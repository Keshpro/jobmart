namespace Backend.Models
{
    public class JobPosting
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string RequiredSkills { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int RecruiterId { get; set; } // Job එක දාපු කෙනා
        public User? Recruiter { get; set; }

        public ICollection<Application>? Applications { get; set; }
    }
}