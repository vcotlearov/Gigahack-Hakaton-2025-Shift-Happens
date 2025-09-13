using System.Text.Json.Serialization;

namespace FarmProfit.API.Models;

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

public class ContractDto
{
	public Guid Id { get; set; } = Guid.NewGuid();
	[JsonPropertyName("userId")]
	public Guid BusinessId { get; set; }
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