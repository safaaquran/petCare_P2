using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using PetCareJordan.Api.Controllers;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;
using PetCareJordan.Api.Services;
using Xunit;

namespace PetCareJordan.Tests;

public class PetCareJordanFeatureTests
{
    private static PetCareJordanContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<PetCareJordanContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new PetCareJordanContext(options);
    }

    private static IConfiguration CreateConfig()
    {
        return new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Issuer"] = "PetCareJordan.Tests",
                ["Jwt:Audience"] = "PetCareJordan.Client",
                ["Jwt:Key"] = "THIS_IS_A_LONG_SECRET_KEY_FOR_TESTING_ONLY_123456789"
            })
            .Build();
    }

    private static FakeWebHostEnvironment Env()
    {
        return new FakeWebHostEnvironment();
    }

    private static void SetUser(ControllerBase controller, int userId, UserRole role)
    {
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(
                    new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                        new Claim(ClaimTypes.Role, role.ToString())
                    }, "TestAuth"))
            }
        };
    }

    private static async Task<(AppUser user, AppUser vet, AppUser admin, Pet pet)> SeedBasicData(PetCareJordanContext db)
    {
        var user = new AppUser
        {
            FullName = "Lina User",
            Email = "lina@petcare.com",
            PasswordHash = "hash",
            PhoneNumber = "0790000000",
            City = "Amman",
            Role = UserRole.User
        };

        var vet = new AppUser
        {
            FullName = "Omar Vet",
            Email = "omar@petcare.com",
            PasswordHash = "hash",
            PhoneNumber = "0791111111",
            City = "Irbid",
            Role = UserRole.Vet
        };

        var admin = new AppUser
        {
            FullName = "Admin",
            Email = "admin@petcare.com",
            PasswordHash = "hash",
            PhoneNumber = "0792222222",
            City = "Amman",
            Role = UserRole.Admin
        };

        db.Users.AddRange(user, vet, admin);
        await db.SaveChangesAsync();

        var pet = new Pet
        {
            Name = "Milo",
            Type = PetType.Cat,
            Breed = "Persian",
            AgeInMonths = 12,
            Gender = PetGender.Male,
            CollarId = "COL-100",
            Color = "White",
            City = "Amman",
            LocationDetails = "Gardens",
            WeightKg = 4.2m,
            IsNeutered = true,
            Description = "Friendly cat",
            PhotoUrl = "milo.jpg",
            OwnerId = user.Id
        };

        db.Pets.Add(pet);
        await db.SaveChangesAsync();

        return (user, vet, admin, pet);
    }

    // TC-AUTO-01: Password hashing
    [Fact]
    public void PasswordHash_ShouldNotStorePlainPassword()
    {
        var service = new PasswordService();
        var password = "MyStrongPassword123";

        var hash = service.HashPassword(password);

        Assert.NotEqual(password, hash);
        Assert.False(string.IsNullOrWhiteSpace(hash));
    }

    // TC-AUTO-02: Correct password verification
    [Fact]
    public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
    {
        var service = new PasswordService();
        var hash = service.HashPassword("secret123");

        var result = service.VerifyPassword("secret123", hash);

        Assert.True(result);
    }

    // TC-AUTO-03: Wrong password rejection
    [Fact]
    public void VerifyPassword_WithWrongPassword_ShouldReturnFalse()
    {
        var service = new PasswordService();
        var hash = service.HashPassword("secret123");

        var result = service.VerifyPassword("wrong-password", hash);

        Assert.False(result);
    }

    // TC-AUTO-04: JWT role claim
    [Fact]
    public void JwtToken_ShouldContainUserRoleClaim()
    {
        var service = new JwtTokenService(CreateConfig());

        var user = new AppUser
        {
            Id = 7,
            FullName = "Test Vet",
            Email = "vet@petcare.com",
            Role = UserRole.Vet
        };

        var token = service.CreateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.Contains(jwt.Claims, claim =>
            claim.Type == ClaimTypes.Role &&
            claim.Value == "Vet");
    }

    // TC-AUTO-05: Register valid user
    [Fact]
    public async Task Register_WithValidUser_ShouldCreateAccount()
    {
        await using var db = CreateDb();

        var controller = new AuthController(
            db,
            new PasswordService(),
            new JwtTokenService(CreateConfig()));

        var request = new RegisterRequest(
            "Sara Ahmad",
            "Sara@petCare.com",
            "Pass123!",
            "0793333333",
            "Amman",
            UserRole.User);

        var response = await controller.Register(request);

        var created = Assert.IsType<CreatedAtActionResult>(response.Result);
        var body = Assert.IsType<AuthResponse>(created.Value);

        Assert.Equal("sara@petcare.com", body.Email);
        Assert.Equal(UserRole.User, body.Role);
    }

    // TC-AUTO-06: Reject public admin registration
    [Fact]
    public async Task Register_WithAdminRole_ShouldReturnBadRequest()
    {
        await using var db = CreateDb();

        var controller = new AuthController(
            db,
            new PasswordService(),
            new JwtTokenService(CreateConfig()));

        var request = new RegisterRequest(
            "Admin",
            "admin@petcare.com",
            "Pass123!",
            "0790000000",
            "Amman",
            UserRole.Admin);

        var response = await controller.Register(request);

        Assert.IsType<BadRequestObjectResult>(response.Result);
    }

    // TC-AUTO-07: Login valid user
    [Fact]
    public async Task Login_WithCorrectCredentials_ShouldReturnToken()
    {
        await using var db = CreateDb();

        var passwordService = new PasswordService();

        db.Users.Add(new AppUser
        {
            FullName = "Lina User",
            Email = "lina@petcare.com",
            PasswordHash = passwordService.HashPassword("Pass123!"),
            PhoneNumber = "0790000000",
            City = "Amman",
            Role = UserRole.User
        });

        await db.SaveChangesAsync();

        var controller = new AuthController(
            db,
            passwordService,
            new JwtTokenService(CreateConfig()));

        var response = await controller.Login(
            new LoginRequest("lina@petcare.com", "Pass123!"));

        var ok = Assert.IsType<OkObjectResult>(response.Result);
        var body = Assert.IsType<AuthResponse>(ok.Value);

        Assert.False(string.IsNullOrWhiteSpace(body.Token));
    }

    // TC-AUTO-08: Login wrong password
    [Fact]
    public async Task Login_WithWrongPassword_ShouldReturnUnauthorized()
    {
        await using var db = CreateDb();

        var passwordService = new PasswordService();

        db.Users.Add(new AppUser
        {
            FullName = "Lina User",
            Email = "lina@petcare.com",
            PasswordHash = passwordService.HashPassword("Pass123!"),
            PhoneNumber = "0790000000",
            City = "Amman",
            Role = UserRole.User
        });

        await db.SaveChangesAsync();

        var controller = new AuthController(
            db,
            passwordService,
            new JwtTokenService(CreateConfig()));

        var response = await controller.Login(
            new LoginRequest("lina@petcare.com", "WrongPass"));

        Assert.IsType<UnauthorizedObjectResult>(response.Result);
    }

    // TC-AUTO-09: Get pets list
    [Fact]
    public async Task GetPets_ShouldReturnSeededPets()
    {
        await using var db = CreateDb();

        await SeedBasicData(db);

        var controller = new PetsController(db, Env());

        var response = await controller.GetPets(null, null);

        var ok = Assert.IsType<OkObjectResult>(response.Result);
        var pets = Assert.IsAssignableFrom<IEnumerable<PetSummaryDto>>(ok.Value);

        Assert.Single(pets);
    }

    // TC-AUTO-10: Search pet by collar ID
    [Fact]
    public async Task GetByCollarId_WithExistingCollar_ShouldReturnPet()
    {
        await using var db = CreateDb();

        await SeedBasicData(db);

        var controller = new PetsController(db, Env());

        var response = await controller.GetByCollarId("COL-100");

        var ok = Assert.IsType<OkObjectResult>(response.Result);
        var pet = Assert.IsType<PetSummaryDto>(ok.Value);

        Assert.Equal("Milo", pet.Name);
        Assert.Equal("COL-100", pet.CollarId);
    }

    // TC-AUTO-11: Collar ID not found
    [Fact]
    public async Task GetByCollarId_WithMissingCollar_ShouldReturnNotFound()
    {
        await using var db = CreateDb();

        await SeedBasicData(db);

        var controller = new PetsController(db, Env());

        var response = await controller.GetByCollarId("NOT-FOUND");

        Assert.IsType<NotFoundResult>(response.Result);
    }

    // TC-AUTO-12: Create adoption post
    [Fact]
    public async Task CreateAdoptionPost_WithValidUser_ShouldCreatePendingListing()
    {
        await using var db = CreateDb();

        var data = await SeedBasicData(db);

        var controller = new AdoptionsController(db, Env());
        SetUser(controller, data.user.Id, UserRole.User);

        var request = new CreateAdoptionPostRequest(
            "Lucky",
            PetType.Dog,
            10,
            8.5m,
            true,
            "Amman",
            "Khalda",
            "dog.jpg",
            "Friendly dog looking for a home",
            "0799999999");

        var response = await controller.CreateAdoptionPost(request);

        var created = Assert.IsType<CreatedAtActionResult>(response.Result);
        var listing = Assert.IsType<AdoptionListingDto>(created.Value);

        Assert.Equal("Lucky", listing.PetName);
        Assert.Equal(AdoptionStatus.Pending, listing.Status);
    }

    // TC-AUTO-13: Reject invalid adoption post
    [Fact]
    public async Task CreateAdoptionPost_WithMissingRequiredFields_ShouldReturnBadRequest()
    {
        await using var db = CreateDb();

        var data = await SeedBasicData(db);

        var controller = new AdoptionsController(db, Env());
        SetUser(controller, data.user.Id, UserRole.User);

        var request = new CreateAdoptionPostRequest(
            "",
            PetType.Cat,
            5,
            3.5m,
            true,
            "Amman",
            "",
            "",
            "",
            "");

        var response = await controller.CreateAdoptionPost(request);

        Assert.IsType<BadRequestObjectResult>(response.Result);
    }

    // TC-AUTO-14: Create medical record
    [Fact]
    public async Task CreateMedicalRecord_WithValidVetAndPet_ShouldCreateRecord()
    {
        await using var db = CreateDb();

        var data = await SeedBasicData(db);

        var controller = new MedicalController(db, Env());

        var request = new CreateMedicalRecordRequest(
            data.pet.Id,
            data.vet.Id,
            "General checkup",
            "Healthy",
            "No treatment required",
            DateTime.UtcNow);

        var response = await controller.CreateMedicalRecord(request);

        var created = Assert.IsType<CreatedAtActionResult>(response.Result);
        var record = Assert.IsType<MedicalRecordDto>(created.Value);

        Assert.Equal("Healthy", record.Diagnosis);
        Assert.Equal("Omar Vet", record.VetName);
    }

    // TC-AUTO-15: Chat empty message validation
    [Fact]
    public async Task SendMessage_WithEmptyText_ShouldReturnBadRequest()
    {
        await using var db = CreateDb();

        var data = await SeedBasicData(db);

        var conversation = new ChatConversation
        {
            UserId = data.user.Id,
            VetId = data.vet.Id,
            CreatedAtUtc = DateTime.UtcNow
        };

        db.ChatConversations.Add(conversation);
        await db.SaveChangesAsync();

        var controller = new ChatController(db);
        SetUser(controller, data.user.Id, UserRole.User);

        var response = await controller.SendMessage(
            conversation.Id,
            new SendChatMessageRequest("   "));

        Assert.IsType<BadRequestObjectResult>(response.Result);
    }
}

public sealed class FakeWebHostEnvironment : IWebHostEnvironment
{
    public string ApplicationName { get; set; } = "PetCareJordan.Tests";

    public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();

    public string WebRootPath { get; set; } = Directory.GetCurrentDirectory();

    public string EnvironmentName { get; set; } = "Development";

    public string ContentRootPath { get; set; } = Directory.GetCurrentDirectory();

    public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
}