using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Models;

namespace PetCareJordan.Api.Data;

public class PetCareJordanContext(DbContextOptions<PetCareJordanContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<AdoptionListing> AdoptionListings => Set<AdoptionListing>();
    public DbSet<LostPetReport> LostPetReports => Set<LostPetReport>();
    public DbSet<FoundPetReport> FoundPetReports => Set<FoundPetReport>();
    public DbSet<MedicalRecord> MedicalRecords => Set<MedicalRecord>();
    public DbSet<VaccinationRecord> VaccinationRecords => Set<VaccinationRecord>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<Pet>()
            .HasIndex(pet => pet.CollarId)
            .IsUnique();

        modelBuilder.Entity<Pet>()
            .Property(pet => pet.WeightKg)
            .HasPrecision(8, 2);

        modelBuilder.Entity<LostPetReport>()
            .Property(report => report.RewardAmount)
            .HasPrecision(8, 2);

        modelBuilder.Entity<Pet>()
            .HasOne(pet => pet.Owner)
            .WithMany(owner => owner.OwnedPets)
            .HasForeignKey(pet => pet.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AdoptionListing>()
            .HasOne(listing => listing.Pet)
            .WithOne(pet => pet.AdoptionListing)
            .HasForeignKey<AdoptionListing>(listing => listing.PetId);

        modelBuilder.Entity<MedicalRecord>()
            .HasOne(record => record.Pet)
            .WithMany(pet => pet.MedicalRecords)
            .HasForeignKey(record => record.PetId);

        modelBuilder.Entity<MedicalRecord>()
            .HasOne(record => record.Vet)
            .WithMany(vet => vet.MedicalRecordsAuthored)
            .HasForeignKey(record => record.VetId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<VaccinationRecord>()
            .HasOne(record => record.Pet)
            .WithMany(pet => pet.Vaccinations)
            .HasForeignKey(record => record.PetId);

        modelBuilder.Entity<VaccinationRecord>()
            .HasOne(record => record.Vet)
            .WithMany(vet => vet.VaccinationsAuthored)
            .HasForeignKey(record => record.VetId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Notification>()
            .HasOne(notification => notification.User)
            .WithMany()
            .HasForeignKey(notification => notification.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
