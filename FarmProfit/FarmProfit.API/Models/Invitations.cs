namespace FarmProfit.API.Models
{
	public class Invitations
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Email { get; set; }
		public Guid BusinessId { get; set; }
		public string Status { get; set; }
	}
}
