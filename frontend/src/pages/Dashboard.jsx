import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5183/api';

const GENERIC_INDUSTRIES = [
  "Administration & HR", "Finance & Accounting", "Sales & Marketing",
  "Customer Service", "Engineering & Tech", "Operations & Logistics", "Healthcare & Medical"
];

// ─────────────────────────────────────────────────────────────────────────
// SKILL CATALOG — organized by industry category so the picker stays small
// and relevant instead of dumping one giant undifferentiated list.
// ─────────────────────────────────────────────────────────────────────────
const SKILL_CATALOG = {
  "Administration & HR": [
    "Recruitment & Talent Acquisition", "Onboarding & Induction", "Employee Relations",
    "Performance Management", "Compensation & Benefits Administration", "HRIS Management",
    "Payroll Processing", "Labor Law Compliance", "Policy Development", "Training & Development",
    "Succession Planning", "Conflict Resolution", "Diversity & Inclusion Programs",
    "Employee Engagement", "Workforce Planning", "Exit Interviews & Offboarding",
    "Organizational Development", "Job Analysis & Design", "Disciplinary Procedures",
    "Health & Safety Compliance", "Office Administration", "Records Management",
    "Meeting Coordination", "Calendar Management", "Travel Coordination", "Vendor Management",
    "Procurement Support", "Document Control", "Correspondence Handling", "Data Entry & Filing",
    "Employee Handbook Maintenance", "Benefits Enrollment", "Grievance Handling",
    "HR Analytics & Reporting", "Applicant Tracking Systems", "Background Verification",
    "Compensation Benchmarking", "Employer Branding", "Internal Communications", "Change Management",
  ],
  "Finance & Accounting": [
    "Financial Reporting", "Budgeting & Forecasting", "Accounts Payable", "Accounts Receivable",
    "General Ledger Management", "Bank Reconciliation", "Financial Statement Analysis",
    "Tax Preparation & Compliance", "Payroll Accounting", "Cost Accounting",
    "Auditing & Internal Controls", "Cash Flow Management", "Fixed Asset Management",
    "Accounts Reconciliation", "Financial Modeling", "Variance Analysis",
    "Regulatory Compliance (IFRS/GAAP)", "Credit Control", "Invoice Processing",
    "Expense Management", "Financial Planning & Analysis (FP&A)", "Risk Management",
    "Investment Analysis", "Treasury Management", "Procure-to-Pay Processes",
    "ERP Systems (SAP/Oracle)", "QuickBooks/Xero Proficiency", "Management Accounting",
    "Payroll Tax Filing", "Chart of Accounts Maintenance", "Month-End Close Process",
    "Year-End Financial Close", "Financial Due Diligence", "Budgetary Control",
    "Working Capital Management", "Debt Management", "Statutory Reporting", "VAT/GST Compliance",
    "Internal Audit", "External Audit Coordination",
  ],
  "Sales & Marketing": [
    "Lead Generation", "Sales Pipeline Management", "CRM Software Proficiency",
    "Customer Relationship Building", "Cold Calling", "Sales Negotiation", "Account Management",
    "Territory Management", "Sales Forecasting", "Digital Marketing Strategy", "SEO/SEM",
    "Social Media Marketing", "Content Marketing", "Email Marketing Campaigns", "Brand Management",
    "Market Research & Analysis", "Product Positioning", "Campaign Management",
    "Marketing Analytics", "Google Ads Management", "Copywriting", "Public Relations",
    "Influencer Marketing", "Event Marketing", "Trade Show Coordination",
    "Customer Retention Strategies", "Upselling & Cross-Selling", "Sales Presentations",
    "Proposal Writing", "Competitive Analysis", "Pricing Strategy",
    "Channel Partnership Management", "Affiliate Marketing", "Marketing Automation Tools",
    "A/B Testing", "Conversion Rate Optimization", "Customer Segmentation",
    "Sales Training & Coaching", "Retail Merchandising", "B2B Sales",
  ],
  "Customer Service": [
    "Customer Support", "Complaint Resolution", "Call Center Operations", "Live Chat Support",
    "Ticketing Systems (Zendesk/Freshdesk)", "Customer Satisfaction Surveys",
    "Service Level Agreement Management", "Technical Support", "Order Processing",
    "Returns & Refunds Handling", "Customer Onboarding", "Help Desk Management",
    "Multi-Channel Support (Phone/Email/Chat)", "Escalation Management",
    "Quality Assurance Monitoring", "Customer Feedback Analysis", "Retention & Loyalty Programs",
    "Product Knowledge Training", "Empathy & Active Listening", "Conflict De-escalation",
    "Customer Journey Mapping", "First Contact Resolution", "Live Support Scripting",
    "CRM Data Entry", "Warranty Claims Processing", "Service Recovery", "After-Sales Support",
    "Customer Success Management", "Client Relationship Management", "Voice of Customer Programs",
    "Chatbot Management", "Call Quality Auditing", "Multilingual Support",
    "Self-Service Portal Management", "Account Reactivation",
  ],
  "Engineering & Tech": [
    "Software Development", "React.js", "Angular", "Vue.js", "Node.js", "Java Spring Boot",
    "ASP.NET Core", "Python Development", "C# Development", "RESTful API Design", "GraphQL",
    "Microservices Architecture", "Cloud Architecture (AWS/Azure/GCP)", "DevOps Practices",
    "CI/CD Pipeline Management", "Docker & Containerization", "Kubernetes Orchestration",
    "Database Design (SQL Server/PostgreSQL/MySQL)", "NoSQL Databases (MongoDB)",
    "System Architecture Design", "Unit Testing & TDD", "Code Review", "Version Control (Git)",
    "Agile/Scrum Methodology", "Technical Documentation", "Mobile App Development (iOS/Android)",
    "UI/UX Implementation", "Performance Optimization", "Security Best Practices",
    "Penetration Testing", "Network Administration", "IT Infrastructure Management",
    "Server Administration (Linux/Windows)", "Cybersecurity Monitoring",
    "Data Structures & Algorithms", "Machine Learning Fundamentals", "Data Engineering",
    "ETL Pipeline Development", "Business Intelligence Tools", "Automated Testing Frameworks",
    "Load & Stress Testing", "Technical Troubleshooting", "Firmware Development",
    "Embedded Systems", "IoT Development", "Blockchain Fundamentals",
    "Site Reliability Engineering", "Infrastructure as Code (Terraform)",
    "Serverless Architecture", "Full-Stack Development",
  ],
  "Operations & Logistics": [
    "Supply Chain Management", "Inventory Management", "Warehouse Operations",
    "Procurement & Sourcing", "Vendor & Supplier Relations", "Logistics Coordination",
    "Fleet Management", "Distribution Planning", "Demand Forecasting", "Quality Control",
    "Lean Manufacturing", "Six Sigma", "Process Improvement", "Production Planning",
    "Shipping & Freight Coordination", "Import/Export Compliance", "Customs Documentation",
    "Order Fulfillment", "Stock Reconciliation", "ERP Systems (SAP/Oracle)",
    "Route Optimization", "Cost Reduction Initiatives", "Health & Safety Standards",
    "Facilities Management", "Equipment Maintenance Scheduling", "Contract Negotiation",
    "Material Requirements Planning", "Just-In-Time (JIT) Inventory", "Cold Chain Logistics",
    "Third-Party Logistics (3PL) Management", "Reverse Logistics", "KPI Tracking & Reporting",
    "Capacity Planning", "Cross-Docking Operations", "Barcode & RFID Systems",
    "Freight Cost Analysis", "Regulatory Compliance", "Project Coordination",
    "Risk Mitigation Planning", "Sustainability Initiatives",
  ],
  "Healthcare & Medical": [
    "Patient Care Coordination", "Clinical Documentation", "Medical Records Management",
    "HIPAA Compliance", "Electronic Health Records (EHR)", "Patient Scheduling",
    "Insurance Verification & Billing", "Medical Coding (ICD-10/CPT)", "Vital Signs Monitoring",
    "Medication Administration", "Infection Control Protocols", "Clinical Triage",
    "Diagnostic Support", "Care Plan Development", "Patient Education",
    "Telehealth Coordination", "Healthcare Compliance & Regulations",
    "Quality Assurance in Healthcare", "Emergency Response Procedures", "Laboratory Coordination",
    "Medical Equipment Operation", "Discharge Planning", "Case Management",
    "Health Informatics", "Clinical Research Support", "Pharmacy Coordination",
    "Nursing Care Standards", "Patient Advocacy", "Medical Billing & Reimbursement",
    "Cross-Functional Care Team Collaboration", "Chronic Disease Management",
    "Rehabilitation Support", "Occupational Health & Safety", "Public Health Program Support",
    "Health Records Auditing",
  ],
};

// Cross-industry skills shown regardless of selected category
const UNIVERSAL_SKILLS = [
  "Management", "Leadership", "Strategic Planning", "Project Management", "Team Building",
  "Time Management", "Critical Thinking", "Problem Solving", "Decision Making",
  "Communication Skills", "Presentation Skills", "Negotiation", "Conflict Resolution",
  "Adaptability", "Analytical Thinking", "Attention to Detail", "Multitasking",
  "Stakeholder Management", "Budget Management", "Risk Assessment", "Data Analysis",
  "Reporting & Documentation", "Cross-Functional Collaboration", "Mentoring & Coaching",
  "Public Speaking", "Business Writing", "Microsoft Office Suite", "Google Workspace",
  "Process Optimization", "Change Management", "Innovation Management", "Customer Focus",
  "Ethical Judgment", "Emotional Intelligence", "Cultural Competence", "Remote Team Management",
  "Agile Mindset", "Vendor Negotiation", "Crisis Management", "Continuous Improvement",
  "Goal Setting & OKRs", "Performance Metrics Tracking", "Digital Literacy", "Research Skills",
  "Networking", "Delegation", "Work Prioritization", "Bilingual Communication (Sinhala-English)",
  "Financial Literacy", "Compliance Awareness",
];

// Keywords used to infer a job posting's category when the API doesn't return one directly
const CATEGORY_KEYWORDS = {
  "Administration & HR": ["hr", "human resources", "admin", "recruit", "people", "talent"],
  "Finance & Accounting": ["finance", "account", "audit", "tax", "budget", "treasury"],
  "Sales & Marketing": ["sales", "marketing", "brand", "growth", "business development"],
  "Customer Service": ["customer", "support", "service desk", "call center", "care"],
  "Engineering & Tech": ["engineer", "developer", "software", "it ", "tech", "programmer", "data", "qa"],
  "Operations & Logistics": ["operations", "logistics", "supply chain", "warehouse", "procurement"],
  "Healthcare & Medical": ["health", "medical", "nurse", "clinical", "patient", "pharma"],
};

const detectJobCategory = (job) => {
  if (!job) return null;
  if (job.category && GENERIC_INDUSTRIES.includes(job.category)) return job.category;
  const text = `${job.title || ''} ${job.department || ''} ${job.description || ''}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => text.includes(k))) return cat;
  }
  return null;
};

const getSkillsForCategory = (category) => {
  const base = category && SKILL_CATALOG[category] ? SKILL_CATALOG[category] : [];
  // Dedupe — some skills legitimately belong to more than one category
  // (e.g. "Change Management", "ERP Systems (SAP/Oracle)").
  return Array.from(new Set([...base, ...UNIVERSAL_SKILLS]));
};

const ALL_SKILLS_DEDUPED = Array.from(new Set([...Object.values(SKILL_CATALOG).flat(), ...UNIVERSAL_SKILLS]));

// ─────────────────────────────────────────────────────────────────────────
// SHARED STYLE TOKENS (Executive Light Theme — Editorial White / Dark Slate / Forest Green)
// ─────────────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] bg-[#F8FAFC] outline-none focus:border-[#4A7C59] focus:bg-white transition placeholder:text-gray-300";

const cardCls = "bg-white border border-[#E7E5E4] rounded-2xl";

const chipCls = (active) =>
  `px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition ${
    active ? 'bg-[#4A7C59] text-white border-[#4A7C59]' : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#4A7C59]'
  }`;

// ─────────────────────────────────────────────────────────────────────────
// INLINE ICONS
// ─────────────────────────────────────────────────────────────────────────
const Icon = {
  Home: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Document: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Spinner: () => (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V2.5" />
    </svg>
  ),
  Search: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [candidateData, setCandidateData] = useState({
    id: 0, firstName: '', lastName: '', email: '', jobTitle: '', status: 'Active'
  });
  const [allJobs, setAllJobs] = useState([]);
  const [loadingCandidate, setLoadingCandidate] = useState(true);
  const [candidateLoadError, setCandidateLoadError] = useState('');

  const [stats, setStats] = useState({ applied: 0, reviewing: 0, shortListed: 0, rejected: 0 });

  // CV builder state
  const [cvForm, setCvForm] = useState({ summary: '', contact: '', preferredField: GENERIC_INDUSTRIES[0] });
  const [experiences, setExperiences] = useState(['']);
  const [educations, setEducations] = useState(['']);
  const [cvSkills, setCvSkills] = useState([]);
  const [cvSkillSearch, setCvSkillSearch] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generatedCvView, setGeneratedCvView] = useState(false);

  // Profile settings state
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', password: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // AI power suite state
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiSelectedJobId, setAiSelectedJobId] = useState('');
  const [aiSelectedSkills, setAiSelectedSkills] = useState([]);
  const [aiSkillSearch, setAiSkillSearch] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // ───────────────────────────────────────────────────────────────────
  // DATA BOOTSTRAP — fetches the LOGGED-IN candidate specifically.
  // Fix: previously fell back to list[0] when the email match failed,
  // which silently showed a random/fixed candidate's data instead of
  // the actual logged-in user's data.
  // ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'Candidate') {
      alert('Unauthorized access. Please log in as a candidate.');
      navigate('/login');
      return;
    }

    const storedId = localStorage.getItem('candidateId') || localStorage.getItem('userId') || localStorage.getItem('id');
    const storedEmail = (localStorage.getItem('email') || '').trim().toLowerCase();

    const deriveStats = (status) => {
      if (status === 'Shortlisted') return { applied: 6, reviewing: 1, shortListed: 3, rejected: 2 };
      if (status === 'Rejected') return { applied: 5, reviewing: 0, shortListed: 0, rejected: 5 };
      if (status === 'UnderReview') return { applied: 4, reviewing: 4, shortListed: 0, rejected: 0 };
      return { applied: 3, reviewing: 1, shortListed: 1, rejected: 0 };
    };

    const applyCandidate = (found) => {
      setCandidateData(found);
      setProfileForm({ firstName: found.firstName || '', lastName: found.lastName || '', password: '' });
      setStats(deriveStats(found.status));
    };

    const loadByIdFirst = async () => {
      // Preferred path: fetch this specific candidate directly by id, so we
      // never accidentally render someone else's record.
      if (storedId) {
        try {
          const res = await axios.get(`${API_BASE_URL}/Auth/candidates/${storedId}`);
          if (res.data) {
            applyCandidate(res.data);
            return;
          }
        } catch (err) {
          console.warn('Direct candidate-by-id fetch failed, falling back to email match.', err);
        }
      }

      // Fallback: match by email against the full list — but never default
      // to the first record in the list if no match is found.
      try {
        const res = await axios.get(`${API_BASE_URL}/Auth/candidates`);
        const list = Array.isArray(res.data) ? res.data : [];

        // DEBUG — remove once matching is confirmed working.
        console.log('[JobMart Debug] storedId:', storedId);
        console.log('[JobMart Debug] storedEmail:', storedEmail);
        console.log('[JobMart Debug] candidates API sample record:', list[0]);
        console.log('[JobMart Debug] all localStorage keys:', { ...localStorage });

        // Some ASP.NET Core APIs return PascalCase JSON (Email, Id) instead
        // of camelCase (email, id) depending on serializer settings — check both.
        const getField = (obj, ...names) => {
          for (const n of names) {
            if (obj[n] !== undefined && obj[n] !== null) return obj[n];
          }
          return '';
        };

        const found = list.find(
          (u) => String(getField(u, 'email', 'Email')).trim().toLowerCase() === storedEmail
        );

        if (found) {
          applyCandidate(found);
        } else {
          console.warn('[JobMart Debug] No candidate matched storedEmail against the list above.');
          setCandidateLoadError('Could not match your account to a candidate record. Please log in again.');
        }
      } catch (err) {
        console.error('Failed to load candidate profile:', err);
        setCandidateLoadError('Failed to load your profile. Please refresh the page.');
      } finally {
        setLoadingCandidate(false);
      }
    };

    loadByIdFirst().finally(() => setLoadingCandidate(false));

    axios
      .get(`${API_BASE_URL}/JobPosting`)
      .then((res) => setAllJobs(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error('Failed to load job postings:', err));
  }, [navigate]);

  // ───────────────────────────────────────────────────────────────────
  // CV DYNAMIC ARRAY HANDLERS
  // ───────────────────────────────────────────────────────────────────
  const addExperienceField = () => setExperiences((prev) => [...prev, '']);
  const removeExperienceField = (index) =>
    setExperiences((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  const updateExperienceValue = (index, value) =>
    setExperiences((prev) => prev.map((v, i) => (i === index ? value : v)));

  const addEducationField = () => setEducations((prev) => [...prev, '']);
  const removeEducationField = (index) =>
    setEducations((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  const updateEducationValue = (index, value) =>
    setEducations((prev) => prev.map((v, i) => (i === index ? value : v)));

  const toggleCvSkillSelection = (skill) =>
    setCvSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  const toggleAiSkillSelection = (skill) =>
    setAiSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));

  // ───────────────────────────────────────────────────────────────────
  // SKILL LISTS — scoped to category + filtered by search text
  // ───────────────────────────────────────────────────────────────────
  const cvSkillPool = useMemo(() => getSkillsForCategory(cvForm.preferredField), [cvForm.preferredField]);
  const cvVisibleSkills = useMemo(() => {
    const q = cvSkillSearch.trim().toLowerCase();
    const pool = q ? cvSkillPool.filter((s) => s.toLowerCase().includes(q)) : cvSkillPool;
    // Always keep already-selected skills visible even if filtered out by search/category
    const extra = cvSkills.filter((s) => !pool.includes(s));
    return [...extra, ...pool];
  }, [cvSkillPool, cvSkillSearch, cvSkills]);

  const aiSelectedJob = useMemo(
    () => allJobs.find((j) => String(j.id) === String(aiSelectedJobId)) || null,
    [allJobs, aiSelectedJobId]
  );
  const aiJobCategory = useMemo(() => detectJobCategory(aiSelectedJob), [aiSelectedJob]);
  const aiSkillPool = useMemo(
    () => (aiSelectedJob ? getSkillsForCategory(aiJobCategory) : ALL_SKILLS_DEDUPED),
    [aiSelectedJob, aiJobCategory]
  );
  const aiVisibleSkills = useMemo(() => {
    const q = aiSkillSearch.trim().toLowerCase();
    const pool = q ? aiSkillPool.filter((s) => s.toLowerCase().includes(q)) : aiSkillPool;
    const extra = aiSelectedSkills.filter((s) => !pool.includes(s));
    return [...extra, ...pool];
  }, [aiSkillPool, aiSkillSearch, aiSelectedSkills]);

  const handleSelectJobForAi = (jobId) => {
    setAiSelectedJobId(jobId);
    const job = allJobs.find((j) => String(j.id) === String(jobId));
    if (job) {
      setAiJobTitle(job.title || '');
      // Drop any selected skills that no longer match the new job's category
      const newPool = getSkillsForCategory(detectJobCategory(job));
      setAiSelectedSkills((prev) => prev.filter((s) => newPool.includes(s)));
    }
  };

  // ───────────────────────────────────────────────────────────────────
  // CV PRINT COMPILATION
  // ───────────────────────────────────────────────────────────────────
  const triggerCvPrintCompilation = () => {
    if (!cvForm.summary.trim() || !cvForm.contact.trim()) {
      alert('Please complete the Summary and Contact fields before compiling your CV.');
      return;
    }
    setGeneratedCvView(true);
  };

  useEffect(() => {
    if (!generatedCvView) return;
    const timer = setTimeout(() => {
      window.print();
    }, 150);

    const handleAfterPrint = () => setGeneratedCvView(false);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [generatedCvView]);

  // ───────────────────────────────────────────────────────────────────
  // RESUME FILE UPLOAD
  // ───────────────────────────────────────────────────────────────────
  const handleResumeBinaryUpload = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      setUploadStatus('Please select a document to upload first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', uploadedFile);

    setUploading(true);
    setUploadStatus('Uploading resume...');
    try {
      const res = await axios.post(
        `${API_BASE_URL}/AiIntegration/upload-resume/${candidateData.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploadStatus(res.data?.message || 'Resume uploaded successfully.');
    } catch (err) {
      setUploadStatus('Upload failed. Please check the file and try again.');
    } finally {
      setUploading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────
  // PROFILE UPDATE
  // ───────────────────────────────────────────────────────────────────
  const saveProfileDataChanges = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    try {
      const payload = {
        ...candidateData,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      };
      if (profileForm.password.trim()) {
        payload.password = profileForm.password.trim();
      }

      await axios.put(`${API_BASE_URL}/Auth/candidates/${candidateData.id}`, payload);

      setCandidateData((prev) => ({ ...prev, firstName: profileForm.firstName, lastName: profileForm.lastName }));
      setProfileForm((prev) => ({ ...prev, password: '' }));
      setProfileMessage('Profile updated successfully.');
    } catch (err) {
      setProfileMessage('Update failed. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────
  // AI ASSET GENERATION
  // ───────────────────────────────────────────────────────────────────
  const handleAiAssetCompilation = async () => {
    setAiError('');
    if (!aiJobTitle.trim() || aiSelectedSkills.length === 0) {
      setAiError('Enter a target job title and select at least one skill.');
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/generate-candidate-assets`, {
        targetJobTitle: aiJobTitle.trim(),
        selectedSkills: aiSelectedSkills,
      });
      setAiResult(res.data);
    } catch (err) {
      setAiError('AI generation failed. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────
  // RECOMMENDATION FILTER
  // ───────────────────────────────────────────────────────────────────
  const preferredKeyword = cvForm.preferredField.split(' ')[0].toLowerCase();
  const recommendedJobsFeed = allJobs.filter((job) =>
    `${job.title || ''} ${job.category || ''} ${job.department || ''}`.toLowerCase().includes(preferredKeyword)
  );
  const overviewJobs = recommendedJobsFeed.length > 0 ? recommendedJobsFeed : allJobs.slice(0, 4);

  const tabs = [
    { key: 'overview', label: 'Overview Dashboard', icon: <Icon.Home /> },
    { key: 'applications', label: 'My Application & CV', icon: <Icon.Document /> },
    { key: 'ai_features', label: 'AI Power Features', icon: <Icon.Cpu /> },
    { key: 'profile', label: 'Profile Configurations', icon: <Icon.User /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] antialiased">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #jobmart-printable-cv, #jobmart-printable-cv * { visibility: visible; }
          #jobmart-printable-cv { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>

      <div className="max-w-screen-xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
        <div className={`md:col-span-1 ${cardCls} p-4 space-y-1 h-fit shadow-sm`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${
                activeTab === tab.key ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {/* ─────────── OVERVIEW ─────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {candidateLoadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3 rounded-xl">
                  {candidateLoadError}
                </div>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${cardCls} p-4`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Applied</span>
                  <h3 className="text-2xl font-black font-mono text-indigo-600 mt-1">{loadingCandidate ? '—' : stats.applied}</h3>
                </div>
                <div className={`${cardCls} p-4`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Under Review</span>
                  <h3 className="text-2xl font-black font-mono text-amber-600 mt-1">{loadingCandidate ? '—' : stats.reviewing}</h3>
                </div>
                <div className={`${cardCls} p-4`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shortlisted / Calls</span>
                  <h3 className="text-2xl font-black font-mono text-emerald-600 mt-1">{loadingCandidate ? '—' : stats.shortListed}</h3>
                </div>
                <div className={`${cardCls} p-4`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rejected Vacancies</span>
                  <h3 className="text-2xl font-black font-mono text-red-600 mt-1">{loadingCandidate ? '—' : stats.rejected}</h3>
                </div>
              </div>

              <div className={`${cardCls} p-5 space-y-4`}>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wide">Target Industry Recommendations</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Vacancies matched to your preference: <span className="text-[#4A7C59] font-bold">{cvForm.preferredField}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {overviewJobs.length === 0 && <p className="text-xs text-gray-400 col-span-2">No vacancies available right now.</p>}
                  {overviewJobs.map((job) => (
                    <div key={job.id} className="border border-gray-100 bg-[#FAFAF9] p-4 rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{job.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{job.company} · <span className="text-gray-400">{job.location}</span></p>
                      </div>
                      <button
                        onClick={() => alert('Application submitted successfully.')}
                        className="w-full py-1.5 text-[10px] text-white bg-[#0F172A] rounded-lg font-bold hover:bg-[#1E293B] transition"
                      >
                        Apply Instantly
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────── APPLICATION & CV BUILDER ─────────── */}
          {activeTab === 'applications' && (
            <div className={`${cardCls} p-6 space-y-6`}>
              <div>
                <h2 className="text-base font-black">Application & CV Builder</h2>
                <p className="text-xs text-gray-400 mt-0.5">Build a customized CV, or upload an existing resume file.</p>
              </div>

              <div className="space-y-4 border-b border-gray-100 pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Preferred Industry Field</label>
                    <select
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                      value={cvForm.preferredField}
                      onChange={(e) => setCvForm({ ...cvForm, preferredField: e.target.value })}
                    >
                      {GENERIC_INDUSTRIES.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Contact Number</label>
                    <input
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                      value={cvForm.contact}
                      onChange={(e) => setCvForm({ ...cvForm, contact: e.target.value })}
                      placeholder="e.g. +94 77 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Professional Summary</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl resize-none outline-none focus:border-[#4A7C59]"
                    value={cvForm.summary}
                    onChange={(e) => setCvForm({ ...cvForm, summary: e.target.value })}
                    placeholder="Summarize your professional background and strengths..."
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">Work Experience</label>
                    <button onClick={addExperienceField} className="flex items-center gap-1 text-[10px] bg-[#4A7C59]/10 text-[#4A7C59] px-2 py-0.5 rounded font-bold hover:bg-[#4A7C59]/20 transition">
                      <Icon.Plus /> Add Work Record
                    </button>
                  </div>
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                        value={exp}
                        onChange={(e) => updateExperienceValue(idx, e.target.value)}
                        placeholder={`e.g. Senior Manager, Operations — 2 years (${idx + 1})`}
                      />
                      {experiences.length > 1 && (
                        <button onClick={() => removeExperienceField(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><Icon.Trash /></button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">Education</label>
                    <button onClick={addEducationField} className="flex items-center gap-1 text-[10px] bg-[#4A7C59]/10 text-[#4A7C59] px-2 py-0.5 rounded font-bold hover:bg-[#4A7C59]/20 transition">
                      <Icon.Plus /> Add Academy Record
                    </button>
                  </div>
                  {educations.map((edu, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                        value={edu}
                        onChange={(e) => updateEducationValue(idx, e.target.value)}
                        placeholder={`e.g. BSc in Software Engineering — University Name (${idx + 1})`}
                      />
                      {educations.length > 1 && (
                        <button onClick={() => removeEducationField(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><Icon.Trash /></button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Professional Competencies — scoped to selected industry + searchable */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">
                      Professional Competencies <span className="text-[#4A7C59]">· {cvForm.preferredField}</span>
                    </label>
                    <span className="text-[10px] text-gray-400">{cvSkills.length} selected</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
                    <input
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                      placeholder="Search skills (e.g. budgeting, react, negotiation)..."
                      value={cvSkillSearch}
                      onChange={(e) => setCvSkillSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 border border-gray-100 bg-gray-50/50 rounded-xl max-h-40 overflow-y-auto">
                    {cvVisibleSkills.length === 0 && <span className="text-[10px] text-gray-400 px-1 py-1">No skills match your search.</span>}
                    {cvVisibleSkills.map((s) => (
                      <button key={s} onClick={() => toggleCvSkillSelection(s)} className={chipCls(cvSkills.includes(s))}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <button onClick={triggerCvPrintCompilation} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#4A7C59] rounded-xl shadow-sm hover:bg-[#3E6A4A] transition">
                  <Icon.Download /> Compile & Generate CV
                </button>
                <form onSubmit={handleResumeBinaryUpload} className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-gray-100 file:text-gray-700 cursor-pointer"
                  />
                  <button type="submit" disabled={uploading} className="px-3 py-1.5 text-[10px] font-bold text-white bg-slate-900 rounded-lg disabled:bg-gray-400 flex items-center gap-1.5">
                    {uploading && <Icon.Spinner />} Upload Resume
                  </button>
                </form>
              </div>
              {uploadStatus && <p className="text-[10px] font-mono text-[#4A7C59]">{uploadStatus}</p>}
            </div>
          )}

          {/* ─────────── AI POWER FEATURES ─────────── */}
          {activeTab === 'ai_features' && (
            <div className={`${cardCls} p-6 space-y-5`}>
              <div>
                <h2 className="text-base font-black">AI Career Asset Generator</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pick an existing job posting to auto-scope the skill list, or type a custom target role.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Match Against a Job Posting (optional)</label>
                  <select
                    className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                    value={aiSelectedJobId}
                    onChange={(e) => handleSelectJobForAi(e.target.value)}
                  >
                    <option value="">— No specific job, show all skills —</option>
                    {allJobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title} {job.company ? `· ${job.company}` : ''}</option>
                    ))}
                  </select>
                  {aiSelectedJob && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      Showing skills relevant to <span className="text-[#4A7C59] font-bold">{aiJobCategory || 'this role'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Target Job Title</label>
                  <input
                    className="w-full px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                    placeholder="e.g. Logistics Director, Finance Lead, HR Manager"
                    value={aiJobTitle}
                    onChange={(e) => setAiJobTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">Core Skills</label>
                    <span className="text-[10px] text-gray-400">{aiSelectedSkills.length} selected</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
                    <input
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59]"
                      placeholder="Search skills..."
                      value={aiSkillSearch}
                      onChange={(e) => setAiSkillSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl max-h-40 overflow-y-auto">
                    {aiVisibleSkills.length === 0 && <span className="text-[10px] text-gray-400 px-1 py-1">No skills match your search.</span>}
                    {aiVisibleSkills.map((s) => (
                      <button key={s} onClick={() => toggleAiSkillSelection(s)} className={chipCls(aiSelectedSkills.includes(s))}>{s}</button>
                    ))}
                  </div>
                </div>

                <button onClick={handleAiAssetCompilation} disabled={aiLoading} className="px-4 py-2 text-xs font-bold text-white bg-slate-950 rounded-xl disabled:bg-gray-400 flex items-center gap-1.5">
                  {aiLoading && <Icon.Spinner />} {aiLoading ? 'Generating...' : 'Generate Career Assets'}
                </button>
                {aiError && <p className="text-[10px] font-bold text-red-600">{aiError}</p>}
              </div>

              {aiResult && (
                <div className="font-mono text-[11px] p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3">
                  <div>
                    <span className="text-[#A5B4FC] font-bold block border-b border-slate-700 pb-0.5">SUGGESTED RESUME HEADLINE</span>
                    <p className="text-emerald-400 mt-1">{aiResult.suggestedResumeHeadline}</p>
                  </div>
                  <div>
                    <span className="text-[#A5B4FC] font-bold block border-b border-slate-700 pb-0.5">COVER LETTER</span>
                    <p className="text-slate-300 mt-1 whitespace-pre-line text-[10px] leading-relaxed">{aiResult.coverLetter}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────── PROFILE CONFIGURATIONS ─────────── */}
          {activeTab === 'profile' && (
            <div className={`${cardCls} p-6 space-y-6`}>
              <div>
                <h2 className="text-base font-black">Account Settings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Update your name or password. Your email is fixed for account security.</p>
              </div>

              {candidateLoadError ? (
                <p className="text-xs font-bold text-red-600">{candidateLoadError}</p>
              ) : (
                <form onSubmit={saveProfileDataChanges} className="space-y-4 max-w-md">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">First Name</label>
                      <input className={inputCls} value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Last Name</label>
                      <input className={inputCls} value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Email (read-only)</label>
                    <input className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed" value={candidateData.email} readOnly />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">New Password (optional)</label>
                    <input type="password" className={inputCls} placeholder="Leave blank to keep current password" value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} />
                  </div>
                  <button type="submit" disabled={profileSaving} className="px-4 py-2.5 text-xs font-bold text-white bg-[#4A7C59] rounded-xl hover:bg-[#3E6A4A] transition disabled:bg-gray-400 flex items-center gap-1.5">
                    {profileSaving && <Icon.Spinner />} Save Changes
                  </button>
                  {profileMessage && <p className="text-[10px] font-bold text-[#4A7C59]">{profileMessage}</p>}
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {generatedCvView && (
        <div id="jobmart-printable-cv" className="p-16 text-[#0F172A] font-serif space-y-6 bg-white">
          <div className="border-b-4 border-[#0F172A] pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight">{candidateData.firstName} {candidateData.lastName}</h1>
              <p className="text-xs font-mono mt-1 text-gray-600">{candidateData.email} · {cvForm.contact || 'N/A'}</p>
            </div>
            <p className="text-xs font-bold text-[#4A7C59] tracking-wider uppercase">{cvForm.preferredField}</p>
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-slate-400">Professional Summary</h3>
              <p className="text-xs mt-2 leading-relaxed text-gray-800 whitespace-pre-line">{cvForm.summary}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-slate-400">Work Experience</h3>
              <ul className="list-disc pl-4 text-xs mt-2 space-y-1 text-gray-800">
                {experiences.filter(Boolean).map((exp, i) => <li key={i}>{exp}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-slate-400">Education</h3>
              <ul className="list-disc pl-4 text-xs mt-2 space-y-1 text-gray-800">
                {educations.filter(Boolean).map((edu, i) => <li key={i}>{edu}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-slate-400">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {cvSkills.map((s) => <span key={s} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gray-700">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;