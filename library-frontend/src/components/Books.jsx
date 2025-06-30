import { useState, useEffect } from 'react';
import { booksAPI, authorsAPI } from '../services/api';
import BookForm from './BookForm';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchTerm]);

  const loadData = async () => {
    try {
      const [booksData, authorsData] = await Promise.all([
        booksAPI.getAll(),
        authorsAPI.getAll()
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
      );
      setFilteredBooks(filtered);
    }
  };

  const handleAdd = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book');
      }
    }
  };

  const handleFormSubmit = async (bookData) => {
    try {
      if (editingBook) {
        await booksAPI.update(editingBook.id, bookData);
      } else {
        await booksAPI.create(bookData);
      }
      setShowForm(false);
      setEditingBook(null);
      await loadData();
    } catch (error) {
      console.error('Error saving book:', error);
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Books Management</h1>
        <button onClick={handleAdd} className="btn btn-primary">
          Add New Book
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search books by title, author, or ISBN..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        {filteredBooks.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Year</th>
                <th>Available/Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.authorName}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.availableCopies}/{book.totalCopies}</td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(book)}
                        className="btn btn-secondary btn-small"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="btn btn-danger btn-small"
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
            {searchTerm ? 'No books found matching your search.' : 'No books available.'}
          </p>
        )}
      </div>

      {showForm && (
        <BookForm
          book={editingBook}
          authors={authors}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Books;

