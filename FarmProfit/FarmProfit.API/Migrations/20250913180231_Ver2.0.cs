using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmProfit.API.Migrations
{
    /// <inheritdoc />
    public partial class Ver20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
	        migrationBuilder.DropColumn(
		        name: "Name",
		        table: "Users");
		}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
