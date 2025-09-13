namespace FarmProfit.API.Models
{
	public class User
	{
		public int Id { get; set; } // Primary key
		public string Auth0Id { get; set; } // Auth0 "sub" claim (unique user ID)
		public string Email { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? LastLoginAt { get; set; }

		// Add domain-specific fields here
		public string Role { get; set; } = "User";
	}
}
