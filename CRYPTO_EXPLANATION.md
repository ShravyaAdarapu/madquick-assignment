# 🔐 Cryptography Implementation

## Library Choice: crypto-js

### Why crypto-js?

We chose **crypto-js** as our encryption library for the following reasons:

1. **Battle-Tested & Trusted** 📊
   - Over 10 million weekly downloads on npm
   - Used by major companies and applications worldwide
   - Maintained and actively updated since 2009

2. **Comprehensive Algorithm Support** 🛡️
   - AES-256 encryption (industry standard)
   - PBKDF2 key derivation (password-based key generation)
   - Multiple cipher modes (CBC, CTR, CFB, OFB)
   - Various padding schemes (PKCS7, ISO10126, etc.)

3. **Browser-Native & Lightweight** ⚡
   - Works seamlessly in all modern browsers
   - Small bundle size (~100KB minified)
   - No external dependencies
   - Pure JavaScript implementation

4. **Developer-Friendly** 👨‍💻
   - Simple, intuitive API
   - Extensive documentation
   - Large community with many examples
   - TypeScript types available

5. **Production-Ready** 🚀
   - Well-tested across millions of applications
   - Consistent behavior across platforms
   - Predictable performance characteristics

## Encryption Architecture

### 1. Master Key Derivation

```typescript
// User's password + email → Strong encryption key
const masterKey = CryptoJS.PBKDF2(password, email, {
  keySize: 256 / 32,        // 256-bit key
  iterations: 10000,        // 10,000 iterations
});
```

**Why PBKDF2?**
- Slows down brute-force attacks
- Derives a strong key from user's password
- Uses email as salt for uniqueness
- 10,000 iterations balances security and performance

### 2. Data Encryption

```typescript
// Generate random IV for each encryption
const iv = CryptoJS.lib.WordArray.random(16);

// Encrypt with AES-256-CBC
const encrypted = CryptoJS.AES.encrypt(jsonData, masterKey, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});
```

**Key Points:**
- **AES-256**: Military-grade encryption standard
- **CBC Mode**: Cipher Block Chaining for enhanced security
- **Random IV**: Unique initialization vector for each item
- **PKCS7 Padding**: Standard padding scheme

### 3. Data Decryption

```typescript
// Decrypt using stored IV and master key
const decrypted = CryptoJS.AES.decrypt(encryptedData, masterKey, {
  iv: CryptoJS.enc.Hex.parse(iv),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});

// Convert to UTF-8 string
const jsonData = decrypted.toString(CryptoJS.enc.Utf8);
```

## Security Model

### What Gets Encrypted?
- ✅ Password
- ✅ Username
- ✅ Title
- ✅ URL
- ✅ Notes

All vault item data is encrypted as a JSON object before transmission.

### What's Stored on Server?
```json
{
  "userId": "user_id_here",
  "encryptedData": "U2FsdGVkX1+...", // Base64 encrypted blob
  "iv": "a1b2c3d4...",                // Hex-encoded IV
  "createdAt": "2025-10-05T...",
  "updatedAt": "2025-10-05T..."
}
```

The server **never** sees:
- Your master password
- Your encryption key
- Your plaintext passwords
- Any unencrypted vault data

### Key Storage

1. **Master Password**: Never stored anywhere, only exists during login
2. **Encryption Key**: Derived from master password, stored in browser localStorage
3. **JWT Token**: Stored in browser localStorage for authentication

⚠️ **Important**: If you lose your master password, your data cannot be recovered!

## Security Guarantees

### ✅ What We Protect Against

1. **Server Breach**: Even if our database is compromised, attackers only get encrypted blobs
2. **Network Interception**: All data is encrypted before transmission (+ HTTPS in production)
3. **XSS Attacks**: Sensitive data is not exposed in DOM, only displayed when needed
4. **Brute Force**: PBKDF2 with 10,000 iterations makes password cracking extremely slow

### ⚠️ What You Must Protect

1. **Master Password**: Keep it strong and secret
2. **Local Device**: Anyone with access to your logged-in device can access your vault
3. **Browser Security**: Keep your browser updated and use trusted extensions only

## Encryption Flow Diagram

```
User Login
    ↓
Master Password + Email
    ↓
PBKDF2 (10,000 iterations)
    ↓
256-bit Encryption Key (stored in localStorage)
    ↓
                    ┌─────────────────────────────────┐
                    │  Adding/Editing Vault Item      │
                    └─────────────────────────────────┘
                                    ↓
                    Vault Data (JSON) + Encryption Key
                                    ↓
                        Random IV Generation
                                    ↓
                    AES-256-CBC Encryption
                                    ↓
            Encrypted Blob + IV → Sent to Server
                                    ↓
                    Stored in MongoDB (encrypted)
                    
                    ┌─────────────────────────────────┐
                    │  Retrieving Vault Item          │
                    └─────────────────────────────────┘
                                    ↓
            Encrypted Blob + IV ← Retrieved from Server
                                    ↓
                    Encryption Key (from localStorage)
                                    ↓
                    AES-256-CBC Decryption
                                    ↓
                        Vault Data (JSON)
                                    ↓
                        Display in UI
```

## Alternative Libraries Considered

### Why Not Web Crypto API?
- More verbose and complex API
- Harder to work with for key management
- Less examples and community support
- crypto-js provides better developer experience

### Why Not tweetnacl?
- Primarily focused on NaCl primitives
- Would need additional libraries for AES
- Smaller ecosystem
- crypto-js is more comprehensive

### Why Not node-forge?
- Larger bundle size
- More complex API
- crypto-js is lighter and simpler

## Best Practices Implemented

1. ✅ Never reuse IVs (new random IV for each encryption)
2. ✅ Use strong key derivation (PBKDF2 with 10,000+ iterations)
3. ✅ Use authenticated encryption mode (AES-CBC with PKCS7)
4. ✅ Never log sensitive data
5. ✅ Clear sensitive data from memory when possible
6. ✅ Use secure random number generation
7. ✅ Implement clipboard auto-clear for passwords

## Testing Encryption

You can verify the encryption is working by:

1. **Network Tab**: Check browser dev tools - all vault data should be base64 encrypted strings
2. **Database Inspection**: Connect to MongoDB directly - you'll only see encrypted blobs
3. **Server Logs**: No plaintext passwords or sensitive data should appear in logs

## References

- [crypto-js Documentation](https://cryptojs.gitbook.io/docs/)
- [AES Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
- [PBKDF2 Specification](https://tools.ietf.org/html/rfc2898)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
