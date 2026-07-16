import React, { useState, useEffect } from 'react';
import axios from 'axios';

const inputCls = "w-full px-3 py-2.5 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] focus:bg-white transition text-[#0F172A]";
const cardCls = "bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-sm";
const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5";

const Icon = {
  Chart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>,
  Brain: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  List: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Microphone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
};

const API_BASE_URL = 'http://localhost:5183/api';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', description: '' });
  const [interviewPrep, setInterviewPrep] = useState({});
  const [preppingId, setPreppingId] = useState(null);

  const [aiScores, setAiScores] = useState({}); 
  const [aiFeedback, setAiFeedback] = useState({}); 
  const [scanningId, setScanningId] = useState(null);

  const stats = {
    totalTalent: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
    underReview: candidates.filter(c => !c.status || c.status === 'Active').length,
    rejected: candidates.filter(c => c.status === 'Closed').length
  };

  useEffect(() => {
    loadInitialDatabaseData();
  }, []);

  const loadInitialDatabaseData = () => {
    axios.get(`${API_BASE_URL}/Auth/candidates`)
      .then(res => setCandidates(res.data.filter(u => u.role === 'Candidate')))
      .catch(err => console.error(err));

    axios.get(`${API_BASE_URL}/JobPosting`)
      .then(res => {
        setJobs(res.data);
        if (res.data.length > 0 && !selectedJobId) setSelectedJobId(res.data[0].id);
      })
      .catch(err => console.error(err));
  };

  const triggerAiEvaluationPipeline = async (candidateId) => {
    if (!selectedJobId) return alert("Select a specific active vacancy reference mapping context.");
    setScanningId(candidateId);
    try {
      const response = await axios.get(`${API_BASE_URL}/AiIntegration/evaluate-candidate/${candidateId}/${selectedJobId}`);
      const { matchScore, aiFeedback: feedback } = response.data;
      
      setAiScores(prev => ({ ...prev, [candidateId]: matchScore }));
      setAiFeedback(prev => ({ ...prev, [candidateId]: feedback }));
    } catch (err) {
      console.error(err);
      alert("AI Token execution fault.");
    } finally {
      setScanningId(null);
    }
  };

  const triggerAiInterviewMatrix = async (candidateId) => {
    if (!selectedJobId) return alert("Select a target vacancy descriptor context.");
    setPreppingId(candidateId);
    try {
      const targetJob = jobs.find(j => j.id == selectedJobId);
      const targetCand = candidates.find(c => c.id == candidateId);
      
      const response = await axios.post(`${API_BASE_URL}/AiIntegration/generate-candidate-assets`, {
        targetJobTitle: `Interview Questions Matrix for ${targetCand.firstName} applying for ${targetJob.title}`,
        selectedSkills: [targetCand.jobTitle || "General Skill Matrix", "Core Architecture Evaluation"]
      });
      
      setInterviewPrep(prev => ({ ...prev, [candidateId]: response.data.coverLetter }));
    } catch (err) {
      alert("AI Coprocessor structural timeout.");
    } finally {
      setPreppingId(null);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company || !jobForm.description) return alert("Complete mandatory matrix markers.");
    try {
      await axios.post(`${API_BASE_URL}/JobPosting`, jobForm);
      alert("Job Vacancy Node published successfully inside remote database data cluster!");
      setJobForm({ title: '', company: '', location: '', description: '' });
      loadInitialDatabaseData(); 
      setActiveTab('overview');
    } catch (err) {
      alert("Database persistence failure occurred.");
    }
  };

  const updateApplicationPipelineStatus = async (id, currentStatus) => {
    try {
      const candidate = candidates.find(c => c.id === id);
      await axios.put(`${API_BASE_URL}/Auth/candidates/${id}`, {
        ...candidate,
        status: currentStatus
      });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: currentStatus } : c));
      alert(`Application profile status successfully updated to: ${currentStatus}`);
    } catch (err) {
      alert("Pipeline database update update transaction aborted.");
    }
  };

  const filteredCandidates = candidates.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="md:col-span-1 bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-1 h-fit shadow-sm">
          <div className="p-2 mb-4 border-b border-gray-100 pb-4">
            <h3 className="text-xs font-black uppercase text-[#4A7C59] tracking-wider">JobMart Recruiter</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Automated Command Hub</p>
          </div>

          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'overview' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Chart /> Overview Analytics</button>
          <button onClick={() => setActiveTab('manage_jobs')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'manage_jobs' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Briefcase /> Manage Job Vacancies</button>
          <button onClick={() => setActiveTab('ai_hub')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'ai_hub' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Brain /> AI Screening Hub</button>
          <button onClick={() => setActiveTab('ai_interview')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'ai_interview' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.Microphone /> AI Interview Matrix</button>
          <button onClick={() => setActiveTab('pipeline')} className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition ${activeTab === 'pipeline' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'text-gray-500 hover:bg-gray-50'}`}><Icon.List /> Pipeline Ledger Grid</button>
        </div>

        <div className="md:col-span-3 space-y-6">
          
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Recruiter Command Workspace 💼</h1>
              <p className="text-xs text-gray-500 mt-0.5">Orchestrate live job postings, screening metrics and cognitive vector mappings.</p>
            </div>
            
            <div className="w-full sm:w-64">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Target Assessment Context</label>
              <select className={inputCls} value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title} · {j.company}</option>)}
              </select>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Talent Pool</span><h3 className="text-2xl font-black font-mono text-indigo-600 mt-1">{stats.totalTalent}</h3></div>
                <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Under Review</span><h3 className="text-2xl font-black font-mono text-amber-600 mt-1">{stats.underReview}</h3></div>
                <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Shortlisted Profiles</span><h3 className="text-2xl font-black font-mono text-emerald-600 mt-1">{stats.shortlisted}</h3></div>
                <div className={cardCls}><span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rejected Nodes</span><h3 className="text-2xl font-black font-mono text-red-600 mt-1">{stats.rejected}</h3></div>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
                <h2 className="text-sm font-black text-[#0F172A] uppercase tracking-wide">Target Vacancy Blueprint Metrics</h2>
                {jobs.filter(j => j.id == selectedJobId).map(job => (
                  <div key={job.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-[#4A7C59]">{job.title}</h4>
                    <p className="text-[11px] text-gray-500">{job.company} · <span className="font-medium text-gray-400">{job.location}</span></p>
                    <p className="text-xs text-slate-600 border-t border-gray-200/60 pt-2 mt-2 leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'manage_jobs' && (
            <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-[#0F172A]">Post New Corporate Job Requisition</h2>
                <p className="text-xs text-gray-400 mt-0.5">Publish dynamic operational requirements targeting candidate profile vectors.</p>
              </div>

              <form onSubmit={handleJobSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Job Vacancy Title</label><input className={inputCls} placeholder="e.g. Senior QA Engineer" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} /></div>
                  <div><label className={labelCls}>Hiring Entity / Company</label><input className={inputCls} placeholder="e.g. KreativeLabs Corporation" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} /></div>
                </div>
                <div><label className={labelCls}>Geographic Workspace Location</label><input className={inputCls} placeholder="e.g. Matale, Sri Lanka / Remote" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} /></div>
                <div><label className={labelCls}>Job Description Summary</label><textarea rows={4} className="w-full px-3 py-2 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] resize-none" placeholder="Outline primary responsibilities, standard technology stacks, and operational dependencies mapping profiles..." value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} /></div>
                
                <button type="submit" className="px-5 py-2.5 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3d664a] rounded-xl shadow-md transition">Publish Job Requistion</button>
              </form>
            </div>
          )}

          {activeTab === 'ai_hub' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50"><h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Cognitive Suitability Matrix Vetting</h3></div>
              <div className="divide-y divide-gray-100">
                {candidates.map(candidate => {
                  const score = aiScores[candidate.id];
                  const feedback = aiFeedback[candidate.id];
                  const isScanning = scanningId === candidate.id;

                  return (
                    <div key={candidate.id} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-gray-50/40 transition">
                      <div className="lg:col-span-4 space-y-1">
                        <h4 className="text-xs font-bold text-[#0F172A]">{candidate.firstName} {candidate.lastName}</h4>
                        <p className="text-[10px] text-gray-400">{candidate.email}</p>
                        <div className="pt-2"><span className="px-2 py-0.5 text-[9px] font-bold text-[#4A7C59] bg-[#4A7C59]/5 rounded-md border border-[#4A7C59]/10 uppercase">{candidate.jobTitle || 'Unassigned'}</span></div>
                      </div>
                      <div className="lg:col-span-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Narrative Context</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">{candidate.bio || 'No digital profile biography provided.'}</p>
                      </div>
                      <div className="lg:col-span-4 bg-white border border-gray-200 p-3 rounded-xl flex flex-col justify-between min-h-[90px]">
                        <div>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase mb-1">AI Diagnostics</span>
                          {isScanning ? (
                            <div className="flex items-center gap-2 text-[10px] text-[#4A7C59] font-bold pt-1"><div className="w-2.5 h-2.5 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin"></div>Processing Neural Alignments...</div>
                          ) : score !== undefined ? (
                            <div className="space-y-1.5">
                              <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md ${score >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{score}% Compatibility Match</span>
                              <p className="text-[10px] text-slate-500 italic leading-tight mt-1">"{feedback}"</p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 italic pt-1">Awaiting profile verification metrics scan.</p>
                          )}
                        </div>
                        {score === undefined && !isScanning && (
                          <button onClick={() => triggerAiEvaluationPipeline(candidate.id)} className="mt-3 w-full py-1.5 text-[10px] text-white bg-[#0F172A] font-bold rounded-lg hover:bg-[#4A7C59] transition shadow-xs">Scan Profile with AI</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai_interview' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">AI Automated Interview Question Sheet Synthesizer</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Generate tailored behavior and technical screening question matrices from profile datasets.</p>
              </div>

              <div className="divide-y divide-gray-100">
                {candidates.map(candidate => {
                  const prepData = interviewPrep[candidate.id];
                  const isPrepping = preppingId === candidate.id;

                  return (
                    <div key={candidate.id} className="p-6 space-y-4 hover:bg-gray-50/30 transition">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-[#0F172A]">{candidate.firstName} {candidate.lastName}</h4>
                          <p className="text-[10px] text-gray-400">Designation Target Alignment Parameter: <span className="text-[#4A7C59] font-bold">{candidate.jobTitle || 'Unassigned'}</span></p>
                        </div>
                        {!prepData && (
                          <button onClick={() => triggerAiInterviewMatrix(candidate.id)} disabled={isPrepping} className="px-3 py-1.5 bg-[#4A7C59] font-bold text-white text-[10px] rounded-lg shadow-sm hover:bg-[#3d664a]">
                            {isPrepping ? "Compiling Prompts..." : "Generate Interview Matrix Sheet"}
                          </button>
                        )}
                      </div>

                      {prepData && (
                        <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] border border-slate-900 leading-relaxed whitespace-pre-line">
                          <span className="text-indigo-400 font-bold block border-b border-slate-800 pb-1 mb-2">[SYNTHESIZED INTERVIEW QUESTIONS MATRIX SHEET]</span>
                          {prepData}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Active Pipeline Workflow Allocation Ledger</h3>
                </div>
                <input type="text" className="w-full sm:w-60 px-3 py-1.5 text-xs border border-gray-200 bg-gray-50 rounded-lg outline-none focus:border-[#4A7C59]" placeholder="Filter queries..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400">
                      <th className="p-3">Candidate Personal Details</th>
                      <th className="p-3">Target Profile Title</th>
                      <th className="p-3">Active Pipeline State Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCandidates.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/40 transition">
                        <td className="p-3 font-medium text-[#0F172A]">
                          <div>{c.firstName} {c.lastName}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{c.email}</div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-[#4A7C59]">{c.jobTitle || 'Unassigned Node'}</td>
                        <td className="p-3">
                          <select className="px-2 py-1 text-[11px] border border-gray-200 bg-white rounded-md outline-none" value={c.status || 'Active'} onChange={e => updateApplicationPipelineStatus(c.id, e.target.value)}>
                            <option value="Active">Under Review</option>
                            <option value="Shortlisted">Shortlist Account</option>
                            <option value="Closed">Reject Application</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;