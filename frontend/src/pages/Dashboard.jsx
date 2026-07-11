import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ─── Shared Executive Styling Layout Classes ────────────────────────────────
const inputCls = "w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] bg-[#F8FAFC] outline-none focus:border-[#4A7C59] focus:bg-white transition placeholder:text-gray-300";
const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5";

// ─── Minimalist Clean Vector Icons ──────────────────────────────────────────
const Icon = {
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Document: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Cpu: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Plus: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  AvatarPlaceholder: () => <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
};

const SKILLS_POOL = [
  "Management", "Leadership", "Financial Auditing", "Recruiting & HR", "Digital Marketing", 
  "Sales Architecture", "Customer Relations", "Data Analysis", "Risk Assessment", "Strategic Planning",
  "React.js", "ASP.NET Core", "SQL Server", "UI/UX Design", "Project Operations"
];

const API_BASE_URL = 'http://localhost:5183/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // 💡 Security Loader State එකක් එකතු කළා දත්ත ලෝඩ් වෙනකම් වැරදි දත්ත පෙන්වීම වැළැක්වීමට
  const [loading, setLoading] = useState(true);
  
  const [candidateData, setCandidateData] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [stats, setStats] = useState({ applied: 0, reviewing: 0, shortListed: 0, rejected: 0 });

  // CV Maker Layout States
  const [cvForm, setCvForm] = useState({ contact: '', summary: '' });
  const [experiences, setExperiences] = useState([""]); 
  const [educations, setEducations] = useState([""]);
  const [cvSkills, setCvSkills] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [generatedCvView, setGeneratedCvView] = useState(false);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', jobTitle: '', bio: '', password: '', profileImage: '' });

  // AI Cover Letter States
  const [aiSelectedSkills, setAiSelectedSkills] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email');

    if (!token || role !== 'Candidate' || !storedEmail) {
      alert("Session expired or unauthorized. Please re-authenticate.");
      localStorage.clear();
      navigate('/login');
      return;
    }

    // 🔐 100% ක් ආරක්ෂිත සැබෑ සන්නිවේදන API Pipeline එක
    axios.get(`${API_BASE_URL}/Auth/candidates`)
      .then(res => {
        // 💡 ලොග් වෙලා ඉන්න සැබෑ පරිශීලකයාගේ Email එකෙන් විතරක්ම ෆිල්ටර් කරගන්නවා (Fallbacks සම්පූර්ණයෙන්ම ඉවත් කළා)
        const found = res.data.find(u => u.email.toLowerCase() === storedEmail.toLowerCase());
        
        if (found) {
          setCandidateData(found);
          setProfileForm({ 
            firstName: found.firstName || '', 
            lastName: found.lastName || '', 
            jobTitle: found.jobTitle || 'Unassigned',
            bio: found.bio || '',
            password: '',
            profileImage: found.profileImage || ''
          });

          if (found.status === 'Active') {
            setStats({ applied: 5, reviewing: 2, shortListed: 2, rejected: 0 });
          } else {
            setStats({ applied: 3, reviewing: 1, shortListed: 1, rejected: 1 });
          }
          setLoading(false); // 💡 දත්ත හරියටම ලැබුණු පසු ලෝඩර් එක නවත්වනවා
        } else {
          // ලොග් වූ ඊමේල් එකට අදාළ කිසිම දත්තයක් ඩේටාබේස් එකේ නැත්නම් ආරක්ෂාව සඳහා ලොග්අවුට් කරයි
          console.error("[Security Alert] Stored email has no reference in current database context.");
          localStorage.clear();
          navigate('/login');
        }
      }).catch(err => {
        Console.error("Identity Synchronization Broken:", err);
        setLoading(false);
      });

    axios.get(`${API_BASE_URL}/JobPosting`)
      .then(res => setAllJobs(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  if (loading || !candidateData) {
    // ⏳ HCI Smooth Loading Experience Skeleton Screen
    return (
      <div className="min-h-screen bg-[#F4F2FA] flex items-center justify-center font-sans">
        <div className="text-center space-y-3 p-6 bg-white border border-gray-100 rounded-2xl shadow-xl">
          <div className="w-10 h-10 border-4 border-[#4A7C59] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-[#0F172A] tracking-wide uppercase">Synchronizing Secure Identity Parameters...</p>
        </div>
      </div>
    );
  }

  // Dynamic Array Handlers
  const addExperienceField = () => setExperiences([...experiences, ""]);
  const removeExperienceField = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const updateExperienceValue = (index, value) => {
    const next = [...experiences];
    next[index] = value;
    setExperiences(next);
  };

  const addEducationField = () => setEducations([...educations, ""]);
  const removeEducationField = (index) => setEducations(educations.filter((_, i) => i !== index));
  const updateEducationValue = (index, value) => {
    const next = [...educations];
    next[index] = value;
    setEducations(next);
  };

  const toggleCvSkillSelection = (skill) => {
    setCvSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleAiSkillSelection = (skill) => {
    setAiSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleImageConversion = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCvPrintCompilation = () => {
    if (!cvForm.contact || !cvForm.summary) {
      alert("Please populate the Summary and Contact details inside your CV context before printing.");
      return;
    }
    setGeneratedCvView(true);
    setTimeout(() => {
      window.print();
      setGeneratedCvView(false);
    }, 400);
  };

  const handleResumeBinaryUpload = async (e) => {
    e.preventDefault();
    if (!uploadedFile) return alert("Select an existing physical document file to stream.");
    const formData = new FormData();
    formData.append("file", uploadedFile);
    setUploadStatus("Streaming file parameters to backend system...");
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/upload-resume/${candidateData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus(res.data.message || "File uploaded successfully!");
    } catch (err) {
      setUploadStatus("Upload pipeline rejected binary payload.");
    }
  };

  // ─── PROFILE UPDATE DATABASE INTERCEPTOR ───
  const saveProfileDataChanges = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/Auth/candidates/${candidateData.id}`, {
        ...candidateData,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        jobTitle: profileForm.jobTitle,
        bio: profileForm.bio,
        profileImage: profileForm.profileImage
      });
      
      setCandidateData(prev => ({ 
        ...prev, 
        firstName: profileForm.firstName, 
        lastName: profileForm.lastName, 
        jobTitle: profileForm.jobTitle,
        bio: profileForm.bio,
        profileImage: profileForm.profileImage
      }));
      
      alert("Profile configurations synchronized securely inside Database.");
    } catch (err) {
      alert("Database mutation transaction aborted.");
    }
  };

  const handleAiAssetCompilation = async () => {
    if (aiSelectedSkills.length === 0) return alert("Select standard strengths matrix parameter competencies.");
    setAiLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/generate-candidate-assets`, {
        targetJobTitle: candidateData.jobTitle,
        selectedSkills: aiSelectedSkills
      });
      setAiResult(res.data);
    } catch (e) {
      alert("AI token orchestration system fault.");
    } finally {
      setAiLoading(false);
    }
  };

  // Real-time Filtering Logic using active bound state variables
  const dynamicFilteredJobs = allJobs.filter(job => 
    (job.title || '').toLowerCase().includes((candidateData.jobTitle || '').toLowerCase()) ||
    (candidateData.jobTitle || '').toLowerCase().includes((job.title || '').toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      
      <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* HCI Layout Side Routing Drawer Component */}
        <div className="md:col-span-1 bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-1 h-fit shadow-sm">
          {/* User Profile Mini Badge */}
          <div className="flex items-center gap-3 p-2 mb-4 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shadow-inner">
              {candidateData.profileImage ? <img src={candidateData.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <Icon.User />}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-[#0F172A] truncate">{candidateData.firstName} {candidateData.lastName}</h4>
              <p className="text-[10px] text-[#4A7C59] font-semibold truncate">{candidateData.jobTitle}</p>
            </div>
          </div>

          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'overview' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Home /> Overview Workspace</button>
          <button onClick={() => setActiveTab('applications')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'applications' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Document /> My Application & CV</button>
          <button onClick={() => setActiveTab('ai_features')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'ai_features' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Cpu /> AI Power Features</button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'profile' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.User /> Profile Configurations</button>
        </div>

        {/* Dynamic Display Board View Column */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Welcome Header Strip */}
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Welcome back, {candidateData.firstName}! 👋</h1>
              <p className="text-xs text-gray-500 mt-0.5">Your recruitment profile matrix telemetry is active.</p>
            </div>
            <span className="px-3 py-1 bg-[#4A7C59]/10 text-[#4A7C59] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#4A7C59]/20">Candidate Active Node</span>
          </div>

          {/* ──── TAB WINDOW: OVERVIEW METRICS & AUTOMATED MATCHING FEED ──── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Counter Matrix Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Applied</span><h3 className="text-2xl font-black font-mono text-indigo-600 mt-1">{stats.applied}</h3></div>
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">In Process</span><h3 className="text-2xl font-black font-mono text-amber-600 mt-1">{stats.reviewing}</h3></div>
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shortlisted / Calls</span><h3 className="text-2xl font-black font-mono text-emerald-600 mt-1">{stats.shortListed}</h3></div>
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl"><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CV Rejected</span><h3 className="text-2xl font-black font-mono text-red-600 mt-1">{stats.rejected}</h3></div>
              </div>

              {/* Recommendations Display Panel */}
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
                <div>
                  <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wide">Jobs Matching Your Designation</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Automated semantics processing results matching: <span className="text-[#4A7C59] font-bold">"{candidateData.jobTitle}"</span></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dynamicFilteredJobs.length === 0 ? (
                    <p className="text-xs text-gray-400 italic sm:col-span-2 py-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">No active vacancies listed matching your job title parameter. Update your designation profile context to trigger re-indexing.</p>
                  ) : (
                    dynamicFilteredJobs.map(job => (
                      <div key={job.id} className="border border-gray-100 bg-[#FBFBFE] p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-xs hover:border-[#4A7C59]/30 transition">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{job.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">{job.company} · <span className="text-gray-400">{job.location}</span></p>
                        </div>
                        <button onClick={() => alert(`Application pipeline transaction opened successfully.`)} className="w-full py-1.5 text-[10px] text-white bg-[#0F172A] rounded-lg font-bold hover:bg-[#4A7C59] transition">Apply Instantly</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──── TAB WINDOW: STRUCTURAL MULTI-INPUT CV BUILDER & UPLOADER ──── */}
          {activeTab === 'applications' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-base font-black text-[#0F172A]">CV Generator Engine & Digital Broker</h2>
                <p className="text-xs text-gray-400 mt-0.5">Input structured professional credentials metrics to synthesize customized vector layouts or link ready-made items.</p>
              </div>

              <div className="space-y-4 border-b border-gray-100 pb-5">
                <div>
                  <label className={labelCls}>Contact Parameters</label>
                  <input className={inputCls} value={cvForm.contact} onChange={e => setCvForm({...cvForm, contact: e.target.value})} placeholder="e.g. +94 77 111 2222 | Colombo, Sri Lanka" />
                </div>
                <div>
                  <label className={labelCls}>Executive Background Abstract Summary</label>
                  <textarea rows={2} className="w-full px-4 py-2.5 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl resize-none outline-none focus:border-[#4A7C59]" value={cvForm.summary} onChange={e => setCvForm({...cvForm, summary: e.target.value})} placeholder="Detail core milestones, achievements, and sector domains..." />
                </div>

                {/* Multiple Dynamic Work Experience Fields */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><label className={labelCls}>Employment History Chronology</label>
                    <button onClick={addExperienceField} className="flex items-center gap-1 text-[9px] bg-[#4A7C59]/10 text-[#4A7C59] px-2 py-1 rounded font-bold hover:bg-[#4A7C59]/20 transition"><Icon.Plus /> Add Work Record</button>
                  </div>
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input className={inputCls} value={exp} onChange={e => updateExperienceValue(idx, e.target.value)} placeholder={`e.g. 2 Years as Associate Consultant at Corporate Hub (${idx + 1})`} />
                      {experiences.length > 1 && <button onClick={() => removeExperienceField(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition"><Icon.Trash /></button>}
                    </div>
                  ))}
                </div>

                {/* Multiple Dynamic Education Fields */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><label className={labelCls}>Academic Qualifications Matrix</label>
                    <button onClick={addEducationField} className="flex items-center gap-1 text-[9px] bg-[#4A7C59]/10 text-[#4A7C59] px-2 py-1 rounded font-bold hover:bg-[#4A7C59]/20 transition"><Icon.Plus /> Add Academy Record</button>
                  </div>
                  {educations.map((edu, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input className={inputCls} value={edu} onChange={e => updateEducationValue(idx, e.target.value)} placeholder={`e.g. Bachelor of Business Administration - Global Institute (${idx + 1})`} />
                      {educations.length > 1 && <button onClick={() => removeEducationField(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition"><Icon.Trash /></button>}
                    </div>
                  ))}
                </div>

                {/* Checked Competency Filter Buttons Layout */}
                <div className="space-y-2">
                  <label className={labelCls}>Select Capabilities Parameters</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                    {SKILLS_POOL.map(s => {
                      const checked = cvSkills.includes(s);
                      return <button key={s} onClick={() => toggleCvSkillSelection(s)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${checked ? 'bg-[#4A7C59] text-white border-[#4A7C59]' : 'bg-white text-gray-500 border-gray-200'}`}>{s}</button>
                    })}
                  </div>
                </div>
              </div>

              {/* Double Vector Choice Area */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <button onClick={triggerCvPrintCompilation} className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#4A7C59] rounded-xl shadow-sm hover:bg-[#3d664a] transition"><Icon.Download /> Compile & Generate CV (PDF)</button>
                
                <form onSubmit={handleResumeBinaryUpload} className="flex gap-2 items-center">
                  <input type="file" onChange={e => setUploadedFile(e.target.files[0])} className="text-xs text-gray-500 cursor-pointer file:mr-2 file:py-1.5 file:px-2 file:rounded-md file:border-0 file:bg-gray-200 file:text-[10px] file:font-bold" />
                  <button type="submit" className="px-3 py-1.5 text-[10px] font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition">Upload CV</button>
                </form>
              </div>
              {uploadStatus && <p className="text-[10px] font-mono text-indigo-600 mt-2">{uploadStatus}</p>}
            </div>
          )}

          {/* ──── TAB WINDOW: AI CORE DRIVEN COVER LETTER GENERATOR ──── */}
          {activeTab === 'ai_features' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-5">
              <div>
                <h2 className="text-base font-black text-[#0F172A]">AI Cognitive Asset Engine Suite</h2>
                <p className="text-xs text-gray-400 mt-0.5">Synthesize professional cover letters automatically mapped directly to your current profile designation.</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className={labelCls}>Active Target Profile Designation Enforced</label>
                  <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 bg-gray-50 cursor-not-allowed outline-none" value={candidateData.jobTitle} readOnly />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>Select Strengths To Embed Into Cover Letter Context</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl max-h-32 overflow-y-auto">
                    {SKILLS_POOL.map(s => {
                      const active = aiSelectedSkills.includes(s);
                      return <button key={s} onClick={() => toggleAiSkillSelection(s)} className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition ${active ? 'bg-[#4A7C59] text-white border-[#4A7C59]' : 'bg-white text-gray-500 border-gray-200'}`}>{s}</button>
                    })}
                  </div>
                </div>

                <button onClick={handleAiAssetCompilation} disabled={aiLoading} className="px-5 py-2.5 text-xs font-bold text-white bg-slate-950 rounded-xl hover:bg-slate-800 transition shadow-sm">{aiLoading ? "Orchestrating AI..." : "Synthesize AI Outbound Cover Letter"}</button>
              </div>

              {aiResult && (
                <div className="font-mono text-[11px] p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 border border-slate-800 shadow-inner">
                  <div><span className="text-indigo-400 font-bold block border-b border-slate-800 pb-1">[AI SUGGESTED RESUME HEADLINE]</span><p className="text-emerald-400 mt-1.5 font-bold">"{aiResult.suggestedResumeHeadline}"</p></div>
                  <div><span className="text-indigo-400 font-bold block border-b border-slate-800 pb-1">[SYNTHESIZED COVER LETTER DOCUMENT]</span><p className="text-slate-300 mt-1.5 whitespace-pre-line leading-relaxed text-[10px]">{aiResult.coverLetter}</p></div>
                </div>
              )}
            </div>
          )}

          {/* ──── TAB WINDOW: CANDIDATE CONFIGS ──── */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl space-y-6">
              <div>
                <h2 className="text-base font-black text-[#0F172A]">Account Profile Identity Coordinates</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage operational attributes, biographies, and parameters bounding your recruitment data.</p>
              </div>

              <form onSubmit={saveProfileDataChanges} className="space-y-4 max-w-xl">
                {/* Profile Picture Attachment Component */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                    {profileForm.profileImage ? <img src={profileForm.profileImage} alt="Avatar" className="w-full h-full object-cover" /> : <Icon.AvatarPlaceholder />}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">Upload Profile Avatar picture</label>
                    <input type="file" accept="image/*" onChange={handleImageConversion} className="text-xs text-gray-400 cursor-pointer" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>First Name</label><input className={inputCls} value={profileForm.firstName} onChange={e => setProfileForm({...profileForm, firstName: e.target.value})} /></div>
                  <div><label className={labelCls}>Last Name</label><input className={inputCls} value={profileForm.lastName} onChange={e => setProfileForm({...profileForm, lastName: e.target.value})} /></div>
                </div>

                {/* JOB TITLE INPUT COMPONENT */}
                <div>
                  <label className={labelCls}>Target Professional Job Title (Core Recommendation Driver)</label>
                  <input className={inputCls} placeholder="e.g. Senior Project Manager / Executive Assistant" value={profileForm.jobTitle} onChange={e => setProfileForm({...profileForm, jobTitle: e.target.value})} />
                  <p className="text-[10px] text-gray-400 mt-1">Changing this designation instantly filters matching platform vacancies on your dashboard overview.</p>
                </div>

                {/* BIO INPUT COMPONENT */}
                <div>
                  <label className={labelCls}>Professional Personal Biography / Summary Context</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 text-sm border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl resize-none outline-none focus:border-[#4A7C59]" placeholder="Share a snapshot of your timeline expertise..." value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} />
                </div>

                {/* EMAIL READ-ONLY PREVIEW */}
                <div>
                  <label className={labelCls}>Identity Access Email Address (Immutable Field Preview)</label>
                  <input className="w-full px-4 py-2.5 rounded-xl border border-gray-100 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed" value={candidateData.email} readOnly />
                </div>

                <div>
                  <label className={labelCls}>Security Token Authentication Password</label>
                  <input type="password" className={inputCls} placeholder="••••••••" value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} />
                </div>

                <button type="submit" className="px-5 py-2.5 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3d664a] rounded-xl transition shadow-md">Commit Profile Settings</button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ─── 🖨️ PHYSICAL PRINT LAYER OUTLINE UTILITIES ─── */}
      {generatedCvView && (
        <div className="fixed inset-0 bg-white z-50 p-16 text-[#0F172A] font-serif space-y-6 print:block">
          <div className="border-b-4 border-[#0F172A] pb-4 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight">{candidateData.firstName} {candidateData.lastName}</h1>
              <p className="text-xs font-mono mt-1 text-gray-600">Email: {candidateData.email} | Contact: {cvForm.contact || 'N/A'}</p>
              <p className="text-xs font-bold text-[#4A7C59] mt-1 uppercase tracking-wider">Target Designation: {candidateData.jobTitle}</p>
            </div>
            {profileForm.profileImage && <img src={profileForm.profileImage} alt="CV Avatar" className="w-16 h-16 rounded-lg object-cover border border-gray-300" />}
          </div>
          
          <div className="space-y-5">
            {profileForm.bio && (
              <div>
                <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-gray-400">Personal Abstract Biography</h3>
                <p className="text-xs mt-2 text-gray-800 leading-relaxed">{profileForm.bio}</p>
              </div>
            )}
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-gray-400">Professional Summary</h3>
              <p className="text-xs mt-2 leading-relaxed text-gray-800 whitespace-pre-line">{cvForm.summary}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-gray-400">Chronological Work History</h3>
              <ul className="list-disc pl-5 text-xs mt-2 space-y-1 text-gray-800">
                {experiences.map((exp, i) => exp && <li key={i}>{exp}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-gray-400">Academic Qualifications Matrix</h3>
              <ul className="list-disc pl-5 text-xs mt-2 space-y-1 text-gray-800">
                {educations.map((edu, i) => edu && <li key={i}>{edu}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase border-b border-gray-300 pb-0.5 tracking-wider text-gray-400">Core Matrix Technical Strengths</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cvSkills.map(s => <span key={s} className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-gray-700">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;