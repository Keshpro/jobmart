using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Core Platform Tables
        public DbSet<User> Users { get; set; }
        public DbSet<JobPosting> JobPostings { get; set; }
        public DbSet<Application> Applications { get; set; }

        // Corporate Staff / Internal Roles Table
        public DbSet<RoleAccount> RoleAccounts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Relationship: Application -> JobPosting (One-To-Many)
            modelBuilder.Entity<Application>()
                .HasOne(a => a.JobPosting)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobPostingId)
                .OnDelete(DeleteBehavior.Restrict); // Prevents cascade cycles

            // 2. Relationship: Application -> User/Candidate (One-To-Many)
            modelBuilder.Entity<Application>()
                .HasOne(a => a.Candidate)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Restrict); // Prevents cascade cycles
        }
    }
}