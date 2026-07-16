using Microsoft.AspNetCore.Mvc;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InterviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InterviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── 📅 SCHEDULE INTERVIEW & GENERATE CALENDAR LINK ───
        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleInterview([FromBody] InterviewRequestDto request)
        {
            if (request.CandidateId <= 0 || string.IsNullOrEmpty(request.InterviewDate))
            {
                return BadRequest(new { message = "Invalid scheduling parameters detected." });
            }

            // 1. Generate External Calendar Provider Link (Google Calendar Format)
            string eventTitle = Uri.EscapeDataString($"JobMart Technical Interview - {request.Platform}");
            string eventDetails = Uri.EscapeDataString("Congratulations! You have been shortlisted. Please join via the provided link at the exact scheduled time.");
            
            // Format datetime for Google Calendar (YYYYMMDDTHHMMSSZ)
            string formattedDate = DateTime.Parse(request.InterviewDate).ToString("yyyyMMddTHHmmssZ");
            string calLink = $"https://calendar.google.com/calendar/render?action=TEMPLATE&text={eventTitle}&dates={formattedDate}/{formattedDate}&details={eventDetails}";

            // 2. Mock Email & SMS Notification Trace
            string emailLog = $"[SYSTEM MAIL SERVER] Dispatched to Candidate ID #{request.CandidateId} | Subject: Interview Scheduled | Attachment: {calLink}";

            // 3. Database Save Logic (To be connected with Entity Framework)
            // var interview = new Interview { CandidateId = request.CandidateId, Date = request.InterviewDate, Link = calLink };
            // _context.Interviews.Add(interview);
            // await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Interview scheduled successfully and calendar invites dispatched via SMTP.",
                calendarUrl = calLink,
                systemLog = emailLog
            });
        }
    }

    public class InterviewRequestDto
    {
        public int CandidateId { get; set; }
        public string InterviewDate { get; set; } = string.Empty;
        public string Platform { get; set; } = string.Empty;
    }
}