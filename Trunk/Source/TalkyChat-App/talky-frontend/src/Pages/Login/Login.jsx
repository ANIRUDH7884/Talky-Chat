import { useState } from 'react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate login
      setTimeout(() => {
        setIsLoading(false);
        alert('Login would proceed here');
      }, 1500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
      </div>
      
      <div className="login-card">
        <div className="card-header">
          <div className="logo">
            <span className="logo-icon">TC</span>
            <span className="logo-text">TalkyChat</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your conversations</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`input-group ${errors.email ? 'error' : ''}`}>
            <div className="input-icon">
              <FiMail />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              autoFocus
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className={`input-group ${errors.password ? 'error' : ''}`}>
            <div className="input-icon">
              <FiLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="forgot-password">
            <button type="button">Forgot password?</button>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <>
                Sign In <FiArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <button type="button">Create one</button>
        </div>
      </div>
    </div>
  );
};

export default Login;