using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class JobPosting
    {
        [Key]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Company { get; set; }
        public required string Description { get; set; }
        public required string RequiredSkills { get; set; }
        
        // Missing properties required by your controller
        public string? Location { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public int CreatedByUserId { get; set; }
        public User? CreatedByUser { get; set; }

        // Navigation property for database relationships
        public ICollection<Application>? Applications { get; set; }
    }
}