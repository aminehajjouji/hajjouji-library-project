import React, { useState, useEffect } from 'react';

const BookForm = ({ book, authors, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    description: '',
    publicationYear: '',
    totalCopies: '',
    availableCopies: '',
    authorId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        isbn: book.isbn || '',
        description: book.description || '',
        publicationYear: book.publicationYear || '',
        totalCopies: book.totalCopies || '',
        availableCopies: book.availableCopies || '',
        authorId: book.authorId || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    }

    if (!formData.authorId) {
      newErrors.authorId = 'Author is required';
    }

    if (!formData.publicationYear) {
      newErrors.publicationYear = 'Publication year is required';
    } else if (formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear()) {
      newErrors.publicationYear = 'Please enter a valid year';
    }

    if (!formData.totalCopies) {
      newErrors.totalCopies = 'Total copies is required';
    } else if (formData.totalCopies < 1) {
      newErrors.totalCopies = 'Total copies must be at least 1';
    }

    if (!formData.availableCopies) {
      newErrors.availableCopies = 'Available copies is required';
    } else if (formData.availableCopies < 0) {
      newErrors.availableCopies = 'Available copies cannot be negative';
    } else if (parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!
      validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        publicationYear: parseInt(formData.publicationYear),
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: parseInt(formData.availableCopies),
        authorId: parseInt(formData.authorId)
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Error saving book. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error mb-2">{errors.submit}</div>
          )}

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">ISBN *</label>
            <input
              type="text"
              name="isbn"
              className="form-input"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN"
            />
            {errors.isbn && <div className="error">{errors.isbn}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Author *</label>
            <select
              name="authorId"
              className="form-input"
              value={formData.authorId}
              onChange={handleChange}
            >
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.firstName} {author.lastName}
                </option>
              ))}
            </select>
            {errors.authorId && <div className="error">{errors.authorId}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publication Year *</label>
            <input
              type="number"
              name="publicationYear"
              className="form-input"
              value={formData.publicationYear}
              onChange={handleChange}
              placeholder="Enter publication year"
            />
            {errors.publicationYear && <div className="error">{errors.publicationYear}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Total Copies *</label>
            <input
              type="number"
              name="totalCopies"
              className="form-input"
              value={formData.totalCopies}
              onChange={handleChange}
              placeholder="Enter total copies"
              min="1"
            />
            {errors.totalCopies && <div className="error">{errors.totalCopies}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Available Copies *</label>
            <input
              type="number"
              name="availableCopies"
              className="form-input"
              value={formData.availableCopies}
              onChange={handleChange}
              placeholder="Enter available copies"
              min="0"
            />
            {errors.availableCopies && <div className="error">{errors.availableCopies}</div>}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;

