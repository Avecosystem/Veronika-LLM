import React, { useEffect, useState } from 'react';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Search, Edit, Trash2, Check, X } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
  createdAt: string;
}

interface PaymentRequest {
  id: string;
  user: { name: string; email: string };
  amount: number;
  utr: string;
  status: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchPayments();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get('/api/payment/pending');
      setPayments(res.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handlePaymentStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.put(`/api/payment/${id}/status`, { status });
      setPayments(payments.filter(p => p.id !== id));
      if (status === 'APPROVED') fetchUsers(); // Refresh users to show updated credits
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleUpdateCredits = async (id: string) => {
    try {
      await api.put(`/api/admin/users/${id}/credits`, { credits: editCredits });
      setUsers(users.map(u => u.id === id ? { ...u, credits: editCredits } : u));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[50vh] text-center">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-slate-400">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          Pending Payments ({payments.length})
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Credits</th>
                  <th className="p-4">Join Date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-900 text-purple-200' : 'bg-slate-700 text-slate-300'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      {editingId === u.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={editCredits} 
                            onChange={(e) => setEditCredits(parseInt(e.target.value))}
                            className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 focus:border-blue-500 outline-none"
                          />
                          <button onClick={() => handleUpdateCredits(u.id)} className="text-green-500 hover:text-green-400"><Check size={18} /></button>
                          <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400"><X size={18} /></button>
                        </div>
                      ) : (
                        <span>{u.credits}</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => { setEditingId(u.id); setEditCredits(u.credits); }}
                        className="p-2 hover:bg-blue-900/30 text-blue-400 rounded-lg transition-colors"
                        title="Edit Credits"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={u.role === 'admin'}
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">UTR Code</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No pending payments</td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{p.user.name}</div>
                      <div className="text-xs text-slate-400">{p.user.email}</div>
                    </td>
                    <td className="p-4 font-bold text-green-400">+{p.amount}</td>
                    <td className="p-4 font-mono text-slate-300">{p.utr}</td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => handlePaymentStatus(p.id, 'APPROVED')}
                        className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg transition-colors text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handlePaymentStatus(p.id, 'REJECTED')}
                        className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors text-sm font-medium"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
