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

// 2. Real JWT Authentication Architecture Setup 
// appsettings.json එකෙන් Key එක කියවයි, නැතහොත් strong fallback signature එකක් භාවිතා කරයි
var jwtKey = builder.Configuration["Jwt:Key"] ?? "JobMart_Enterprise_Secure_Dynamic_JWT_Secret_Key_2026_Token_Validation";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Development නිසාවෙන් HTTPS චෙක් කිරීම අක්‍රීයයි
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false, // Localhost නිසා Domain Issuer check කිරීම මඟහරියි
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero // Token එක Expire වූ සැනින් ක්ෂණිකව අවලංගු වීමට
    };
});

// Authorization layer activation
builder.Services.AddAuthorization();

// 3. CORS Setup (Authorized React Frontend Port 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger Setup with JWT Bearer Support 
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AI Recruitment API", Version = "v1" });
    
    // Swagger UI "Authorize" Button configuration
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
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

// Allows React frontend to access backend APIs securely
app.UseCors("AllowReactApp");

// Security Middleware Pipeline Enforcers (Authentication must be called BEFORE Authorization)
app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();

// 5. Automated Database Initialization & Seeding Engine
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();

    try
    {
        // Pending Migrations පවතී නම් ස්වයංක්‍රීයව Database එකට Apply කරයි
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
            Console.WriteLine("🔄 [DATABASE]: Pending migrations applied successfully!");
        }
        else
        {
            context.Database.EnsureCreated();
        }

        // Default Root Administrator Account Seed Interceptor
        if (!context.RoleAccounts.Any(r => r.Email == "admin@gmail.com"))
        {
            var adminStaff = new RoleAccount
            {
                Email = "admin@gmail.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), // Cryptographic BCrypt Hashing
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