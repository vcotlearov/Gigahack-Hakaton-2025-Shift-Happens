namespace FarmProfit.API.Models
{
	public class User
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Auth0Id { get; set; }
		public string Email { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? LastLoginAt { get; set; }

		public string Role { get; set; } = "User";
	}
}
