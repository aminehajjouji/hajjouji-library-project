import { useState, useEffect } from 'react';
import { booksAPI, authorsAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    availableBooks: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [books, authors] = await Promise.all([
        booksAPI.getAll(),
        authorsAPI.getAll()
      ]);

      const availableBooks = books.filter(book => book.availableCopies > 0).length;
      
      setStats({
        totalBooks: books.length,
        totalAuthors: authors.length,
        availableBooks
      });

      setRecentBooks(books.slice(-5).reverse());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="mb-3">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalBooks}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalAuthors}</div>
          <div className="stat-label">Total Authors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.availableBooks}</div>
          <div className="stat-label">Available Books</div>
        </div>
      </div>

      {/* Recent Books */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Books</h2>
        </div>
        
        {recentBooks.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {recentBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.authorName}</td>
                  <td>{book.publicationYear}</td>
                  <td>
                    <span style={{ 
                      color: book.availableCopies > 0 ? '#059669' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
            No books available
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

