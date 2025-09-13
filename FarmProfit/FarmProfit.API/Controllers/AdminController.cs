using FarmProfit.API.Contexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmProfit.API.Controllers
{
	[ApiController]
	[Route("api/admin")]
	public class AdminController(AppDbContext db, ILogger<AdminController> logger) : ControllerBase
	{
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
	}
}
