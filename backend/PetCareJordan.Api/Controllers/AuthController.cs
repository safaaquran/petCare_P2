using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCareJordan.Api.Data;
using PetCareJordan.Api.Dtos;
using PetCareJordan.Api.Models;
using PetCareJordan.Api.Services;

namespace PetCareJordan.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(PetCareJordanContext context, PasswordService passwordService, JwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(item => item.Email == request.Email);

        if (user is null || !passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password.");
        }

        return Ok(CreateAuthResponse(user));
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!Enum.TryParse<UserRole>(request.Role, true, out var parsedRole))
        {
            return BadRequest("Role must be User or Vet.");
        }

        if (parsedRole == UserRole.Admin)
        {
            return BadRequest("Admin accounts cannot be created from public registration.");
        }

        var emailExists = await context.Users.AnyAsync(item => item.Email == request.Email);
        if (emailExists)
        {
            return Conflict("A user with this email already exists.");
        }

        var user = new AppUser
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordService.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber,
            City = request.City,
            Role = parsedRole
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(Login), CreateAuthResponse(user));
    }

    private AuthResponse CreateAuthResponse(AppUser user) =>
        new(user.Id, user.FullName, user.Email, user.City, user.PhoneNumber, user.Role, jwtTokenService.CreateToken(user));
}
