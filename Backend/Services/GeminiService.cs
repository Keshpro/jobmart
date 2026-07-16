using System.Text;
using System.Text.Json;

namespace JobMart.Api.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        // Main method to communicate with Gemini API
        public async Task<string> GenerateContentAsync(string prompt)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var model = _configuration["Gemini:Model"] ?? "gemini-1.5-pro";
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

            // Format the request body based on Google API documentation
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            // Send POST request
            var response = await _httpClient.PostAsync(url, jsonContent);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error: {error}");
            }

            // Parse the JSON response securely
            var responseData = await response.Content.ReadFromJsonAsync<JsonElement>();
            
            try 
            {
                var text = responseData.GetProperty("candidates")[0]
                                       .GetProperty("content")
                                       .GetProperty("parts")[0]
                                       .GetProperty("text")
                                       .GetString();
                return text ?? "No response generated.";
            }
            catch
            {
                return "Failed to parse Gemini response.";
            }
        }
    }
}