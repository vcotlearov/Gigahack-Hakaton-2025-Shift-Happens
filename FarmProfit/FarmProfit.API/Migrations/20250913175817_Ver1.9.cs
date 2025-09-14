using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmProfit.API.Migrations
{
    /// <inheritdoc />
    public partial class Ver19 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.RenameColumn(
				name: "Phone",
				table: "Users",
				newName: "Role");

			migrationBuilder.AddColumn<string>(
				name: "Email",
				table: "Users",
				type: "nvarchar(max)",
				nullable: false,
				defaultValue: "");

			migrationBuilder.AddColumn<DateTime>(
		        name: "LastLoginAt",
		        table: "Users",
		        type: "datetime2",
		        nullable: true);
		}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
