using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection Configuration (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. JWT Authentication Setup (Login / Register වලට අවශ්‍යයි)
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

// Authorization සේවාව ඇතුලත් කිරීම (Roles පාවිච්චි කරන්න මේක අනිවාර්යයි)
builder.Services.AddAuthorization();

// 3. CORS Setup (React Frontend එකට කතා කරන්න අවසර දීම)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // React/Vite run වෙන සාමාන්‍ය port එක (5173) මෙතනට දාලා තියෙන්නේ
            policy.WithOrigins("http://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 4. Swagger Setup with JWT Support (Bug Fix එක මෙතනයි)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AI Recruitment API", Version = "v1" });
    
    // Swagger UI එකට "Authorize" Button එක එකතු කිරීම
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

// CORS එක Enable කිරීම (හැමවෙලේම Authorization වලට උඩින් තියෙන්න ඕනේ)
app.UseCors("AllowReactApp");

// Security - අනිවාර්යයෙන්ම මේ පිළිවෙලටම තියෙන්න ඕනේ 
app.UseAuthentication(); // කවුද කියලා අඳුරගන්නවා (Login)
app.UseAuthorization();  // මොනවද කරන්න පුළුවන් කියලා බලනවා (Roles)

app.MapControllers();

app.Run();