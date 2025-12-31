import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { translations, Language } from '../i18n/translations';

interface User {
  id: number;
  name: string;
  email: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/profile');
      setUser(res.data);
    } catch (error) {
      console.error("Failed to refresh profile", error);
      logout();
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations['en'][key];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshProfile, loading, language, setLanguage, t }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};