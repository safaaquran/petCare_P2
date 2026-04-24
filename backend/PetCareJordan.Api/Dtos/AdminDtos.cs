using PetCareJordan.Api.Models;

namespace PetCareJordan.Api.Dtos;

public record ModerationItemDto(
    string Kind,
    int ItemId,
    string Title,
    string Description,
    string City,
    string ContactName,
    string PhotoUrl,
    DateTime SubmittedAtUtc,
    ModerationStatus ModerationStatus);
