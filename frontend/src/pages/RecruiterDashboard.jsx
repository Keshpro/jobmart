import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Search, UserCheck, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const RecruiterDashboard = () => {
  const [nlpQuery, setNlpQuery] = useState('');
  const [nlpResult, setNlpResult] = useState('');
  const [loadingNlp, setLoadingNlp] = useState(false);

  const [candidateId, setCandidateId] = useState('');
  const [jobId, setJobId] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loadingEval, setLoadingEval] = useState(false);

  // 1. NLP Job Search
  const handleNlpSearch = async (e) => {
    e.preventDefault();
    setLoadingNlp(true);
    try {
      const response = await axios.post('http://localhost:5183/api/AiIntegration/nlp-search', {
        query: nlpQuery
      });
      setNlpResult(response.data.logs);
    } catch (error) {
      setNlpResult('Failed to process NLP search.');
    } finally {
      setLoadingNlp(false);
    }
  };

  // 2. Evaluate Candidate against Job Posting
  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoadingEval(true);
    try {
      const response = await axios.get(`http://localhost:5183/api/AiIntegration/evaluate-candidate/${candidateId}/${jobId}`);
      setEvaluation(response.data);
    } catch (error) {
      alert('Failed to evaluate candidate. Ensure IDs are correct and exist in database.');
    } finally {
      setLoadingEval(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: NLP Search & AI Evaluation Tools */}
        <div className="space-y-6">
          
          {/* NLP Search */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
              <Search className="text-indigo-500" /> AI Natural Language Search
            </h3>
            <form onSubmit={handleNlpSearch} className="space-y-4">
              <textarea 
                rows="3"
                placeholder="E.g., I need a senior frontend dev with 5 years React experience in Colombo..."
                value={nlpQuery}
                onChange={(e) => setNlpQuery(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                required
              />
              <button type="submit" disabled={loadingNlp} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 flex justify-center items-center font-medium">
                {loadingNlp ? <Loader2 className="animate-spin" /> : 'Parse Requirements'}
              </button>
            </form>
            {nlpResult && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded text-sm text-slate-700">
                <span className="font-bold block mb-1">Compiler Output:</span>
                {nlpResult}
              </div>
            )}
          </div>

          {/* AI Candidate Evaluation */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-brand-green">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
              <UserCheck className="text-brand-green" /> AI Profile Matcher
            </h3>
            <form onSubmit={handleEvaluate} className="grid grid-cols-2 gap-4 mb-4">
              <input 
                type="number" 
                placeholder="Candidate ID" 
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-brand-green"
                required
              />
              <input 
                type="number" 
                placeholder="Job Posting ID" 
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-brand-green"
                required
              />
              <button type="submit" disabled={loadingEval} className="col-span-2 bg-brand-green text-white py-2 rounded hover:bg-brand-dark flex justify-center items-center font-medium">
                {loadingEval ? <Loader2 className="animate-spin" /> : 'Run AI Evaluation'}
              </button>
            </form>
            
            {evaluation && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-800">Match Score:</span>
                  <span className="text-2xl font-black text-brand-green">{evaluation.matchScore}%</span>
                </div>
                <p className="text-sm text-slate-700 italic">"{evaluation.aiFeedback}"</p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-slate-800 text-white py-1 rounded text-sm hover:bg-slate-900 flex items-center justify-center gap-1"><CheckCircle size={16} /> Hire</button>
                  <button className="flex-1 bg-red-600 text-white py-1 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-1"><XCircle size={16} /> Reject</button>
                  <button className="flex-1 border border-slate-300 text-slate-700 py-1 rounded text-sm hover:bg-slate-100 flex items-center justify-center gap-1"><Calendar size={16} /> Interview</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Jobs Mock View */}
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-slate-800">
          <h3 className="text-xl font-bold mb-4 text-slate-800">Recent Applications</h3>
          <p className="text-sm text-slate-500 mb-4">Use the AI Profile Matcher on the left to evaluate these candidates.</p>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-3 border border-slate-200 rounded-lg flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">Candidate ID: 10{item}</p>
                  <p className="text-sm text-slate-500">Applied for: Senior Developer (Job ID: 50)</p>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded">Pending AI Eval</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecruiterDashboard;