import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5183/api';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Doc: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Cpu: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path strokeLinecap="round" d="M9 9h6v6H9z" /><path strokeLinecap="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" /></svg>,
  Plus: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Upload: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Search: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Image: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Sparkle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5L5 3zM19 1l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" /></svg>,
};

// ─── 100+ Skills Dataset ──────────────────────────────────────────────────────
const ALL_SKILLS = [
  // Frontend
  "React.js", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3",
  "Tailwind CSS", "Bootstrap", "SASS/SCSS", "Styled Components", "Redux", "Zustand", "React Query", "GraphQL (Client)", "Webpack", "Vite",
  // Backend
  "Node.js", "Express.js", "ASP.NET Core", "Java Spring Boot", "Laravel", "Django", "FastAPI", "Flask", "Ruby on Rails", "NestJS",
  "Go (Golang)", "Rust", "PHP", "Python", "Java", "C#", "Kotlin", "GraphQL (Server)", "gRPC", "WebSockets",
  // Database
  "PostgreSQL", "MySQL", "SQL Server", "MongoDB", "Redis", "Elasticsearch", "Firebase", "SQLite", "Oracle DB", "DynamoDB",
  "Cassandra", "Supabase", "PlanetScale", "Prisma ORM", "Entity Framework", "Sequelize", "Mongoose",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud (GCP)", "CI/CD Pipelines", "GitHub Actions", "Jenkins", "Terraform", "Ansible",
  "Linux/Bash", "Nginx", "Apache", "Cloudflare", "Vercel", "Railway", "Heroku",
  // Mobile
  "Flutter", "React Native", "Android (Kotlin)", "iOS (Swift)", "Expo",
  // AI/ML
  "TensorFlow", "PyTorch", "Scikit-learn", "Hugging Face", "LangChain", "OpenAI API", "Pandas", "NumPy", "Jupyter",
  // Design & Tools
  "Figma", "Adobe XD", "Sketch", "Photoshop", "UI/UX Design Principles", "Responsive Design", "Accessibility (WCAG)", "Design Systems",
  // Other
  "REST API Design", "Microservices", "Event-Driven Architecture", "System Design", "Git & GitHub", "Agile/Scrum", "Unit Testing", "Jest", "Cypress", "Playwright",
  "SEO", "Web Performance", "WebAssembly", "Blockchain Basics", "Solidity", "Three.js", "D3.js",
  // Non-IT (cross-domain jobs)
  "Digital Marketing", "Content Strategy", "Copywriting", "Social Media Management", "SEO/SEM", "Google Analytics",
  "Project Management", "Product Management", "Business Analysis", "Data Analysis", "Excel / Google Sheets", "Power BI", "Tableau",
  "Accounting (IFRS)", "Financial Modeling", "Sales & CRM", "Customer Success", "Technical Writing",
];

// ─── 25+ Job Listings ─────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { id: 1, title: "Senior React Developer", company: "TechCorp Lanka", location: "Colombo 03", type: "Full-time", salary: "LKR 250k–350k", tags: ["React.js", "TypeScript", "AWS"], field: "Frontend" },
  { id: 2, title: "UI/UX Designer", company: "DigitalNest", location: "Remote", type: "Contract", salary: "LKR 180k–240k", tags: ["Figma", "Design Systems", "Accessibility (WCAG)"], field: "Design" },
  { id: 3, title: "Full Stack Engineer", company: "Finwave Labs", location: "Colombo 07", type: "Full-time", salary: "LKR 300k–420k", tags: ["Next.js", "Node.js", "PostgreSQL"], field: "Full Stack" },
  { id: 4, title: "DevOps Engineer", company: "CloudBase LK", location: "Kandy", type: "Full-time", salary: "LKR 280k–380k", tags: ["Docker", "Kubernetes", "AWS"], field: "DevOps" },
  { id: 5, title: "Flutter Mobile Developer", company: "AppNest", location: "Remote", type: "Full-time", salary: "LKR 200k–280k", tags: ["Flutter", "Dart", "Firebase"], field: "Mobile" },
  { id: 6, title: "Data Scientist", company: "Insight Analytics", location: "Colombo 02", type: "Full-time", salary: "LKR 260k–360k", tags: ["Python", "TensorFlow", "Pandas"], field: "Data" },
  { id: 7, title: "Backend Engineer (.NET)", company: "EnterprisePro", location: "Colombo 05", type: "Full-time", salary: "LKR 240k–320k", tags: ["ASP.NET Core", "SQL Server", "Azure"], field: "Backend" },
  { id: 8, title: "Angular Developer", company: "WebMatrix", location: "Gampaha", type: "Full-time", salary: "LKR 170k–230k", tags: ["Angular", "TypeScript", "REST API Design"], field: "Frontend" },
  { id: 9, title: "Cloud Architect", company: "NimbusTech", location: "Remote", type: "Contract", salary: "USD 3k–5k/mo", tags: ["AWS", "Azure", "Terraform"], field: "Cloud" },
  { id: 10, title: "Laravel Backend Developer", company: "CodeLab SL", location: "Colombo 10", type: "Full-time", salary: "LKR 160k–220k", tags: ["Laravel", "MySQL", "REST API Design"], field: "Backend" },
  { id: 11, title: "Product Manager – SaaS", company: "Momentum HQ", location: "Colombo 03", type: "Full-time", salary: "LKR 350k–500k", tags: ["Product Management", "Agile/Scrum", "Figma"], field: "Product" },
  { id: 12, title: "Machine Learning Engineer", company: "AI Foundry LK", location: "Remote", type: "Full-time", salary: "LKR 400k–600k", tags: ["PyTorch", "Python", "LangChain"], field: "AI/ML" },
  { id: 13, title: "iOS Developer", company: "SwiftApps", location: "Colombo 06", type: "Full-time", salary: "LKR 220k–300k", tags: ["iOS (Swift)", "Xcode", "Firebase"], field: "Mobile" },
  { id: 14, title: "QA Automation Engineer", company: "QualityFirst", location: "Negombo", type: "Full-time", salary: "LKR 150k–210k", tags: ["Cypress", "Playwright", "Jest"], field: "QA" },
  { id: 15, title: "Blockchain Developer", company: "LedgerSL", location: "Remote", type: "Contract", salary: "USD 4k–7k/mo", tags: ["Solidity", "Blockchain Basics", "Web3.js"], field: "Blockchain" },
  { id: 16, title: "React Native Developer", company: "CrossApps LK", location: "Colombo 04", type: "Full-time", salary: "LKR 200k–270k", tags: ["React Native", "TypeScript", "Redux"], field: "Mobile" },
  { id: 17, title: "Senior Java Engineer", company: "BankTech LK", location: "Colombo 01", type: "Full-time", salary: "LKR 280k–400k", tags: ["Java Spring Boot", "PostgreSQL", "Microservices"], field: "Backend" },
  { id: 18, title: "Data Analyst", company: "PivotBI", location: "Remote", type: "Part-time", salary: "LKR 120k–170k", tags: ["Power BI", "Excel / Google Sheets", "Python"], field: "Data" },
  { id: 19, title: "Technical Content Writer", company: "DocsFirst", location: "Remote", type: "Freelance", salary: "LKR 80k–140k", tags: ["Technical Writing", "SEO", "Markdown"], field: "Content" },
  { id: 20, title: "Go Backend Engineer", company: "Velocify", location: "Colombo 07", type: "Full-time", salary: "LKR 320k–450k", tags: ["Go (Golang)", "gRPC", "Docker"], field: "Backend" },
  { id: 21, title: "Vue.js Frontend Developer", company: "UIcraft", location: "Galle", type: "Full-time", salary: "LKR 160k–220k", tags: ["Vue.js", "Nuxt.js", "Tailwind CSS"], field: "Frontend" },
  { id: 22, title: "Business Analyst", company: "ConsolidateIT", location: "Colombo 02", type: "Full-time", salary: "LKR 180k–250k", tags: ["Business Analysis", "Excel / Google Sheets", "Agile/Scrum"], field: "Business" },
  { id: 23, title: "Cybersecurity Analyst", company: "SecureLayer", location: "Colombo 03", type: "Full-time", salary: "LKR 260k–360k", tags: ["Linux/Bash", "Networking", "Ethical Hacking"], field: "Security" },
  { id: 24, title: "Graphic / Motion Designer", company: "StudioNine", location: "Remote", type: "Contract", salary: "LKR 130k–200k", tags: ["Photoshop", "Adobe XD", "Figma"], field: "Design" },
  { id: 25, title: "Systems Architect", company: "EnterprisePro", location: "Colombo 05", type: "Full-time", salary: "LKR 500k–700k", tags: ["System Design", "Microservices", "AWS"], field: "Architecture" },
];

// ─── Application Mock Data ─────────────────────────────────────────────────────
const MOCK_APPLICATIONS = [
  { id: 1, title: "Senior React Developer", company: "TechCorp Lanka", status: "Shortlisted", date: "2024-06-01", color: "emerald" },
  { id: 2, title: "Full Stack Engineer", company: "Finwave Labs", status: "Under Review", date: "2024-05-28", color: "amber" },
  { id: 3, title: "UI/UX Designer", company: "DigitalNest", status: "Under Review", date: "2024-05-22", color: "amber" },
  { id: 4, title: "Flutter Mobile Developer", company: "AppNest", status: "Rejected", date: "2024-05-15", color: "red" },
  { id: 5, title: "Vue.js Frontend Developer", company: "UIcraft", status: "Applied", date: "2024-06-07", color: "blue" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] bg-[#F8FAFC] outline-none focus:border-[#6C3FF4] focus:bg-white transition placeholder:text-gray-300";
const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#6B7A8D] mb-1.5";

const STATUS_BADGE = {
  Shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
  Applied: "bg-blue-50 text-blue-700 border-blue-200",
};

const JOB_FIELDS = ["All Fields", "Frontend", "Backend", "Full Stack", "Mobile", "DevOps", "Cloud", "Data", "AI/ML", "Design", "Product", "QA", "Blockchain", "Security", "Content", "Business", "Architecture"];

// ─── Reusable small components ────────────────────────────────────────────────
const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white border border-[#EDE8F5] rounded-2xl p-6 shadow-sm ${className}`}>{children}</div>
);

const SectionHeader = ({ title, sub }) => (
  <div className="mb-5">
    <h2 className="text-base font-black text-[#0F172A]">{title}</h2>
    {sub && <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>}
  </div>
);

// ─── TAB 1: Overview ──────────────────────────────────────────────────────────
const OverviewTab = ({ candidateData }) => {
  const [jobSearch, setJobSearch] = useState('');
  const [fieldFilter, setFieldFilter] = useState('All Fields');

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch = `${j.title} ${j.company}`.toLowerCase().includes(jobSearch.toLowerCase());
    const matchField = fieldFilter === 'All Fields' || j.field === fieldFilter;
    return matchSearch && matchField;
  });

  const stats = [
    { label: 'Total Applied', value: 12, color: 'text-[#6C3FF4]', bg: 'bg-[#F3F0FF]' },
    { label: 'Under Review', value: 6, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Shortlisted', value: 4, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: 2, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border border-white rounded-2xl p-4`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7A8D]">{s.label}</span>
            <h3 className={`text-3xl font-black font-mono mt-1 ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <SectionCard>
        <SectionHeader title="Recent Applications" sub="Your latest job applications and their status" />
        <div className="space-y-2">
          {MOCK_APPLICATIONS.map(a => (
            <div key={a.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#FAFAFF] transition">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{a.title}</p>
                <p className="text-xs text-[#94A3B8]">{a.company} · {a.date}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold ${STATUS_BADGE[a.status]}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Job Listings */}
      <SectionCard>
        <SectionHeader title="Browse Job Listings" sub={`${MOCK_JOBS.length} active positions across all fields`} />
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
            <input value={jobSearch} onChange={e => setJobSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] outline-none focus:border-[#6C3FF4] transition" />
          </div>
          <select value={fieldFilter} onChange={e => setFieldFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] outline-none focus:border-[#6C3FF4] transition">
            {JOB_FIELDS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
          {filtered.map(job => (
            <div key={job.id} className="border border-[#F0EBF8] bg-[#FAFAFF] p-4 rounded-xl flex flex-col gap-2.5 hover:shadow-md transition">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#0F172A] leading-snug">{job.title}</h4>
                  <span className="shrink-0 text-[10px] font-bold text-[#6C3FF4] bg-[#F3F0FF] px-2 py-0.5 rounded-lg">{job.type}</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5">{job.company} · {job.location}</p>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1">{job.salary}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {job.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-[#F3F0FF] text-[#6C3FF4] text-[9px] font-semibold">{t}</span>)}
              </div>
              <button onClick={() => alert(`Applied to "${job.title}"`)} className="mt-auto w-full py-1.5 text-[10px] font-bold text-white bg-[#0F172A] rounded-lg hover:bg-[#1E293B] transition">
                Apply Now
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-8 text-xs text-gray-400 bg-gray-50 border border-dashed rounded-xl">No jobs match your filters.</div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

// ─── TAB 2: Application & CV Builder ─────────────────────────────────────────
const ApplicationsTab = ({ candidateData }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const imageRef = useRef();

  const [experiences, setExperiences] = useState([
    { id: 1, role: '', company: '', from: '', to: '', description: '' }
  ]);
  const [educations, setEducations] = useState([
    { id: 1, degree: '', institution: '', year: '', grade: '' }
  ]);
  const [cvData, setCvData] = useState({
    firstName: candidateData.firstName || '',
    lastName: candidateData.lastName || '',
    email: candidateData.email || '',
    phone: '',
    address: '',
    summary: '',
    uploadedFile: null,
    uploadStatus: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const addExperience = () => setExperiences(p => [...p, { id: Date.now(), role: '', company: '', from: '', to: '', description: '' }]);
  const removeExperience = (id) => setExperiences(p => p.filter(e => e.id !== id));
  const updateExp = (id, field, val) => setExperiences(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const addEducation = () => setEducations(p => [...p, { id: Date.now(), degree: '', institution: '', year: '', grade: '' }]);
  const removeEducation = (id) => setEducations(p => p.filter(e => e.id !== id));
  const updateEdu = (id, field, val) => setEducations(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const handleCvField = (field, val) => setCvData(p => ({ ...p, [field]: val }));

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!cvData.uploadedFile) return alert('Select a file first.');
    const formData = new FormData();
    formData.append('file', cvData.uploadedFile);
    handleCvField('uploadStatus', 'Uploading...');
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/upload-resume/${candidateData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleCvField('uploadStatus', res.data.message || 'Resume uploaded successfully.');
    } catch {
      handleCvField('uploadStatus', 'Upload failed. Please try again.');
    }
  };

  const generateAndPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ─── CV Builder Form ─── */}
      <SectionCard>
        <SectionHeader title="CV Builder" sub="Fill in your details to generate a professional CV" />

        {/* Profile Image + Basic Info */}
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#C4B5FD] bg-[#F8F5FF] flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => imageRef.current.click()}>
              {profileImagePreview
                ? <img src={profileImagePreview} alt="profile" className="w-full h-full object-cover" />
                : <div className="flex flex-col items-center gap-1 text-[#A78BFA]"><Icon.Image /><span className="text-[9px] font-bold">Add Photo</span></div>
              }
            </div>
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <span className="text-[9px] text-gray-400">JPG / PNG / WEBP</span>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className={labelCls}>First Name</label><input className={inputCls} value={cvData.firstName} onChange={e => handleCvField('firstName', e.target.value)} placeholder="John" /></div>
            <div><label className={labelCls}>Last Name</label><input className={inputCls} value={cvData.lastName} onChange={e => handleCvField('lastName', e.target.value)} placeholder="Doe" /></div>
            <div><label className={labelCls}>Email</label><input className={inputCls} type="email" value={cvData.email} onChange={e => handleCvField('email', e.target.value)} placeholder="john@email.com" /></div>
            <div><label className={labelCls}>Phone Number</label><input className={inputCls} value={cvData.phone} onChange={e => handleCvField('phone', e.target.value)} placeholder="+94 77 XXX XXXX" /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={cvData.address} onChange={e => handleCvField('address', e.target.value)} placeholder="No. 12, Main St, Colombo 03" /></div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
          <label className={labelCls}>Professional Summary</label>
          <textarea rows={3} className={`${inputCls} resize-none`} value={cvData.summary} onChange={e => handleCvField('summary', e.target.value)} placeholder="Brief overview of your skills, goals, and value you bring..." />
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className={labelCls}>Work Experience</label>
            <button onClick={addExperience} className="flex items-center gap-1 text-[10px] font-bold text-[#6C3FF4] bg-[#F3F0FF] px-2.5 py-1.5 rounded-lg hover:bg-[#EAE4FF] transition"><Icon.Plus /> Add</button>
          </div>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="p-4 border border-[#F0EBF8] rounded-xl bg-[#FAFAFF] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#6C3FF4] uppercase tracking-widest">Experience {i + 1}</span>
                  {experiences.length > 1 && (
                    <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-600 transition"><Icon.Trash /></button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={labelCls}>Job Title / Role</label><input className={inputCls} value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} placeholder="e.g. Software Engineer" /></div>
                  <div><label className={labelCls}>Company / Organization</label><input className={inputCls} value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="e.g. KreativeLabs" /></div>
                  <div><label className={labelCls}>From</label><input type="month" className={inputCls} value={exp.from} onChange={e => updateExp(exp.id, 'from', e.target.value)} /></div>
                  <div><label className={labelCls}>To</label><input type="month" className={inputCls} value={exp.to} onChange={e => updateExp(exp.id, 'to', e.target.value)} placeholder="Present" /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>Key Responsibilities</label>
                    <textarea rows={2} className={`${inputCls} resize-none`} value={exp.description} onChange={e => updateExp(exp.id, 'description', e.target.value)} placeholder="Describe key achievements and responsibilities..." />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className={labelCls}>Education</label>
            <button onClick={addEducation} className="flex items-center gap-1 text-[10px] font-bold text-[#6C3FF4] bg-[#F3F0FF] px-2.5 py-1.5 rounded-lg hover:bg-[#EAE4FF] transition"><Icon.Plus /> Add</button>
          </div>
          <div className="space-y-4">
            {educations.map((edu, i) => (
              <div key={edu.id} className="p-4 border border-[#F0EBF8] rounded-xl bg-[#FAFAFF]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#6C3FF4] uppercase tracking-widest">Education {i + 1}</span>
                  {educations.length > 1 && (
                    <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600 transition"><Icon.Trash /></button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={labelCls}>Degree / Qualification</label><input className={inputCls} value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} placeholder="e.g. BSc Software Engineering" /></div>
                  <div><label className={labelCls}>Institution</label><input className={inputCls} value={edu.institution} onChange={e => updateEdu(edu.id, 'institution', e.target.value)} placeholder="e.g. University of Moratuwa" /></div>
                  <div><label className={labelCls}>Year of Completion</label><input className={inputCls} value={edu.year} onChange={e => updateEdu(edu.id, 'year', e.target.value)} placeholder="e.g. 2022" /></div>
                  <div><label className={labelCls}>GPA / Grade</label><input className={inputCls} value={edu.grade} onChange={e => updateEdu(edu.id, 'grade', e.target.value)} placeholder="e.g. 3.8 / 4.0" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start border-t border-[#F0EBF8] pt-5">
          <button onClick={generateAndPrint} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#6C3FF4] rounded-xl hover:bg-[#5B2FD4] transition">
            <Icon.Print /> Generate & Print CV
          </button>
          <form onSubmit={handleResumeUpload} className="flex gap-2 items-center flex-wrap">
            <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleCvField('uploadedFile', e.target.files[0])} className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#F3F0FF] file:text-[#6C3FF4] cursor-pointer" />
            <button type="submit" className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#0F172A] rounded-xl hover:bg-[#1E293B] transition"><Icon.Upload /> Upload Resume</button>
          </form>
        </div>
        {cvData.uploadStatus && <p className="text-xs font-semibold text-[#6C3FF4] mt-2">{cvData.uploadStatus}</p>}
      </SectionCard>

      {/* ─── Hidden Print CV ─── */}
      <div className="hidden print:block fixed inset-0 bg-white z-50 p-12 text-[#0F172A] space-y-6">
        <div className="flex items-start gap-6 border-b-4 border-[#6C3FF4] pb-5">
          {profileImagePreview && <img src={profileImagePreview} alt="profile" className="w-28 h-28 rounded-2xl object-cover border-2 border-[#6C3FF4]" />}
          <div>
            <h1 className="text-3xl font-black tracking-tight">{cvData.firstName} {cvData.lastName}</h1>
            <p className="text-sm mt-1 text-gray-600">📧 {cvData.email} &nbsp;|&nbsp; 📞 {cvData.phone || 'N/A'} &nbsp;|&nbsp; 📍 {cvData.address || 'N/A'}</p>
          </div>
        </div>
        {cvData.summary && (
          <div><h3 className="text-base font-black uppercase border-b border-gray-200 pb-1 mb-2">Professional Summary</h3><p className="text-sm leading-relaxed text-gray-700">{cvData.summary}</p></div>
        )}
        {experiences.some(e => e.role) && (
          <div>
            <h3 className="text-base font-black uppercase border-b border-gray-200 pb-1 mb-3">Work Experience</h3>
            {experiences.filter(e => e.role).map(e => (
              <div key={e.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-[#6C3FF4]">{e.role}</p>
                  <span className="text-xs text-gray-500 font-mono">{e.from} — {e.to || 'Present'}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">{e.company}</p>
                {e.description && <p className="text-xs text-gray-600 mt-1">{e.description}</p>}
              </div>
            ))}
          </div>
        )}
        {educations.some(e => e.degree) && (
          <div>
            <h3 className="text-base font-black uppercase border-b border-gray-200 pb-1 mb-3">Education</h3>
            {educations.filter(e => e.degree).map(e => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-[#6C3FF4]">{e.degree}</p>
                  <span className="text-xs text-gray-500 font-mono">{e.year}</span>
                </div>
                <p className="text-sm text-gray-700">{e.institution} {e.grade && `· GPA: ${e.grade}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TAB 3: AI Features ───────────────────────────────────────────────────────
const AIFeaturesTab = ({ candidateData }) => {
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  const DEFAULTS = ALL_SKILLS.slice(0, 20);

  const filteredSkills = skillSearch.trim()
    ? ALL_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()))
    : showAllSkills ? ALL_SKILLS : DEFAULTS;

  const toggleSkill = (s) => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleGenerate = async () => {
    if (!jobTitle || selectedSkills.length === 0) return alert('Enter a target job title and select at least one skill.');
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/generate-candidate-assets`, {
        targetJobTitle: jobTitle,
        selectedSkills
      });
      setAiResult(res.data);
    } catch {
      setAiResult({ suggestedResumeHeadline: 'AI generation failed — check your backend connection.', coverLetter: '' });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionHeader title="AI Career Asset Generator" sub="Generate resume headlines and cover letters tailored to your target role" />

        <div className="space-y-4 max-w-2xl">
          {/* Job Title */}
          <div>
            <label className={labelCls}>Target Job Title</label>
            <input className={inputCls} value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Full Stack Engineer, Product Manager, Data Analyst..." />
          </div>

          {/* Skills Search & Select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls}>Your Skills ({selectedSkills.length} selected)</label>
              {selectedSkills.length > 0 && (
                <button onClick={() => setSelectedSkills([])} className="text-[10px] text-red-400 font-semibold hover:text-red-600">Clear all</button>
              )}
            </div>

            {/* Selected Chips */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 bg-[#F8F5FF] border border-[#E8E0FF] rounded-xl mb-3 max-h-24 overflow-y-auto">
                {selectedSkills.map(s => (
                  <button key={s} onClick={() => toggleSkill(s)} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#6C3FF4] text-white text-[10px] font-bold hover:bg-[#5B2FD4] transition">
                    {s} ✕
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
              <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder={`Search ${ALL_SKILLS.length}+ skills (IT, Design, Business, AI/ML...)`} className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm bg-[#F8FAFC] outline-none focus:border-[#6C3FF4] transition" />
            </div>

            {/* Skill Grid */}
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              {!skillSearch && !showAllSkills && (
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest mb-2">Top 20 — Search or browse all</p>
              )}
              {skillSearch && (
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest mb-2">{filteredSkills.length} results</p>
              )}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {filteredSkills.map(s => {
                  const active = selectedSkills.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSkill(s)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${active ? 'bg-[#6C3FF4] text-white border-[#6C3FF4]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#6C3FF4] hover:text-[#6C3FF4]'}`}>
                      {s}
                    </button>
                  );
                })}
              </div>
              {!skillSearch && (
                <button onClick={() => setShowAllSkills(!showAllSkills)} className="mt-3 text-[10px] text-[#6C3FF4] font-bold hover:underline">
                  {showAllSkills ? `Show less` : `Show all ${ALL_SKILLS.length} skills →`}
                </button>
              )}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={aiLoading} className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-[#0F172A] rounded-xl hover:bg-[#1E293B] disabled:bg-gray-400 transition">
            <Icon.Sparkle />
            {aiLoading ? 'Generating...' : 'Generate Resume Headline & Cover Letter'}
          </button>
        </div>
      </SectionCard>

      {/* AI Result */}
      {aiResult && (
        <SectionCard>
          <SectionHeader title="Generated Assets" sub="AI-crafted output based on your profile" />
          <div className="space-y-4">
            <div className="p-4 bg-[#F3F0FF] border border-[#C4B5FD] rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6C3FF4] mb-1">Resume Headline</p>
              <p className="text-sm font-bold text-[#0F172A]">{aiResult.suggestedResumeHeadline}</p>
            </div>
            {aiResult.coverLetter && (
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7A8D] mb-2">Cover Letter Draft</p>
                <p className="text-xs leading-relaxed text-[#334155] whitespace-pre-line">{aiResult.coverLetter}</p>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

// ─── TAB 4: Profile ───────────────────────────────────────────────────────────
const ProfileTab = ({ candidateData, setCandidateData }) => {
  const [form, setForm] = useState({ firstName: candidateData.firstName, lastName: candidateData.lastName, password: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/Auth/candidates/${candidateData.id}`, { ...candidateData, ...form });
      setCandidateData(p => ({ ...p, firstName: form.firstName, lastName: form.lastName }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save changes. Please try again.');
    }
  };

  return (
    <SectionCard>
      <SectionHeader title="Account Settings" sub="Update your personal information and password" />
      <form onSubmit={handleSave} className="space-y-4 max-w-md">
        <div className="grid grid-cols-2 gap-3">
          <div><label className={labelCls}>First Name</label><input className={inputCls} value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} /></div>
          <div><label className={labelCls}>Last Name</label><input className={inputCls} value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} /></div>
        </div>
        <div>
          <label className={labelCls}>Email (read-only)</label>
          <input className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" value={candidateData.email} readOnly />
        </div>
        <div>
          <label className={labelCls}>New Password</label>
          <input type="password" className={inputCls} placeholder="Leave blank to keep current" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
        </div>
        <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#6C3FF4] rounded-xl hover:bg-[#5B2FD4] transition">
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </form>
    </SectionCard>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', Icon: Icon.Home },
  { id: 'applications', label: 'My Application & CV', Icon: Icon.Doc },
  { id: 'ai_features', label: 'AI Features', Icon: Icon.Sparkle },
  { id: 'profile', label: 'Profile', Icon: Icon.User },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [candidateData, setCandidateData] = useState({ id: 0, firstName: '', lastName: '', email: '', jobTitle: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'Candidate') {
      alert('Unauthorized.');
      navigate('/login');
      return;
    }
    const email = localStorage.getItem('email') || 'candidate@jobmart.lk';
    axios.get(`${API_BASE_URL}/Auth/candidates`)
      .then(res => {
        const found = res.data.find(u => u.email === email) || res.data[0];
        if (found) setCandidateData(found);
      }).catch(() => {
        setCandidateData({ id: 0, firstName: 'Demo', lastName: 'User', email: 'demo@jobmart.lk', jobTitle: 'Candidate' });
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F4F2FA] font-sans text-[#0F172A] print:bg-white">

      {/* Header */}
      <header className="bg-white border-b border-[#EDE8F5] sticky top-0 z-40 print:hidden">
        <div className="max-w-screen-xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6C3FF4] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight">JobMart</span>
              <span className="text-[10px] text-[#94A3B8] font-mono ml-2">{candidateData.firstName} {candidateData.lastName}</span>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-1.5 text-xs font-bold text-red-500 border border-red-100 px-3 py-1.5 rounded-xl hover:bg-red-50 transition">
            <Icon.Logout /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-6 print:hidden">
        {/* Tab navigation — horizontal strip */}
        <div className="flex overflow-x-auto gap-1 bg-white border border-[#EDE8F5] rounded-2xl p-1.5 shadow-sm mb-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${activeTab === t.id ? 'bg-[#6C3FF4] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8F5FF] hover:text-[#6C3FF4]'}`}>
              <t.Icon /> {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab candidateData={candidateData} />}
        {activeTab === 'applications' && <ApplicationsTab candidateData={candidateData} />}
        {activeTab === 'ai_features' && <AIFeaturesTab candidateData={candidateData} />}
        {activeTab === 'profile' && <ProfileTab candidateData={candidateData} setCandidateData={setCandidateData} />}
      </div>
    </div>
  );
};

export default Dashboard;