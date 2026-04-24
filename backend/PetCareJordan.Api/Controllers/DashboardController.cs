using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;

namespace PetCareJordan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(PetCareJordanContext context) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var pets = await context.Pets
            .Where(item => item.ModerationStatus == ModerationStatus.Approved)
            .ToListAsync();
        var users = await context.Users.ToListAsync();
        var listings = await context.AdoptionListings
            .Where(item => item.ModerationStatus == ModerationStatus.Approved)
            .ToListAsync();
        var upcomingVaccineCount = await context.VaccinationRecords.CountAsync(item =>
            !item.IsCompleted &&
            item.DueDateUtc <= DateTime.UtcNow.AddDays(30) &&
            item.Pet != null &&
            item.Pet.ModerationStatus == ModerationStatus.Approved);
        var pendingModerationCount =
            await context.Pets.CountAsync(item => item.ModerationStatus == ModerationStatus.Pending) +
            await context.AdoptionListings.CountAsync(item => item.ModerationStatus == ModerationStatus.Pending) +
            await context.LostPetReports.CountAsync(item => item.ModerationStatus == ModerationStatus.Pending) +
            await context.FoundPetReports.CountAsync(item => item.ModerationStatus == ModerationStatus.Pending);

        var summary = new DashboardSummaryDto(
            users.Count(user => user.Role == UserRole.User || user.Role == UserRole.Admin),
            users.Count(user => user.Role == UserRole.Vet),
            pets.Count,
            listings.Count(item => item.Status == AdoptionStatus.Available),
            await context.LostPetReports.CountAsync(item => item.Status == ReportStatus.Active && item.ModerationStatus == ModerationStatus.Approved),
            await context.FoundPetReports.CountAsync(item => item.Status == ReportStatus.Active && item.ModerationStatus == ModerationStatus.Approved),
            upcomingVaccineCount,
            pendingModerationCount,
            pets.GroupBy(pet => pet.Type.ToString()).ToDictionary(group => group.Key, group => group.Count()),
            pets.GroupBy(pet => pet.City).ToDictionary(group => group.Key, group => group.Count()));

        return Ok(summary);
    }
}
