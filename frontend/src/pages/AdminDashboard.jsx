import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ─── Icons (inline SVGs - no extra deps) ──────────────────────────────────────
const Icon = {
  Users: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Shield: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Monitor: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M8 21h8M12 17v4" /></svg>,
  Chart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Check: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Cpu: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" /></svg>,
  Bell: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
};

const STATUS_COLORS = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
  Paused: 'bg-amber-50 text-amber-700 border-amber-200',
  Closed: 'bg-red-50 text-red-600 border-red-200',
};

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] bg-[#F8FAFC] outline-none focus:border-[#6C3FF4] focus:bg-white transition placeholder:text-gray-300";
const API_BASE_URL = 'http://localhost:5183/api';

// ─── Shared Modal Components ──────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-[#E8E0F0]">
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#F0EBF8]">
        <h3 className="text-sm font-bold text-[#0F172A] tracking-wide uppercase">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition"><Icon.Close /></button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#6B7A8D] mb-1.5">{label}</label>
    {children}
  </div>
);

const Confirm = ({ msg, onConfirm, onCancel }) => (
  <Modal title="Confirm Action" onClose={onCancel}>
    <p className="text-sm text-[#334155] mb-6">{msg}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
      <button onClick={onConfirm} className="px-4 py-2 text-sm text-white bg-red-600 rounded-xl hover:bg-red-700 transition">Delete</button>
    </div>
  </Modal>
);

// ─── Sub-Section: Candidate Management ───────────────────────────────────────
const UserManagement = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'Candidate', status: 'Active', jobTitle: '' });

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Auth/candidates`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [refreshTrigger]);

  const filtered = users.filter(u => {
    const matchesGeneral = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesJobTitle = jobTitleFilter ? (u.jobTitle || '').toLowerCase().includes(jobTitleFilter.toLowerCase()) : true;
    return matchesGeneral && matchesJobTitle;
  });

  const handleSave = async () => {
    try {
      if (modal === 'add') {
        await axios.post(`${API_BASE_URL}/Auth/register`, { ...form, role: 'Candidate' });
      } else {
        await axios.put(`${API_BASE_URL}/Auth/candidates/${editing}`, form);
      }
      fetchCandidates();
      setModal(null);
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed execution.");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Candidate Management</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">{users.length} live database candidate profiles</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidate..." className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs bg-[#F8FAFC] outline-none w-40" />
          <input value={jobTitleFilter} onChange={e => setJobTitleFilter(e.target.value)} placeholder="Filter by Job Title..." className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs bg-[#F8FAFC] outline-none w-44" />
          <button onClick={() => { setForm({ firstName: '', lastName: '', email: '', password: '', role: 'Candidate', status: 'Active', jobTitle: '' }); setEditing(null); setModal('add'); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#0F172A] text-white rounded-xl hover:bg-[#1E293B] transition">
            <Icon.Plus /> New Candidate
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#F0EBF8]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F8F5FF] text-[#6B7A8D] uppercase tracking-widest text-[10px]">
              <th className="px-4 py-3 text-left font-semibold">Candidate Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Target Job Title</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8F5FF]">
            {filtered.map(u => (
              <tr key={u.id} className="bg-white hover:bg-[#FAFAFF] transition">
                <td className="px-4 py-3 font-semibold text-[#0F172A]">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-[#64748B]">{u.email}</td>
                <td className="px-4 py-3 font-medium text-[#4A7C59]">{u.jobTitle || 'Unassigned'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${STATUS_COLORS[u.status] || STATUS_COLORS.Active}`}>{u.status || 'Active'}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setForm({ ...u }); setEditing(u.id); setModal('edit'); }} className="p-1.5 rounded-lg hover:bg-[#6C3FF4]/10 text-[#6C3FF4] transition"><Icon.Edit /></button>
                    <button onClick={() => setDeleting(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Icon.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Candidate Account' : 'Edit Profile Context'} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name"><input className={inputCls} value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></Field>
              <Field label="Last Name"><input className={inputCls} value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></Field>
            </div>
            <Field label="Email"><input className={inputCls} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></Field>
            {modal === 'add' && <Field label="Password"><input className={inputCls} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></Field>}
            <Field label="Target Job Title"><input className={inputCls} value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} /></Field>
            <button onClick={handleSave} className="w-full py-2.5 text-sm text-white bg-[#6C3FF4] rounded-xl font-semibold mt-2">{modal === 'add' ? 'Create Account' : 'Commit Changes'}</button>
          </div>
        </Modal>
      )}

      {deleting && <Confirm msg="Delete candidate account context structural reference?" onConfirm={async () => { await axios.delete(`${API_BASE_URL}/Auth/candidates/${deleting}`); fetchCandidates(); setDeleting(null); }} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

// ─── Sub-Section: Role Management ───────────────────────────────────────────
const RoleManagement = ({ refreshTrigger }) => {
  const [roleAccounts, setRoleAccounts] = useState([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', role: 'Recruiter' });

  const fetchRoleAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Auth/role-accounts`);
      setRoleAccounts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoleAccounts();
  }, [refreshTrigger]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">System Role Records</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Corporate permissions configurations mapping</p>
        </div>
        <div className="flex gap-2">
          <select value={selectedRoleFilter} onChange={e => setSelectedRoleFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs bg-[#F8FAFC] outline-none">
            <option value="All">All Roles Combined</option>
            <option value="Admin">Admin</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Hiring Manager">Hiring Manager</option>
          </select>
          <button onClick={() => setModal(true)} className="px-3 py-2 text-xs font-semibold bg-[#0F172A] text-white rounded-xl">Provision Corporate Role</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#F0EBF8]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F8F5FF] text-[#6B7A8D] uppercase tracking-widest text-[10px]">
              <th className="px-4 py-3 text-left font-semibold">Account Email</th>
              <th className="px-4 py-3 text-left font-semibold">Authorization Role</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8F5FF]">
            {roleAccounts.filter(a => selectedRoleFilter === 'All' || a.role === selectedRoleFilter).map(acc => (
              <tr key={acc.id} className="bg-white hover:bg-[#FAFAFF] transition">
                <td className="px-4 py-3 font-mono text-[#0F172A]">{acc.email}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 font-bold">{acc.role}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setDeleting(acc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Icon.Trash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Provision Corporate Access" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <Field label="Email Address"><input className={inputCls} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></Field>
            <Field label="Password"><input className={inputCls} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></Field>
            <Field label="Target Role">
              <select className={inputCls} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="Recruiter">Recruiter</option>
                <option value="Hiring Manager">Hiring Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </Field>
            <button onClick={async () => { await axios.post(`${API_BASE_URL}/Auth/admin-register`, form); fetchRoleAccounts(); setModal(false); }} className="w-full py-2.5 text-sm text-white bg-[#6C3FF4] rounded-xl font-semibold">Generate Profile</button>
          </div>
        </Modal>
      )}

      {deleting && <Confirm msg="Drop internal operational access validation structure?" onConfirm={async () => { await axios.delete(`${API_BASE_URL}/Auth/role-accounts/${deleting}`); fetchRoleAccounts(); setDeleting(null); }} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

// ─── Sub-Section: Job Post Management ─────────────────────────────────────────
const JobManagement = ({ onJobMutation }) => {
  const [jobs, setJobs] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', status: 'Active' });

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/JobPosting`);
      setJobs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await axios.put(`${API_BASE_URL}/JobPosting/${editing}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/JobPosting`, form);
      }
      fetchJobs();
      if(onJobMutation) onJobMutation();
      setModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Platform Job Assertions</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">{jobs.length} platform openings bound inside database</p>
        </div>
        <button onClick={() => { setForm({ title: '', company: '', location: '', type: 'Full-time', status: 'Active' }); setEditing(null); setModal(true); }} className="px-3 py-2 text-xs font-semibold bg-[#0F172A] text-white rounded-xl flex items-center gap-1.5"><Icon.Plus /> Add Job Post</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#F0EBF8]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F8F5FF] text-[#6B7A8D] uppercase tracking-widest text-[10px]">
              <th className="px-4 py-3 text-left font-semibold">Job Title</th>
              <th className="px-4 py-3 text-left font-semibold">Company</th>
              <th className="px-4 py-3 text-left font-semibold">Location</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8F5FF]">
            {jobs.map(j => (
              <tr key={j.id} className="bg-white hover:bg-[#FAFAFF] transition">
                <td className="px-4 py-3 font-semibold text-[#0F172A]">{j.title}</td>
                <td className="px-4 py-3 text-[#64748B]">{j.company}</td>
                <td className="px-4 py-3 text-[#64748B]">{j.location}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold ${STATUS_COLORS[j.status] || STATUS_COLORS.Active}`}>{j.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setForm({...j}); setEditing(j.id); setModal(true); }} className="p-1.5 rounded-lg hover:bg-[#6C3FF4]/10 text-[#6C3FF4] transition"><Icon.Edit /></button>
                    <button onClick={() => setDeleting(j.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Icon.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Publish Job Configuration" onClose={() => setModal(false)}>
          <div className="space-y-3">
            <Field label="Job Title"><input className={inputCls} value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></Field>
            <Field label="Company Name"><input className={inputCls} value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></Field>
            <Field label="Location context"><input className={inputCls} value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></Field>
            <button onClick={handleSave} className="w-full py-2.5 text-sm text-white bg-[#6C3FF4] rounded-xl font-semibold mt-2">Commit Parameters</button>
          </div>
        </Modal>
      )}

      {deleting && <Confirm msg="Remove job listing record mapping instance?" onConfirm={async () => { await axios.delete(`${API_BASE_URL}/JobPosting/${deleting}`); fetchJobs(); if(onJobMutation) onJobMutation(); setDeleting(null); }} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

// ─── Sub-Section: AI Core & External Integrations Monitor ──────────────────
const SystemMonitor = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  
  const [aiLogs, setAiLogs] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [notifType, setNotifType] = useState('Email');
  const [notifAddress, setNotifAddress] = useState('amal@jobmart.lk');
  const [notifLogs, setNotifLogs] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Auth/candidates`).then(res => setCandidates(res.data));
    axios.get(`${API_BASE_URL}/JobPosting`).then(res => setJobs(res.data));
  }, []);

  const triggerAiEngine = async () => {
    if(!selectedCandidate || !selectedJob) return alert("Select candidate and target job constraints.");
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/analyze-match`, {
        candidateId: parseInt(selectedCandidate),
        jobId: parseInt(selectedJob)
      });
      setAiResult(res.data);
      setAiLogs(res.data.executionLogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const dispatchProtocol = async () => {
    setNotifLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/AiIntegration/dispatch-notification`, {
        serviceType: notifType,
        targetAddress: notifAddress
      });
      setNotifLogs(res.data.orchestrationLogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A]">AI Processing & Gateway Telemetry</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">Live validation testing mapping for cognitive analytics and notification dispatch pipelines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Match Core Testing Card */}
        <div className="bg-white border border-[#F0EBF8] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] border-b border-gray-100 pb-2">
            <Icon.Cpu /> AI Matching Engine Execution Controller
          </div>
          <div className="space-y-3">
            <Field label="Target Database Candidate">
              <select className={inputCls} value={selectedCandidate} onChange={e => setSelectedCandidate(e.target.value)}>
                <option value="">Select Target Candidate Instance</option>
                {candidates.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.jobTitle || 'Unassigned'})</option>)}
              </select>
            </Field>
            <Field label="Benchmark Job Specification">
              <select className={inputCls} value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
                <option value="">Select Platform Job Requirements</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title} - {j.company}</option>)}
              </select>
            </Field>
            <button onClick={triggerAiEngine} disabled={aiLoading} className="w-full py-2.5 text-xs text-white bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition">
              {aiLoading ? "Executing Complex Vector Maps..." : "Run AI Alignment Analysis"}
            </button>
          </div>

          {/* AI Output Terminal Block */}
          {aiResult && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-2">
              <p className="text-indigo-400 font-bold border-b border-slate-700 pb-1">[AI RESOLUTION METRICS]</p>
              <p>Compliance Score: <span className="text-emerald-400 font-bold text-sm">{aiResult.score}%</span></p>
              <p>Classification Matrix: <span className="text-amber-400">{aiResult.matchGrade}</span></p>
              <div className="pt-2 border-t border-slate-800 text-slate-400 space-y-1">
                {aiLogs.map((log, idx) => <div key={idx} className="text-slate-300">{log}</div>)}
              </div>
            </div>
          )}
        </div>

        {/* Communication Gateways Card */}
        <div className="bg-white border border-[#F0EBF8] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] border-b border-gray-100 pb-2">
            <Icon.Bell /> Integrated Notification & Calendar Telemetry
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {['Email', 'SMS', 'Calendar'].map(t => (
                <button key={t} onClick={() => setNotifType(t)} className={`py-2 text-xs font-bold rounded-xl border transition ${notifType === t ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{t}</button>
              ))}
            </div>
            <Field label="Protocol Endpoint Address / Resource ID">
              <input className={inputCls} value={notifAddress} onChange={e => setNotifAddress(e.target.value)} />
            </Field>
            <button onClick={dispatchProtocol} disabled={notifLoading} className="w-full py-2.5 text-xs text-white bg-emerald-600 rounded-xl font-bold hover:bg-emerald-700 transition">
              {notifLoading ? "Orchestrating Remote Links..." : "Dispatch Protocol Request"}
            </button>
          </div>

          {/* Comms Output Terminal Block */}
          {notifLogs.length > 0 && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1">
              <p className="text-emerald-400 font-bold border-b border-slate-700 pb-1">[DISPATCH TELEMETRY TRACE]</p>
              {notifLogs.map((log, idx) => <div key={idx} className="text-slate-300">{log}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sub-Section: Dynamic Analytics Feed ──────────────────────────────────────
const Analytics = ({ statsTrigger }) => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Auth/candidates`).then(res => setCandidates(res.data));
    axios.get(`${API_BASE_URL}/JobPosting`).then(res => setJobs(res.data));
  }, [statsTrigger]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0F172A]">Platform Execution Analytics</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">Aggregated system telemetry metrics gathered dynamically from DbContext</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-[#F0EBF8] rounded-2xl p-5 shadow-sm">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Total Evaluated Candidates</span>
          <h3 className="text-3xl font-black font-mono text-[#6C3FF4] mt-1">{candidates.length}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Active records stored inside database container</p>
        </div>
        <div className="bg-white border border-[#F0EBF8] rounded-2xl p-5 shadow-sm">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Live Job Requirements</span>
          <h3 className="text-3xl font-black font-mono text-blue-600 mt-1">{jobs.length}</h3>
          <p className="text-[10px] text-gray-400 mt-2">Active openings synced to candidate indexing feeds</p>
        </div>
        <div className="bg-white border border-[#F0EBF8] rounded-2xl p-5 shadow-sm">
          <span className="text-[#64748B] text-xs font-semibold uppercase tracking-wider">Infrastructure Gateway Operational</span>
          <h3 className="text-3xl font-black font-mono text-emerald-600 mt-1">99.9<span className="text-xs text-gray-400">%</span></h3>
          <p className="text-[10px] text-gray-400 mt-2">Secure TLS pipelines healthy</p>
        </div>
      </div>
    </div>
  );
};

// ─── Root Control Panel Component Environment ───────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'Admin') {
      alert('Unauthorized Security Route Definition.');
      navigate('/login');
    }
  }, [navigate]);

  const mutateDataRefreshNotification = () => {
    setDataRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F4F2FA] font-sans">
      <header className="bg-white border-b border-[#EDE8F5] sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6C3FF4] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-[#0F172A]">JobMart</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-[#6C3FF4] bg-[#6C3FF4]/10 px-1.5 py-0.5 rounded">Admin Management Environment</span>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-xl hover:bg-red-50 transition font-semibold flex items-center gap-1.5">
            <Icon.Logout /> Logout Account
          </button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white border border-[#EDE8F5] rounded-2xl overflow-hidden shadow-sm">
          {/* Navigation Bar Tabs Selection */}
          <div className="flex border-b border-[#F0EBF8] overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
                  activeTab === t.id ? 'border-[#6C3FF4] text-[#6C3FF4] bg-[#F8F5FF]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <t.Icon /> {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'users' && <UserManagement refreshTrigger={dataRefreshTrigger} />}
            {activeTab === 'roles' && <RoleManagement refreshTrigger={dataRefreshTrigger} />}
            {activeTab === 'jobs' && <JobManagement onJobMutation={mutateDataRefreshNotification} />}
            {activeTab === 'monitor' && <SystemMonitor />}
            {activeTab === 'analytics' && <Analytics statsTrigger={dataRefreshTrigger} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const TABS = [
  { id: 'users', label: 'Users Management', Icon: Icon.Users },
  { id: 'roles', label: 'Roles System', Icon: Icon.Shield },
  { id: 'jobs', label: 'Jobs Setup Feed', Icon: Icon.Briefcase },
  { id: 'monitor', label: 'AI & Core Monitor', Icon: Icon.Monitor },
  { id: 'analytics', label: 'Platform Analytics', Icon: Icon.Chart },
];

export default AdminDashboard;