using FarmProfit.API.Contexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Controllers
{
	[ApiController]
	[Route("api/profile")]
	public class ProfileController(AppDbContext db) : ControllerBase
	{
		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetProfile()
		{
			var sub = User.FindFirst("sub")?.Value;
			var user = await db.Users.FirstOrDefaultAsync(u => u.Auth0Id == sub);
			return Ok(user);
		}
	}
}
