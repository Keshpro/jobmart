using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        // Dependency Injection හරහා configuration සහ ඩේටාබේස් සම්බන්ධතාවය ලබා ගැනීම
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ─── 🔐 INTERNAL CRYPTOGRAPHIC JWT TOKEN GENERATION ENGINE ────────────────
        private string GenerateJwtToken(string email, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            // Program.cs එකේ ඇති එකම Key එකම configuration එකෙන් ලබා ගනී
            var jwtKey = _configuration["Jwt:Key"] ?? "JobMart_Enterprise_Secure_Dynamic_JWT_Secret_Key_2026_Token_Validation";
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddHours(3), // Token එක පැය 3ක් වලංගු වේ
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes), 
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // ─── PUBLIC CANDIDATE REGISTER ENDPOINT (Users Table) ───
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return BadRequest(new { message = "Email address is already registered." });
                }

                var newCandidate = new User
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "Candidate",
                    JobTitle = "Unassigned" 
                };

                _context.Users.Add(newCandidate);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Registration successful!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [REGISTER CRASH]: {ex.Message}");
                return StatusCode(500, new { message = "Internal Server Error during registration.", error = ex.Message });
            }
        }

        // ─── ADMIN ROLE & ACCOUNT PROVISIONING ENDPOINT ───
        [HttpPost("admin-register")]
        public async Task<IActionResult> AdminRegister([FromBody] AdminRegisterDto dto)
        {
            if (dto.Role == "Candidate")
            {
                return BadRequest(new { message = "Candidates cannot be registered through corporate provisioning endpoints." });
            }

            if (await _context.RoleAccounts.AnyAsync(r => r.Email == dto.Email))
            {
                return BadRequest(new { message = "Corporate Email already exists in records." });
            }

            var newStaff = new RoleAccount
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role 
            };

            _context.RoleAccounts.Add(newStaff);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{dto.Role} account created successfully!" });
        }

        // ─── PLATFORM AUTHENTICATION (LOGIN FLOW WITH REAL JWT) ───
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // 1. Corporate Staff Role Accounts (Admin/Recruiter/Hiring Manager) Check
            var staffUser = await _context.RoleAccounts.FirstOrDefaultAsync(r => r.Email == dto.Email);
            if (staffUser != null && BCrypt.Net.BCrypt.Verify(dto.Password, staffUser.PasswordHash))
            {
                var token = GenerateJwtToken(staffUser.Email, staffUser.Role);
                return Ok(new
                {
                    Token = token,
                    FirstName = "Staff",
                    LastName = staffUser.Role,
                    Role = staffUser.Role
                });
            }

            // 2. Candidate Users Table Check
            var candidateUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (candidateUser != null && BCrypt.Net.BCrypt.Verify(dto.Password, candidateUser.PasswordHash))
            {
                var token = GenerateJwtToken(candidateUser.Email, "Candidate");
                return Ok(new
                {
                    Token = token,
                    FirstName = candidateUser.FirstName,
                    LastName = candidateUser.LastName,
                    Role = "Candidate"
                });
            }

            return Unauthorized(new { message = "Invalid email or password parameters." });
        }

        // ─── CANDIDATE MANAGEMENT ENDPOINTS (Users Table) ───
        [HttpGet("candidates")]
        public async Task<IActionResult> GetCandidates()
        {
            var candidates = await _context.Users.ToListAsync();
            return Ok(candidates);
        }

        [HttpPut("candidates/{id}")]
        public async Task<IActionResult> UpdateCandidate(int id, [FromBody] User updatedUser)
        {
            var candidate = await _context.Users.FindAsync(id);
            if (candidate == null) return NotFound(new { message = "Candidate not found." });

            candidate.FirstName = updatedUser.FirstName;
            candidate.LastName = updatedUser.LastName;
            candidate.Email = updatedUser.Email;
            candidate.JobTitle = updatedUser.JobTitle;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Candidate updated successfully." });
        }

        [HttpDelete("candidates/{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            var candidate = await _context.Users.FindAsync(id);
            if (candidate == null) return NotFound(new { message = "Candidate not found." });

            _context.Users.Remove(candidate);
            await _context.SaveChangesAsync();

            await _context.Database.ExecuteSqlRawAsync(@"
                WITH CTE AS (
                    SELECT Id, ROW_NUMBER() OVER (ORDER BY Id) AS NewId
                    FROM Users
                )
                UPDATE CTE SET Id = NewId;
                
                DECLARE @MaxId INT = ISNULL((SELECT MAX(Id) FROM Users), 0);
                DBCC CHECKIDENT ('Users', RESEED, @MaxId);
            ");

            return Ok(new { message = "Candidate deleted and IDs successfully resequenced." });
        }

        // ─── INTERNAL ROLE MANAGEMENT ENDPOINTS (RoleAccounts Table) ───
        [HttpGet("role-accounts")]
        public async Task<IActionResult> GetRoleAccounts()
        {
            var staffAccounts = await _context.RoleAccounts
                .Select(acc => new { acc.Id, acc.Email, acc.Role })
                .ToListAsync();
            return Ok(staffAccounts);
        }

        [HttpDelete("role-accounts/{id}")]
        public async Task<IActionResult> DeleteRoleAccount(int id)
        {
            var account = await _context.RoleAccounts.FindAsync(id);
            if (account == null) return NotFound(new { message = "System account not found." });

            // Program.cs එකේ seed වන ප්‍රධාන ගිණුම ආරක්ෂා කිරීමට වෙනස් කළා
            if (account.Email == "admin@gmail.com")
                return BadRequest(new { message = "Root system operator cannot be terminated." });

            _context.RoleAccounts.Remove(account);
            await _context.SaveChangesAsync();

            await _context.Database.ExecuteSqlRawAsync(@"
                WITH CTE AS (
                    SELECT Id, ROW_NUMBER() OVER (ORDER BY Id) AS NewId
                    FROM RoleAccounts
                )
                UPDATE CTE SET Id = NewId;
                
                DECLARE @MaxId INT = ISNULL((SELECT MAX(Id) FROM RoleAccounts), 0);
                DBCC CHECKIDENT ('RoleAccounts', RESEED, @MaxId);
            ");

            return Ok(new { message = "Internal system role terminated and IDs successfully resequenced." });
        }
    }

    // ─── DATA TRANSFER OBJECTS (DTOs) ───
    public class RegisterDto
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class AdminRegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}