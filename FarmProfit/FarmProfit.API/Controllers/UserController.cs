using FarmProfit.API.Contexts;
using FarmProfit.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace FarmProfit.API.Controllers;

public class UserRegistrationRequest
{
	public string Name { get; set; }
	public string Phone { get; set; }
	public string Email { get; set; }
	public string Password { get; set; }
}

[ApiController]
[Route("api/users")]
public class UsersController(AppDbContext db, HttpClient httpClient, ILogger<UsersController> logger) : ControllerBase
{
	private readonly string _auth0Domain = "dev-iqadq0gbmsvx3bju.us.auth0.com";

	[HttpPost("register")]
	public async Task<IActionResult> Register([FromBody] UserRegistrationRequest request)
	{
		var managementToken = await GetManagementApiAccessToken();

		var userData = new
		{
			email = request.Email,
			connection = "Username-Password-Authentication", // Auth0 Database connection name
			password = request.Password,
			user_metadata = new { name = request.Name }
		};

		var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"https://{_auth0Domain}/api/v2/users");
		httpRequest.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", managementToken);
		httpRequest.Content = new StringContent(JsonSerializer.Serialize(userData), Encoding.UTF8, "application/json");

		var response = await httpClient.SendAsync(httpRequest);
		if (response.IsSuccessStatusCode)
		{
			try
			{
				var user = new User
				{
					Name = request.Name,
					Phone = request.Phone,
					CreatedAt = DateTime.UtcNow
				};

				logger.LogInformation("Saving user to our DB");
				db.Users.Add(user);
				await db.SaveChangesAsync();
				logger.LogInformation("User is saved");

				return Ok(new
				{
					user.Id,
					user.Name,
					user.Phone,
					user.CreatedAt
				});
			}
			catch (Exception ex)
			{
				logger.LogError($"Error during save: {ex.Message}");
				return BadRequest(ex.Message);
			}
		}

		var error = await response.Content.ReadAsStringAsync();
		return BadRequest(error);
	}

	private async Task<string> GetManagementApiAccessToken()
	{
		var client = new HttpClient();

		var requestBody = new Dictionary<string, string>
		{
			{ "client_id", "l4av6wENlxynvRsQWFz1Un4s49E3xEK0" },
			{ "client_secret", "6DbDwUzolHuGKOG6C6mc1LLARAVBnI2K1PDH_0Plc5_GMfmzaiI_Vt8Aupr0Qq5x" },
			{ "audience", $"https://{_auth0Domain}/api/v2/" },
			{ "grant_type", "client_credentials" }
		};

		var response = await client.PostAsync(
			$"https://{_auth0Domain}/oauth/token",
			new FormUrlEncodedContent(requestBody));

		string responseBody = await response.Content.ReadAsStringAsync();
		var tokenObj = JsonDocument.Parse(responseBody);
		return tokenObj.RootElement.GetProperty("access_token").GetString() ?? "";
	}

	[HttpGet("secure")]
	[Authorize]
	public async Task<IActionResult> Secure()
	{
		var auth0Id = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
		var user = await db.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);

		return Ok(new { message = "You are authenticated", user });
	}

	[HttpGet("all")]
	[Authorize]
	public async Task<IActionResult> GetListOfUsers()
	{
		try
		{
			var users = db.Users.Select(u => new { u.Id, u.Email, u.Name, u.Phone, u.CreatedAt });
			return await Task.FromResult<IActionResult>(Ok(users));
		}
		catch (Exception ex)
		{
			logger.LogError($"Error during save: {ex.Message}");
			return BadRequest(ex.Message);
		}

		
	}

	[HttpGet("public")]
	public IActionResult Public()
	{
		return Ok(new { message = "This endpoint is public" });
	}
}