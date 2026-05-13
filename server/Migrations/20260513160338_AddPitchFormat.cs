using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Datsan.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPitchFormat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Format",
                table: "Fields",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "FiveSide");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Format",
                table: "Fields");
        }
    }
}
