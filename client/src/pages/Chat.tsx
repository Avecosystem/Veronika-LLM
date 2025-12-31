import React, { useState, useRef, useEffect } from 'react';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { defaultModel } from '../config/models';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();

    const textToSend = promptText || input;
    if (!textToSend.trim() || !user) return;

    if (user.credits < 1) {
      alert("Insufficient credits!");
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
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const SuggestionCard = ({ icon, title, subtitle, prompt }: { icon: string, title: string, subtitle: string, prompt: string }) => (
    <button
      onClick={() => handleSubmit(undefined, prompt)}
      className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-surface-dark p-5 text-left hover:bg-surface-dark-highlight hover:border-white/10 transition-all group h-full"
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-background-dark transition-colors">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-white text-base font-bold leading-tight">{title}</h2>
        <p className="text-text-muted text-xs opacity-70">{subtitle}</p>
      </div>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-gray-100 selection:bg-primary/30">

      {/* Sidebar */}
      <aside className={`flex-col w-[260px] bg-sidebar-dark border-r border-white/10 ${sidebarOpen ? 'flex absolute inset-y-0 left-0 z-50' : 'hidden md:flex'} flex-shrink-0 transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-3 gap-3">
          <div className="flex items-center gap-2 px-2 py-2 mb-2 md:hidden">
            <span className="text-white font-bold ml-auto cursor-pointer" onClick={() => setSidebarOpen(false)}>Close</span>
          </div>

          <button
            onClick={() => { setMessages([]); setInput(''); }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg h-10 px-3 bg-primary hover:bg-[#0fb3d4] text-black transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="material-symbols-outlined text-black group-hover:scale-110 transition-transform text-[20px]">add</span>
              <span className="text-sm font-semibold leading-normal truncate">New Chat</span>
            </div>
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 pt-2">
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left group">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">image</span>
                <span className="text-gray-300 text-sm font-medium leading-normal truncate flex-1">Create Image</span>
              </button>
              <button
                onClick={() => navigate('/buy-credits')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
              >
                <span className="material-symbols-outlined text-gray-400 text-[18px]">workspace_premium</span>
                <span className="text-gray-300 text-sm font-medium leading-normal truncate flex-1">Upgrade ({user?.credits})</span>
              </button>
            </div>
          </div>

          <div className="pt-2 mt-auto border-t border-white/10 flex flex-col gap-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left w-full cursor-pointer">
              <div className="flex items-center justify-center rounded-full size-6 ring-2 ring-white/10 bg-indigo-500 text-xs font-bold text-white">
                {userInitial}
              </div>
              <span className="text-white text-sm font-medium leading-normal truncate">{user?.name}</span>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left w-full"
            >
              <span className="material-symbols-outlined text-white text-[20px]">settings</span>
              <span className="text-white text-sm font-medium leading-normal">Settings</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left w-full"
            >
              <span className="material-symbols-outlined text-white text-[20px]">logout</span>
              <span className="text-white text-sm font-medium leading-normal">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-background-light dark:bg-background-dark relative">
        <header className="flex-none flex items-center justify-between border-b border-gray-200 dark:border-white/5 px-4 py-3 bg-white/50 dark:bg-background-dark/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-300 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex items-center gap-2 text-slate-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors">
              <span className="text-lg font-bold leading-tight tracking-[-0.015em]">VERONIKA</span>
              <span className="material-symbols-outlined text-sm text-gray-500">expand_more</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full max-w-[900px] mx-auto p-4 flex flex-col gap-6 pb-40">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full mt-20">
              <div className="w-full max-w-4xl flex flex-col gap-12 items-center">
                <div className="flex flex-col items-center text-center gap-4">
                  <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    How can I help you today?
                  </h1>
                  <p className="text-text-muted text-lg font-normal max-w-xl opacity-80">
                    I'm your AI assistant, ready to help with code, writing, analysis, and more.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4 md:px-0">
                  <SuggestionCard icon="science" title="Explain quantum computing" subtitle="in simple terms for a beginner" prompt="Explain quantum computing in simple terms for a beginner" />
                  <SuggestionCard icon="code" title="Write a Python script" subtitle="to scrape a news website" prompt="Write a Python script to scrape a news website" />
                  <SuggestionCard icon="palette" title="Create Images" subtitle="by veronikaextra" prompt="Create an image of a futuristic city" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className="group flex gap-4 md:px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex-shrink-0">
                    {msg.role === 'assistant' ? (
                      <div className="flex items-center justify-center bg-[#10a37f] rounded-full size-8 mt-1">
                        <span className="material-symbols-outlined text-white text-[18px]">smart_toy</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-full size-8 mt-1 border border-gray-200 dark:border-white/10 bg-indigo-500 text-white font-bold text-xs">
                        {userInitial}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 gap-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-gray-100">{msg.role === 'assistant' ? 'VERONIKA' : 'You'}</p>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-gray-200 text-[15px] leading-7 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="group flex gap-4 md:px-4 py-2">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center bg-[#10a37f] rounded-full size-8 mt-1">
                      <span className="material-symbols-outlined text-white text-[18px]">smart_toy</span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-2 min-w-0 mt-2">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background-light via-background-light/90 to-transparent dark:from-background-dark dark:via-background-dark/95 dark:to-transparent pt-12 pb-6 px-4 z-20">
          <div className="max-w-[800px] mx-auto relative">
            <form onSubmit={(e) => handleSubmit(e)} className="bg-white dark:bg-[#27272a] border border-gray-300 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-black/20 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all overflow-hidden flex flex-col">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-gray-500 p-3 pl-4 focus:ring-0 resize-none min-h-[52px] max-h-[200px] leading-6"
                placeholder="Message VERONIKA..."
                rows={1}
                style={{ height: '52px' }}
              />
              <div className="flex items-center justify-between px-2 pb-2">
                <div className="flex items-center gap-1">
                  {/* Attachments buttons if needed */}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Use voice">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                  <button
                    disabled={loading || !input.trim()}
                    type="submit"
                    className="p-1.5 rounded-lg bg-primary disabled:bg-gray-300 dark:disabled:bg-gray-700 text-black hover:bg-[#0ebbdc] transition-colors disabled:cursor-not-allowed shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px] font-bold">arrow_upward</span>
                  </button>
                </div>
              </div>
            </form>
            <div className="text-center mt-2">
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                AI can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
