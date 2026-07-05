using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobPostingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobPostingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _context.JobPostings.ToListAsync();
            return Ok(jobs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] JobPosting job)
        {
            if (job == null) return BadRequest();

            _context.JobPostings.Add(job);
            await _context.SaveChangesAsync();
            return Ok(job);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobPosting updatedJob)
        {
            var job = await _context.JobPostings.FindAsync(id);
            if (job == null) return NotFound();

            job.Title = updatedJob.Title;
            job.Company = updatedJob.Company;
            job.Location = updatedJob.Location;
            job.Type = updatedJob.Type; // Fixed reflection assignment bug
            job.Status = updatedJob.Status;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Job listing configuration updated." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.JobPostings.FindAsync(id);
            if (job == null) return NotFound();

            _context.JobPostings.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Job record clean complete." });
        }
    }
}