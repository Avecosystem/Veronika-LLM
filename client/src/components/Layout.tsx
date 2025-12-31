import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  Plus, 
  CreditCard, 
  Shield
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide sidebar on auth pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label, active }: any) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active 
          ? 'bg-blue-600/10 text-blue-400' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <MessageSquare className="text-blue-500" />
              VERONIKA
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* New Chat Button */}
          <button 
            onClick={() => {
              navigate('/');
              window.location.reload(); 
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold mb-6 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 uppercase px-4 mb-2">Menu</div>
            <NavItem 
              to="/" 
              icon={MessageSquare} 
              label="Chat" 
              active={location.pathname === '/'} 
            />
            <NavItem 
              to="/settings" 
              icon={Settings} 
              label="Settings" 
              active={location.pathname === '/settings'} 
            />
            <NavItem 
              to="/buy-credits" 
              icon={CreditCard} 
              label="Subscription" 
              active={location.pathname === '/buy-credits'} 
            />
            
            {user?.role === 'admin' && (
              <>
                <div className="text-xs font-bold text-slate-500 uppercase px-4 mt-6 mb-2">Admin</div>
                <NavItem 
                  to="/admin" 
                  icon={Shield} 
                  label="Dashboard" 
                  active={location.pathname === '/admin'} 
                />
              </>
            )}
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            {user ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-white">{user.name}</div>
                  <div className="text-xs text-blue-400 font-medium">{user.credits} Credits</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
               <Link to="/login" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl transition-colors font-medium">
                 Login
               </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex-shrink-0 h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur-md z-30">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            VERONIKA
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};