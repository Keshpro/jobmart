using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HiringController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HiringController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── 1. GET ALL SHORTLISTED CANDIDATES ───
        [HttpGet("shortlisted")]
        public async Task<IActionResult> GetShortlistedCandidates()
        {
            // In a real DB, you'd filter by Application Status == 'Shortlisted'
            // For now, we fetch candidates who have uploaded CVs as a mock filter
            var candidates = await _context.Users
                .Where(u => u.Role == "Candidate" && u.IsCvUploaded)
                .Select(u => new 
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.JobTitle,
                    u.Email
                })
                .ToListAsync();

            return Ok(candidates);
        }

        // ─── 2. SUBMIT HIRING MANAGER EVALUATION ───
        [HttpPost("evaluate")]
        public async Task<IActionResult> EvaluateCandidate([FromBody] EvaluationDto dto)
        {
            if (dto == null || dto.CandidateId <= 0)
                return BadRequest(new { message = "Invalid evaluation data." });

            // In a full schema, this would save to an 'Evaluations' table.
            // Here we acknowledge the evaluation and return success.
            
            return Ok(new 
            { 
                message = "Candidate evaluation saved successfully.",
                candidateId = dto.CandidateId,
                score = dto.Score,
                status = "Evaluated"
            });
        }

        // ─── 3. MAKE FINAL HIRING DECISION ───
        [HttpPost("decision")]
        public async Task<IActionResult> MakeHiringDecision([FromBody] DecisionDto dto)
        {
            if (string.IsNullOrEmpty(dto.Decision) || dto.CandidateId <= 0)
                return BadRequest(new { message = "Invalid decision parameters." });

            // Logic to update Candidate Application Status to 'Hired' or 'Rejected'
            return Ok(new { message = $"Candidate successfully marked as {dto.Decision}." });
        }
    }

    public class EvaluationDto
    {
        public int CandidateId { get; set; }
        public int Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
    }

    public class DecisionDto
    {
        public int CandidateId { get; set; }
        public string Decision { get; set; } = string.Empty; // "Hire" or "Reject"
    }
}