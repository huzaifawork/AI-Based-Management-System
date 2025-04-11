import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your login logic here
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <PageLayout className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <FiLogIn className="auth-icon" size={48} />
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {error && (
            <div className="error-state">
              <p className="error-text">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">
                <FiUser className="form-icon" />
                Email
              </label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FiLock className="form-icon" />
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login; 