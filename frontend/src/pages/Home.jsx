import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AiChatbot from '../components/AiChatbot';
import { 
  BrainCircuit, Search, BarChart3, 
  ArrowRight, Zap, BriefcaseBusiness, CheckCircle, Users 
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 -z-10 bg-[radial-gradient(#4A7C59_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
        <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter">
          The Future of Hiring is <br /> 
          <span className="text-brand-green">Intelligent & Fast</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          JobMart leverages Google Gemini AI to bridge the gap between world-class talent and innovative companies.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-brand-green text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-xl hover:shadow-brand-green/20">
            Get Started
          </Link>
          <Link to="/login" className="bg-white border-2 border-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all">
            Access Portal
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Jobs", val: "12,500+" },
            { label: "Matches Made", val: "8,200+" },
            { label: "Companies", val: "650+" },
            { label: "AI Accuracy", val: "99.2%" }
          ].map((stat, i) => (
            <div key={i}><h3 className="text-4xl font-black">{stat.val}</h3><p className="text-slate-400">{stat.label}</p></div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose JobMart?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BrainCircuit, title: "AI-Powered Matching", desc: "Our Gemini-based engine ranks candidates with 99% accuracy." },
            { icon: Search, title: "NLP Job Search", desc: "Find your ideal role using natural language query processing." },
            { icon: BarChart3, title: "Real-time Analytics", desc: "Detailed insights into your application performance." }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-white border border-slate-200 rounded-2xl hover:border-brand-green hover:shadow-2xl transition-all">
              <item.icon className="h-12 w-12 text-brand-green mb-6" />
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Build Profile", desc: "Upload your resume and let our AI analyze your professional skills." },
              { step: "02", title: "AI Matching", desc: "Gemini suggests roles perfectly tailored to your experience." },
              { step: "03", title: "Get Hired", desc: "Apply with one click and track your interview status seamlessly." }
            ].map((item, i) => (
              <div key={i} className="relative p-8 border-l-4 border-brand-green bg-white rounded-r-2xl shadow-sm">
                <span className="text-6xl font-black text-brand-green/10 absolute top-2 right-4">{item.step}</span>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center">
        <div className="flex justify-center gap-6 mb-6">
          <Zap className="text-brand-green" />
          <span className="font-black text-xl">JobMart AI</span>
        </div>
        <p className="text-slate-500">© 2026 JobMart Recruitment Platform. All Rights Reserved.</p>
      </footer>

      {/* AI Chatbot Floating Component */}
      <AiChatbot />
    </div>
  );
};

export default Home;
