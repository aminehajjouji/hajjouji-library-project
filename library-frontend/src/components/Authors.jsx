import { useState, useEffect } from 'react';
import { authorsAPI } from '../services/api';
import AuthorForm from './AuthorForm';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    filterAuthors();
  }, [authors, searchTerm]);

  const loadAuthors = async () => {
    try {
      const data = await authorsAPI.getAll();
      setAuthors(data);
    } catch (error) {
      console.error('Error loading authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAuthors = () => {
    if (!searchTerm) {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter(author =>
        `${author.firstName} ${author.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (author.biography && author.biography.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAuthors(filtered);
    }
  };

  const handleAdd = () => {
    setEditingAuthor(null);
    setShowForm(true);
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await authorsAPI.delete(id);
        await loadAuthors();
      } catch (error) {
        console.error('Error deleting author:', error);
        alert('Error deleting author. The author may have books associated with them.');
      }
    }
  };

  const handleFormSubmit = async (authorData) => {
    try {
      if (editingAuthor) {
        await authorsAPI.update(editingAuthor.id, authorData);
      } else {
        await authorsAPI.create(authorData);
      }
      setShowForm(false);
      setEditingAuthor(null);
      await loadAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAuthor(null);
  };

  if (loading) {
    return <div className="loading">Loading authors...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Authors Management</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add New Author
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search authors by name or biography..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        {filteredAuthors.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Birth Year</th>
                <th>Books Count</th>
                <th>Biography</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map(author => (
                <tr key={author.id}>
                  <td>
                    <strong>{author.firstName} {author.lastName}</strong>
                  </td>
                  <td>
                    {author.birthYear || (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>Not specified</span>
                    )}
                  </td>
                  <td>
                    <span style={{ 
                      backgroundColor: author.bookCount > 0 ? '#e5f7e5' : '#f5f5f5',
                      color: author.bookCount > 0 ? '#059669' : '#666',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {author.bookCount} book{author.bookCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    {author.biography ? (
                      author.biography.length > 100 
                        ? `${author.biography.substring(0, 100)}...`
                        : author.biography
                    ) : (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>No biography</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(author)}
                        className="btn btn-secondary btn-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="btn btn-danger btn-small"
                        disabled={author.bookCount > 0}
                        title={author.bookCount > 0 ? 'Cannot delete author with books' : 'Delete author'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            {searchTerm ? 'No authors found matching your search.' : 'No authors available.'}
          </p>
        )}
      </div>

      {showForm && (
        <AuthorForm
          author={editingAuthor}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Authors;

