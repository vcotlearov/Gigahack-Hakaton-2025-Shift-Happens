using System.Text.Json.Serialization;

namespace FarmProfit.API.Models
{
	public class Parcel
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		[JsonPropertyName("businessId")]
		public Guid BusinessId { get; set; }
		[JsonIgnore]
		public Businesses Business { get; set; }
		[JsonPropertyName("name")]
		public string Name { get; set; }
		[JsonPropertyName("ownership")]
		public string Ownership { get; set; }
		[JsonPropertyName("landType")]
		public string LandType { get; set; }
		[JsonPropertyName("cadastralNumber")]
		public string CadastralNumber { get; set; }
		[JsonPropertyName("geoJson")]
		public string GeoJson { get; set; }
		[JsonPropertyName("area")]
		public float Area { get; set; }
	}
}
