using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmProfit.API.Migrations
{
    /// <inheritdoc />
    public partial class Ver17 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
			migrationBuilder.CreateTable(
			   name: "Businesses",
			   columns: table => new
			   {
				   Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
				   UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
				   BusinessName = table.Column<string>(type: "nvarchar(max)", nullable: false),
				   IDNO = table.Column<string>(type: "nvarchar(max)", nullable: false),
				   RegistrationDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
				   LegalForm = table.Column<string>(type: "nvarchar(max)", nullable: false),
				   SysEndTime = table.Column<DateTime>(type: "datetime2", nullable: false)
					   .Annotation("SqlServer:TemporalIsPeriodEndColumn", true),
				   SysStartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
					   .Annotation("SqlServer:TemporalIsPeriodStartColumn", true)
			   },
			   constraints: table =>
			   {
				   table.PrimaryKey("PK_Businesses", x => x.Id);
			   })
			   .Annotation("SqlServer:IsTemporal", true)
			   .Annotation("SqlServer:TemporalHistoryTableName", "BusinessesHistory")
			   .Annotation("SqlServer:TemporalHistoryTableSchema", null)
			   .Annotation("SqlServer:TemporalPeriodEndColumnName", "SysEndTime")
			   .Annotation("SqlServer:TemporalPeriodStartColumnName", "SysStartTime");

			migrationBuilder.CreateTable(
				name: "Contacts",
				columns: table => new
				{
					Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					BusinessId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
					Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
					PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
					Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
					SysEndTime = table.Column<DateTime>(type: "datetime2", nullable: false)
						.Annotation("SqlServer:TemporalIsPeriodEndColumn", true),
					SysStartTime = table.Column<DateTime>(type: "datetime2", nullable: false)
						.Annotation("SqlServer:TemporalIsPeriodStartColumn", true)
				},
				constraints: table =>
				{
					table.PrimaryKey("PK_Contacts", x => x.Id);
					table.ForeignKey(
						name: "FK_Contacts_Businesses_BusinessId",
						column: x => x.BusinessId,
						principalTable: "Businesses",
						principalColumn: "Id",
						onDelete: ReferentialAction.Cascade);
				})
				.Annotation("SqlServer:IsTemporal", true)
				.Annotation("SqlServer:TemporalHistoryTableName", "ContactsHistory")
				.Annotation("SqlServer:TemporalHistoryTableSchema", null)
				.Annotation("SqlServer:TemporalPeriodEndColumnName", "SysEndTime")
				.Annotation("SqlServer:TemporalPeriodStartColumnName", "SysStartTime");

			migrationBuilder.CreateIndex(
				name: "IX_Contacts_BusinessId",
				table: "Contacts",
				column: "BusinessId",
				unique: true);
		}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
