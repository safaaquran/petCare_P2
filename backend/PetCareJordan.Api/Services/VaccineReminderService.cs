using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Models;

namespace PetCareJordan.Api.Services;

public class VaccineReminderService(PetCareJordanContext context)
{
    private const int ReminderWindowDays = 7;

    public async Task RefreshAsync(int? ownerId = null)
    {
        await RemoveExpiredVaccinePlansAsync(ownerId);
        await RemoveExpiredReminderNotificationsAsync(ownerId);
        await UpdateActiveReminderNotificationTextAsync(ownerId);
    }

    public async Task<Notification> NotifyOwnerAsync(int vaccineId, bool forceUnread = true)
    {
        await RemoveExpiredVaccinePlansAsync();

        var vaccine = await context.VaccinationRecords
            .Include(item => item.Pet)
                .ThenInclude(pet => pet!.Owner)
            .FirstOrDefaultAsync(item => item.Id == vaccineId);

        if (vaccine?.Pet?.Owner is null)
        {
            throw new KeyNotFoundException("Vaccine record was not found.");
        }

        if (vaccine.IsCompleted)
        {
            throw new InvalidOperationException("This vaccine is already completed.");
        }

        if (IsPublicDemoPet(vaccine.Pet))
        {
            throw new InvalidOperationException("This pet is not part of the medical workflow.");
        }

        if (vaccine.DueDateUtc.Date < DateTime.UtcNow.Date)
        {
            throw new InvalidOperationException("This vaccine date has already passed.");
        }

        return await UpsertReminderNotificationAsync(vaccine, forceUnread);
    }

    private async Task RemoveExpiredVaccinePlansAsync(int? ownerId = null)
    {
        var today = DateTime.UtcNow.Date;
        var query = context.VaccinationRecords
            .Include(vaccine => vaccine.Pet)
            .Where(vaccine =>
                !vaccine.IsCompleted &&
                vaccine.DueDateUtc.Date < today &&
                vaccine.Pet != null);

        if (ownerId.HasValue)
        {
            query = query.Where(vaccine => vaccine.Pet!.OwnerId == ownerId.Value);
        }

        var expiredVaccines = await query.ToListAsync();

        if (expiredVaccines.Count == 0)
        {
            return;
        }

        var expiredVaccineIds = expiredVaccines.Select(vaccine => vaccine.Id).ToList();
        var notifications = await context.Notifications
            .Where(notification =>
                notification.Type == NotificationType.VaccineReminder &&
                notification.VaccinationRecordId != null &&
                expiredVaccineIds.Contains(notification.VaccinationRecordId.Value))
            .ToListAsync();

        context.Notifications.RemoveRange(notifications);
        context.VaccinationRecords.RemoveRange(expiredVaccines);
        await context.SaveChangesAsync();
    }


    private async Task RemoveExpiredReminderNotificationsAsync(int? ownerId = null)
    {
        var now = DateTime.UtcNow;
        var activeVaccineIds = await context.VaccinationRecords
            .Where(vaccine => !vaccine.IsCompleted && vaccine.DueDateUtc.Date >= now.Date)
            .Select(vaccine => vaccine.Id)
            .ToListAsync();

        var query = context.Notifications
            .Where(notification =>
                notification.Type == NotificationType.VaccineReminder &&
                (
                    notification.VaccinationRecordId == null ||
                    notification.ExpiresAtUtc <= now ||
                    !activeVaccineIds.Contains(notification.VaccinationRecordId.Value)
                ));

        if (ownerId.HasValue)
        {
            query = query.Where(notification => notification.UserId == ownerId.Value);
        }

        var expiredNotifications = await query.ToListAsync();
        if (expiredNotifications.Count == 0)
        {
            return;
        }

        context.Notifications.RemoveRange(expiredNotifications);
        await context.SaveChangesAsync();
    }

    private async Task UpdateActiveReminderNotificationTextAsync(int? ownerId = null)
    {
        var today = DateTime.UtcNow.Date;
        var query = context.VaccinationRecords
            .Include(vaccine => vaccine.Pet)
                .ThenInclude(pet => pet!.Owner)
            .Where(vaccine =>
                !vaccine.IsCompleted &&
                vaccine.DueDateUtc.Date >= today &&
                vaccine.Pet != null &&
                vaccine.Pet.Owner != null &&
                context.Notifications.Any(notification =>
                    notification.UserId == vaccine.Pet.OwnerId &&
                    notification.Type == NotificationType.VaccineReminder &&
                    notification.VaccinationRecordId == vaccine.Id));

        if (ownerId.HasValue)
        {
            query = query.Where(vaccine => vaccine.Pet!.OwnerId == ownerId.Value);
        }

        var activeReminderVaccines = await query.ToListAsync();
        foreach (var vaccine in activeReminderVaccines)
        {
            await UpsertReminderNotificationAsync(vaccine, forceUnread: false);
        }
    }

    private async Task EnsureUpcomingReminderNotificationsAsync(int? ownerId = null)
    {
        var today = DateTime.UtcNow.Date;
        var reminderCutoff = today.AddDays(ReminderWindowDays);

        var query = context.VaccinationRecords
            .Include(vaccine => vaccine.Pet)
                .ThenInclude(pet => pet!.Owner)
            .Where(vaccine =>
                !vaccine.IsCompleted &&
                vaccine.DueDateUtc.Date >= today &&
                vaccine.DueDateUtc.Date <= reminderCutoff &&
                vaccine.Pet != null &&
                vaccine.Pet.Owner != null &&
                !vaccine.Pet.CollarId.StartsWith("MAP-") &&
                !vaccine.Pet.CollarId.StartsWith("ADOPT-"));

        if (ownerId.HasValue)
        {
            query = query.Where(vaccine => vaccine.Pet!.OwnerId == ownerId.Value);
        }

        var upcomingVaccines = await query.ToListAsync();

        foreach (var vaccine in upcomingVaccines)
        {
            await UpsertReminderNotificationAsync(vaccine, forceUnread: false);
        }

        if (upcomingVaccines.Count > 0)
        {
            await context.SaveChangesAsync();
        }
    }

    private async Task<Notification> UpsertReminderNotificationAsync(VaccinationRecord vaccine, bool forceUnread)
    {
        if (vaccine.Pet?.Owner is null)
        {
            throw new KeyNotFoundException("Vaccine owner was not found.");
        }

        var dueDate = vaccine.DueDateUtc.Date;
        var daysUntilDue = (dueDate - DateTime.UtcNow.Date).Days;
        var timingText = daysUntilDue switch
        {
            0 => "today",
            1 => "tomorrow",
            _ => $"in {daysUntilDue} days"
        };

        var notification = await context.Notifications.FirstOrDefaultAsync(item =>
            item.UserId == vaccine.Pet.OwnerId &&
            item.Type == NotificationType.VaccineReminder &&
            item.VaccinationRecordId == vaccine.Id);

        var isNewNotification = notification is null;
        if (isNewNotification)
        {
            notification = new Notification
            {
                UserId = vaccine.Pet.OwnerId,
                Type = NotificationType.VaccineReminder,
                VaccinationRecordId = vaccine.Id,
                IsSentByVet = forceUnread,
                IsRead = false
            };
            context.Notifications.Add(notification);
        }
        else if (forceUnread)
        {
            notification!.IsRead = false;
        }

        if (forceUnread)
        {
            notification!.IsSentByVet = true;
        }

        notification!.Title = $"Vaccine reminder for {vaccine.Pet.Name}";
        notification.Message = $"{vaccine.VaccineName} is due {timingText} for {vaccine.Pet.Name}. Due date: {dueDate:yyyy-MM-dd}.";
        if (isNewNotification || forceUnread)
        {
            notification.TriggerDateUtc = DateTime.UtcNow;
        }
        notification.ExpiresAtUtc = dueDate.AddDays(1);

        await context.SaveChangesAsync();
        return notification;
    }

    private static bool IsPublicDemoPet(Pet pet) =>
        pet.CollarId.StartsWith("MAP-") || pet.CollarId.StartsWith("ADOPT-");
}






