namespace JobMart.Api.Models
{
    // DTO for ATS Resume Scoring
    public class ResumeEvaluationRequest
    {
        public required string ResumeText { get; set; }
        public required string JobDescription { get; set; }
    }

    // DTO for the floating AI Career Coach
    public class ChatbotRequest
    {
        public required string UserMessage { get; set; }
    }
}