import { useState, useEffect } from 'react';

const AuthorForm = ({ author, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    biography: '',
    birthYear: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (author) {
      setFormData({
        firstName: author.firstName || '',
        lastName: author.lastName || '',
        biography: author.biography || '',
        birthYear: author.birthYear || ''
      });
    }
  }, [author]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = 'First name must not exceed 100 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = 'Last name must not exceed 100 characters';
    }

    if (formData.biography && formData.biography.length > 1000) {
      newErrors.biography = 'Biography must not exceed 1000 characters';
    }

    if (formData.birthYear && (formData.birthYear < 1000 || formData.birthYear > new Date().getFullYear())) {
      newErrors.birthYear = 'Please enter a valid birth year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        birthYear: formData.birthYear ? parseInt(formData.birthYear) : null
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Error saving author. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{author ? 'Edit Author' : 'Add New Author'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error mb-2">{errors.submit}</div>
          )}

          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              maxLength="100"
            />
            {errors.firstName && <div className="error">{errors.firstName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              maxLength="100"
            />
            {errors.lastName && <div className="error">{errors.lastName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Birth Year</label>
            <input
              type="number"
              name="birthYear"
              className="form-input"
              value={formData.birthYear}
              onChange={handleChange}
              placeholder="Enter birth year (optional)"
              min="1000"
              max={new Date().getFullYear()}
            />
            {errors.birthYear && <div className="error">{errors.birthYear}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Biography</label>
            <textarea
              name="biography"
              className="form-input"
              value={formData.biography}
              onChange={handleChange}
              placeholder="Enter author biography (optional)"
              rows="4"
              maxLength="1000"
            />
            {errors.biography && <div className="error">{errors.biography}</div>}
            {formData.biography && (
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                {formData.biography.length}/1000 characters
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (author ? 'Update Author' : 'Add Author')}
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

export default AuthorForm;

