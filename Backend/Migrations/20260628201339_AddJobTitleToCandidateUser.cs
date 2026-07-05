using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddJobTitleToCandidateUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobPostings_Users_RecruiterId",
                table: "JobPostings");

            migrationBuilder.DropIndex(
                name: "IX_JobPostings_RecruiterId",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "RecruiterId",
                table: "JobPostings");

            migrationBuilder.RenameColumn(
                name: "RequiredSkills",
                table: "JobPostings",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "JobPostings",
                newName: "Status");

            migrationBuilder.AddColumn<string>(
                name: "JobTitle",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "JobPostings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobTitle",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Company",
                table: "JobPostings");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "JobPostings");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "JobPostings",
                newName: "RequiredSkills");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "JobPostings",
                newName: "Description");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "JobPostings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "RecruiterId",
                table: "JobPostings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_JobPostings_RecruiterId",
                table: "JobPostings",
                column: "RecruiterId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobPostings_Users_RecruiterId",
                table: "JobPostings",
                column: "RecruiterId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
