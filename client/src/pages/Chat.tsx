import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    if (user.credits < 1) {
      alert("Insufficient credits!");
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/chat', {
        messages: [...messages, userMessage],
        model: 'provider-8/gpt-oss-20b'
      });

      const botMessage: Message = { 
        role: 'assistant', 
        content: response.data.choices[0].message.content 
      };
      setMessages(prev => [...prev, botMessage]);
      refreshProfile(); // Update credits
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Veronika AI</h1>
        <p className="text-slate-400 mb-8 max-w-md">Experience the next generation of AI conversation. Sign up now to get started with 100 free credits.</p>
        <button onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105">
          Start Generating
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 mb-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Bot size={48} className="mb-4 opacity-50" />
            <p>Start a conversation with Veronika AI</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
            )}
            <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <UserIcon size={18} />
              </div>
            )}
          </div>
        ))}
        {loading && (
           <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
               <Bot size={18} />
             </div>
             <div className="bg-slate-800 rounded-2xl px-4 py-2 text-slate-400 flex items-center gap-1">
               <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};