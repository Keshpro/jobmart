using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class JobPosting
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Company { get; set; } = string.Empty; // Fixed explicit primitive string definition

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty; // Full-time, Part-time, etc.

        [Required]
        public string Status { get; set; } = string.Empty; // Active, Paused, Closed

        // Relationship property navigation matching your DbContext configuration
        public ICollection<Application> Applications { get; set; } = new List<Application>();
        public string Description { get; set; } = string.Empty; // string
    }
}