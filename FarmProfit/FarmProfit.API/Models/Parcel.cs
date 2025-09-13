namespace FarmProfit.API.Models
{
	public class Parcel
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public Guid BusinessId { get; set; }
		public Businesses Business { get; set; }
		public string Name { get; set; }
		public string Ownership { get; set; }
		public string LandType { get; set; }
		public string CadastralNumber { get; set; }
		public string GeoJson { get; set; }
		public float Area { get; set; }
	}
}
