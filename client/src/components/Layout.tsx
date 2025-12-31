import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, MessageSquare, Globe } from 'lucide-react';
import { Language } from '../i18n/translations';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, t, language, setLanguage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <MessageSquare className="text-blue-500" />
            VERONIKA AI
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white flex items-center gap-1">
                <Globe size={20} />
                <span className="uppercase text-xs font-bold">{language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block">
                {(['en', 'hi', 'zh', 'ru'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 ${language === lang ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
                  >
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : lang === 'zh' ? 'Chinese' : 'Russian'}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-slate-400">{user.credits} {t('credits')}</span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white" title={t('logout')}>
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">{t('login')}</Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  {t('getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};