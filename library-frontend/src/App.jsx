import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import Authors from './components/Authors';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navbar />
                <div className="container">
                  <Dashboard />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/books" element={
              <ProtectedRoute>
                <Navbar />
                <div className="container">
                  <Books />
                </div>
              </ProtectedRoute>
            } />
            <Route path="/authors" element={
              <ProtectedRoute>
                <Navbar />
                <div className="container">
                  <Authors />
                </div>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

