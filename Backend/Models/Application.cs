namespace Backend.Models
{
    public class Application
    {
        public int Id { get; set; }
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        public string ResumeUrl { get; set; } = string.Empty; // Cloud Storage Link එක
        public string Status { get; set; } = "Pending"; // "Pending", "Shortlisted", "Rejected"
        
        // AI scores
        public double AiMatchScore { get; set; } 

        // Foreign Keys
        public int JobPostingId { get; set; }
        public JobPosting? JobPosting { get; set; }

        public int CandidateId { get; set; }
        public User? Candidate { get; set; }
    }
}