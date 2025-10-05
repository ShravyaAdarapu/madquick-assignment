import { useState, useEffect } from 'react';
import { LogOut, Plus, Search, Filter, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getVaultItems, createVaultItem, updateVaultItem, deleteVaultItem, VaultItem } from '../services/api';
import { encryptVaultItem, decryptVaultItem, VaultItemData } from '../utils/crypto';
import VaultItemCard from '../components/VaultItemCard';
import VaultItemModal from '../components/VaultItemModal';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

interface DecryptedVaultItem extends VaultItem {
  decryptedData: VaultItemData | null;
}

function Dashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [vaultItems, setVaultItems] = useState<DecryptedVaultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVaultItems();
  }, []);

  const loadVaultItems = async () => {
    try {
      setLoading(true);
      const items = await getVaultItems();
      const masterKey = localStorage.getItem('masterKey');
      
      if (!masterKey) {
        setError('Master key not found. Please log in again.');
        return;
      }

      // Decrypt all items
      const decryptedItems: DecryptedVaultItem[] = items.map(item => ({
        ...item,
        decryptedData: decryptVaultItem(item.encryptedData, item.iv, masterKey),
      }));

      setVaultItems(decryptedItems);
      setError('');
    } catch (err: any) {
      setError('Failed to load vault items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (data: VaultItemData) => {
    try {
      const masterKey = localStorage.getItem('masterKey');
      if (!masterKey) {
        setError('Master key not found. Please log in again.');
        return;
      }

      const { encryptedData, iv } = encryptVaultItem(data, masterKey);

      if (editingItem) {
        // Update existing item
        const updated = await updateVaultItem(editingItem._id, encryptedData, iv);
        setVaultItems(prev =>
          prev.map(item =>
            item._id === updated._id
              ? { ...updated, decryptedData: data }
              : item
          )
        );
      } else {
        // Create new item
        const created = await createVaultItem(encryptedData, iv);
        setVaultItems(prev => [{ ...created, decryptedData: data }, ...prev]);
      }

      setShowModal(false);
      setEditingItem(null);
    } catch (err: any) {
      setError('Failed to save vault item');
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteVaultItem(id);
      setVaultItems(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      setError('Failed to delete vault item');
      console.error(err);
    }
  };

  const handleEditItem = (item: DecryptedVaultItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      vaultItems
        .flatMap(item => item.decryptedData?.tags || [])
        .filter(tag => tag)
    )
  );

  const filteredItems = vaultItems.filter(item => {
    if (!item.decryptedData) return false;
    
    const data = item.decryptedData;
    
    // Filter by tag
    if (selectedTag && (!data.tags || !data.tags.includes(selectedTag))) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        data.title.toLowerCase().includes(query) ||
        data.username.toLowerCase().includes(query) ||
        data.url.toLowerCase().includes(query) ||
        data.notes.toLowerCase().includes(query) ||
        (data.tags && data.tags.some(tag => tag.toLowerCase().includes(query)))
      );
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🔐 SecureVault</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/settings')} className="btn-secondary">
            <SettingsIcon size={18} />
            Settings
          </button>
          <button onClick={onLogout} className="btn-logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="vault-section">
          <div className="vault-header">
            <h2>Your Vault ({filteredItems.length}/{vaultItems.length})</h2>
            <button onClick={handleAddNew} className="btn-add">
              <Plus size={18} />
              Add Item
            </button>
          </div>

          <div className="filters-row">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by title, username, URL, tags, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {allTags.length > 0 && (
              <div className="tag-filter">
                <Filter size={18} />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="tag-select"
                >
                  <option value="">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading your vault...</div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? (
                <>No items match your search.</>
              ) : (
                <>Your vault is empty. Add your first password!</>
              )}
            </div>
          ) : (
            <div className="vault-grid">
              {filteredItems.map(item => (
                item.decryptedData && (
                  <VaultItemCard
                    key={item._id}
                    item={item}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item._id)}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <VaultItemModal
          item={editingItem?.decryptedData || null}
          onSave={handleSaveItem}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
