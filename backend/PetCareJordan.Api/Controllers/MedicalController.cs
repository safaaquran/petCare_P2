using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;
using PetCareJordan.Api.Services;

namespace PetCareJordan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalController(PetCareJordanContext context, IWebHostEnvironment environment) : ControllerBase
{
    [Authorize(Roles = "Vet,Admin")]
    [HttpGet("upcoming-vaccines")]
    public async Task<ActionResult<IEnumerable<object>>> GetUpcomingVaccines()
    {
        await RemoveExpiredVaccineNotificationsAsync();

        var today = DateTime.UtcNow.Date;
        var cutoff = DateTime.UtcNow.AddDays(30);
        var vaccines = await context.VaccinationRecords
            .Include(vaccine => vaccine.Pet)
                .ThenInclude(pet => pet!.Owner)
            .Where(vaccine => !vaccine.IsCompleted && vaccine.DueDateUtc.Date >= today && vaccine.DueDateUtc <= cutoff)
            .OrderBy(vaccine => vaccine.DueDateUtc)
            .Select(vaccine => new
            {
                vaccine.Id,
                vaccine.VaccineName,
                vaccine.DueDateUtc,
                PetName = vaccine.Pet!.Name,
                PetCollarId = vaccine.Pet.CollarId,
                OwnerName = vaccine.Pet.Owner!.FullName,
                OwnerPhone = vaccine.Pet.Owner.PhoneNumber
            })
            .ToListAsync();

        return Ok(vaccines);
    }

    [Authorize(Roles = "Vet,Admin")]
    [HttpPost("vaccines")]
    public async Task<ActionResult<object>> CreateVaccination(CreateVaccinationRequest request)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var vetId))
        {
            return Unauthorized();
        }

        var vet = await context.Users.FirstOrDefaultAsync(user => user.Id == vetId && (user.Role == UserRole.Vet || user.Role == UserRole.Admin));
        var pet = await context.Pets.FindAsync(request.PetId);

        if (vet is null || pet is null)
        {
            return BadRequest("Valid pet and vet are required.");
        }

        if (string.IsNullOrWhiteSpace(request.VaccineName))
        {
            return BadRequest("Vaccine name is required.");
        }

        var vaccine = new VaccinationRecord
        {
            PetId = pet.Id,
            VetId = vet.Id,
            VaccineName = request.VaccineName.Trim(),
            DueDateUtc = request.DueDateUtc.Date,
            GivenOnUtc = request.GivenOnUtc,
            IsCompleted = request.IsCompleted
        };

        context.VaccinationRecords.Add(vaccine);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateVaccination), new
        {
            vaccine.Id,
            vaccine.VaccineName,
            vaccine.DueDateUtc,
            PetName = pet.Name,
            PetCollarId = pet.CollarId
        });
    }

    [Authorize(Roles = "Vet,Admin")]
    [HttpPost("vaccines/{vaccineId:int}/notify")]
    public async Task<ActionResult<object>> NotifyOwner(int vaccineId)
    {
        var vaccine = await context.VaccinationRecords
            .Include(item => item.Pet)
                .ThenInclude(pet => pet!.Owner)
            .FirstOrDefaultAsync(item => item.Id == vaccineId);

        if (vaccine?.Pet?.Owner is null)
        {
            return NotFound();
        }

        if (vaccine.IsCompleted)
        {
            return BadRequest("This vaccine is already completed.");
        }

        var today = DateTime.UtcNow.Date;
        var dueDate = vaccine.DueDateUtc.Date;

        if (dueDate < today)
        {
            await RemoveExpiredVaccineNotificationsAsync();
            return BadRequest("This vaccine date has already passed.");
        }

        var daysUntilDue = (dueDate - today).Days;
        var timingText = daysUntilDue switch
        {
            0 => "today",
            1 => "tomorrow",
            _ => $"in {daysUntilDue} days"
        };

        var existingNotification = await context.Notifications.FirstOrDefaultAsync(notification =>
            notification.UserId == vaccine.Pet.OwnerId &&
            notification.Type == NotificationType.VaccineReminder &&
            notification.VaccinationRecordId == vaccine.Id);

        var title = $"Vaccine reminder for {vaccine.Pet.Name}";
        var message = $"{vaccine.VaccineName} is due {timingText} for {vaccine.Pet.Name}. Due date: {dueDate:yyyy-MM-dd}.";

        if (existingNotification is null)
        {
            existingNotification = new Notification
            {
                UserId = vaccine.Pet.OwnerId,
                Type = NotificationType.VaccineReminder,
                VaccinationRecordId = vaccine.Id
            };
            context.Notifications.Add(existingNotification);
        }

        existingNotification.Title = title;
        existingNotification.Message = message;
        existingNotification.TriggerDateUtc = DateTime.UtcNow;
        existingNotification.ExpiresAtUtc = dueDate.AddDays(1);
        existingNotification.IsRead = false;

        await context.SaveChangesAsync();

        return Ok(new { existingNotification.Id, existingNotification.Title, existingNotification.Message });
    }

    [Authorize(Roles = "User")]
    [HttpGet("my-pets")]
    public async Task<ActionResult<IEnumerable<UserPetMedicalSnapshotDto>>> GetMyPetsMedicalStatus()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return Unauthorized();
        }

        var pets = await context.Pets
            .Where(pet => pet.OwnerId == userId)
            .Include(pet => pet.MedicalRecords)
                .ThenInclude(record => record.Vet)
            .Include(pet => pet.Vaccinations)
                .ThenInclude(vaccine => vaccine.Vet)
            .OrderBy(pet => pet.Name)
            .ToListAsync();

        var nowDate = DateTime.UtcNow.Date;
        var snapshots = pets.Select(pet =>
        {
            var medicalHistory = pet.MedicalRecords
                .OrderByDescending(record => record.VisitDateUtc)
                .Select(record => new MedicalRecordDto(
                    record.Id,
                    record.Vet?.FullName ?? "Unknown Vet",
                    record.VisitReason,
                    record.Diagnosis,
                    record.Treatment,
                    record.VisitDateUtc))
                .ToList();

            var vaccinePlan = pet.Vaccinations
                .OrderBy(vaccine => vaccine.DueDateUtc)
                .Select(vaccine => new UserPetVaccinePlanDto(
                    vaccine.Id,
                    vaccine.VaccineName,
                    vaccine.GivenOnUtc,
                    vaccine.DueDateUtc,
                    vaccine.IsCompleted,
                    GetVaccineStatus(vaccine, nowDate)))
                .ToList();

            var pendingVaccinesCount = vaccinePlan.Count(vaccine => !vaccine.IsCompleted);
            var isUpToDate = vaccinePlan.Count > 0 &&
                             vaccinePlan.All(vaccine => vaccine.IsCompleted || vaccine.DueDateUtc.Date > nowDate);

            var latestRecord = medicalHistory.FirstOrDefault();
            var healthSummary = latestRecord is null
                ? "No medical records yet."
                : $"{latestRecord.Diagnosis}. Treatment: {latestRecord.Treatment}";

            return new UserPetMedicalSnapshotDto(
                pet.Id,
                pet.CollarId,
                pet.Name,
                pet.Type,
                pet.Breed,
                PhotoUrlResolver.Resolve(pet.PhotoUrl, pet.Type, pet.Breed, environment),
                healthSummary,
                isUpToDate,
                pendingVaccinesCount,
                medicalHistory,
                vaccinePlan);
        });

        return Ok(snapshots);
    }

    [HttpPost("records")]
    public async Task<ActionResult<MedicalRecordDto>> CreateMedicalRecord(CreateMedicalRecordRequest request)
    {
        var vet = await context.Users.FirstOrDefaultAsync(item => item.Id == request.VetId && item.Role == UserRole.Vet);
        var pet = await context.Pets.FindAsync(request.PetId);

        if (vet is null || pet is null)
        {
            return BadRequest("Valid pet and vet are required.");
        }

        var record = new MedicalRecord
        {
            PetId = request.PetId,
            VetId = request.VetId,
            VisitReason = request.VisitReason,
            Diagnosis = request.Diagnosis,
            Treatment = request.Treatment,
            VisitDateUtc = request.VisitDateUtc
        };

        context.MedicalRecords.Add(record);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateMedicalRecord), new MedicalRecordDto(record.Id, vet.FullName, record.VisitReason, record.Diagnosis, record.Treatment, record.VisitDateUtc));
    }

    [HttpPut("records/{recordId:int}")]
    public async Task<ActionResult<MedicalRecordDto>> UpdateMedicalRecord(int recordId, UpdateMedicalRecordRequest request)
    {
        var record = await context.MedicalRecords
            .Include(item => item.Vet)
            .FirstOrDefaultAsync(item => item.Id == recordId);

        if (record is null || record.Vet is null)
        {
            return NotFound();
        }

        record.VisitReason = request.VisitReason;
        record.Diagnosis = request.Diagnosis;
        record.Treatment = request.Treatment;
        record.VisitDateUtc = request.VisitDateUtc;

        await context.SaveChangesAsync();

        return Ok(new MedicalRecordDto(record.Id, record.Vet.FullName, record.VisitReason, record.Diagnosis, record.Treatment, record.VisitDateUtc));
    }

    private static string GetVaccineStatus(VaccinationRecord vaccine, DateTime nowDate)
    {
        if (vaccine.IsCompleted)
        {
            return "Completed";
        }

        if (vaccine.DueDateUtc.Date < nowDate)
        {
            return "Overdue";
        }

        if (vaccine.DueDateUtc.Date <= nowDate.AddDays(14))
        {
            return "Due Soon";
        }

        return "Scheduled";
    }

    private async Task RemoveExpiredVaccineNotificationsAsync()
    {
        var now = DateTime.UtcNow;
        var expiredNotifications = await context.Notifications
            .Where(notification =>
                notification.Type == NotificationType.VaccineReminder &&
                notification.ExpiresAtUtc != null &&
                notification.ExpiresAtUtc <= now)
            .ToListAsync();

        if (expiredNotifications.Count == 0)
        {
            return;
        }

        context.Notifications.RemoveRange(expiredNotifications);
        await context.SaveChangesAsync();
    }
}
