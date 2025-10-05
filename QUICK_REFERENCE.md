# 🚀 Quick Reference Card

Essential commands and information for SecureVault.

## 📦 Installation

```bash
npm run install-all
```

## 🏃 Development

```bash
# Start everything
npm run dev

# Backend only
npm run server

# Frontend only
npm run client
```

## 🔧 Configuration Files

### Backend Environment (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
madquick/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth middleware
│   │   └── server.ts    # App entry
│   └── package.json
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page views
│   │   ├── services/    # API calls
│   │   └── utils/       # Crypto, generator
│   └── package.json
└── README.md
```

## 🔐 Security Features

✅ **Client-Side Encryption** (AES-256)  
✅ **Password Hashing** (bcrypt)  
✅ **JWT Authentication**  
✅ **PBKDF2 Key Derivation**  
✅ **Auto-Clear Clipboard** (15s)  

## 🎯 Core Features

1. **Password Generator**
   - Length: 8-32 characters
   - Options: Numbers, Symbols, Exclude Similar

2. **Vault Management**
   - Add, Edit, Delete items
   - Search & Filter
   - Copy passwords

3. **Authentication**
   - Sign Up / Login
   - JWT tokens (7-day expiry)

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Vault
- `GET /api/vault` - List items
- `POST /api/vault` - Create item
- `PUT /api/vault/:id` - Update item
- `DELETE /api/vault/:id` - Delete item

## 🛠️ Tech Stack

**Frontend**: React 18 + TypeScript + Vite  
**Backend**: Node.js + Express + TypeScript  
**Database**: MongoDB  
**Encryption**: crypto-js  
**Auth**: JWT + bcrypt  

## 🚢 Deployment Options

1. **Free Tier**
   - Frontend: Vercel
   - Backend: Render
   - Database: MongoDB Atlas
   - Cost: $0/month

2. **Railway** (All-in-One)
   - Full-stack deployment
   - Includes MongoDB
   - Easy setup

## 📝 Common Commands

```bash
# Install dependencies
npm run install-all

# Development
npm run dev

# Build for production
npm run build

# Start production backend
cd backend && npm start

# Preview production frontend
cd frontend && npm run preview
```

## 🐛 Common Issues

### Port already in use
```bash
# Change PORT in backend/.env
PORT=5001
```

### MongoDB connection error
```bash
# Check if MongoDB is running
mongod

# Or use MongoDB Atlas connection string
```

### Module not found
```bash
# Clean install
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

## 📚 Documentation

- **[README.md](README.md)** - Full documentation
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[CRYPTO_EXPLANATION.md](CRYPTO_EXPLANATION.md)** - Security details
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing checklist

## 🔑 Key Libraries

| Library | Purpose | Size |
|---------|---------|------|
| crypto-js | Encryption | ~100KB |
| express | Backend framework | ~50KB |
| mongoose | MongoDB ODM | ~150KB |
| react | UI library | ~40KB |
| jsonwebtoken | Auth tokens | ~20KB |
| bcryptjs | Password hashing | ~30KB |

## ⚡ Performance Tips

- Use production builds
- Enable gzip compression
- Use CDN for static assets
- Add database indexes
- Implement caching

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET
- [ ] Enable rate limiting
- [ ] Whitelist CORS origins
- [ ] Validate all inputs
- [ ] Keep dependencies updated

## 📊 Default Settings

| Setting | Value |
|---------|-------|
| JWT Expiry | 7 days |
| Password Min Length | 6 characters |
| PBKDF2 Iterations | 10,000 |
| Clipboard Clear | 15 seconds |
| Default Password Length | 16 characters |
| Encryption | AES-256-CBC |

## 🎨 UI Colors (Dark Mode)

- **Background**: #000000 (Pure Black)
- **Card Background**: #0a0a0a
- **Border**: #1a1a1a
- **Primary**: #4CAF50 (Green)
- **Text**: #ffffff
- **Secondary Text**: #888888
- **Error**: #f44336

## 🧪 Test Credentials

```
Email: test@example.com
Password: test123456
```

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review TESTING_GUIDE.md
3. Check browser console for errors
4. Review backend logs

---

**Made with ❤️ using MERN + TypeScript + crypto-js**
