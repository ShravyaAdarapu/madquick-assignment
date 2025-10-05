import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, RefreshCw } from 'lucide-react';
import { signup, createVaultItem } from '../services/api';
import { deriveMasterKey, encryptVaultItem } from '../utils/crypto';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordGenerator';
import './Auth.css';

interface SignupProps {
  onSignup: (token: string) => void;
}

function Signup({ onSignup }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 2FA setup
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [authToken, setAuthToken] = useState('');
  
  // Password generator options
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const handleGeneratePassword = () => {
    const generated = generatePassword({
      length,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
    });
    setPassword(generated);
    setConfirmPassword(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await signup(email, password);
      
      // Derive master key from password (client-side only)
      const masterKey = deriveMasterKey(password, email);
      localStorage.setItem('masterKey', masterKey);
      
      // Check if 2FA setup is required
      if (response.twoFactor) {
        setQrCode(response.twoFactor.qrCode);
        setSecret(response.twoFactor.secret);
        setAuthToken(response.token);
        setShow2FASetup(true);
        setLoading(false);
        return;
      }
      
      // Automatically save signup credentials to vault
      try {
        const vaultData = {
          title: 'SecureVault Account',
          username: email,
          password: password,
          url: window.location.origin,
          notes: 'Your SecureVault master account credentials',
          tags: ['SecureVault', 'Master'],
        };
        
        const { encryptedData, iv } = encryptVaultItem(vaultData, masterKey);
        await createVaultItem(encryptedData, iv);
      } catch (vaultError) {
        // Don't fail signup if vault save fails
        console.error('Failed to save credentials to vault:', vaultError);
      }
      
      onSignup(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    // Save credentials to vault
    try {
      const masterKey = localStorage.getItem('masterKey');
      if (masterKey) {
        const vaultData = {
          title: 'SecureVault Account',
          username: email,
          password: password,
          url: window.location.origin,
          notes: 'Your SecureVault master account credentials',
          tags: ['SecureVault', 'Master'],
        };
        
        const { encryptedData, iv } = encryptVaultItem(vaultData, masterKey);
        await createVaultItem(encryptedData, iv);
      }
    } catch (vaultError) {
      console.error('Failed to save credentials to vault:', vaultError);
    }
    
    onSignup(authToken);
  };

  if (show2FASetup) {
    return (
      <div className="auth-container">
        <div className="auth-box setup-2fa-box">
          <div className="auth-header">
            <Lock size={48} />
            <h1>Setup 2FA</h1>
            <p>Scan this QR code with Google Authenticator or Authy</p>
          </div>

          <div className="setup-content">
            <div className="qr-code-container">
              <img src={qrCode} alt="2FA QR Code" />
            </div>

            <div className="secret-container">
              <small>Or enter this code manually:</small>
              <code>{secret}</code>
            </div>

            <p className="info-text">
              ⚠️ <strong>Important:</strong> Set this up now! You'll need the 6-digit code every time you log in.
            </p>

            <button onClick={handleContinue} className="btn-primary">
              I've Saved It → Continue to Vault
            </button>

            <small className="help-text">
              Don't have an authenticator app? Download Google Authenticator or Authy from your app store.
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Lock size={48} />
          <h1>SecureVault</h1>
          <p>Create your secure account</p>
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
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
            
            <div className="generator-panel">
              <h4>Password Generator</h4>
              
              {password && (
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${calculatePasswordStrength(password)}%`,
                      background: calculatePasswordStrength(password) < 40 ? '#f44336' : 
                                 calculatePasswordStrength(password) < 70 ? '#ff9800' : '#4CAF50'
                    }}
                  />
                </div>
              )}
              
              <div className="generator-options">
                <div className="option-row">
                  <label htmlFor="length-slider">Length: {length}</label>
                  <input
                    id="length-slider"
                    type="range"
                    min="8"
                    max="32"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                  />
                </div>

                <div className="option-checkbox">
                  <input
                    id="numbers"
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  <label htmlFor="numbers">Include Numbers (0-9)</label>
                </div>

                <div className="option-checkbox">
                  <input
                    id="symbols"
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  <label htmlFor="symbols">Include Symbols (!@#$%...)</label>
                </div>

                <div className="option-checkbox">
                  <input
                    id="exclude-similar"
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                  />
                  <label htmlFor="exclude-similar">Exclude Similar (i, l, 1, L, o, 0, O)</label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="btn-generate-full"
              >
                <RefreshCw size={16} />
                Generate Password
              </button>
            </div>
            
            <small>⚠️ Remember this password - it cannot be recovered!</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
