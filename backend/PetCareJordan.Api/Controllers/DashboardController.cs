using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;
using PetCareJordan.Api.Services;

namespace PetCareJordan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(PetCareJordanContext context, VaccineReminderService vaccineReminderService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        await vaccineReminderService.RefreshAsync();

        var pets = await context.Pets.ToListAsync();
        var users = await context.Users.ToListAsync();
        var listings = await context.AdoptionListings
            .Include(listing => listing.Pet)
            .ToListAsync();
        var availableAdoptionPets = listings
            .Where(item => item.Status == AdoptionStatus.Available && item.Pet is not null)
            .Select(item => item.Pet!)
            .ToList();
        var activeLostReports = await context.LostPetReports
            .Where(item => item.Status == ReportStatus.Active)
            .ToListAsync();
        var activeFoundReports = await context.FoundPetReports
            .Where(item => item.Status == ReportStatus.Active)
            .ToListAsync();
        var publicMapAnimals = availableAdoptionPets
            .Select(pet => new MapAnimal(pet.Type.ToString(), NormalizeJordanCity(pet.City)))
            .Concat(activeLostReports.Select(report => new MapAnimal(report.PetType.ToString(), NormalizeJordanCity(report.LastSeenPlace))))
            .Concat(activeFoundReports.Select(report => new MapAnimal(report.PetType.ToString(), NormalizeJordanCity(report.FoundPlace))))
            .ToList();
        var today = DateTime.UtcNow.Date;
        var upcomingVaccineCutoff = today.AddDays(30);
        var upcomingVaccineCount = await context.VaccinationRecords.CountAsync(item =>
            !item.IsCompleted &&
            item.DueDateUtc.Date >= today &&
            item.DueDateUtc.Date <= upcomingVaccineCutoff);

        var summary = new DashboardSummaryDto(
            users.Count(user => user.Role == UserRole.User || user.Role == UserRole.Admin),
            users.Count(user => user.Role == UserRole.Vet),
            pets.Count,
            listings.Count(item => item.Status == AdoptionStatus.Available),
            activeLostReports.Count,
            activeFoundReports.Count,
            upcomingVaccineCount,
            publicMapAnimals.GroupBy(item => item.Type).ToDictionary(group => group.Key, group => group.Count()),
            publicMapAnimals.GroupBy(item => item.City).ToDictionary(group => group.Key, group => group.Count()));

        return Ok(summary);
    }

    private static string NormalizeJordanCity(string location)
    {
        var value = location.Trim();
        var city = value.Split(',', '-', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? value;

        return city.ToLowerInvariant() switch
        {
            "amman" => "Amman",
            "irbid" => "Irbid",
            "zarqa" => "Zarqa",
            "aqaba" => "Aqaba",
            "madaba" => "Madaba",
            "salt" => "Salt",
            "jerash" => "Jerash",
            "mafraq" => "Mafraq",
            "karak" => "Karak",
            _ => city
        };
    }

    private sealed record MapAnimal(string Type, string City);
}

