import Navbar from '../components/Navbar';
import AiChatbot from '../components/AiChatbot';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            The Future of <span className="text-brand-green">Enterprise Recruitment</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            JobMart integrates cutting-edge AI to match elite talent with world-class opportunities. Experience smart resume parsing, automated ATS scoring, and real-time career coaching.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/login" className="bg-brand-green text-white px-8 py-3 rounded-md font-bold text-lg hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl">
              Find a Job
            </Link>
            <Link to="/login" className="bg-white text-slate-800 border-2 border-slate-200 px-8 py-3 rounded-md font-bold text-lg hover:border-brand-green hover:text-brand-green transition-all shadow-sm hover:shadow-md">
              Hire Talent
            </Link>
          </div>
        </div>
      </main>

      {/* Floating AI Coach */}
      <AiChatbot />
    </div>
  );
};

export default Home;