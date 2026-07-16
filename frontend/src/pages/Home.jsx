import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatBot from '../components/AiChatbot';
import {
  BrainCircuit, Search, BriefcaseBusiness, BarChart3,
  Users, CheckCircle, ArrowRight, Zap, MapPin, Sparkles
} from 'lucide-react';

/* ---------------------------------------------------------------------
   Design tokens (see comment block at bottom for rationale + font setup)
--------------------------------------------------------------------- */
const GREEN = '#4A7C59';   // Executive Green — existing JobMart brand color
const GOLD = '#C9A227';    // Signal Gold — reserved for "AI is working" moments
const INK = '#0F172A';     // slate-900
const MIST = '#64748B';    // slate-500

/* ---------------------------------------------------------------------
   Lightweight scroll-reveal (no framer-motion dependency required).
   Swap the transition below for a <motion.div> if framer-motion is
   already installed in this project.
--------------------------------------------------------------------- */
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Reveal = ({ children, className = '', delay = 0 }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ---------------------------------------------------------------------
   Content
--------------------------------------------------------------------- */
const trustedCompanies = ['TechCorp', 'Nexora', 'BlueHarbor', 'Finlytics', 'Orbit Labs', 'Vantage Cloud'];

const steps = [
  { step: '01', title: 'Build your profile', desc: 'Upload a resume once — the parser reads your skills, roles and years of experience for you.' },
  { step: '02', title: 'Get AI-matched', desc: 'Gemini scores every open role against your profile and ranks the closest fits first.' },
  { step: '03', title: 'Interview and get hired', desc: 'Apply in one click and track every interview stage from a single dashboard.' },
];

const features = [
  { icon: BrainCircuit, title: 'Resume Parsing', desc: 'Skills, titles and experience are extracted automatically — no forms to fill twice.' },
  { icon: Search, title: 'NLP Job Search', desc: "Search the way you'd describe the job to a friend, not the way a filter menu expects." },
  { icon: BarChart3, title: 'Skill Matching', desc: 'Every listing shows a match score, so you know why a role was suggested to you.' },
  { icon: Zap, title: 'Real-Time Alerts', desc: 'New roles that clear your match threshold reach you the moment they go live.' },
];

const jobs = [
  { title: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'Remote', match: 96 },
  { title: 'Product Manager', company: 'Nexora', location: 'Colombo · Hybrid', match: 91 },
  { title: 'AI Researcher', company: 'Orbit Labs', location: 'Remote', match: 88 },
];

/* ---------------------------------------------------------------------
   Signature element: the Live Match Scanner
   Makes "the AI is working" visible (Nielsen: visibility of system
   status) instead of stating it in a stat card.
--------------------------------------------------------------------- */
const MatchScanner = () => {
  const skills = ['React', 'System Design', 'Node.js', 'Leadership'];
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 24,
      padding: 28,
      boxShadow: '0 24px 60px -20px rgba(15,23,42,0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: GOLD,
          animation: 'jm-pulse 1.6s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
          letterSpacing: '0.08em', color: MIST, textTransform: 'uppercase',
        }}>
          AI matching · live
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%', flexShrink: 0,
          background: `conic-gradient(${GREEN} 0% 94%, #E2E8F0 94% 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%', background: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 20, color: INK }}>94%</span>
            <span style={{ fontSize: 10, color: MIST }}>match</span>
          </div>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: INK, marginBottom: 2 }}>Senior Software Engineer</p>
          <p style={{ fontSize: 13, color: MIST }}>Scored against your resume just now</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
        {skills.map((s, i) => (
          <span key={s} style={{
            fontSize: 12, fontWeight: 600, color: GREEN,
            background: 'rgba(74,124,89,0.1)', border: `1px solid rgba(74,124,89,0.25)`,
            borderRadius: 999, padding: '5px 12px',
            opacity: 0, animation: `jm-chip-in 0.5s ease forwards ${0.4 + i * 0.18}s`,
          }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------
   Page
--------------------------------------------------------------------- */
const Home = () => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="min-h-screen bg-white" style={{ color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .jm-display { font-family: 'Fraunces', serif; }
        @keyframes jm-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes jm-chip-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes jm-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .jm-marquee-track { animation: jm-marquee 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .jm-marquee-track { animation: none; }
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full" style={{ background: 'rgba(74,124,89,0.08)' }}>
              <Sparkles size={14} color={GREEN} />
              <span style={{ fontSize: 12, fontWeight: 600, color: GREEN, letterSpacing: '0.02em' }}>Powered by Google Gemini</span>
            </div>
            <h1 className="jm-display" style={{ fontSize: 'clamp(2.75rem, 5vw, 4rem)', lineHeight: 1.05, fontWeight: 600, marginBottom: 20 }}>
              Hiring that reads<br />the room, not just<br />the resume.
            </h1>
            <p style={{ fontSize: 18, color: MIST, maxWidth: 440, marginBottom: 32 }}>
              JobMart scores every role against your actual skills, so the first thing you see is the job worth applying to.
            </p>

            {/* Primary action — the single thing this page wants you to do */}
            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl" style={{ background: '#F8FAF9', border: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} color={MIST} />
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Job title or skill"
                  className="w-full bg-transparent outline-none py-2 text-sm"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} color={MIST} />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent outline-none py-2 text-sm"
                />
              </div>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm whitespace-nowrap"
                style={{ background: GREEN }}
              >
                Find Matches <ArrowRight size={16} />
              </Link>
            </div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: MIST, marginTop: 12 }}>
              scanning 12,500 live roles right now
            </p>
          </div>

          <Reveal delay={150}>
            <MatchScanner />
          </Reveal>
        </div>
      </section>

      {/* Trust strip — social proof, keeps it honest with a marquee not a claim */}
      <section className="py-8 border-y" style={{ borderColor: '#E2E8F0', background: '#F8FAF9' }}>
        <div className="overflow-hidden max-w-7xl mx-auto px-6">
          <p style={{ fontSize: 11, letterSpacing: '0.1em', color: MIST, textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
            Hiring teams already matching on JobMart
          </p>
          <div className="flex overflow-hidden">
            <div className="jm-marquee-track flex gap-16 pr-16 shrink-0">
              {[...trustedCompanies, ...trustedCompanies].map((c, i) => (
                <span key={i} className="whitespace-nowrap" style={{ fontWeight: 700, fontSize: 18, color: '#CBD5E1' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbering earns its place */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <Reveal>
          <h2 className="jm-display" style={{ fontSize: 34, fontWeight: 600, textAlign: 'center', marginBottom: 56 }}>
            From resume to interview, in three steps
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <Reveal key={item.step} delay={i * 120}>
              <div className="p-8 rounded-2xl h-full" style={{ borderLeft: `3px solid ${GREEN}`, background: '#F8FAF9' }}>
                <span className="jm-display" style={{ fontSize: 15, fontWeight: 600, color: GREEN }}>{item.step}</span>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '10px 0 8px' }}>{item.title}</h3>
                <p style={{ color: MIST, fontSize: 15 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6" style={{ background: INK }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="jm-display" style={{ fontSize: 34, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
              What the AI is actually doing
            </h2>
            <p style={{ color: '#94A3B8', marginBottom: 48, maxWidth: 520 }}>
              Not a black box — here's what runs behind every match score.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="p-7 rounded-2xl h-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <f.icon size={22} color={GOLD} style={{ marginBottom: 14 }} />
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ color: '#94A3B8', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="jm-display" style={{ fontSize: 34, fontWeight: 600, marginBottom: 40, textAlign: 'center' }}>
              Top matches this week
            </h2>
          </Reveal>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <Reveal key={job.title} delay={i * 100}>
                <div
                  className="flex justify-between items-center p-6 rounded-2xl transition-all hover:shadow-md"
                  style={{ background: '#fff', border: '1px solid #E2E8F0' }}
                >
                  <div className="flex items-center gap-4">
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: 'rgba(74,124,89,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <BriefcaseBusiness size={20} color={GREEN} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 16 }}>{job.title}</h4>
                      <p style={{ color: MIST, fontSize: 13 }}>{job.company} · {job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600,
                      color: GREEN, background: 'rgba(74,124,89,0.1)', borderRadius: 999, padding: '4px 10px',
                    }}>
                      {job.match}% match
                    </span>
                    <Link to="/login" className="flex items-center gap-1 font-bold text-sm" style={{ color: GREEN }}>
                      Apply <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t text-center" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex justify-center items-center gap-2 mb-4">
          <Zap size={18} color={GREEN} />
          <span className="jm-display" style={{ fontWeight: 600, fontSize: 20 }}>JobMart AI</span>
        </div>
        <p style={{ color: MIST, fontSize: 13 }}>© 2026 JobMart Recruitment Platform. All Rights Reserved.</p>
      </footer>

      <ChatBot />
    </div>
  );
};

export default Home;