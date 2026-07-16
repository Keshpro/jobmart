import { useState } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am JobMart AI. Need help finding a job or perfecting your resume?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    // Meheta thamai backend eke chat API eka connect karanne
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-green text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in duration-300">
          <div className="bg-brand-green p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold"><Bot /> JobMart AI</div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm p-2 rounded-lg ${m.role === 'user' ? 'bg-brand-green text-white ml-auto w-fit' : 'bg-white border w-fit'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-2 text-sm outline-none" 
              placeholder="Ask anything..."
            />
            <button onClick={handleSend} className="text-brand-green"><Send size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;