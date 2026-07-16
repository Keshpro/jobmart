import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5183/api';

const Home = () => {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Career Coach. How can I guide your professional journey today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loadingBot, setLoadingBot] = useState(false);

  const sendMessageToAi = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setLoadingBot(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/AiIntegration/career-coach`, { message: userMsg.text });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Cognitive synchronization timeout. Try again.' }]);
    } finally {
      setLoadingBot(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased flex flex-col justify-between">
      
      <div className="max-w-screen-xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
        <div className="space-y-6">
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#4A7C59] bg-[#4A7C59]/10 rounded-full border border-[#4A7C59]/20">
            Next-Gen AI Recruitment Ecosystem
          </span>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Connecting Talent with <span className="text-[#4A7C59]">Cognitive Match-Making</span> Technology.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            JobMart utilizes real-time semantic analysis to filter candidates, calculate compatibility metrics, and prepare high-performing corporate pipelines automatically.
          </p>
          <div className="pt-4 flex gap-4">
            <a href="/login" className="px-6 py-3 text-xs font-bold text-white bg-[#4A7C59] hover:bg-[#3d664a] rounded-xl shadow-md transition">
              Get Started Now
            </a>
            <button onClick={() => setIsBotOpen(true)} className="px-6 py-3 text-xs font-bold text-[#4A7C59] bg-white border border-[#E2E8F0] hover:bg-gray-50 rounded-xl shadow-xs transition">
              Consult AI Coach
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="w-80 h-96 bg-white border border-[#E2E8F0] rounded-3xl shadow-lg p-6 space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-mono font-black uppercase text-slate-400">Telemetry Engine Live</span>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
              <span className="text-[9px] font-mono font-bold text-indigo-600 block">[Gemini Parsing Success]</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">System parsed candidate credentials successfully with 95% vacancy alignment.</p>
            </div>
          </div>
          <div className="absolute top-8 left-8 w-80 h-96 bg-[#4A7C59]/10 rounded-3xl border border-[#4A7C59]/20 -rotate-6"></div>
        </div>
      </div>

      {/* ─── 🤖 FLOATING CHATBOT WIDGET ─── */}
      <div className="fixed bottom-6 right-6 z-50">
        
        {!isBotOpen && (
          <button 
            onClick={() => setIsBotOpen(true)}
            className="w-14 h-14 bg-[#4A7C59] hover:bg-[#3d664a] text-white rounded-full flex items-center justify-center shadow-xl transition transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}

        {isBotOpen && (
          <div className="w-80 sm:w-96 h-[450px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in">
            
            <div className="bg-[#4A7C59] p-4 text-white flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">JobMart AI Assistant</h4>
                <p className="text-[9px] text-emerald-100 mt-0.5">Automated HR Career Advisor</p>
              </div>
              <button onClick={() => setIsBotOpen(false)} className="text-white hover:text-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-[#4A7C59] text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none shadow-2xs'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loadingBot && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-2xs text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#4A7C59] rounded-full animate-bounce"></div>
                    Coach is compiling response...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessageToAi} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Ask about careers, CVs, salaries..."
                className="flex-grow px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl outline-none focus:border-[#4A7C59] focus:bg-white"
              />
              <button type="submit" className="px-4 py-2 bg-[#4A7C59] hover:bg-[#3d664a] text-white text-xs font-bold rounded-xl shadow-xs transition">
                Send
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default Home;