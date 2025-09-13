using FarmProfit.API.Contexts;
using System.Security.Claims;
using FarmProfit.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Middleware
{
	public class UserProvisioningMiddleware(RequestDelegate next)
	{
		public async Task InvokeAsync(HttpContext context, AppDbContext db)
		{
			if (context.User.Identity?.IsAuthenticated == true)
			{
				var sub = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				var email = context.User.FindFirst(ClaimTypes.Email)?.Value;

				if (!string.IsNullOrEmpty(sub))
				{
					var user = await db.Users.FirstOrDefaultAsync(u => u.Auth0Id == sub);
					if (user == null)
					{
						user = new User
						{
							Auth0Id = sub,
							Email = email ?? "unknown@example.com",
							CreatedAt = DateTime.UtcNow
						};
						db.Users.Add(user);
					}
					else
					{
						user.LastLoginAt = DateTime.UtcNow;
					}

					await db.SaveChangesAsync();
					context.Items["Employee"] = user;
				}
			}

			await next(context);
		}
	}
}
