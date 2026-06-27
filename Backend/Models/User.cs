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
        
        // Navigation Properties (එක්කෙනෙක්ට Applications ගොඩක් තියෙන්න පුළුවන්)
        public ICollection<Application>? Applications { get; set; }
    }
}