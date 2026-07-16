import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Upload, FileText, BarChart, Loader2 } from 'lucide-react';

const CandidateDashboard = () => {
  const userId = localStorage.getItem('userId');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // AI Tools State
  const [atsData, setAtsData] = useState(null);
  const [loadingAts, setLoadingAts] = useState(false);
  
  const [targetJob, setTargetJob] = useState('');
  const [skills, setSkills] = useState('');
  const [generatedAssets, setGeneratedAssets] = useState(null);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // 1. Upload Physical CV
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus('Uploading...');
      await axios.post(`http://localhost:5183/api/AiIntegration/upload-resume/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('CV Uploaded Successfully!');
    } catch (error) {
      setUploadStatus('Failed to upload CV.');
    }
  };

  // 2. Fetch AI ATS Score
  const generateAtsScore = async () => {
    setLoadingAts(true);
    try {
      const response = await axios.get(`http://localhost:5183/api/AiIntegration/ats-analytics/${userId}`);
      setAtsData(response.data);
    } catch (error) {
      alert('Ensure your profile is complete before generating an ATS score.');
    } finally {
      setLoadingAts(false);
    }
  };

  // 3. Generate AI Career Assets (Cover Letter)
  const generateAssets = async (e) => {
    e.preventDefault();
    setLoadingAssets(true);
    try {
      const skillArray = skills.split(',').map(s => s.trim());
      const response = await axios.post(`http://localhost:5183/api/AiIntegration/generate-candidate-assets`, {
        targetJobTitle: targetJob,
        selectedSkills: skillArray
      });
      setGeneratedAssets(response.data);
    } catch (error) {
      alert('Failed to generate assets.');
    } finally {
      setLoadingAssets(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Actions */}
        <div className="md:col-span-1 space-y-6">
          
          {/* CV Upload Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-brand-green">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
              <Upload className="text-brand-green" /> Upload Physical CV
            </h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-dark hover:file:bg-brand-green hover:file:text-white transition-all cursor-pointer"
              />
              <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-900">
                Sync Resume
              </button>
            </form>
            {uploadStatus && <p className="mt-3 text-sm font-semibold text-brand-green">{uploadStatus}</p>}
          </div>

          {/* ATS Generator Trigger */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
              <BarChart className="text-blue-500" /> ATS Analytics
            </h3>
            <p className="text-sm text-slate-600 mb-4">Run an AI scan on your profile to see how you rank against enterprise standards.</p>
            <button 
              onClick={generateAtsScore} 
              disabled={loadingAts}
              className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 flex justify-center items-center"
            >
              {loadingAts ? <Loader2 className="animate-spin" /> : 'Generate ATS Score'}
            </button>
          </div>
        </div>

        {/* Right Column: AI Results & Assets */}
        <div className="md:col-span-2 space-y-6">
          
          {/* ATS Results View */}
          {atsData && (
            <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">AI Profile Analysis</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                  <p className="text-sm text-slate-500 font-bold uppercase">ATS Score</p>
                  <p className="text-4xl font-extrabold text-brand-green">{atsData.atsScore}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                  <p className="text-sm text-slate-500 font-bold uppercase">Interview Probability</p>
                  <p className="text-4xl font-extrabold text-blue-600">{atsData.interviewProbability}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-bold text-slate-700">Missing Keywords:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {atsData.missingKeywords?.map((kw, i) => (
                    <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Cover Letter Generator */}
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
              <FileText className="text-purple-500" /> AI Career Assets Generator
            </h3>
            <form onSubmit={generateAssets} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Target Job Title (e.g. Software Engineer)" 
                  required
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 w-full focus:outline-none focus:border-brand-green"
                />
                <input 
                  type="text" 
                  placeholder="Skills (comma separated)" 
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 w-full focus:outline-none focus:border-brand-green"
                />
              </div>
              <button 
                type="submit" 
                disabled={loadingAssets}
                className="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 flex justify-center items-center"
              >
                {loadingAssets ? <Loader2 className="animate-spin" /> : 'Generate Cover Letter & Headline'}
              </button>
            </form>

            {generatedAssets && (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                <h4 className="font-bold text-lg text-slate-800 mb-2">Punchy Headline</h4>
                <p className="italic text-slate-600 mb-4">"{generatedAssets.suggestedResumeHeadline}"</p>
                <h4 className="font-bold text-lg text-slate-800 mb-2">Executive Cover Letter</h4>
                <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">{generatedAssets.coverLetter}</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;