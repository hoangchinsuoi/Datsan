using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Datsan.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldPosition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GalleryImages",
                table: "Fields",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Fields",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "Front");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GalleryImages",
                table: "Fields");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Fields");
        }
    }
}
