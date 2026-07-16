using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiIntegrationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        // Inject dependencies
        public AiIntegrationController(ApplicationDbContext context, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = httpClient;
        }

        [HttpGet("evaluate-candidate/{candidateId}/{jobId}")]
        public async Task<IActionResult> EvaluateCandidate(int candidateId, int jobId)
        {
            var candidate = await _context.Users.FindAsync(candidateId);
            var job = await _context.JobPostings.FindAsync(jobId);

            if (candidate == null || job == null)
            {
                return NotFound(new { message = "Candidate or Job posting entity record missing." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API key missing." });
            }

            string cvContextPayload = "No physical CV uploaded by candidate yet.";
            if (candidate.IsCvUploaded && !string.IsNullOrEmpty(candidate.CvPath) && System.IO.File.Exists(candidate.CvPath))
            {
                cvContextPayload = $"[Physical Resume]: File reference string: {Path.GetFileName(candidate.CvPath)}.";
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={apiKey}";

            var prompt = $@"
            You are an expert AI HR Recruiter System. 
            Analyze the following candidate profile against the target job specs.
            
            Candidate Base Profile:
            - Name: {candidate.FirstName} {candidate.LastName}
            - Current Job Title: {candidate.JobTitle}
            - Personal Biography: {candidate.Bio}
            
            Candidate Uploaded CV Context:
            - {cvContextPayload}
            
            Target Job Vacancy:
            - Title: {job.Title}
            - Corporate Company: {job.Company}
            - Description Summary: {job.Description}

            Provide your expert HR evaluation strictly in JSON format:
            {{
                ""matchScore"": [0-100],
                ""aiFeedback"": ""[2-sentence concise summary]""
            }}";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            if (string.IsNullOrEmpty(rawText))
            {
                return BadRequest(new { message = "AI returned an empty response." });
            }

            var cleanJson = rawText.Replace("```json", "").Replace("```", "").Trim();
            var result = JsonSerializer.Deserialize<Dictionary<string, object>>(cleanJson);

            return Ok(result);
        }

        [HttpPost("upload-resume/{candidateId}")]
        public async Task<IActionResult> UploadResumeBinaryStream(int candidateId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Invalid document file." });
            }

            var candidate = await _context.Users.FindAsync(candidateId);
            if (candidate == null) return NotFound(new { message = "Candidate profile not found." });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Storage", "Resumes");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            if (!string.IsNullOrEmpty(candidate.CvPath) && System.IO.File.Exists(candidate.CvPath))
            {
                System.IO.File.Delete(candidate.CvPath);
            }

            var uniquelyNamedFile = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var binaryExecutionFilePath = Path.Combine(uploadsFolder, uniquelyNamedFile);

            using (var stream = new FileStream(binaryExecutionFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            candidate.CvPath = binaryExecutionFilePath;
            candidate.IsCvUploaded = true;
            _context.Entry(candidate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Physical CV uploaded successfully.", isCvUploaded = true });
        }

        [HttpPost("generate-candidate-assets")]
        public async Task<IActionResult> GenerateCandidateAssets([FromBody] AssetRequestDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.TargetJobTitle) || dto.SelectedSkills == null || dto.SelectedSkills.Count == 0)
            {
                return BadRequest(new { message = "Invalid parameters." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API key missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={apiKey}";
            var skillsString = string.Join(", ", dto.SelectedSkills);

            var prompt = $@"
            You are a premium career optimization AI.
            Target Job Role: {dto.TargetJobTitle}
            Core Competencies: {skillsString}

            Provide your result strictly inside the following JSON structure:
            {{
                ""suggestedResumeHeadline"": ""[Punchy resume header statement]"",
                ""coverLetter"": ""[Formal 3-paragraph executive cover letter]""
            }}";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            if (string.IsNullOrEmpty(rawText))
            {
                return BadRequest(new { message = "AI returned an empty response." });
            }

            var cleanJson = rawText.Replace("```json", "").Replace("```", "").Trim();
            var result = JsonSerializer.Deserialize<Dictionary<string, object>>(cleanJson);

            return Ok(result);
        }

        [HttpGet("ats-analytics/{candidateId}")]
        public async Task<IActionResult> GetAtsAnalytics(int candidateId)
        {
            var candidate = await _context.Users.FindAsync(candidateId);
            if (candidate == null) return NotFound(new { message = "Candidate profile not found." });

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API key missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={apiKey}";

            var prompt = $@"
            You are an expert ATS Analyzer. Evaluate this candidate:
            - Target Title: {candidate.JobTitle}
            - Biography: {candidate.Bio}

            Provide your evaluation strictly in JSON format:
            {{
                ""profileCompletion"": 85,
                ""atsScore"": [0-100],
                ""interviewProbability"": ""[e.g., 87%]"",
                ""missingKeywords"": [""Keyword1"", ""Keyword2""],
                ""suggestedImprovements"": [""Improvement1"", ""Improvement2""]
            }}";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            if (string.IsNullOrEmpty(rawText))
            {
                return BadRequest(new { message = "AI returned an empty response." });
            }

            var cleanJson = rawText.Replace("```json", "").Replace("```", "").Trim();
            return Ok(JsonSerializer.Deserialize<Dictionary<string, object>>(cleanJson));
        }

        [HttpPost("nlp-search")]
        public async Task<IActionResult> NlpJobSearch([FromBody] Dictionary<string, string> data)
        {
            var query = data.ContainsKey("query") ? data["query"] : "";
            
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API key missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={apiKey}";

            var prompt = $@"
            Analyze the following natural language job search query string: '{query}'.
            Extract the core technology stack requirements and target designation parameters vectors.
            Provide a highly concise technical compiler analysis log statement.";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            return Ok(new { logs = rawText ?? "Parameters compiled successfully." });
        }

        [HttpPost("career-coach")]
        public async Task<IActionResult> GetCareerCoachResponse([FromBody] Dictionary<string, string> request)
        {
            var userMessage = request.ContainsKey("message") ? request["message"] : "";
            if (string.IsNullOrEmpty(userMessage))
            {
                return BadRequest(new { response = "Please input a valid inquiry." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API key missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={apiKey}";

            var prompt = $@"
            You are an expert AI Career Coach named JobMart Assistant. 
            Provide highly supportive, professional career guidance.
            Keep your response concise (maximum 3-4 sentences).

            User Message: ""{userMessage}""";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            return Ok(new { response = rawText ?? "I am processing your query." });
        }
    }

    public class AssetRequestDto
    {
        public required string TargetJobTitle { get; set; }
        public required List<string> SelectedSkills { get; set; }
    }
}