import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'Registration failed. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-white">
      <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 lg:px-10 z-10">
        <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">VERONIKA</div>
        <a className="text-sm font-medium text-text-subtle hover:text-primary transition-colors" href="#">Help</a>
      </header>

      <div className="layout-container flex h-full grow flex-col justify-center items-center py-10 px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10 opacity-50"></div>

        <div className="w-full max-w-[480px] flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">Create your account</h1>
            <p className="text-text-subtle text-base font-normal leading-normal">Join the AI revolution and chat with the smartest assistant.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal" htmlFor="full_name">Full Name</label>
              <div className="relative">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-text-subtle px-4 text-base font-normal leading-normal transition-all"
                  id="full_name"
                  placeholder="e.g. Alex Smith"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal" htmlFor="email">Email Address</label>
              <div className="relative">
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-text-subtle px-4 text-base font-normal leading-normal transition-all"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal" htmlFor="country">Country</label>
              <div className="relative">
                <select
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-text-subtle px-4 pr-10 text-base font-normal leading-normal transition-all appearance-none"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option disabled value="">Select your country</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="au">Australia</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="jp">Japan</option>
                  <option value="in">India</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none flex items-center">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal" htmlFor="password">Password</label>
                <div className="relative group">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-text-subtle px-4 pr-10 text-base font-normal leading-normal transition-all"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-white text-sm font-medium leading-normal" htmlFor="confirm_password">Confirm Password</label>
                <div className="relative">
                  <input
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-12 placeholder:text-text-subtle px-4 pr-10 text-base font-normal leading-normal transition-all"
                    id="confirm_password"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-text-secondary hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center" 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-1">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 rounded border-border-dark text-primary bg-surface-dark focus:ring-primary focus:ring-offset-background-dark" id="terms" type="checkbox" required />
              </div>
              <label className="text-sm text-text-subtle font-normal" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-[#0ebcdb] active:bg-[#0ba5c2] text-background-dark h-12 px-5 text-base font-bold leading-normal transition-colors duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  Sign Up
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-dark"></div>
              <span className="flex-shrink-0 mx-4 text-text-subtle text-xs uppercase font-medium tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-border-dark"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-[#232e31] text-slate-900 dark:text-white h-12 px-4 transition-colors" type="button">
                <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqKUZRcZKkBqSxw4DkwdnllQyF8UPUR8Hg7PB8sVA_VXmW4suo9thvicIvA3IX2-C-Haa8yYe73RPWJkO_tQtN0Ay4mIBCxmotlCdQXjYtThdPdkizJfhCx_NF9L3YBzvYhlqehCLr6l7dv72RfY15Rnq4CydDUSTINLOBsGQZ0A632sF-y7tT_aUU76G5PJzHDMmeuY1ASN5ganO4sxOnMuPJjzhzw84m4R_tKdtZ1O4VYpbljq_qzooR-yY0S7LCW1EwBYjIWw" />
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-[#232e31] text-slate-900 dark:text-white h-12 px-4 transition-colors" type="button">
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-text-subtle text-sm font-normal">
                Already have an account?
                <Link className="text-primary font-medium hover:underline hover:text-[#0ebcdb] transition-colors ml-1" to="/login">Log in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
