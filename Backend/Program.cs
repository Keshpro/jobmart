using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection Configuration (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. JWT Authentication Setup 
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKeyForAiRecruitmentPlatform2026";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false, 
            ValidateAudience = false 
        };
    });

// Authorization part
builder.Services.AddAuthorization();

// 3. CORS Setup (Authorized React Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // React/Vite run on port 5173, so we allow that origin
            policy.WithOrigins("http://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger Setup with JWT Support 
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AI Recruitment API", Version = "v1" });
    
    // Swagger UI "Authorize" Button 
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. \r\n\r\nType 'Bearer' [space] and then your token.\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Allows React frontend to access backend APIs
app.UseCors("AllowReactApp");

// Security Middleware
app.UseAuthentication(); // Authentication (Login)
app.UseAuthorization();  // Authorization (Roles)

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();

    try
    {
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
            Console.WriteLine("🔄 [DATABASE]: Pending migrations applied successfully!");
        }
        else
        {
    
            context.Database.EnsureCreated();
        }

        if (!context.RoleAccounts.Any(r => r.Email == "admin@gmail.com"))
        {
            var adminStaff = new RoleAccount
            {
                Email = "admin@gmail.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), 
                Role = "Admin"
            };

            context.RoleAccounts.Add(adminStaff);
            context.SaveChanges();
            Console.WriteLine("🚀 [SEEDING SUCCESS]: admin@gmail.com has been added to RoleAccounts table as Admin!");
        }
        else
        {
            Console.WriteLine("✅ [DB CHECK]: Admin (admin@gmail.com) already exists in RoleAccounts.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ [DB ERROR]: Something went wrong during database initialization: {ex.Message}");
    }
}

app.Run();