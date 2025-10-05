import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { login } from '../services/api';
import { deriveMasterKey } from '../utils/crypto';
import './Auth.css';

interface LoginProps {
  onLogin: (token: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password, twoFactorToken || undefined);
      
      // Check if 2FA is required
      if (response.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setLoading(false);
        return;
      }
      
      // Derive master key from password (client-side only)
      const masterKey = deriveMasterKey(password, email);
      localStorage.setItem('masterKey', masterKey);
      
      onLogin(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Lock size={48} />
          <h1>SecureVault</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Master Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter your master password"
              disabled={requiresTwoFactor}
            />
          </div>

          {requiresTwoFactor && (
            <div className="form-group">
              <label htmlFor="twoFactorToken">2FA Code</label>
              <input
                id="twoFactorToken"
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value)}
                required
                maxLength={6}
                placeholder="Enter 6-digit code"
                autoFocus
              />
              <small>Enter the 6-digit code from your authenticator app</small>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : requiresTwoFactor ? 'Verify & Sign In' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
