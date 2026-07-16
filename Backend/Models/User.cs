using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string Role { get; set; } 
        
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public string? JobTitle { get; set; }
        public string? Bio { get; set; }
        
        public bool IsCvUploaded { get; set; } = false;
        public string? CvPath { get; set; }
        
        public int? AtsScore { get; set; }
    }
}