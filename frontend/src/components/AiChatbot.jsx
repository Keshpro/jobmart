import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your JobMart AI Career Coach. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Connecting to your .NET Backend API
      const response = await axios.post('http://localhost:5183/api/AiIntegration/career-coach', {
        message: userMessage.text
      });

      const botMessage = { role: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-green text-white p-4 rounded-full shadow-2xl hover:bg-brand-dark hover:scale-110 transition-all duration-300"
        >
          <MessageCircle className="h-8 w-8" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-brand-green text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <h3 className="font-bold text-lg">AI Career Coach</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-200 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${msg.role === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 p-3 rounded-lg rounded-bl-none text-sm animate-pulse shadow-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask for career advice..."
              className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-brand-green text-white p-2 rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;