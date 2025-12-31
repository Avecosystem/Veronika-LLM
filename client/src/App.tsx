import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Chat } from './pages/Chat';
import { AdminDashboard } from './pages/AdminDashboard';
import { BuyCredits } from './pages/BuyCredits';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/buy-credits" element={<BuyCredits />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;