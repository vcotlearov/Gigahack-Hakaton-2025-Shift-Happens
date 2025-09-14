using FarmProfit.API.Contexts;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FarmProfit.API.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController(AppDbContext db, ILogger<AdminController> logger) : ControllerBase
{
	private const string Domain = "dev-iqadq0gbmsvx3bju.us.auth0.com";
	[HttpGet("users")]
	[Authorize]
	public async Task<IActionResult> GetListOfUsers()
	{
		try
		{
			var users = db.Users.Select(u => new { u.Id, u.Email, u.Auth0Id, u.LastLoginAt, u.CreatedAt });
			return await Task.FromResult<IActionResult>(Ok(users));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during save: {ex.Message}");
			return BadRequest(ex.Message);
		}
	}

	[HttpPost("invite")]
	public async Task<IActionResult> Invite([FromBody] InviteRequest request)
	{
		await db.Invitations.AddAsync(new Invitations
		{
			BusinessId = request.BusinessId,
			Email = request.Email,
			Status = "Pending"
		});

		await db.SaveChangesAsync();

		var emp = new Employees
		{
			Email = request.Email
		};

		emp.Businesses.Add(db.Businesses.First(x => x.Id == request.BusinessId));
		await db.Employees.AddAsync(emp);

		await db.SaveChangesAsync();

		return Ok(new { Message = "Invitation sent via Auth0 email" });
	}

	private async Task<string> GetManagementToken()
	{
		var http = new HttpClient();
		var tokenResponse = await http.PostAsJsonAsync($"https://{Domain}/oauth/token", new
		{
			client_id = "l4av6wENlxynvRsQWFz1Un4s49E3xEK0",
			client_secret = "6DbDwUzolHuGKOG6C6mc1LLARAVBnI2K1PDH_0Plc5_GMfmzaiI_Vt8Aupr0Qq5x",
			audience = $"https://{Domain}/api/v2/",
			grant_type = "client_credentials"
		});

		var tokenJson = await tokenResponse.Content.ReadFromJsonAsync<JsonElement>();
		var mgmtToken = tokenJson.GetProperty("access_token").GetString();

		return mgmtToken;
	}

	[HttpPost("assign")]
	public async Task<IActionResult> AssignGroup([FromBody] GroupAssignment assignment)
	{
		var invited = db.Invitations.FirstOrDefault(s => s.Email == assignment.Email);
		if (invited == null)
			return Ok();

		var emp = new Employees
		{
			Email = invited.Email
		};

		emp.Businesses.Add(db.Businesses.First(x=>x.Id == invited.BusinessId));
		await db.Employees.AddAsync(emp);

		await db.SaveChangesAsync();

		return Ok();
	}

	public class GroupAssignment
	{
		public string Email { get; set; }
		public string Group { get; set; }
	}

	public class InviteRequest
	{
		public string Email { get; set; }
		public Guid BusinessId { get; set; }
	}
}
