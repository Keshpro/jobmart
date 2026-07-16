namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Candidate"; // "Admin", "Recruiter", "Candidate"

        public string? JobTitle { get; set; } = string.Empty;

        public string? CvPath { get; set; } = string.Empty; // CV saved File Path

        public bool IsCvUploaded { get; set; } = false;
        
public string? ExtractedSkills { get; set; } = string.Empty; // AI (Comma-separated)
        
        // Navigation property for applications submitted by the user (if the user is a candidate)
        public ICollection<Application>? Applications { get; set; }
        public string Bio { get; internal set; } = string.Empty;
    }
}