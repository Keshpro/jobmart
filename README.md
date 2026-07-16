# JobMart - AI-Powered Recruitment & Talent Management System

JobMart is a modern, enterprise-grade Applicant Tracking System (ATS) and talent ecosystem built with a high-performance .NET Core Web API backend, a responsive React (Vite) frontend with Tailwind CSS, and deeply integrated cognitive intelligence powered by the Google Gemini API. The system enables seamless workflows across multiple organization roles (Candidates, Recruiters, and Hiring Managers).

---

## 🚀 Key System Capabilities & Architecture

*   **Dual-Engine Backend Architecture**: Utilizes a clean .NET Core Web API paired with Entity Framework Core connecting to SQL Server for structural business workflows.
*   **Cognitive AI Pipelines**: Seamless asynchronous handshake with Google Gemini API models to deliver instant, actionable talent metrics without local ML training.
*   **Dual-Vector File Asset Tracking**: Hybrid document ingestion workflow using file-system binary storage for physical documents (`.pdf`/`.docx`) linked directly with SQL Server index path strings.
*   **Multi-Tabbed Intelligent Portals**: High-performance dashboard framework for structured authorization layers and analytical workflows.

---

## 🛠️ The Tech Stack

### Core Backend Components
*   **Framework:** .NET Core 8.0 / 9.0 Web API
*   **Data Access Layer:** Entity Framework Core (Code-First Migrations)
*   **Database Engine:** Microsoft SQL Server
*   **Cognitive Engine:** Google Gemini API Integration (`gemini-pro`)

### Core Frontend Components
*   **Library:** React.js (Scaffolded using Vite for ultra-fast compilation)
*   **Utility & Styling Framework:** Tailwind CSS 
*   **Network Request Layer:** Axios (HTTP client with global pipeline config)

---

## 📂 Core Modular Blueprint

```text
├── Backend/                    # .NET Core Engine
│   ├── Controllers/            # API Endpoints (Auth, JobPostings, AiIntegration)
│   ├── Data/                   # DbContext System & Schema Specifications
│   ├── Models/                 # Strongly Typed Entities (User, JobPosting)
│   ├── Storage/Resumes/        # Local Native File System Cache for CV uploads
│   └── appsettings.json        # Environment Parameter Management & Keys
│
└── frontend/                   # React Layer
    ├── src/
    │   ├── components/         # Shared Structural Units (Sidebar, Buttons)
    │   ├── pages/
    │   │   ├── Home.jsx        # Landing Framework containing the Floating AI Bot
    │   │   └── Dashboard.jsx   # Candidate Telemetry Hub
    │   └── main.jsx            # Application Context Initializer
