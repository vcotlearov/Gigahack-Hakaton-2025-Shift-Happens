using System.Text.Json.Serialization;

namespace FarmProfit.API.Models;

public class Businesses
{
	public Guid Id { get; set; } = Guid.NewGuid();
	public Guid UserId { get; set; }
	public string BusinessName { get; set; }
	public string IDNO { get; set; }
	public DateTimeOffset RegistrationDate { get; set; }
	public string LegalForm { get; set; }

	public Contacts Contract { get; set; }
	public ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
}

public class BusinessDto
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
	public ContractDto Contact { get; set; }
}