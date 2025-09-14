namespace FarmProfit.API.Models
{
	public class Employees
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Name { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
		public string Phone { get; set; }
		public ICollection<Businesses> Businesses { get; set; } = new List<Businesses>();
	}
}
