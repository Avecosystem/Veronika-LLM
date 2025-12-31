import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user, language, setLanguage, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'profile' | 'admin' | 'subscription'>('general');
  const [theme, setTheme] = useState<'system' | 'dark' | 'light'>('dark');

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-text-main">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-full border-r border-border-dark bg-gray-900 dark:bg-sidebar-dark">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark/50 border border-border-dark mb-6 hover:bg-surface-dark cursor-pointer transition-colors">
            <div className="flex items-center justify-center rounded-full size-12 shrink-0 border border-border-dark bg-indigo-500 text-white font-bold text-xl">
              {userInitial}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-white text-sm font-semibold leading-tight truncate">{user?.name}</h1>
              <p className="text-text-secondary text-xs font-normal leading-normal truncate">{user?.role === 'admin' ? 'Administrator' : 'Pro Plan Member'}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-dark hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">General</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-dark hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span className="text-sm font-medium">Profile</span>
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-dark hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span className="text-sm font-medium">Admin Dashboard</span>
              </button>
            )}
            <button
              onClick={() => navigate('/buy-credits')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-dark hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span className="text-sm font-medium">Manage Subscription</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-dark hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-sm font-medium">Back to Chat</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border-dark">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-dark hover:text-white transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-dark">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border-dark bg-background-dark sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="text-text-secondary" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-white font-bold text-lg">Settings</h1>
          </div>
          <div className="size-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            {userInitial}
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-12">
          {activeTab === 'general' && (
            <>
              <div className="mb-10">
                <h2 className="text-white text-3xl font-bold leading-tight mb-2">General Settings</h2>
                <p className="text-text-secondary text-base">Manage your application preferences, appearance, and API configurations.</p>
              </div>

              <div className="space-y-10">
                <section className="border-b border-border-dark pb-10">
                  <h3 className="text-white text-lg font-bold mb-4">Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Theme Preference</label>
                      <div className="flex gap-3">
                        {['system', 'dark', 'light'].map((t) => (
                          <label key={t} className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="theme"
                              className="peer sr-only"
                              checked={theme === t}
                              onChange={() => setTheme(t as any)}
                            />
                            <div className="h-12 flex items-center justify-center rounded-lg border border-border-dark bg-surface-dark text-white text-sm font-medium transition-all peer-checked:border-primary peer-checked:text-primary peer-checked:ring-1 peer-checked:ring-primary hover:border-gray-500 hover:bg-gray-600 capitalize">
                              {t}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Primary Language</label>
                      <div className="relative">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value as any)}
                          className="w-full appearance-none h-12 bg-surface-dark border border-border-dark text-white text-sm rounded-lg px-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                          <option value="en">English (US)</option>
                          <option value="hi">Hindi</option>
                          <option value="zh">Chinese</option>
                          <option value="ru">Russian</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
                          <span className="material-symbols-outlined">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div className="flex justify-end gap-3 pt-6 pb-20">
                  <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-white bg-transparent hover:bg-surface-dark transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-primary hover:bg-[#1a7f64] transition-colors shadow-lg shadow-primary/20">
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <div className="mb-10">
                <h2 className="text-white text-3xl font-bold leading-tight mb-2">Profile Settings</h2>
                <p className="text-text-secondary text-base">Manage your personal information and security.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.name}
                    readOnly
                    className="w-full h-12 bg-surface-dark border border-border-dark rounded-lg px-4 text-white focus:outline-none focus:border-primary cursor-not-allowed opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email}
                    readOnly
                    className="w-full h-12 bg-surface-dark border border-border-dark rounded-lg px-4 text-white focus:outline-none focus:border-primary cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
