using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ─── 1. GET SYSTEM ANALYTICS & STATS ───
        [HttpGet("stats")]
        public async Task<IActionResult> GetSystemStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalCandidates = await _context.Users.CountAsync(u => u.Role == "Candidate");
            var totalRecruiters = await _context.Users.CountAsync(u => u.Role == "Recruiter");
            var totalJobs = await _context.JobPostings.CountAsync();

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalCandidates = totalCandidates,
                TotalRecruiters = totalRecruiters,
                TotalJobs = totalJobs
            });
        }

        // ─── 2. GET ALL USERS FOR MANAGEMENT ───
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // ─── 3. UPDATE USER ROLE (RBAC MANAGEMENT) ───
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleDto dto)
        {
            if (string.IsNullOrEmpty(dto.NewRole))
                return BadRequest(new { message = "Role cannot be empty." });

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found in the system." });

            user.Role = dto.NewRole;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User role successfully updated to {dto.NewRole}." });
        }
    }

    public class UpdateRoleDto
    {
        public string NewRole { get; set; } = string.Empty;
    }
}