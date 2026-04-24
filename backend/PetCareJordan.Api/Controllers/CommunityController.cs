using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;

namespace PetCareJordan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommunityController(PetCareJordanContext context) : ControllerBase
{
    [HttpGet("lost")]
    public async Task<ActionResult<IEnumerable<LostPetReportDto>>> GetLostPets()
    {
        var reports = await context.LostPetReports
            .Where(report => report.ModerationStatus == ModerationStatus.Approved)
            .OrderByDescending(report => report.LastSeenDateUtc)
            .Select(report => new LostPetReportDto(
                report.Id,
                report.PetName,
                report.PetType,
                report.Description,
                report.ApproximateAgeInMonths,
                report.LastSeenPlace,
                report.LastSeenDateUtc,
                report.RewardAmount,
                report.PhotoUrl,
                report.ContactName,
                report.ContactPhone,
                report.Status,
                report.ModerationStatus))
            .ToListAsync();

        return Ok(reports);
    }

    [HttpPost("lost")]
    [Authorize]
    public async Task<ActionResult<LostPetReportDto>> CreateLostPetReport(CreateLostPetReportRequest request)
    {
        var report = new LostPetReport
        {
            PetName = request.PetName,
            PetType = request.PetType,
            Description = request.Description,
            ApproximateAgeInMonths = request.ApproximateAgeInMonths,
            LastSeenPlace = request.LastSeenPlace,
            LastSeenDateUtc = request.LastSeenDateUtc,
            RewardAmount = request.RewardAmount,
            PhotoUrl = request.PhotoUrl,
            ContactName = request.ContactName,
            ContactPhone = request.ContactPhone,
            Status = ReportStatus.Active,
            ModerationStatus = ModerationStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.LostPetReports.Add(report);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLostPets), new LostPetReportDto(report.Id, report.PetName, report.PetType, report.Description, report.ApproximateAgeInMonths, report.LastSeenPlace, report.LastSeenDateUtc, report.RewardAmount, report.PhotoUrl, report.ContactName, report.ContactPhone, report.Status, report.ModerationStatus));
    }

    [HttpGet("found")]
    public async Task<ActionResult<IEnumerable<FoundPetReportDto>>> GetFoundPets()
    {
        var reports = await context.FoundPetReports
            .Where(report => report.ModerationStatus == ModerationStatus.Approved)
            .OrderByDescending(report => report.FoundDateUtc)
            .Select(report => new FoundPetReportDto(
                report.Id,
                report.PetType,
                report.Description,
                report.FoundPlace,
                report.FoundDateUtc,
                report.PhotoUrl,
                report.ContactName,
                report.ContactPhone,
                report.Status,
                report.ModerationStatus))
            .ToListAsync();

        return Ok(reports);
    }

    [HttpPost("found")]
    [Authorize]
    public async Task<ActionResult<FoundPetReportDto>> CreateFoundPetReport(CreateFoundPetReportRequest request)
    {
        var report = new FoundPetReport
        {
            PetType = request.PetType,
            Description = request.Description,
            FoundPlace = request.FoundPlace,
            FoundDateUtc = request.FoundDateUtc,
            PhotoUrl = request.PhotoUrl,
            ContactName = request.ContactName,
            ContactPhone = request.ContactPhone,
            Status = ReportStatus.Active,
            ModerationStatus = ModerationStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.FoundPetReports.Add(report);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFoundPets), new FoundPetReportDto(report.Id, report.PetType, report.Description, report.FoundPlace, report.FoundDateUtc, report.PhotoUrl, report.ContactName, report.ContactPhone, report.Status, report.ModerationStatus));
    }

    [HttpGet("notifications/{userId:int}")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications(int userId)
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!string.Equals(role, UserRole.Admin.ToString(), StringComparison.OrdinalIgnoreCase) && currentUserId != userId.ToString())
        {
            return Forbid();
        }

        var notifications = await context.Notifications
            .Where(notification => notification.UserId == userId)
            .OrderByDescending(notification => notification.TriggerDateUtc)
            .Select(notification => new NotificationDto(notification.Id, notification.Title, notification.Message, notification.TriggerDateUtc, notification.IsRead))
            .ToListAsync();

        return Ok(notifications);
    }
}
