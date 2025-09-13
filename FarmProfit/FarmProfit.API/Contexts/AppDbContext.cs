using FarmProfit.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Contexts
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<User> Users { get; set; }
	}
}
