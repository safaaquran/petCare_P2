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
public class AdoptionsController(PetCareJordanContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdoptionListingDto>>> GetAdoptionListings()
    {
        var listings = await context.AdoptionListings
            .Include(listing => listing.Pet)
            .Where(listing => listing.ModerationStatus == ModerationStatus.Approved && listing.Pet != null && listing.Pet.ModerationStatus == ModerationStatus.Approved)
            .OrderByDescending(listing => listing.PostedAtUtc)
            .Select(listing => new AdoptionListingDto(
                listing.Id,
                listing.PetId,
                listing.Pet!.Name,
                listing.Pet.Type,
                listing.Pet.Breed,
                listing.Pet.PhotoUrl,
                listing.Pet.City,
                listing.Story,
                listing.ContactMethod,
                listing.ContactDetails,
                listing.Status,
                listing.PostedAtUtc,
                listing.ModerationStatus))
            .ToListAsync();

        return Ok(listings);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<AdoptionListingDto>> CreateAdoptionListing(CreateAdoptionListingRequest request)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var currentUserId))
        {
            return Unauthorized("Invalid user session.");
        }

        var pet = await context.Pets
            .FirstOrDefaultAsync(item => item.Id == request.PetId);
        if (pet is null)
        {
            return BadRequest("Pet not found.");
        }

        if (pet.OwnerId != currentUserId)
        {
            return Forbid("Only the owner can publish adoption details for this pet.");
        }

        var listing = new AdoptionListing
        {
            PetId = request.PetId,
            Story = request.Story,
            ContactMethod = request.ContactMethod,
            ContactDetails = request.ContactDetails,
            Status = AdoptionStatus.Available,
            PostedAtUtc = DateTime.UtcNow,
            ModerationStatus = ModerationStatus.Pending
        };

        context.AdoptionListings.Add(listing);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAdoptionListings), new AdoptionListingDto(listing.Id, pet.Id, pet.Name, pet.Type, pet.Breed, pet.PhotoUrl, pet.City, listing.Story, listing.ContactMethod, listing.ContactDetails, listing.Status, listing.PostedAtUtc, listing.ModerationStatus));
    }
}
