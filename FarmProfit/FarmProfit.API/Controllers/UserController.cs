using FarmProfit.API.Contexts;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext db) : ControllerBase
{
	// 1️⃣ Register a new user (requires Auth0 login)
	[HttpPost("register")]
	[Authorize]
	public async Task<IActionResult> Register([FromBody] User dto)
	{
		var auth0Id = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
		if (auth0Id == null) return Unauthorized();

		var exists = await db.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);
		if (exists != null) return Conflict("User already registered");

		var user = new User
		{
			Auth0Id = auth0Id,
			Name = dto.Name,
			Phone = dto.Phone,
			CreatedAt = DateTime.UtcNow
		};

		db.Users.Add(user);
		await db.SaveChangesAsync();

		return Ok(user);
	}

	[HttpGet("secure")]
	[Authorize]
	public async Task<IActionResult> Secure()
	{
		var auth0Id = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
		var user = await db.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);

		return Ok(new { message = "You are authenticated", user });
	}

	[HttpGet("public")]
	public IActionResult Public()
	{
		return Ok(new { message = "This endpoint is public" });
	}
}