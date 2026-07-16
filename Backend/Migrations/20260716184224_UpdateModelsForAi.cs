using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsForAi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtractedSkills",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "AtsScore",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "JobPostings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "JobPostings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RequiredSkills",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "JobPostingId1",
                table: "Applications",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobPostings_CreatedByUserId",
                table: "JobPostings",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_JobPostingId1",
                table: "Applications",
                column: "JobPostingId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_JobPostings_JobPostingId1",
                table: "Applications",
                column: "JobPostingId1",
                principalTable: "JobPostings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_JobPostings_Users_CreatedByUserId",
                table: "JobPostings",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_JobPostings_JobPostingId1",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_JobPostings_Users_CreatedByUserId",
                table: "JobPostings");

            migrationBuilder.DropIndex(
                name: "IX_JobPostings_CreatedByUserId",
                table: "JobPostings");

            migrationBuilder.DropIndex(
                name: "IX_Applications_JobPostingId1",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "AtsScore",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "RequiredSkills",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "JobPostingId1",
                table: "Applications");

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtractedSkills",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
