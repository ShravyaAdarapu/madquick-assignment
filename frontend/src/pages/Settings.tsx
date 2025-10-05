import { useState, useEffect } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setup2FA, verify2FA, disable2FA, get2FAStatus } from '../services/api';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const status = await get2FAStatus();
      setTwoFactorEnabled(status.enabled);
    } catch (err) {
      console.error('Failed to load 2FA status:', err);
    }
  };

  const handleSetup = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await setup2FA();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setShowSetup(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await verify2FA(verificationCode);
      setSuccess('2FA enabled successfully!');
      setTwoFactorEnabled(true);
      setShowSetup(false);
      setQrCode('');
      setSecret('');
      setVerificationCode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await disable2FA(disablePassword);
      setSuccess('2FA disabled successfully!');
      setTwoFactorEnabled(false);
      setShowDisable(false);
      setDisablePassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          <ArrowLeft size={20} />
          Back to Vault
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="section-header">
            <Shield size={24} />
            <div>
              <h2>Two-Factor Authentication (2FA)</h2>
              <p>Add an extra layer of security to your account</p>
            </div>
          </div>

          <div className="section-status">
            <span className={`status-badge ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
              {twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
            </span>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!twoFactorEnabled && !showSetup && (
            <div className="action-box">
              <p>Protect your account with Time-based One-Time Passwords (TOTP)</p>
              <button onClick={handleSetup} className="btn-primary" disabled={loading}>
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            </div>
          )}

          {showSetup && (
            <div className="setup-box">
              <h3>Step 1: Scan QR Code</h3>
              <p>Use Google Authenticator, Authy, or any TOTP app to scan this code:</p>
              
              {qrCode && (
                <div className="qr-code-container">
                  <img src={qrCode} alt="2FA QR Code" />
                </div>
              )}

              <div className="secret-container">
                <small>Or enter this secret manually:</small>
                <code>{secret}</code>
              </div>

              <form onSubmit={handleVerify} className="verify-form">
                <h3>Step 2: Verify</h3>
                <p>Enter the 6-digit code from your authenticator app:</p>
                
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSetup(false);
                      setQrCode('');
                      setSecret('');
                    }}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {twoFactorEnabled && !showDisable && (
            <div className="action-box">
              <p>2FA is currently protecting your account</p>
              <button
                onClick={() => setShowDisable(true)}
                className="btn-danger"
              >
                Disable 2FA
              </button>
            </div>
          )}

          {showDisable && (
            <div className="disable-box">
              <h3>Disable Two-Factor Authentication</h3>
              <p>Enter your master password to confirm:</p>

              <form onSubmit={handleDisable}>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Enter your master password"
                  required
                  autoFocus
                />

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisable(false);
                      setDisablePassword('');
                    }}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-danger" disabled={loading}>
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
