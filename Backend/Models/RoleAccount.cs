using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class RoleAccount
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty; // "Admin", "Recruiter", "Hiring Manager"
    }
}