import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Chat } from './pages/Chat';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;