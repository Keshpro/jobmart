import React, { useState, useEffect } from 'react';
import axios from 'axios';

const inputCls = "w-full px-3 py-2.5 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] focus:bg-white transition text-[#0F172A]";
const cardCls = "bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm space-y-3";
const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5";

const Icon = {
  Chart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  FileText: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Sparkles: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
};

const API_BASE_URL = 'http://localhost:5183/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [candidateData, setCandidateData] = useState({
    id: '', firstName: '', lastName: '', email: '', jobTitle: '', bio: '', isCvUploaded: false
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const [atsAnalytics, setAtsAnalytics] = useState({
    profileCompletion: 0,
    atsScore: 0,
    interviewProbability: '0%',
    missingKeywords: [],
    suggestedImprovements: []
  });
  const [loadingAts, setLoadingAts] = useState(true);

  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiSearchLogs, setAiSearchLogs] = useState('');
  const [searchingNlp, setSearchingNlp] = useState(false);

  const [aiInputs, setAiInputs] = useState({ targetTitle: '', skills: '' });
  const [aiResult, setAiResult] = useState({ headline: '', coverLetter: '' });
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1'; 
    
    axios.get(`${API_BASE_URL}/Auth/candidates`)
      .then(res => {
        const current = res.data.find(u => u.id == userId);
        if (current) {
          setCandidateData({
            id: current.id, firstName: current.firstName, lastName: current.lastName,
            email: current.email, jobTitle: current.jobTitle || '', bio: current.bio || '',
            isCvUploaded: current.isCvUploaded || false
          });
          setAiInputs({ targetTitle: current.jobTitle || '', skills: '' });
          loadLiveAtsAnalytics(current.id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const loadLiveAtsAnalytics = (id) => {
    setLoadingAts(true);
    axios.get(`${API_BASE_URL}/AiIntegration/ats-analytics/${id}`)
      .then(res => {
        setAtsAnalytics({
          profileCompletion: res.data.profileCompletion || 75,
          atsScore: res.data.atsScore || 70,
          interviewProbability: res.data.interviewProbability || '50%',
          missingKeywords: res.data.missingKeywords || [],
          suggestedImprovements: res.data.suggestedImprovements || []
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingAts(false));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/Auth/candidates/${candidateData.id}`, candidateData);
      alert("Profile data configurations persisted successfully.");
      loadLiveAtsAnalytics(candidateData.id);
    } catch (err) {
      alert("Database mutation transaction aborted.");
    }
  };

  const handleResumeBinaryUpload = async (e) => {
    e.preventDefault();
    if (!uploadedFile) return alert("Select a valid physical file mapping context.");
    
    const formData = new FormData();
    formData.append("file", uploadedFile);
    setUploadStatus("Synchronizing file directly to server repository...");

    try {
      await axios.post(`${API_BASE_URL}/AiIntegration/upload-resume/${candidateData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus("CV synchronized successfully!");
      setCandidateData(prev => ({ ...prev, isCvUploaded: true }));
      loadLiveAtsAnalytics(candidateData.id);
    } catch (err) {
      setUploadStatus("Upload pipeline execution fault context.");
    }
  };

  const triggerAiAssetGeneration = async (e) => {
    e.preventDefault();
    if (!aiInputs.targetTitle || !aiInputs.skills) return alert("Define primary skill tokens and job vectors.");
    
    setGeneratingAi(true);
    try {
      const skillsArray = aiInputs.skills.split(',').map(s => s.trim());
      const response = await axios.post(`${API_BASE_URL}/AiIntegration/generate-candidate-assets`, {
        targetJobTitle: aiInputs.targetTitle,
        selectedSkills: skillsArray
      });
      setAiResult({
        headline: response.data.suggestedResumeHeadline,
        coverLetter: response.data.coverLetter
      });
    } catch (err) {
      alert("AI Coprocessor network execution timeout.");
    } finally {
      setGeneratingAi(false);
    }
  };

  const triggerSmartSearch = async (e) => {
    e.preventDefault();
    if(!aiSearchQuery) return;
    
    setSearchingNlp(true);
    setAiSearchLogs("Initializing NLP parsing sequences...");
    try {
      const response = await axios.post(`${API_BASE_URL}/AiIntegration/nlp-search`, { query: aiSearchQuery });
      setAiSearchLogs(response.data.logs);
    } catch (err) {
      setAiSearchLogs("Linguistic framework pipeline error.");
    } finally {
      setSearchingNlp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-1 bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-1 h-fit shadow-sm">
          <div className="p-2 mb-4 border-b border-gray-100 pb-4">
            <h3 className="text-xs font-black uppercase text-[#4A7C59] tracking-wider">JobMart Platform</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Candidate Center</p>
          </div>
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'overview' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Chart /> Dashboard Overview</button>
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'profile' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.User /> Profile Parameters</button>
          <button onClick={() => setActiveTab('cv_repo')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'cv_repo' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.FileText /> ATS & CV Repository</button>
          <button onClick={() => setActiveTab('ai_optimizer')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'ai_optimizer' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Sparkles /> AI Career Optimizer</button>
          <button onClick={() => setActiveTab('smart_search')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'smart_search' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Search /> Smart NLP Job Search</button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Welcome Back, {candidateData.firstName || 'Candidate'} 👋</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage live profile parameters and trace automated cognitive scores.</p>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {loadingAts ? (
                <div className="text-xs font-bold text-[#4A7C59] p-8 bg-white rounded-2xl border text-center animate-pulse">Running Neural Analytics Core...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Profile Completion</span><h3 className="text-2xl font-black font-mono text-[#4A7C59]">{atsAnalytics.profileCompletion}%</h3></div>
                    <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Live AI ATS Score</span><h3 className="text-2xl font-black font-mono text-indigo-600">{atsAnalytics.atsScore}%</h3></div>
                    <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Interview Probability</span><h3 className="text-2xl font-black font-mono text-purple-600">{atsAnalytics.interviewProbability}</h3></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-black uppercase text-amber-700">⚠️ Extracted Target Skill Gaps</h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {atsAnalytics.missingKeywords.length === 0 ? <p className="text-[11px] text-gray-400 italic">No keyword discrepancies flagged.</p> : 
                          atsAnalytics.missingKeywords.map((kw, i) => <span key={i} className="px-2 py-0.5 font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-100 rounded-md">{kw}</span>)
                        }
                      </div>
                    </div>
                    <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-black uppercase text-indigo-700">💡 Optimization Suggestions</h4>
                      <ul className="space-y-1.5 pt-1 text-xs text-slate-600">
                        {atsAnalytics.suggestedImprovements.length === 0 ? <p className="text-[11px] text-gray-400 italic">Profile parameters fully optimized context.</p> :
                          atsAnalytics.suggestedImprovements.map((imp, i) => <li key={i}>• {imp}</li>)
                        }
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-6">
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>First Name</label><input className={inputCls} value={candidateData.firstName} onChange={e => setCandidateData({...candidateData, firstName: e.target.value})} /></div>
                  <div><label className={labelCls}>Last Name</label><input className={inputCls} value={candidateData.lastName} onChange={e => setCandidateData({...candidateData, lastName: e.target.value})} /></div>
                </div>
                <div><label className={labelCls}>Target Professional Title</label><input className={inputCls} value={candidateData.jobTitle} onChange={e => setCandidateData({...candidateData, jobTitle: e.target.value})} /></div>
                <div><label className={labelCls}>Biography Context</label><textarea rows={4} className="w-full px-3 py-2 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] resize-none" value={candidateData.bio} onChange={e => setCandidateData({...candidateData, bio: e.target.value})} /></div>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold text-white bg-[#4A7C59] rounded-xl shadow-md transition">Update Core Profile</button>
              </form>
            </div>
          )}

          {activeTab === 'cv_repo' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-6">
              <div className="p-5 rounded-xl border bg-gray-50/50 border-gray-100 space-y-4">
                <label className={labelCls}>{candidateData.isCvUploaded ? "Replace Active Document File" : "Upload Resume Parameters"}</label>
                <form onSubmit={handleResumeBinaryUpload} className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input type="file" accept=".pdf,.docx" onChange={e => setUploadedFile(e.target.files[0])} className="text-xs file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-slate-900 file:text-white file:text-[10px] file:font-bold cursor-pointer" />
                  <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-[#0F172A] rounded-xl hover:bg-[#4A7C59] transition">Execute Upload</button>
                </form>
                {uploadStatus && <p className="text-[10px] font-mono text-indigo-600 mt-1">{uploadStatus}</p>}
              </div>
            </div>
          )}

          {activeTab === 'ai_optimizer' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-6">
              <form onSubmit={triggerAiAssetGeneration} className="space-y-4 bg-gray-50/50 p-4 border border-gray-100 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Target Career Title</label><input className={inputCls} value={aiInputs.targetTitle} onChange={e => setAiInputs({...aiInputs, targetTitle: e.target.value})} /></div>
                  <div><label className={labelCls}>Core Matrix Competencies</label><input className={inputCls} placeholder="e.g. Java, React" value={aiInputs.skills} onChange={e => setAiInputs({...aiInputs, skills: e.target.value})} /></div>
                </div>
                <button type="submit" className="px-4 py-2 bg-[#4A7C59] font-bold text-white text-xs rounded-xl shadow-sm hover:bg-[#3d664a]">
                  {generatingAi ? "Processing Tokens..." : "Synthesize Assets"}
                </button>
              </form>

              {aiResult.headline && (
                <div className="space-y-4 animate-fade-in">
                  <div className={cardCls}><span className="text-[9px] font-mono font-black text-indigo-600 uppercase tracking-widest block">[SUGGESTED HeadLINE]</span><p className="text-xs text-slate-800 font-bold border-l-2 border-[#4A7C59] pl-3 py-1 bg-gray-50/50 rounded-r-lg">{aiResult.headline}</p></div>
                  <div className={cardCls}><span className="text-[9px] font-mono font-black text-indigo-600 uppercase tracking-widest block">[SYNTHESIZED COVER LETTER]</span><p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border font-serif">{aiResult.coverLetter}</p></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'smart_search' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-6">
              <form onSubmit={triggerSmartSearch} className="space-y-3">
                <label className={labelCls}>Linguistic Search Query String</label>
                <div className="flex gap-2">
                  <input type="text" className={inputCls} placeholder="e.g. I need a remote React developer job under Rs. 250,000..." value={aiSearchQuery} onChange={e => setAiSearchQuery(e.target.value)} />
                  <button type="submit" className="px-4 py-2 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-[#4A7C59] transition">
                    {searchingNlp ? "Compiling..." : "Compile Query"}
                  </button>
                </div>
              </form>

              {aiSearchLogs && (
                <div className="p-4 bg-slate-900 text-slate-200 font-mono text-[10px] rounded-xl border border-slate-950 leading-relaxed whitespace-pre-line">
                  <span className="text-emerald-400 font-bold block mb-1">[NLP PARSER COMPILER SEQUENCE SUCCESSFUL]</span>
                  {aiSearchLogs}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;