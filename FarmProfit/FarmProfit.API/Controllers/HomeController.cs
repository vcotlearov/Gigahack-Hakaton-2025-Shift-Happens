using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmProfit.API.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController : ControllerBase
{
	// This endpoint requires a valid Auth0 JWT token
	[HttpGet("data")]
	[Authorize]
	public IActionResult GetSecureData()
	{
		var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
		return Ok(new
		{
			message = "You are authenticated!",
			userId
		});
	}

	// Optional: public endpoint
	[HttpGet("public")]
	public IActionResult GetPublicData()
	{
		return Ok(new { message = "This endpoint is public." });
	}
}