using Microsoft.AspNetCore.Mvc;
using Backend.Data; // ඔයාගේ DataContext තියෙන තැන
using Backend.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        // Role එක අනිවාර්යයෙන්ම Candidate කරන්න (Security අතින් වැදගත්)
        user.Role = "Candidate";

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email);
        if (user == null || user.Password != loginDto.Password) // දැනට plain password බලමු
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        return Ok(new { message = "Login successful!", token = "dummy-jwt-token" });
    }
}

{
    public string Email { get; set; }
    public string Password { get; set; }
}