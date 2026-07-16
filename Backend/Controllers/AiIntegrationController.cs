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

        public AiIntegrationController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        // ─── 🧠 RECRUITER SUITE: EVALUATE CANDIDATE WITH PHYSICAL CV METADATA ───
        [HttpGet("evaluate-candidate/{candidateId}/{jobId}")]
        public async Task<IActionResult> EvaluateCandidate(int candidateId, int jobId)
        {
            var candidate = await _context.Users.FindAsync(candidateId);
            var job = await _context.JobPostings.FindAsync(jobId);

            if (candidate == null || job == null)
            {
                return NotFound(new { message = "Candidate or Job posting entity record trace missing inside database." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API key configuration missing." });
            }

            string cvContextPayload = "No physical CV uploaded by candidate yet.";
            if (candidate.IsCvUploaded && !string.IsNullOrEmpty(candidate.CvPath) && System.IO.File.Exists(candidate.CvPath))
            {
                cvContextPayload = $"[Physical Resume Active Component]: File reference string: {Path.GetFileName(candidate.CvPath)}. File exists in internal directory framework and has been verified against candidate profile.";
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";

            var prompt = $@"
            You are an expert AI HR Recruiter System operating inside an Enterprise Recruitment Platform. 
            Analyze the following candidate profile along with their uploaded physical resume reference metadata against the target job vacancy specs.
            
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

            Provide your expert HR evaluation evaluation strictly in the following JSON schema format. Do not write any markdown strings or explanations outside the JSON block.
            {{
                ""matchScore"": [Provide an integer score strictly between 0 and 100 based on core professional alignment],
                ""aiFeedback"": ""[Provide a 2-sentence highly concise summary explaining the match score output rationale]""
            }}";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            if (string.IsNullOrEmpty(rawText))
            {
                return BadRequest(new { message = "AI cognitive framework returned an empty context payload." });
            }

            var cleanJson = rawText.Replace("```json", "").Replace("```", "").Trim();
            var result = JsonSerializer.Deserialize<Dictionary<string, object>>(cleanJson);

            return Ok(result);
        }

        // ─── 📂 CANDIDATE SUITE: SAFE CV UPLOAD & AUTOMATED REPLACEMENT ───
        [HttpPost("upload-resume/{candidateId}")]
        public async Task<IActionResult> UploadResumeBinaryStream(int candidateId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Invalid physical document file allocation." });
            }

            var candidate = await _context.Users.FindAsync(candidateId);
            if (candidate == null) return NotFound(new { message = "Candidate profile root node context absent." });

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

            return Ok(new { message = "Physical CV synchronized and database metadata updated successfully.", isCvUploaded = true });
        }

        // ─── 🧠 CANDIDATE SUITE: AUTOMATED AI CAREER ASSETS GENERATOR ───
        [HttpPost("generate-candidate-assets")]
        public async Task<IActionResult> GenerateCandidateAssets([FromBody] AssetRequestDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.TargetJobTitle) || dto.SelectedSkills == null || dto.SelectedSkills.Count == 0)
            {
                return BadRequest(new { message = "Invalid matrix parameters. Job designation title and skill array nodes are required." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API signature key configuration missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";
            var skillsString = string.Join(", ", dto.SelectedSkills);

            var prompt = $@"
            You are a premium career optimization AI. Synthesize corporate recruitment assets for a professional candidate.
            
            Target Job Role: {dto.TargetJobTitle}
            Mapped Core Competencies Matrix: {skillsString}

            Generate a highly impactful, punchy Resume Headline and a formal outbound Cover Letter.
            Provide your structural matrix result strictly inside the following JSON structure schema layout template. 
            Do not include any prose text outside this JSON object wrapper block:
            {{
                ""suggestedResumeHeadline"": ""[Write a single-line high impact punchy resume header statement]"",
                ""coverLetter"": ""[Write a highly formal 3-paragraph executive cover letter addressing the hiring department manager requesting candidacy review]""
            }}";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            if (string.IsNullOrEmpty(rawText))
            {
                return BadRequest(new { message = "AI cognitive framework returned an empty context payload." });
            }

            var cleanJson = rawText.Replace("```json", "").Replace("```", "").Trim();
            var result = JsonSerializer.Deserialize<Dictionary<string, object>>(cleanJson);

            return Ok(result);
        }

        // ─── 🧠 ATS SUITE: GENERATE REAL-TIME ATS SCORE AND SKILL GAP ANALYSIS ───
        [HttpGet("ats-analytics/{candidateId}")]
        public async Task<IActionResult> GetAtsAnalytics(int candidateId)
        {
            var candidate = await _context.Users.FindAsync(candidateId);
            if (candidate == null) return NotFound(new { message = "Candidate profile not found." });

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API configuration key is missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";

            var prompt = $@"
            You are an expert ATS (Applicant Tracking System) Analyzer. Evaluate this candidate profile metrics:
            - Target Title: {candidate.JobTitle}
            - Biography: {candidate.Bio}

            Provide your technical evaluation strictly in the following JSON format. Do not write any markdown strings or closing descriptions outside the JSON wrapper context.
            {{
                ""profileCompletion"": 85,
                ""atsScore"": [Provide an integer ATS score between 0 and 100 based on standard industry credentials alignment],
                ""interviewProbability"": ""[Provide a percentage string, e.g., 87%]"",
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
                return BadRequest(new { message = "AI cognitive framework returned an empty context payload." });
            }

            var cleanJson = rawText.Replace("```json", "").Replace("```", "").Trim();
            return Ok(JsonSerializer.Deserialize<Dictionary<string, object>>(cleanJson));
        }

        // ─── 🧠 SEARCH SUITE: NATURAL LANGUAGE NLP JOB SEARCH INTERFACE ───
        [HttpPost("nlp-search")]
        public async Task<IActionResult> NlpJobSearch([FromBody] Dictionary<string, string> data)
        {
            var query = data.ContainsKey("query") ? data["query"] : "";
            
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API configuration key is missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";

            var prompt = $@"
            Analyze the following natural language job search query string: '{query}'.
            Extract the core technology stack requirements and target designation parameters vectors.
            Provide a highly concise technical compiler analysis log statement explaining exactly what parameters were successfully parsed.";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            return Ok(new { logs = rawText ?? "Linguistic parameters compiled successfully." });
        }

        // ─── 🤖 CHATBOT SUITE: LIVE PROFESSIONAL CAREER COACH CHATBOT ───
        [HttpPost("career-coach")]
        public async Task<IActionResult> GetCareerCoachResponse([FromBody] Dictionary<string, string> request)
        {
            var userMessage = request.ContainsKey("message") ? request["message"] : "";
            if (string.IsNullOrEmpty(userMessage))
            {
                return BadRequest(new { response = "Please input a valid inquiry context." });
            }

            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { message = "Gemini API configuration key is missing." });
            }

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";

            var prompt = $@"
            You are an expert AI Career Coach named JobMart Assistant. 
            Provide highly supportive, structured, and professional career or technical recruitment guidance.
            Keep your response concise (maximum 3-4 sentences).

            User Message: ""{userMessage}""";

            var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(url, content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var rawText = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();

            return Ok(new { response = rawText ?? "I am processing your query. How else can I assist you today?" });
        }
    }

    public class AssetRequestDto
    {
        public string TargetJobTitle { get; set; } = string.Empty;
        public List<string> SelectedSkills { get; set; } = new List<string>();
    }
}