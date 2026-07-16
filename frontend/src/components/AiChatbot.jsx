import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const GREEN = '#4A7C59';
const GOLD = '#C9A227';
const INK = '#0F172A';
const MIST = '#64748B';

const quickReplies = [
  'Find jobs that match my skills',
  'How does AI matching work?',
  'Help me improve my resume',
];

const initialMessage = {
  id: 'greeting',
  from: 'bot',
  text: "Hi, I'm the JobMart assistant. Ask me about roles, your match score, or how to strengthen your profile.",
};

/* -------------------------------------------------------------------
   Placeholder response logic. Replace `getBotReply` with a call to
   your backend's AI endpoint (the same one used for resume headline /
   cover letter generation) — see the wiring note at the bottom.
------------------------------------------------------------------- */
const getBotReply = async (userText) => {
  const text = userText.toLowerCase();
  await new Promise((res) => setTimeout(res, 700 + Math.random() * 500));

  if (text.includes('match') || text.includes('score')) {
    return "Your match score compares your parsed skills against a role's requirements — 90%+ means a near-exact fit. Want me to pull your top matches?";
  }
  if (text.includes('resume') || text.includes('cv')) {
    return 'I can help tighten your resume headline and summary from the Dashboard → AI tab. Want me to take you there?';
  }
  if (text.includes('job') || text.includes('role')) {
    return "There are 12,500+ live roles right now. Tell me a title or skill and I'll point you to the closest matches.";
  }
  return "I can help with job matches, resume feedback, or how the platform works — what would be most useful?";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    const reply = await getBotReply(trimmed);
    setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }]);
    setIsTyping(false);
  };

  return (
    <>
      <style>{`
        @keyframes jm-chat-in { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes jm-dot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
        @keyframes jm-ring { 0% { box-shadow: 0 0 0 0 rgba(74,124,89,0.35); } 100% { box-shadow: 0 0 0 14px rgba(74,124,89,0); } }
      `}</style>

      {/* Floating panel */}
      {open && (
        <div
          role="dialog"
          aria-label="JobMart AI assistant"
          className="fixed bottom-24 right-6 z-50 flex flex-col"
          style={{
            width: 360, maxWidth: 'calc(100vw - 32px)', height: 480,
            background: '#fff', borderRadius: 20, overflow: 'hidden',
            border: '1px solid #E2E8F0', boxShadow: '0 24px 60px -20px rgba(15,23,42,0.35)',
            animation: 'jm-chat-in 0.25s ease',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ background: INK }}>
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center"
                style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${GREEN}, #2F5B3F)` }}
              >
                <Sparkles size={15} color="#fff" />
              </div>
              <div>
                <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: '#fff' }}>
                  JobMart Assistant
                </p>
                <p style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, animation: 'jm-pulse 1.6s ease-in-out infinite' }} />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ color: '#94A3B8' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: '#F8FAF9' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  background: m.from === 'user' ? GREEN : '#fff',
                  color: m.from === 'user' ? '#fff' : INK,
                  border: m.from === 'user' ? 'none' : '1px solid #E2E8F0',
                  borderRadius: m.from === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '10px 14px',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start', background: '#fff', border: '1px solid #E2E8F0',
                  borderRadius: '14px 14px 14px 2px', padding: '12px 16px', display: 'flex', gap: 4,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6, height: 6, borderRadius: '50%', background: MIST,
                      animation: `jm-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Quick replies — only before the conversation has started */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-col gap-2 mt-1">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left"
                    style={{
                      fontSize: 13, fontWeight: 500, color: GREEN, background: 'rgba(74,124,89,0.08)',
                      border: '1px solid rgba(74,124,89,0.2)', borderRadius: 12, padding: '9px 12px',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center gap-2 p-3"
            style={{ borderTop: '1px solid #E2E8F0', background: '#fff' }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jobs, matches, your resume..."
              className="flex-1 outline-none text-sm px-3 py-2 rounded-xl"
              style={{ background: '#F1F5F9' }}
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={!input.trim()}
              className="flex items-center justify-center"
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: input.trim() ? GREEN : '#CBD5E1', color: '#fff',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${GREEN}, #2F5B3F)`,
          boxShadow: '0 12px 28px -8px rgba(15,23,42,0.4)',
          animation: open ? 'none' : 'jm-ring 2.2s ease-out infinite',
        }}
      >
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
      </button>
    </>
  );
};

export default ChatBot;
