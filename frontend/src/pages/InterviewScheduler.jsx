import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5183/api';

const InterviewScheduler = ({ candidateId = 1, candidateName = "Selected Candidate" }) => {
  const [schedule, setSchedule] = useState({ date: '', time: '', platform: 'Google Meet' });
  const [status, setStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus(null);

    try {
      // Create a unified ISO datetime string for the backend
      const dateTimeString = new Date(`${schedule.date}T${schedule.time}`).toISOString();
      
      const response = await axios.post(`${API_BASE_URL}/Interview/schedule`, {
        candidateId: candidateId,
        interviewDate: dateTimeString,
        platform: schedule.platform
      });

      setStatus({
        type: 'success',
        msg: response.data.message,
        calendarUrl: response.data.calendarUrl,
        log: response.data.systemLog
      });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        msg: 'Pipeline error: Failed to sync with external calendar providers.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-sm max-w-lg">
      <div className="mb-5 border-b border-gray-100 pb-4">
        <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Schedule Interview</h3>
        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">For: {candidateName}</p>
      </div>

      <form onSubmit={handleScheduleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5">Date</label>
            <input 
              type="date" 
              required
              value={schedule.date}
              onChange={(e) => setSchedule({...schedule, date: e.target.value})}
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] focus:bg-white transition text-[#0F172A]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5">Time</label>
            <input 
              type="time" 
              required
              value={schedule.time}
              onChange={(e) => setSchedule({...schedule, time: e.target.value})}
              className="w-full px-3 py-2 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] focus:bg-white transition text-[#0F172A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1.5">Meeting Platform</label>
          <select 
            value={schedule.platform}
            onChange={(e) => setSchedule({...schedule, platform: e.target.value})}
            className="w-full px-3 py-2 text-xs border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl outline-none focus:border-[#4A7C59] cursor-pointer"
          >
            <option value="Google Meet">Google Meet</option>
            <option value="Microsoft Teams">Microsoft Teams</option>
            <option value="Zoom">Zoom</option>
            <option value="In-Person (Office)">In-Person (HQ)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing}
          className="w-full px-4 py-2.5 bg-[#4A7C59] hover:bg-[#3d664a] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
        >
          {isProcessing ? "Synchronizing..." : "Generate Invite & Send Mail"}
        </button>
      </form>

      {status && status.type === 'success' && (
        <div className="mt-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3 animate-fade-in">
          <p className="text-xs font-bold text-emerald-800">{status.msg}</p>
          
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-emerald-600 block">External Calendar Integration:</span>
            <a 
              href={status.calendarUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-[#4A7C59] underline font-medium truncate block"
            >
              Add to Google Calendar 📅
            </a>
          </div>

          <div className="pt-2 border-t border-emerald-200/50">
             <span className="text-[9px] font-mono text-emerald-600 block mb-1">Server Telemetry Log:</span>
             <p className="text-[10px] text-emerald-700 font-mono leading-relaxed bg-white/50 p-2 rounded-lg border border-emerald-100">
               {status.log}
             </p>
          </div>
        </div>
      )}

      {status && status.type === 'error' && (
        <div className="mt-5 p-3 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-xs font-bold text-rose-700">{status.msg}</p>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;