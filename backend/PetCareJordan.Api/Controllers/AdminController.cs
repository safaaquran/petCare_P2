using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;

namespace PetCareJordan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController(PetCareJordanContext context) : ControllerBase
{
    [HttpGet("moderation/pending")]
    public async Task<ActionResult<IEnumerable<ModerationItemDto>>> GetPendingModeration()
    {
        var pendingPets = await context.Pets
            .Include(pet => pet.Owner)
            .Where(pet => pet.ModerationStatus == ModerationStatus.Pending)
            .Select(pet => new ModerationItemDto(
                "pet",
                pet.Id,
                pet.Name,
                pet.Description,
                pet.City,
                pet.Owner != null ? pet.Owner.FullName : "Unknown owner",
                pet.PhotoUrl,
                pet.CreatedAtUtc,
                pet.ModerationStatus))
            .ToListAsync();

        var pendingAdoptions = await context.AdoptionListings
            .Include(listing => listing.Pet)
                .ThenInclude(pet => pet!.Owner)
            .Where(listing => listing.ModerationStatus == ModerationStatus.Pending)
            .Select(listing => new ModerationItemDto(
                "adoption",
                listing.Id,
                listing.Pet != null ? listing.Pet.Name : "Unknown pet",
                listing.Story,
                listing.Pet != null ? listing.Pet.City : "Unknown city",
                listing.Pet != null && listing.Pet.Owner != null ? listing.Pet.Owner.FullName : listing.ContactDetails,
                listing.Pet != null ? listing.Pet.PhotoUrl : string.Empty,
                listing.PostedAtUtc,
                listing.ModerationStatus))
            .ToListAsync();

        var pendingLostReports = await context.LostPetReports
            .Where(report => report.ModerationStatus == ModerationStatus.Pending)
            .Select(report => new ModerationItemDto(
                "lost",
                report.Id,
                report.PetName,
                report.Description,
                report.LastSeenPlace,
                report.ContactName,
                report.PhotoUrl,
                report.CreatedAtUtc,
                report.ModerationStatus))
            .ToListAsync();

        var pendingFoundReports = await context.FoundPetReports
            .Where(report => report.ModerationStatus == ModerationStatus.Pending)
            .Select(report => new ModerationItemDto(
                "found",
                report.Id,
                report.PetType.ToString(),
                report.Description,
                report.FoundPlace,
                report.ContactName,
                report.PhotoUrl,
                report.CreatedAtUtc,
                report.ModerationStatus))
            .ToListAsync();

        return Ok(pendingPets
            .Concat(pendingAdoptions)
            .Concat(pendingLostReports)
            .Concat(pendingFoundReports)
            .OrderByDescending(item => item.SubmittedAtUtc));
    }

    [HttpPut("moderation/{kind}/{id:int}/approve")]
    public async Task<IActionResult> ApproveModerationItem(string kind, int id)
    {
        var updated = await SetModerationStatus(kind, id, ModerationStatus.Approved);
        return updated ? NoContent() : NotFound();
    }

    [HttpPut("moderation/{kind}/{id:int}/reject")]
    public async Task<IActionResult> RejectModerationItem(string kind, int id)
    {
        var updated = await SetModerationStatus(kind, id, ModerationStatus.Rejected);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("moderation/{kind}/{id:int}")]
    public async Task<IActionResult> DeleteModerationItem(string kind, int id)
    {
        switch (kind.Trim().ToLowerInvariant())
        {
            case "pet":
            {
                var pet = await context.Pets.FindAsync(id);
                if (pet is null)
                {
                    return NotFound();
                }

                context.Pets.Remove(pet);
                break;
            }
            case "adoption":
            {
                var listing = await context.AdoptionListings.FindAsync(id);
                if (listing is null)
                {
                    return NotFound();
                }

                context.AdoptionListings.Remove(listing);
                break;
            }
            case "lost":
            {
                var report = await context.LostPetReports.FindAsync(id);
                if (report is null)
                {
                    return NotFound();
                }

                context.LostPetReports.Remove(report);
                break;
            }
            case "found":
            {
                var report = await context.FoundPetReports.FindAsync(id);
                if (report is null)
                {
                    return NotFound();
                }

                context.FoundPetReports.Remove(report);
                break;
            }
            default:
                return BadRequest("Kind must be pet, adoption, lost, or found.");
        }

        await context.SaveChangesAsync();
        return NoContent();
    }

    private async Task<bool> SetModerationStatus(string kind, int id, ModerationStatus status)
    {
        switch (kind.Trim().ToLowerInvariant())
        {
            case "pet":
            {
                var pet = await context.Pets.FindAsync(id);
                if (pet is null)
                {
                    return false;
                }

                pet.ModerationStatus = status;
                break;
            }
            case "adoption":
            {
                var listing = await context.AdoptionListings.FindAsync(id);
                if (listing is null)
                {
                    return false;
                }

                listing.ModerationStatus = status;
                break;
            }
            case "lost":
            {
                var report = await context.LostPetReports.FindAsync(id);
                if (report is null)
                {
                    return false;
                }

                report.ModerationStatus = status;
                break;
            }
            case "found":
            {
                var report = await context.FoundPetReports.FindAsync(id);
                if (report is null)
                {
                    return false;
                }

                report.ModerationStatus = status;
                break;
            }
            default:
                return false;
        }

        await context.SaveChangesAsync();
        return true;
    }
}
