import { useState } from 'react';
import { Copy, Edit, Trash2, Eye, EyeOff, ExternalLink, Check } from 'lucide-react';
import { copyToClipboardWithTimeout } from '../utils/clipboard';
import { VaultItem } from '../services/api';
import { VaultItemData } from '../utils/crypto';
import './VaultItemCard.css';

interface DecryptedVaultItem extends VaultItem {
  decryptedData: VaultItemData | null;
}

interface VaultItemCardProps {
  item: DecryptedVaultItem;
  onEdit: () => void;
  onDelete: () => void;
}

function VaultItemCard({ item, onEdit, onDelete }: VaultItemCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!item.decryptedData) {
    return null;
  }

  const data = item.decryptedData;

  const handleCopy = async (text: string, field: string) => {
    try {
      await copyToClipboardWithTimeout(text, 15000);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const getInitials = (title: string) => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="vault-item-card">
      <div className="card-header">
        <div className="card-icon">{getInitials(data.title)}</div>
        <div className="card-title">
          <h3>{data.title}</h3>
          {data.url && (
            <a
              href={data.url.startsWith('http') ? data.url : `https://${data.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-url"
            >
              {data.url}
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="card-content">
        {data.username && (
          <div className="card-field">
            <label>Username</label>
            <div className="field-value">
              <span>{data.username}</span>
              <button
                onClick={() => handleCopy(data.username, 'username')}
                className="btn-copy"
                title="Copy username"
              >
                {copiedField === 'username' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        {data.password && (
          <div className="card-field">
            <label>Password</label>
            <div className="field-value">
              <span className="password-field">
                {showPassword ? data.password : '••••••••••••'}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="btn-copy"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => handleCopy(data.password, 'password')}
                className="btn-copy"
                title="Copy password (auto-clears in 15s)"
              >
                {copiedField === 'password' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        {data.notes && (
          <div className="card-field">
            <label>Notes</label>
            <p className="notes-text">{data.notes}</p>
          </div>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className="card-tags">
            {data.tags.map(tag => (
              <span key={tag} className="card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="card-actions">
        <button onClick={onEdit} className="btn-edit">
          <Edit size={14} />
          Edit
        </button>
        <button onClick={onDelete} className="btn-delete">
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default VaultItemCard;
