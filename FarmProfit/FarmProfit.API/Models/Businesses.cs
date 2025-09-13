using System.Text.Json.Serialization;

namespace FarmProfit.API.Models
{
	public class Businesses
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		[JsonPropertyName("userId")]
		public Guid UserId { get; set; }
		[JsonPropertyName("businessName")]
		public string BusinessName { get; set; }
		[JsonPropertyName("idno")]
		public string IDNO { get; set; }
		[JsonPropertyName("registrationDate")]
		public DateTimeOffset RegistrationDate { get; set; }
		[JsonPropertyName("legalForm")]
		public string LegalForm { get; set; }

		[JsonPropertyName("contact")]
		public Contacts Contact { get; set; }
		[JsonIgnore]
		public ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
	}
}