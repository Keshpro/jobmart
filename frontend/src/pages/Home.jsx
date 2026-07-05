import React from 'react';
import Footer from '../components/Footer'; 

// ─── HCI Compliant Minimal Vector Icons (Optimized for Light Mode) ───────────
const Icon = {
  Sparkles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L18 12l-6.857 2.286L9 21l-2.286-6.857L0 12l6.857-2.286L9 3z" /></svg>,
  CheckVerified: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  TrendingUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] antialiased">
      
      {/* ─── 1. HERO HEADER SECTION (Minimalist Crisp White Layout) ─── */}
      <section className="relative max-w-screen-xl mx-auto px-6 pt-24 pb-16 text-center space-y-6">
        {/* Dynamic Micro-interaction Notification Badge */}
        <div className="inline-flex items-center gap-2 bg-[#4A7C59]/10 border border-[#4A7C59]/20 text-[#4A7C59] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Icon.Sparkles /> Next-Gen AI Recruitment Ecosystem Active
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
          Modernizing The Global Talent Lifecycle <span className="text-[#4A7C59]">Through AI Insights</span>
        </h1>
        
        <p className="text-sm md:text-base text-[#57657A] max-w-2xl mx-auto leading-relaxed">
          Automate candidate tracking, build custom generative compliance documents, and experience programmatic multi-role talent matching matrixes inside one core architecture.
        </p>

        {/* High Affordance Primary Action Areas */}
        <div className="flex justify-center gap-3 pt-4">
          <button className="px-6 py-3 bg-[#4A7C59] hover:bg-[#3D664A] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#4A7C59]/10 transition-all duration-200 flex items-center gap-2">
            Explore Open Vacancies <Icon.ArrowRight />
          </button>
          <button className="px-6 py-3 bg-[#F8FAFC] border border-[#E2E8F0] text-[#57657A] hover:text-[#0F172A] rounded-xl text-xs font-bold hover:bg-[#F1F5F9] transition-all duration-200">
            Enterprise Solutions
          </button>
        </div>
      </section>

      {/* ─── 2. PERFORMANCE COUNTERS STRIP (Crisp High-Contrast Grid) ─── */}
      <section className="max-w-screen-xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl shadow-sm divide-y-2 md:divide-y-0 md:divide-x divide-[#E2E8F0]">
          <div className="text-center p-2 md:p-0">
            <h3 className="text-3xl font-black font-mono text-[#0F172A]">94K+</h3>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Processed Resumes</p>
          </div>
          <div className="text-center p-2 md:p-0">
            <h3 className="text-3xl font-black font-mono text-[#4A7C59]">1.2M</h3>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">AI Match Matrix Calls</p>
          </div>
          <div className="text-center p-2 md:p-0">
            <h3 className="text-3xl font-black font-mono text-[#0F172A]">99.8%</h3>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">SLA Pipeline Uptime</p>
          </div>
          <div className="text-center p-2 md:p-0">
            <h3 className="text-3xl font-black font-mono text-[#4A7C59]">450+</h3>
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mt-1">Multinational Corporates</p>
          </div>
        </div>
      </section>

      {/* ─── 3. INTEGRATION MATRICES FEATURE CARDS (HCI Chunking Layout) ─── */}
      <section className="max-w-screen-xl mx-auto px-6 mb-16 space-y-6">
        <div>
          <h2 className="text-xl font-black text-[#0F172A]">Premium Cognitive Integration Matrix</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Explore native features engineered to optimize systemic corporate talent pipelines.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ad Card 1: AI Auto-Matching Engine */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm hover:border-[#4A7C59]/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-[#0F172A]"><Icon.Sparkles /></div>
            <div className="space-y-2">
              <span className="text-[9px] bg-[#4A7C59]/10 text-[#4A7C59] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border border-[#4A7C59]/20">Core Service</span>
              <h3 className="text-base font-bold tracking-tight text-[#0F172A] group-hover:text-[#4A7C59] transition-colors">AI Matching Optimization</h3>
              <p className="text-xs text-[#57657A] leading-relaxed">Map systemic corporate job vacancy matrices directly onto user profile structures using automated context telemetry.</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#4A7C59] font-bold">Vector Score Mapping</span>
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 hover:underline cursor-pointer transition">Configure Panel <Icon.ArrowRight /></span>
            </div>
          </div>

          {/* Ad Card 2: Form-Driven CV Builder */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm hover:border-[#4A7C59]/50 transition-all duration-300 group">
            <div className="space-y-2">
              <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border border-slate-200">Candidate Tool</span>
              <h3 className="text-base font-bold tracking-tight text-[#0F172A] group-hover:text-[#4A7C59] transition-colors">Form-Driven Document CV Builder</h3>
              <p className="text-xs text-[#57657A] leading-relaxed">Input competency attributes inside a unified user metadata form block to synthesize formal downloadable print documents instantly.</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-slate-500 font-bold">Print/PDF Generator</span>
              <span className="text-xs font-bold text-[#4A7C59] flex items-center gap-1 hover:underline cursor-pointer transition">Compile Assets <Icon.ArrowRight /></span>
            </div>
          </div>

          {/* Ad Card 3: External API Gateways */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm hover:border-[#4A7C59]/50 transition-all duration-300 group">
            <div className="space-y-2">
              <span className="text-[9px] bg-[#4A7C59]/10 text-[#4A7C59] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest border border-[#4A7C59]/20">External API Channels</span>
              <h3 className="text-base font-bold tracking-tight text-[#0F172A] group-hover:text-[#4A7C59] transition-colors">SendGrid, Twilio & Calendar Links</h3>
              <p className="text-xs text-[#57657A] leading-relaxed">Synchronize candidate operations using high-volume external notification gateways, scheduling intervals directly inside target mailboxes.</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#4A7C59] font-bold">OAuth2 Synchronization</span>
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1 hover:underline cursor-pointer transition">View Endpoints <Icon.ArrowRight /></span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. TECHNICAL DETAILS COMPLIANCE FEED (System Status View) ─── */}
      <section className="max-w-screen-xl mx-auto px-6 mb-20">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#4A7C59] font-bold uppercase tracking-widest">
              <Icon.TrendingUp /> Infrastructure Scale Compliance
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight leading-tight">
              Relational Database Framework Powered By SQL Server
            </h2>
            <p className="text-xs text-[#57657A] leading-relaxed">
              Our entity mapping architecture maintains zero system gaps by resetting metadata identifiers automatically upon structural record termination. Experience safe cascade isolation controls across all user role layers.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold"><span className="text-[#4A7C59]"><Icon.CheckVerified /></span> Secure Role-Based Access Controls (RBAC)</div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold"><span className="text-[#4A7C59]"><Icon.CheckVerified /></span> Encrypted Password Credentials Layer Using BCrypt</div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold"><span className="text-[#4A7C59]"><Icon.CheckVerified /></span> Normalized DB Schema Decoupling Users & Role-Accounts</div>
            </div>
          </div>
          
          {/* Light-Theme Clean Technical Code Box */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-5 font-mono text-[11px] text-slate-300 space-y-2 shadow-inner">
            <p className="text-[#4A7C59] font-bold">[SYSTEM SCHEDULING DISPATCH DEPLOYMENT]</p>
            <p className="text-slate-500"># Initializing TLS handshake protocol mappings...</p>
            <div className="p-3 bg-[#0F172A] text-emerald-400 rounded-lg space-y-1 text-[10px] border border-slate-900">
              <div>&gt; _context.RoleAccounts.AnyAsync(identity_trace);</div>
              <div>&gt; Status: 200 OK Execution cleared.</div>
              <div className="text-[#4A7C59]">&gt; Live Telemetry Engine Synced with Port 5183.</div>
            </div>
            <p className="text-[10px] text-slate-500 text-right italic">JobMart Platform V1.0.0</p>
          </div>
        </div>
      </section>

      <Footer /> 
    </div>
  );
};

export default Home;