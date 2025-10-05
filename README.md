# 🔐 SecureVault - Password Manager

A privacy-first, client-side encrypted password manager built with the MERN stack. All your passwords are encrypted in the browser before being sent to the server, ensuring complete privacy and security.

## ✨ Features

- **🔒 Client-Side Encryption**: All vault items are encrypted using AES-256 before being sent to the server
- **🔐 2FA Enabled by Default**: TOTP-based two-factor authentication for maximum security
- **🎲 Password Generator on Signup**: Generate strong master passwords with customizable options
- **📋 Smart Clipboard**: Copy passwords with automatic clipboard clearing after 15 seconds
- **🔍 Search & Filter**: Quickly find passwords by title, username, URL, tags, or notes
- **🏷️ Tags for Organization**: Organize vault items with custom tags
- **⚙️ Settings Page**: Manage 2FA settings (disable if needed)
- **🎨 Dark Mode UI**: Clean, modern interface with pure black dark mode
- **⚡ Fast & Lightweight**: Built with performance in mind, no heavy UI libraries
- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛡️ Security Features

### Client-Side Encryption
All sensitive data (passwords, usernames, notes) is encrypted **in the browser** using AES-256-CBC encryption before being sent to the server. The server only stores encrypted blobs and never has access to your plaintext passwords.

### Master Key Derivation
Your master password is used to derive an encryption key using PBKDF2 with 10,000 iterations. This key is stored only in your browser's localStorage and is never sent to the server.

### Why crypto-js?
We chose **crypto-js** for client-side encryption because:
- **Battle-tested**: Used by millions of developers worldwide
- **Comprehensive**: Supports AES-256, PBKDF2, and other essential algorithms
- **Lightweight**: Small bundle size (~100KB)
- **Browser-native**: Works seamlessly in all modern browsers
- **Well-documented**: Extensive documentation and community support

The encryption flow:
1. Master password → PBKDF2 → 256-bit encryption key
2. Vault data → JSON string → AES-256-CBC encryption → Base64 string
3. Only encrypted data is sent to the server

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd madquick
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

> ⚠️ **Important**: Change the JWT_SECRET to a strong random string in production!

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Run the application**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

### Building for Production

1. **Build both frontend and backend**
```bash
npm run build
```

2. **Set production environment variables**
Update `backend/.env`:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret-key
```

3. **Deploy**
- **Frontend**: Deploy the `frontend/dist` folder to Vercel, Netlify, or any static hosting
- **Backend**: Deploy the `backend` folder to Render, Railway, Heroku, or any Node.js hosting
- **Database**: Use MongoDB Atlas for managed MongoDB hosting

## 📁 Project Structure

```
madquick/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── models/         # MongoDB models (User, VaultItem)
│   │   ├── routes/         # API routes (auth, vault)
│   │   ├── middleware/     # Auth middleware
│   │   └── server.ts       # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components (Login, Signup, Dashboard)
│   │   ├── services/      # API service
│   │   ├── utils/         # Utilities (crypto, password generator, clipboard)
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account (returns 2FA QR code)
- `POST /api/auth/login` - Login to account (requires 2FA code if enabled)

### Vault
- `GET /api/vault` - Get all vault items (encrypted)
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/:id` - Update vault item
- `DELETE /api/vault/:id` - Delete vault item

### Two-Factor Authentication
- `POST /api/2fa/setup` - Generate new 2FA secret and QR code
- `POST /api/2fa/verify` - Verify and enable 2FA
- `POST /api/2fa/disable` - Disable 2FA (requires password)
- `GET /api/2fa/status` - Check if 2FA is enabled

## 🎯 Usage Guide

### 1. Sign Up
- Enter email and password
- **Use the password generator** to create a strong master password
  - Adjust length (8-32 characters)
  - Toggle numbers, symbols, and similar character exclusion
  - Click "Generate Password"
- **Scan QR code** with Google Authenticator or Authy (2FA is enabled by default)
- Save the backup code shown
- Click "Continue to Vault"
- ⚠️ **Remember your master password** - it cannot be recovered!

### 2. Login
- Enter email and master password
- Enter 6-digit 2FA code from your authenticator app
- Access your vault

### 3. Add Passwords to Vault
- Click "Add Item" button
- Fill in title, username, password, URL, and notes
- Add tags (optional) for organization (e.g., "Banking", "Social", "Work")
- Click "Save Item"
- Data is encrypted before being sent to server

### 4. Search & Filter
- Use the search bar to filter by title, username, URL, tags, or notes
- Use tag dropdown to filter by specific tags
- Results update instantly as you type

### 5. Copy Password
- Click the copy icon next to any password field
- Password is copied to clipboard
- **Automatic clearing**: Clipboard is cleared after 15 seconds for security

### 6. Edit & Delete
- Click "Edit" to modify an existing item
- Click "Delete" to remove an item (confirmation required)

### 7. Manage 2FA (Settings)
- Click "Settings" button in dashboard header
- View 2FA status (enabled by default)
- Option to disable 2FA (requires master password)
- ⚠️ Keeping 2FA enabled is highly recommended for security

## 🔐 Security Best Practices

1. **Use a Strong Master Password**: This is the key to your entire vault
2. **Never Share Your Master Password**: Not even with the app developers
3. **Enable Two-Factor Authentication**: Use your email's 2FA as an additional layer
4. **Regular Backups**: Export your passwords periodically (feature coming soon)
5. **Keep Software Updated**: Always use the latest version

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Encryption**: crypto-js (AES-256, PBKDF2)
- **Icons**: lucide-react
- **Styling**: Custom CSS (pure black dark mode)

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Deploy to Vercel (Frontend) + Render (Backend)

1. **Frontend (Vercel)**
```bash
cd frontend
npm run build
# Deploy 'dist' folder to Vercel
```

2. **Backend (Render)**
```bash
cd backend
npm run build
# Deploy entire backend folder to Render
# Set environment variables in Render dashboard
```

3. **Database (MongoDB Atlas)**
- Create a free cluster on MongoDB Atlas
- Get connection string and update `MONGODB_URI`

## 📊 Features Implemented

✅ **Password Generator** - Built into signup page with customizable options  
✅ **Client-side Encryption** - AES-256-CBC with PBKDF2 key derivation  
✅ **2FA (TOTP)** - Enabled by default with Google Authenticator/Authy  
✅ **JWT Authentication** - Secure token-based auth with bcrypt  
✅ **Vault CRUD Operations** - Full create, read, update, delete functionality  
✅ **Tags & Organization** - Organize passwords with custom tags and filtering  
✅ **Settings Page** - Manage 2FA and account settings  
✅ **Copy with Auto-Clear** - Clipboard automatically clears after 15 seconds  
✅ **Search & Filter** - Instant search across all fields including tags  
✅ **Dark Mode UI** - Pure black (#000000) dark theme  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **TypeScript** - Full type safety across frontend and backend  

## 🔮 Future Enhancements

- 📤 Encrypted export/import of vault data
- 🔄 Password strength analysis and weak password detection
- 📱 Browser extension
- 👥 Secure password sharing
- 🔔 Password expiration reminders
- 📊 Security dashboard with breach monitoring

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies. Special thanks to the open-source community for amazing tools like React, Express, and crypto-js.

---

**⚠️ Security Notice**: This is a demonstration project. For production use, consider additional security measures like rate limiting, HTTPS enforcement, security headers, and professional security audits.
