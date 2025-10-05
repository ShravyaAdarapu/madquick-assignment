# 🔐 SecureVault - Password Manager

A privacy-first, client-side encrypted password manager built with the MERN stack. All your passwords are encrypted in the browser before being sent to the server, ensuring complete privacy and security.

## ✨ Features

- **🔒 Client-Side Encryption**: All vault items are encrypted using AES-256 before being sent to the server
- **🎲 Strong Password Generator**: Generate secure passwords with customizable options (length, symbols, numbers, exclude similar characters)
- **📋 Smart Clipboard**: Copy passwords with automatic clipboard clearing after 15 seconds
- **🔍 Search & Filter**: Quickly find passwords by title, username, URL, or notes
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
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login to account

### Vault
- `GET /api/vault` - Get all vault items (encrypted)
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/:id` - Update vault item
- `DELETE /api/vault/:id` - Delete vault item

## 🎯 Usage Guide

### 1. Sign Up
- Create an account with email and master password
- ⚠️ **Remember your master password** - it cannot be recovered!

### 2. Generate Password
- Use the password generator at the top of the dashboard
- Adjust length (8-32 characters)
- Toggle numbers, symbols, and similar character exclusion
- Click "Generate Strong Password"

### 3. Save Password
- Click "Add Item" button
- Fill in title, username, password, URL, and notes
- Click "Save Item"
- Data is encrypted before being sent to server

### 4. Search & Filter
- Use the search bar to filter by title, username, URL, or notes
- Results update instantly as you type

### 5. Copy Password
- Click the copy icon next to any password field
- Password is copied to clipboard
- **Automatic clearing**: Clipboard is cleared after 15 seconds for security

### 6. Edit & Delete
- Click "Edit" to modify an existing item
- Click "Delete" to remove an item (confirmation required)

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

✅ Password Generator with customizable options  
✅ Client-side encryption (AES-256)  
✅ JWT authentication  
✅ Vault CRUD operations  
✅ Copy to clipboard with auto-clear (15s)  
✅ Search and filter  
✅ Dark mode UI (pure black)  
✅ Responsive design  
✅ TypeScript throughout  

## 🔮 Future Enhancements

- 🔐 Two-Factor Authentication (TOTP)
- 📁 Folders and tags for organization
- 📤 Encrypted export/import
- 🔄 Password strength analysis
- 📱 Browser extension
- 👥 Secure password sharing

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies. Special thanks to the open-source community for amazing tools like React, Express, and crypto-js.

---

**⚠️ Security Notice**: This is a demonstration project. For production use, consider additional security measures like rate limiting, HTTPS enforcement, security headers, and professional security audits.
