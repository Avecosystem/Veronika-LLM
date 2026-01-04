import React, { useState, useRef, useEffect } from 'react';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { defaultModel } from '../config/models';
import { 
  Bot, 
  User as UserIcon, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Code, 
  Palette, 
  FlaskConical, 
  Sparkles 
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();

    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const textToSend = promptText || input;
    if (!textToSend.trim()) return;

    if (user.credits < 1) {
      alert("Insufficient credits! Please upgrade.");
      navigate('/buy-credits');
      return;
    }

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat', {
        messages: [...messages, userMessage],
        model: defaultModel
      });

      const botMessage: Message = {
        role: 'assistant',
        content: response.data.choices[0].message.content
      };
      setMessages(prev => [...prev, botMessage]);
      refreshProfile();
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please check your connection or try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const SuggestionCard = ({ icon: Icon, title, subtitle, prompt }: { icon: any, title: string, subtitle: string, prompt: string }) => (
    <button
      onClick={() => handleSubmit(undefined, prompt)}
      className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left hover:bg-slate-800 hover:border-slate-700 transition-all group h-full shadow-lg shadow-black/20"
    >
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors text-blue-400">
        <Icon size={24} />
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-slate-200 text-base font-bold leading-tight">{title}</h2>
        <p className="text-slate-400 text-xs opacity-70">{subtitle}</p>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full relative bg-slate-950">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 flex flex-col gap-6 pb-40 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full mt-10 md:mt-20">
            <div className="w-full max-w-4xl flex flex-col gap-12 items-center">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-2">
                  <Bot size={40} className="text-white" />
                </div>
                <h1 className="text-slate-100 text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  How can I help you today?
                </h1>
                <p className="text-slate-400 text-lg font-normal max-w-xl">
                  I'm Veronika, your advanced AI assistant. Ready to help with code, analysis, creativity, and more.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4 md:px-0">
                <SuggestionCard 
                  icon={FlaskConical} 
                  title="Explain Science" 
                  subtitle="Quantum computing simply" 
                  prompt="Explain quantum computing in simple terms for a beginner" 
                />
                <SuggestionCard 
                  icon={Code} 
                  title="Write Code" 
                  subtitle="Python script for scraping" 
                  prompt="Write a Python script to scrape a news website" 
                />
                <SuggestionCard 
                  icon={Sparkles} 
                  title="Creative Writing" 
                  subtitle="A futuristic city story" 
                  prompt="Write a short story about a futuristic city with flying cars" 
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 md:px-4 py-6 ${msg.role === 'assistant' ? 'bg-slate-900/30 rounded-2xl' : ''}`}>
                <div className="flex-shrink-0">
                  {msg.role === 'assistant' ? (
                    <div className="flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl size-8 shadow-lg shadow-blue-900/20">
                      <Bot size={18} className="text-white" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl size-8 bg-slate-700 text-white font-bold text-xs">
                      {userInitial}
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-200">{msg.role === 'assistant' ? 'Veronika' : 'You'}</p>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-300 text-[15px] leading-7 whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4 md:px-4 py-6 bg-slate-900/30 rounded-2xl">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl size-8 animate-pulse">
                    <Bot size={18} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col flex-1 gap-2 min-w-0 mt-1">
                  <span className="text-slate-400 text-sm animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pt-12 pb-6 px-4 z-20">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={(e) => handleSubmit(e)} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all overflow-hidden flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 p-4 pl-4 focus:ring-0 resize-none min-h-[52px] max-h-[200px] leading-6 custom-scrollbar"
              placeholder="Message Veronika..."
              rows={1}
              style={{ height: 'auto', minHeight: '52px' }}
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-1">
                {/* Attachments placeholder */}
                <button type="button" className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors" title="Upload Image">
                  <ImageIcon size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors" title="Use voice">
                  <Mic size={20} />
                </button>
                <button
                  disabled={loading || !input.trim()}
                  type="submit"
                  className="p-2 rounded-xl bg-blue-600 disabled:bg-slate-800 text-white hover:bg-blue-500 transition-colors disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-slate-500">
              Veronika can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};