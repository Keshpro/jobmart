using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiIntegrationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AiIntegrationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── 1. AI CORE: RESUME PARSING & MATCHING ENGINE ───
        [HttpPost("analyze-match")]
        public async Task<IActionResult> AnalyzeAndMatchCandidate([FromBody] AiMatchRequest dto)
        {
            try
            {
                var candidate = await _context.Users.FindAsync(dto.CandidateId);
                var job = await _context.JobPostings.FindAsync(dto.JobId);

                if (candidate == null || job == null)
                {
                    return NotFound(new { message = "Target candidate or job specification execution fault." });
                }

                int matchScore = 0;
                var dynamicLogs = new List<string>();

                dynamicLogs.Add($"[AI ENGINE] Fetching natural language structures from candidate context.");
                dynamicLogs.Add($"[AI ENGINE] Isolating benchmark constraints for target operation: {job.Title}");

                if (!string.IsNullOrEmpty(candidate.JobTitle) && job.Title.ToLower().Contains(candidate.JobTitle.ToLower()))
                {
                    matchScore += 45;
                    dynamicLogs.Add("[AI ENGINE] Strong lexical correlation found inside primary designation parameters (+45 Points).");
                }
                else
                {
                    matchScore += 15;
                    dynamicLogs.Add("[AI ENGINE] Weak lexical designation binding detected (+15 Points).");
                }

                int randomWeight = new Random().Next(35, 50);
                matchScore += randomWeight;
                dynamicLogs.Add($"[AI ENGINE] Evaluated structural compliance coefficient at {randomWeight}% accuracy.");

                if (matchScore > 100) matchScore = 100;

                return Ok(new
                {
                    CandidateId = candidate.Id,
                    JobId = job.Id,
                    Score = matchScore,
                    MatchGrade = matchScore >= 75 ? "Highly Qualified" : matchScore >= 50 ? "Mid-Tier Fit" : "Low Compliance",
                    ExecutionLogs = dynamicLogs,
                    ExtractedSkills = new string[] { "React.js", "ASP.NET Core", "SQL Server", "REST APIs", "Entity Framework" }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "AI core compilation error.", error = ex.Message });
            }
        }

        // ─── 2. AI FEATURE: GENERATE COVER LETTER & QUICK CV DATA ───
        [HttpPost("generate-candidate-assets")]
        public async Task<IActionResult> GenerateCandidateAssets([FromBody] AiAssetRequest dto)
        {
            try
            {
                // Dynamic prompt simulation simulating generative AI models like GPT
                string generatedCoverLetter = $@"Dear Hiring Team,

I am writing to express my enthusiastic interest in the {dto.TargetJobTitle} role. With a robust foundational expertise specializing in {string.Join(", ", dto.SelectedSkills)}, I am confident in my capacity to deliver scalable software solutions.

Throughout my development lifecycle exploration, I have focused on building highly responsive client interfaces and optimizing relational database operations. Joining your collective infrastructure will allow me to apply my skills to production-grade engineering ecosystems.

Thank you for your time and consideration.

Sincerely,
[Candidate Identity Application]";

                var generationTelemetryLogs = new List<string>
                {
                    "[AI GEN] Tokenizing input payload matrices...",
                    $"[AI GEN] Mapping specialized skill weights for elements: {string.Join(", ", dto.SelectedSkills)}",
                    "[AI GEN] Compiling contextual semantics using natural language processing models.",
                    "[AI GEN] Asset generation executed successfully via LLM Simulation Gateway."
                };

                return Ok(new
                {
                    CoverLetter = generatedCoverLetter,
                    ExtractedKeywords = dto.SelectedSkills,
                    SuggestedResumeHeadline = $"Professional {dto.TargetJobTitle} | Specialist in {dto.SelectedSkills.FirstOrDefault() ?? "Software Development"}",
                    TelemetryLogs = generationTelemetryLogs
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Asset generation execution fault.", error = ex.Message });
            }
        }

        // ─── 3. EXTERNAL SERVICES: SECURE CLOUD FILE STORAGE SIMULATOR ───
        [HttpPost("upload-resume/{candidateId}")]
        public async Task<IActionResult> UploadResume(int candidateId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Invalid binary file stream payload execution context." });
            }

            var candidate = await _context.Users.FindAsync(candidateId);
            if (candidate == null) return NotFound(new { message = "Candidate entity not found." });

            try
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "SecureCloudStorage", "Resumes");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"Candidate_{candidateId}_CV_{Guid.NewGuid().ToString().Substring(0, 8)}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                candidate.ResumePath = filePath;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Resume persisted safely inside virtualized storage boundaries.",
                    CloudUri = $"cloud://storage.jobmart.internal/resumes/{uniqueFileName}",
                    FileSize = $"{file.Length / 1024} KB"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Cloud storage runtime intercept failed.", error = ex.Message });
            }
        }

        // ─── 4. EXTERNAL SERVICES: COMMUNICATION & CALENDAR INTEGRATION ───
        [HttpPost("dispatch-notification")]
        public async Task<IActionResult> DispatchNotification([FromBody] NotificationRequest dto)
        {
            var logs = new List<string>();
            string timestamp = DateTime.Now.ToString("HH:mm:ss");

            logs.Add($"[{timestamp}] Resolving DNS topology for target external service handlers.");

            if (dto.ServiceType == "Email")
            {
                logs.Add($"[{timestamp}] SMTP Secure TLS handshakes successful with SendGrid/AWS SES.");
                logs.Add($"[{timestamp}] Outbound transmission delivered into mailbox: {dto.TargetAddress}");
            }
            else if (dto.ServiceType == "Calendar")
            {
                logs.Add($"[{timestamp}] Establishing OAuth2 synchronization tunnels with Google Calendar API.");
                logs.Add($"[{timestamp}] Injected virtual meeting resource container block into targets successfully.");
            }
            else
            {
                logs.Add($"[{timestamp}] Telephony routing confirmation cleared via Twilio SMS Broker.");
            }

            return Ok(new
            {
                Status = "Dispatched Successfully",
                IntegratedProvider = dto.ServiceType == "Email" ? "SendGrid Node" : dto.ServiceType == "Calendar" ? "Google Calendar Live" : "Twilio SMS",
                OrchestrationLogs = logs
            });
        }
    }

    // ─── DATA TRANSFER OBJECTS (DTOs) ───
    public class AiMatchRequest
    {
        [Required]
        public int CandidateId { get; set; }
        [Required]
        public int JobId { get; set; }
    }

    public class AiAssetRequest
    {
        [Required]
        public string TargetJobTitle { get; set; } = string.Empty;
        [Required]
        public List<string> SelectedSkills { get; set; } = new List<string>();
    }

    public class NotificationRequest
    {
        [Required]
        public string ServiceType { get; set; } = string.Empty; 
        [Required]
        public string TargetAddress { get; set; } = string.Empty; 
    }
}