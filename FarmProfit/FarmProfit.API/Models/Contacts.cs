namespace FarmProfit.API.Models
{
	public class Contacts
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public Guid BusinessId { get; set; }
		public Businesses Business { get; set; }
		public string Email { get; set; }
		public string Phone { get; set; }
		public string PostalCode { get; set; }
		public string Region { get; set; }
		public string Address { get; set; }
	}
}