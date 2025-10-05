import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { VaultItemData } from '../utils/crypto';
import './VaultItemModal.css';

interface VaultItemModalProps {
  item: VaultItemData | null;
  onSave: (data: VaultItemData) => void;
  onClose: () => void;
}

function VaultItemModal({ item, onSave, onClose }: VaultItemModalProps) {
  const [formData, setFormData] = useState<VaultItemData>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof VaultItemData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="e.g., Gmail, Facebook, Bank Account"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username / Email</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Your username or email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="text"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">Website URL</label>
            <input
              id="url"
              type="text"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional information..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (for organization)</label>
            <div className="tags-input-container">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
              />
              <button type="button" onClick={handleAddTag} className="btn-add-tag">
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-badge">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <small>Examples: Social, Banking, Work, Personal</small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {item ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VaultItemModal;
