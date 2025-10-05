import CryptoJS from 'crypto-js';

export interface VaultItemData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  tags?: string[];
}

/**
 * Derives a master encryption key from the user's password
 * This key is used to encrypt/decrypt all vault items
 */
export const deriveMasterKey = (password: string, email: string): string => {
  // Use PBKDF2 to derive a strong key from password + email (as salt)
  const key = CryptoJS.PBKDF2(password, email, {
    keySize: 256 / 32,
    iterations: 10000,
  });
  return key.toString();
};

/**
 * Encrypts vault item data using AES-256
 * Returns encrypted data and initialization vector (IV)
 */
export const encryptVaultItem = (
  data: VaultItemData,
  masterKey: string
): { encryptedData: string; iv: string } => {
  // Generate random IV for this encryption
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // Convert data to JSON string
  const jsonData = JSON.stringify(data);
  
  // Encrypt using AES-256-CBC
  const encrypted = CryptoJS.AES.encrypt(jsonData, CryptoJS.enc.Hex.parse(masterKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString(CryptoJS.enc.Hex),
  };
};

/**
 * Decrypts vault item data
 */
export const decryptVaultItem = (
  encryptedData: string,
  iv: string,
  masterKey: string
): VaultItemData | null => {
  try {
    // Decrypt using AES-256-CBC
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Hex.parse(masterKey), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    
    // Convert to UTF-8 string and parse JSON
    const jsonData = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!jsonData) {
      throw new Error('Decryption failed - invalid master key');
    }
    
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
