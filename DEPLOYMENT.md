# 🚀 Deployment Guide

Complete guide for deploying SecureVault to production.

## Architecture Overview

```
Frontend (React) → Vercel/Netlify
      ↓ (HTTPS)
Backend (Node.js) → Render/Railway/Heroku
      ↓ (MongoDB Connection)
Database (MongoDB) → MongoDB Atlas
```

## Recommended Stack (Free Tier Available)

- **Frontend**: Vercel or Netlify (Free)
- **Backend**: Render (Free with limitations) or Railway (Free trial)
- **Database**: MongoDB Atlas (Free tier: 512MB)

---

## Option 1: Vercel + Render + MongoDB Atlas

### Step 1: Deploy MongoDB (5 minutes)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**
   - Choose "Shared" (Free tier)
   - Select a region close to your users
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Save username and password

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   ```
   mongodb+srv://username:password@cluster.mongodb.net/password-manager
   ```

### Step 2: Deploy Backend to Render (10 minutes)

1. **Prepare Backend**
   - Make sure `backend/package.json` has a start script
   - Commit and push code to GitHub

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `securevault-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add these variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-manager
   JWT_SECRET=your-random-secret-key-here-make-it-long-and-secure
   PORT=5000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL: `https://securevault-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. **Update Frontend Configuration**
   
   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://securevault-backend.onrender.com/api
   ```

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add production environment"
   git push
   ```

3. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

4. **Import Project**
   - Click "New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

5. **Add Environment Variables**
   - Add `VITE_API_URL` with your Render backend URL
   ```
   VITE_API_URL=https://securevault-backend.onrender.com/api
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your app will be live at: `https://your-app.vercel.app`

7. **Configure CORS** (Backend)
   
   Update `backend/src/server.ts` to allow your Vercel domain:
   ```typescript
   app.use(cors({
     origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```
   
   Redeploy backend on Render.

---

## Option 2: Railway (All-in-One)

Railway provides a simpler deployment with all services in one place.

### Step 1: Deploy to Railway (15 minutes)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add MongoDB Plugin**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will provision a MongoDB instance
   - Copy the connection URL

4. **Configure Backend Service**
   - Click on your backend service
   - Go to "Variables" tab
   - Add:
   ```
   NODE_ENV=production
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   JWT_SECRET=your-random-secret-key
   PORT=5000
   ```
   - Go to "Settings"
   - Set Root Directory: `backend`
   - Set Build Command: `npm install && npm run build`
   - Set Start Command: `npm start`

5. **Configure Frontend Service**
   - Create a new service for frontend
   - Go to "Variables" tab
   - Add:
   ```
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```
   - Go to "Settings"
   - Set Root Directory: `frontend`
   - Set Build Command: `npm install && npm run build`
   - Set Start Command: `npx serve dist -s -p $PORT`

6. **Generate Domains**
   - Click "Generate Domain" for both services
   - Update frontend's `VITE_API_URL` with backend domain
   - Redeploy frontend

---

## Option 3: Heroku (Traditional)

### Prerequisites
- Heroku CLI installed
- Git repository

### Deploy Steps

1. **Install Heroku CLI**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Apps**
   ```bash
   # Create backend app
   heroku create securevault-backend
   
   # Create frontend app
   heroku create securevault-frontend
   ```

4. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox -a securevault-backend
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production -a securevault-backend
   heroku config:set JWT_SECRET=your-secret -a securevault-backend
   ```

6. **Deploy Backend**
   ```bash
   git subtree push --prefix backend heroku-backend main
   ```

7. **Deploy Frontend**
   ```bash
   git subtree push --prefix frontend heroku-frontend main
   ```

---

## Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=long-random-secret-key-change-in-production
PORT=5000
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## Post-Deployment Checklist

- [ ] Test user signup
- [ ] Test user login
- [ ] Test password generation
- [ ] Test saving vault items
- [ ] Test editing vault items
- [ ] Test deleting vault items
- [ ] Test search functionality
- [ ] Test clipboard copy
- [ ] Verify clipboard auto-clear (15s)
- [ ] Test on mobile device
- [ ] Check browser console for errors
- [ ] Verify HTTPS is working
- [ ] Check network tab - data should be encrypted
- [ ] Connect to database - verify data is encrypted

---

## Security Hardening for Production

### 1. Environment Variables
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. HTTPS Only
Ensure both frontend and backend use HTTPS. Most platforms (Vercel, Render, Railway) provide this automatically.

### 3. CORS Configuration
Update `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true
}));
```

### 4. Rate Limiting
Add rate limiting to prevent abuse:
```bash
cd backend
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Security Headers
Add helmet for security headers:
```bash
cd backend
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 6. MongoDB Security
- Use strong passwords
- Enable IP whitelisting
- Enable database encryption at rest (Atlas M10+)
- Regular backups

---

## Custom Domain Setup

### Vercel (Frontend)
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render (Backend)
1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records

---

## Monitoring & Maintenance

### Health Checks
Set up monitoring with:
- UptimeRobot (free)
- Pingdom
- Better Uptime

Monitor endpoint: `https://your-backend.com/api/health`

### Logs
- **Render**: View logs in dashboard
- **Vercel**: Check deployment logs and runtime logs
- **Railway**: Real-time logs in dashboard

### Database Backups
- MongoDB Atlas: Automatic backups on M10+ clusters
- Manual exports: Use `mongodump` command

---

## Cost Estimates

### Free Tier (Perfect for Personal Use)
- Frontend (Vercel): Free
- Backend (Render): Free (with sleep after inactivity)
- Database (MongoDB Atlas): Free (512MB)
- **Total: $0/month**

### Production Tier (For High Traffic)
- Frontend (Vercel Pro): $20/month
- Backend (Render Standard): $7/month
- Database (Atlas M10): $57/month
- **Total: ~$84/month**

---

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify MongoDB connection string
- Check logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Ensure backend is running

### Database connection fails
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check database user permissions

### Slow Performance
- Use CDN for frontend (Vercel/Netlify provide this)
- Enable caching headers
- Optimize images
- Consider upgrading database tier

---

## Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Automatic Deploy**
   - Services will automatically detect changes
   - Build and deploy new version
   - Zero downtime deployment

---

## Rollback

If something goes wrong:

### Vercel
- Go to "Deployments"
- Find previous working deployment
- Click "..." → "Promote to Production"

### Render
- Go to "Deploys"
- Select previous deployment
- Click "Redeploy"

---

**🎉 Congratulations!** Your SecureVault password manager is now live and secure!
