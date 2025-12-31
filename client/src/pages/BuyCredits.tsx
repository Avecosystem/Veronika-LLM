import React, { useState, useEffect } from 'react';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: number;
  amount: number;
  credits: number;
  utr_number: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const BuyCredits: React.FC = () => {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'plans' | 'history'>('plans');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/payment/history');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handlePaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/api/payment/request', {
        amount: Number(amount),
        utr_number: utr
      });
      setSuccess('Payment request submitted successfully! Credits will be added after verification.');
      setAmount('');
      setUtr('');
      fetchHistory();
      refreshProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit payment request');
    } finally {
      setLoading(false);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-gray-100">
      {/* Sidebar - Desktop (Consistent with Settings) */}
      <aside className="hidden md:flex flex-col w-72 h-full border-r border-border-dark bg-gray-900 dark:bg-sidebar-dark">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark/50 border border-border-dark mb-6 hover:bg-surface-dark cursor-pointer transition-colors">
            <div className="flex items-center justify-center rounded-full size-12 shrink-0 border border-border-dark bg-indigo-500 text-white font-bold text-xl">
              {userInitial}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-white text-sm font-semibold leading-tight truncate">{user?.name}</h1>
              <p className="text-gray-400 text-xs font-normal leading-normal truncate">Credits: {user?.credits}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-surface-dark hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
              <span className="text-sm font-medium">Upgrade Plans</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-surface-dark hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span className="text-sm font-medium">Transaction History</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-surface-dark hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-surface-dark hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-sm font-medium">Back to Chat</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border-dark">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-surface-dark hover:text-white transition-colors w-full text-left"
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
            <button className="text-gray-400" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-white font-bold text-lg">Upgrade</h1>
          </div>
          <div className="size-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            {userInitial}
          </div>
        </header>

        <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-12">

          {activeTab === 'plans' && (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-white text-4xl font-extrabold tracking-tight">Upgrade your plan</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">Get more credits, faster processing, and exclusive access to premium models.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Plan */}
                <div className="rounded-2xl border border-white/10 bg-surface-dark p-8 flex flex-col gap-6 hover:border-primary/50 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-white">Starter</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold text-white">₹99</span>
                      <span className="ml-1 text-gray-400">/mo</span>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm">Perfect for getting started with AI.</p>
                  </div>
                  <ul className="space-y-3 flex-1">
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-green-400 text-[20px]">check</span>
                      100 Credits
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-green-400 text-[20px]">check</span>
                      Standard Speed
                    </li>
                  </ul>
                  <button className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                    Choose Starter
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="relative rounded-2xl border-2 border-primary bg-surface-dark p-8 flex flex-col gap-6 shadow-xl shadow-primary/10 scale-105">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-black text-xs font-bold rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Professional</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold text-white">₹499</span>
                      <span className="ml-1 text-gray-400">/mo</span>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm">For power users who need more.</p>
                  </div>
                  <ul className="space-y-3 flex-1">
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                      600 Credits
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                      Fast Speed
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                      Priority Support
                    </li>
                  </ul>
                  <button className="w-full py-3 rounded-lg bg-primary hover:bg-[#0fb3d4] text-black font-bold transition-colors">
                    Choose Professional
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="rounded-2xl border border-white/10 bg-surface-dark p-8 flex flex-col gap-6 hover:border-primary/50 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-white">Enterprise</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold text-white">₹999</span>
                      <span className="ml-1 text-gray-400">/mo</span>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm">Maximum power and flexibility.</p>
                  </div>
                  <ul className="space-y-3 flex-1">
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-green-400 text-[20px]">check</span>
                      1500 Credits
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="material-symbols-outlined text-green-400 text-[20px]">check</span>
                      Ultra Fast Speed
                    </li>
                  </ul>
                  <button className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                    Choose Enterprise
                  </button>
                </div>
              </div>

              {/* Manual Payment Section */}
              <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Manual Payment (UPI)
                </h3>
                <div className="flex flex-col gap-6">
                  <div className="p-4 bg-background-dark/50 rounded-xl border border-white/5">
                    <p className="text-sm text-gray-400 mb-2">Scan QR Code or pay to VPA:</p>
                    <p className="text-white font-mono text-lg select-all">veronika@upi</p>
                  </div>

                  <form onSubmit={handlePaymentRequest} className="flex flex-col gap-4">
                    {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
                    {success && <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm">{success}</div>}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Amount (₹)</label>
                        <input
                          type="number"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                          placeholder="e.g. 499"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">UTR Number</label>
                        <input
                          type="text"
                          required
                          value={utr}
                          onChange={(e) => setUtr(e.target.value)}
                          className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                          placeholder="12-digit UTR"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-[#0fb3d4] text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {loading ? 'Submitting...' : 'Submit Payment Details'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-white text-3xl font-bold">Transaction History</h2>
                <p className="text-gray-400 mt-2">View your past purchases and credit requests.</p>
              </div>

              <div className="bg-surface-dark border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Credits</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">UTR</th>
                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">No transactions found.</td>
                        </tr>
                      ) : (
                        history.map((tx) => (
                          <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-gray-300 text-sm whitespace-nowrap">{new Date(tx.created_at).toLocaleDateString()}</td>
                            <td className="p-4 text-white font-medium text-sm">₹{tx.amount}</td>
                            <td className="p-4 text-gray-300 text-sm">{tx.credits}</td>
                            <td className="p-4 text-gray-400 text-sm font-mono">{tx.utr_number}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                          ${tx.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                  tx.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
