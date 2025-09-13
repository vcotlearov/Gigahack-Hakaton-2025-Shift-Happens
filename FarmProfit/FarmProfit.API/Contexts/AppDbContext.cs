using FarmProfit.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FarmProfit.API.Contexts;
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
	public DbSet<User> Users { get; set; }
	public DbSet<Businesses> Businesses { get; set; }
	public DbSet<Contacts> Contacts { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<Businesses>()
			.ToTable("Businesses", b => b.IsTemporal(
				t =>
				{
					t.HasPeriodStart("SysStartTime").HasColumnName("SysStartTime"); ;
					t.HasPeriodEnd("SysEndTime").HasColumnName("SysEndTime"); ;
					t.UseHistoryTable("BusinessesHistory");
				}));
		modelBuilder.Entity<Contacts>()
			.ToTable("Contacts", b => b.IsTemporal(
				t =>
				{
					t.HasPeriodStart("SysStartTime").HasColumnName("SysStartTime"); ;
					t.HasPeriodEnd("SysEndTime").HasColumnName("SysEndTime"); ;
					t.UseHistoryTable("ContactsHistory");
				}));

		modelBuilder.Entity<Businesses>()
			.HasOne(b => b.Contact)
			.WithOne(c => c.Business)
			.HasForeignKey<Contacts>(c => c.BusinessId)
			.OnDelete(DeleteBehavior.Cascade);
	}
}