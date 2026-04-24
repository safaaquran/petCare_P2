using Microsoft.EntityFrameworkCore;

namespace PetCareJordan.Api.Data;

public static class SchemaBootstrap
{
    public static async Task ApplyCompatibilityUpdatesAsync(PetCareJordanContext context)
    {
        var commands = new[]
        {
            """
            IF COL_LENGTH('Pets', 'ModerationStatus') IS NULL
            BEGIN
                ALTER TABLE [Pets] ADD [ModerationStatus] int NOT NULL CONSTRAINT [DF_Pets_ModerationStatus] DEFAULT 2;
            END
            """,
            """
            IF COL_LENGTH('Pets', 'CreatedAtUtc') IS NULL
            BEGIN
                ALTER TABLE [Pets] ADD [CreatedAtUtc] datetime2 NOT NULL CONSTRAINT [DF_Pets_CreatedAtUtc] DEFAULT SYSUTCDATETIME();
            END
            """,
            """
            IF COL_LENGTH('AdoptionListings', 'ModerationStatus') IS NULL
            BEGIN
                ALTER TABLE [AdoptionListings] ADD [ModerationStatus] int NOT NULL CONSTRAINT [DF_AdoptionListings_ModerationStatus] DEFAULT 2;
            END
            """,
            """
            IF COL_LENGTH('LostPetReports', 'ModerationStatus') IS NULL
            BEGIN
                ALTER TABLE [LostPetReports] ADD [ModerationStatus] int NOT NULL CONSTRAINT [DF_LostPetReports_ModerationStatus] DEFAULT 2;
            END
            """,
            """
            IF COL_LENGTH('LostPetReports', 'CreatedAtUtc') IS NULL
            BEGIN
                ALTER TABLE [LostPetReports] ADD [CreatedAtUtc] datetime2 NOT NULL CONSTRAINT [DF_LostPetReports_CreatedAtUtc] DEFAULT SYSUTCDATETIME();
            END
            """,
            """
            IF COL_LENGTH('FoundPetReports', 'ModerationStatus') IS NULL
            BEGIN
                ALTER TABLE [FoundPetReports] ADD [ModerationStatus] int NOT NULL CONSTRAINT [DF_FoundPetReports_ModerationStatus] DEFAULT 2;
            END
            """,
            """
            IF COL_LENGTH('FoundPetReports', 'CreatedAtUtc') IS NULL
            BEGIN
                ALTER TABLE [FoundPetReports] ADD [CreatedAtUtc] datetime2 NOT NULL CONSTRAINT [DF_FoundPetReports_CreatedAtUtc] DEFAULT SYSUTCDATETIME();
            END
            """
        };

        foreach (var command in commands)
        {
            await context.Database.ExecuteSqlRawAsync(command);
        }
    }
}
