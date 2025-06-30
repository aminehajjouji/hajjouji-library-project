import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          Library Management
        </div>
        
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/books" 
              className={`nav-link ${isActive('/books') ? 'active' : ''}`}
            >
              Books
            </Link>
          </li>
          <li>
            <Link 
              to="/authors" 
              className={`nav-link ${isActive('/authors') ? 'active' : ''}`}
            >
              Authors
            </Link>
          </li>
        </ul>

        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Welcome, {user?.firstName || user?.username}
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary btn-small"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

