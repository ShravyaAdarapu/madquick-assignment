import { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordGenerator';
import { copyToClipboardWithTimeout } from '../utils/clipboard';
import './PasswordGenerator.css';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword({
        length,
        includeNumbers,
        includeSymbols,
        excludeSimilar,
      });
      setPassword(newPassword);
      setCopied(false);
    } catch (error: any) {
      console.error('Password generation error:', error);
    }
  };

  const handleCopy = async () => {
    if (!password) return;
    
    try {
      await copyToClipboardWithTimeout(password, 15000);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const strength = calculatePasswordStrength(password);
  const getStrengthColor = () => {
    if (strength < 40) return '#f44336';
    if (strength < 70) return '#ff9800';
    return '#4CAF50';
  };

  return (
    <div className="password-generator">
      <h2>Password Generator</h2>
      
      <div className="generator-content">
        <div className="password-display">
          <input
            type="text"
            value={password}
            readOnly
            placeholder="Click generate to create a password"
          />
          <button
            onClick={handleCopy}
            className="btn-icon"
            disabled={!password}
            title="Copy password (auto-clears in 15s)"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
          <button onClick={handleGenerate} className="btn-icon" title="Generate password">
            <RefreshCw size={20} />
          </button>
        </div>

        {password && (
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${strength}%`,
                background: getStrengthColor(),
              }}
            />
          </div>
        )}

        <div className="generator-options">
          <div className="option-row">
            <label htmlFor="length">Length: {length}</label>
            <input
              id="length"
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
            <label htmlFor="exclude-similar">Exclude Similar Characters (i, l, 1, L, o, 0, O)</label>
          </div>
        </div>

        <button onClick={handleGenerate} className="btn-generate">
          Generate Strong Password
        </button>
      </div>
    </div>
  );
}

export default PasswordGenerator;
