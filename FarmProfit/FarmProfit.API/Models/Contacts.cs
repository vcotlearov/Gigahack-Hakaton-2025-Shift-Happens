using System.Text.Json.Serialization;

namespace FarmProfit.API.Models
{
	public class Contacts
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		[JsonPropertyName("userId")]
		public Guid BusinessId { get; set; }
		[JsonIgnore]
		public Businesses Business { get; set; }
		[JsonPropertyName("email")]
		public string Email { get; set; }
		[JsonPropertyName("phone")]
		public string Phone { get; set; }
		[JsonPropertyName("postalCode")]
		public string PostalCode { get; set; }
		[JsonPropertyName("region")]
		public string Region { get; set; }
		[JsonPropertyName("address")]
		public string Address { get; set; }
	}
}