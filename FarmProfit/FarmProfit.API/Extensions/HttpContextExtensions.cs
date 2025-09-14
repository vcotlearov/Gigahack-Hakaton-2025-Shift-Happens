using FarmProfit.API.Models;

namespace FarmProfit.API.Extensions
{
	public static class HttpContextExtensions
	{
		public static User? GetEmployee(this HttpContext context)
		{
			if (context.Items.TryGetValue("Employee", out var empObj)
			    && empObj is User employee)
			{
				return employee;
			}

			return null;
		}
	}
}
