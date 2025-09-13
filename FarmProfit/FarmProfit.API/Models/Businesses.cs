namespace FarmProfit.API.Models
{
	public class Businesses
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public Guid UserId { get; set; }
		public string BusinessName { get; set; }
		public string IDNO { get; set; }
		public DateTimeOffset RegistrationDate { get; set; }
		public string LegalForm { get; set; }

		public Contacts Contact { get; set; }
		public ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
	}
}