# 🚀 Quick Setup Guide

Follow these steps to get SecureVault running on your local machine in under 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js v18+ installed ([Download](https://nodejs.org/))
- ✅ MongoDB installed or MongoDB Atlas account ([MongoDB Atlas Free](https://www.mongodb.com/cloud/atlas/register))
- ✅ A terminal/command prompt

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

Or use the shortcut:
```bash
npm run install-all
```

### 2. Configure Backend Environment (1 minute)

Create `backend/.env` file:

```bash
cd backend
# On Windows (PowerShell)
Copy-Item env.example.txt .env

# On Mac/Linux
cp env.example.txt .env
```

Edit `backend/.env` and update if needed:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-manager
JWT_SECRET=change-this-to-a-random-string-in-production
NODE_ENV=development
```

**Using MongoDB Atlas?** Replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-manager
```

### 3. Configure Frontend Environment (Optional)

If your backend is on a different port or domain:

```bash
cd frontend
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4. Start MongoDB (if running locally)

**Windows:**
```bash
# Open a new terminal
mongod
```

**Mac (with Homebrew):**
```bash
# Start MongoDB service
brew services start mongodb-community
```

**Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
```

**Using MongoDB Atlas?** Skip this step! Your database is already running in the cloud.

### 5. Start the Application (1 minute)

From the root directory:

```bash
npm run dev
```

This will start:
- ✅ Backend server on http://localhost:5000
- ✅ Frontend dev server on http://localhost:3000

Wait for the messages:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 6. Open Your Browser

Navigate to: **http://localhost:3000**

You should see the SecureVault login page! 🎉

## First Time Usage

1. **Sign Up**: Click "Sign up" and create your account
2. **Remember Your Master Password**: This cannot be recovered!
3. **Generate Password**: Use the generator at the top
4. **Add Item**: Click "Add Item" to save your first password
5. **Search**: Try the search bar to filter your passwords

## Common Issues & Solutions

### ❌ "Cannot connect to MongoDB"

**Solution:**
- Check if MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` in `backend/.env`
- For Atlas: Check if your IP is whitelisted

### ❌ "Port 5000 already in use"

**Solution:**
- Change PORT in `backend/.env` to another number (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` accordingly

### ❌ "Module not found" errors

**Solution:**
```bash
# Clean install everything
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### ❌ Frontend won't connect to backend

**Solution:**
- Check if backend is running on http://localhost:5000
- Verify `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### ❌ "JWT_SECRET not defined"

**Solution:**
- Make sure `backend/.env` exists and contains `JWT_SECRET`
- Restart the backend server after creating `.env`

## Production Deployment

### Quick Deploy Options

**Option 1: Vercel + Render + MongoDB Atlas** (Recommended)

1. **Database** (5 min)
   - Create free MongoDB Atlas cluster
   - Get connection string

2. **Backend** (10 min)
   - Push code to GitHub
   - Connect Render to your repo
   - Add environment variables
   - Deploy backend folder

3. **Frontend** (5 min)
   - Update `VITE_API_URL` to your Render backend URL
   - Push to GitHub
   - Connect Vercel to your repo
   - Deploy frontend folder

**Option 2: All-in-One (Railway)** (15 min)
- Deploy full stack app to Railway
- Add MongoDB plugin
- Set environment variables
- Done!

## Development Commands

```bash
# Start everything (recommended)
npm run dev

# Start only backend
npm run server

# Start only frontend  
npm run client

# Build for production
npm run build

# Install all dependencies
npm run install-all
```

## Verify Installation

Run these checks to ensure everything works:

1. ✅ Backend Health Check: http://localhost:5000/api/health
   - Should return: `{"status":"ok","message":"Server is running"}`

2. ✅ Frontend Loading: http://localhost:3000
   - Should show SecureVault login page

3. ✅ Sign Up: Create a test account
   - Should redirect to dashboard after signup

4. ✅ Password Generator: Click "Generate Strong Password"
   - Should generate a random password

5. ✅ Save Password: Add a test password
   - Should appear in your vault

6. ✅ Search: Type in the search bar
   - Should filter results

7. ✅ Copy Password: Click copy icon
   - Should copy to clipboard and clear after 15s

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🔐 Read [CRYPTO_EXPLANATION.md](CRYPTO_EXPLANATION.md) to understand the security model
- 🚀 Deploy to production
- 🎨 Customize the UI
- ✨ Add new features

## Need Help?

- Check the README.md for detailed documentation
- Look at the code comments for implementation details
- Common issues are documented above

---

**Happy Password Managing! 🔐**
