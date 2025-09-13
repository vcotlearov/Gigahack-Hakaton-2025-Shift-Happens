using FarmProfit.API.Contexts;
using FarmProfit.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Controllers
{
	[ApiController]
	[Route("api/business")]
	public class BusinessController(AppDbContext db, ILogger<BusinessController> logger) : ControllerBase
	{
		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetBusinessListForUser()
		{
			try
			{
				var employee = HttpContext.GetEmployee();
				if (employee is null) return BadRequest();

				var businessList = db.Businesses.Include(b => b.Contact).Where(u=>u.UserId == employee.Id);
				return await Task.FromResult<IActionResult>(Ok(businessList));
			}
			catch (Exception ex)
			{
				logger.LogError($"Error during save: {ex.Message}");
				return BadRequest(ex.Message);
			}
		}
	}
}
