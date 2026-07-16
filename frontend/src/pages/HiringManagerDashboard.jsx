import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5183/api';

const HiringManagerDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [evaluation, setEvaluation] = useState({ score: '', feedback: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShortlistedCandidates();
  }, []);

  const fetchShortlistedCandidates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/Hiring/shortlisted`);
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      await axios.post(`${API_BASE_URL}/Hiring/evaluate`, {
        candidateId: selectedCandidate.id,
        score: parseInt(evaluation.score),
        feedback: evaluation.feedback
      });
      alert("Evaluation saved successfully!");
      setEvaluation({ score: '', feedback: '' });
    } catch (error) {
      alert("Error saving evaluation.");
    }
  };

  const handleFinalDecision = async (decision) => {
    if (!selectedCandidate) return;
    try {
      await axios.post(`${API_BASE_URL}/Hiring/decision`, {
        candidateId: selectedCandidate.id,
        decision: decision
      });
      alert(`Candidate marked as ${decision}.`);
      setSelectedCandidate(null);
      fetchShortlistedCandidates(); // Refresh list
    } catch (error) {
      alert("Error processing decision.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Hiring Manager Portal</h1>
        <p className="text-sm text-slate-500 mb-8">Review shortlisted candidates, provide evaluations, and make final hiring decisions.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* ─── SHORTLISTED CANDIDATES LIST ─── */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Shortlisted for Review</h3>
            {loading ? (
              <p className="text-xs text-slate-500">Loading candidates...</p>
            ) : (
              <div className="space-y-3">
                {candidates.map(candidate => (
                  <div 
                    key={candidate.id} 
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`p-4 border rounded-xl cursor-pointer transition ${selectedCandidate?.id === candidate.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                  >
                    <h4 className="font-bold text-sm text-slate-800">{candidate.firstName} {candidate.lastName}</h4>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mt-1">{candidate.jobTitle}</p>
                  </div>
                ))}
                {candidates.length === 0 && <p className="text-xs text-slate-500">No candidates pending review.</p>}
              </div>
            )}
          </div>

          {/* ─── EVALUATION & DECISION PANEL ─── */}
          <div className="md:col-span-2">
            {selectedCandidate ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8">
                
                {/* Candidate Info */}
                <div>
                  <h2 className="text-xl font-bold">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                  <p className="text-sm text-slate-500">{selectedCandidate.email} • {selectedCandidate.jobTitle}</p>
                </div>

                {/* Evaluation Form */}
                <form onSubmit={handleEvaluationSubmit} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Interview Evaluation</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Interview Score (1-100)</label>
                    <input 
                      type="number" 
                      required 
                      min="1" max="100"
                      value={evaluation.score}
                      onChange={(e) => setEvaluation({...evaluation, score: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Manager Feedback</label>
                    <textarea 
                      required 
                      rows="3"
                      value={evaluation.feedback}
                      onChange={(e) => setEvaluation({...evaluation, feedback: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-emerald-500 resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition">
                    Save Evaluation
                  </button>
                </form>

                {/* Final Decision Action */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Final Hiring Decision</h3>
                  <div className="flex gap-4">
                    <button onClick={() => handleFinalDecision("Hire")} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-sm">
                      Offer Job (Hire)
                    </button>
                    <button onClick={() => handleFinalDecision("Reject")} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition shadow-sm">
                      Reject Candidate
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-sm text-slate-400 font-medium">Select a candidate from the list to begin evaluation.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HiringManagerDashboard;