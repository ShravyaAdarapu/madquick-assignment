# 🔐 SecureVault - Password Manager

A full-stack MERN password manager with client-side encryption and 2FA.

## 📹 Demo

- **Live App**: [Render Link](https://madquick-5ysm.onrender.com)
- **GitHub Rep**: [Github Rep Link](https://github.com/ShravyaAdarapu/madquick-assignment/)
- **Demo Video**: [Demo Link](https://drive.google.com/file/d/14qJ-I5mIWXNrB4kPNsZhHgO0JGHHiWpn/view?usp=sharing)

## 🔐 Crypto Explanation

I used **crypto-js** for client-side encryption because it's lightweight (~100KB), battle-tested, and works seamlessly in browsers. All vault items are encrypted with AES-256-CBC using a master key derived from the user's password via PBKDF2 (10,000 iterations). The server only stores encrypted blobs - plaintext passwords never leave the browser.
### Setup & Run

1. **Clone and install**
```bash
git clone https://github.com/ShravyaAdarapu/madquick-assignment
cd madquick
npm run install-all
```

2. **Setup environment**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start MongoDB** (if local)
```bash
mongod
```

4. **Run the app**
```bash
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:5000`

## ✨ Features

- **Client-Side Encryption** - All passwords encrypted in browser using AES-256-CBC
- **2FA by Default** - TOTP-based 2FA enabled during signup (Google Authenticator/Authy)
- **Password Generator** - Built into signup with customizable strength
- **Tags & Search** - Organize and find passwords quickly
- **Auto-Clear Clipboard** - Copied passwords clear after 15s
- **Dark Mode** - Pure black theme

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Auth**: JWT + bcrypt
- **Encryption**: crypto-js (AES-256, PBKDF2)
- **2FA**: speakeasy + qrcode

## 📁 Project Structure

```
madquick/
├── backend/          # Express API + MongoDB
│   ├── src/
│   │   ├── models/   # User & VaultItem schemas
│   │   ├── routes/   # auth, vault, 2FA routes
│   │   └── server.ts
├── frontend/         # React app
│   ├── src/
│   │   ├── components/  # VaultItemCard, VaultItemModal
│   │   ├── pages/       # Signup, Login, Dashboard, Settings
│   │   ├── utils/       # crypto, passwordGenerator, clipboard
│   │   └── services/    # API client
└── package.json      # Root with install-all script
```

## 🔧 API Endpoints

**Auth**
- `POST /api/auth/signup` - Create account (returns 2FA QR)
- `POST /api/auth/login` - Login (requires 2FA code)

**Vault**
- `GET /api/vault` - Get all items (encrypted)
- `POST /api/vault` - Create item
- `PUT /api/vault/:id` - Update item
- `DELETE /api/vault/:id` - Delete item

**2FA**
- `GET /api/2fa/status` - Check 2FA status
- `POST /api/2fa/disable` - Disable 2FA

## 📝 Usage

1. **Signup** - Use password generator → scan QR code with authenticator app
2. **Login** - Enter credentials + 6-digit 2FA code
3. **Add Passwords** - Click "Add Item", fill details, add tags
4. **Search** - Use search bar or filter by tags
5. **Settings** - Manage 2FA (can disable if needed)

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed step-by-step instructions on deploying to Vercel.
