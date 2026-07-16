namespace JobMart.Api.Models
{
    // DTO for user registration
    public class UserRegistrationDto
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; } 
    }

    // DTO for user login
    public class UserLoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}