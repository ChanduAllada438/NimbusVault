# FREE Deployment Guide for NimbusVault

Deploy your entire NimbusVault application (Frontend, Backend, and Database) **completely FREE** using Vercel, Render, and MongoDB Atlas.

## Total Cost: $0/month ✅

### Services Used:
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free with hobby plan)
- **Database**: MongoDB Atlas (Free 512MB)
- **Domain** (Optional): Freenom or use free subdomains

---

## 1️⃣ Database Setup - MongoDB Atlas (FREE)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** (use Google or GitHub for quick signup)
3. Create a free account (choose free tier)

### Step 2: Create Free Cluster

1. After login, click **Create a New Project**
2. Name it "NimbusVault"
3. Click **Create Project**
4. Click **Create a Cluster**
5. Select **Free Tier** (M0 Sandbox - 512 MB storage)
6. Choose your region (pick closest to India: Asia)
7. Click **Create Cluster** and wait 2-3 minutes

### Step 3: Create Database User

1. Go to **Security** → **Database Access**
2. Click **Add New Database User**
3. Username: `nimbusvault`
4. Password: Use auto-generated or create strong password
5. Copy and save this password somewhere secure
6. Click **Add User**

### Step 4: Network Access

1. Go to **Security** → **Network Access**
2. Click **Add IP Address**
3. Select **Allow access from anywhere** (0.0.0.0/0)
4. Click **Confirm**

### Step 5: Get Connection String

1. Go to **Clusters** and click **Connect**
2. Choose **Connect your application**
3. Copy the connection string (MongoDB URI)
4. Replace `<username>` with `nimbusvault`
5. Replace `<password>` with your password
6. Replace `<database>` with `nimbusvault`

**Example:**
```
mongodb+srv://nimbusvault:yourpassword@cluster0.xxxxx.mongodb.net/nimbusvault?retryWrites=true&w=majority
```

✅ **Save this URL - you'll need it for backend setup**

---

## 2️⃣ Backend Deployment - Render (FREE)

### Preparation: Update Backend for Production

1. **Update backend/.env.example** with production-ready template:
```
MONGO_URI=your_mongodb_atlas_url_here
PORT=5000
JWT_SECRET=change_this_to_strong_random_string
NODE_ENV=production
CORSORIGIN=https://your-frontend-url.vercel.app
```

2. **Ensure Dockerfile exists** - Check `Dockerfile` in root:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

3. **Push changes to GitHub**:
```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Click **Get Started** or **Sign Up**
3. Connect with GitHub account
4. Authorize Render to access your repositories

### Step 2: Deploy Backend Service

1. Go to **Dashboard** → **New +** → **Web Service**
2. Select your NimbusVault repository
3. Choose the repository and click **Connect**
4. Fill in details:
   - **Name**: `nimbusvault-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Scroll down to **Environment**
6. Add these environment variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate random string (openssl rand -base64 32) |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | Leave blank for now, update after frontend deployment |

7. Select **Instance Type**: Free
8. Click **Create Web Service**
9. Wait for deployment (5-10 minutes)
10. Copy the deployed URL (e.g., `https://nimbusvault-backend.onrender.com`)

✅ **Your backend is live!**

### Step 3: Update CORS

After deploying frontend (next step), come back and update:
1. Go to Settings
2. Update `CORS_ORIGIN` to your frontend URL
3. Save changes (auto redeploys)

---

## 3️⃣ Frontend Deployment - Vercel (FREE)

### Preparation: Configure Frontend API

1. **Update frontend environment variables**
   - Create `frontend/.env.local` locally (don't commit):
   ```
   VITE_API_URL=https://nimbusvault-backend.onrender.com/api
   ```

2. **Or update your frontend code** to use backend URL from environment:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```

3. **Push to GitHub** (without .env.local):
```bash
cd frontend
git add .
git commit -m "chore: prepare frontend for deployment"
git push origin main
```

### Step 1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Select **GitHub** and authorize

### Step 2: Deploy Frontend

1. After login, click **Import Project**
2. Select your NimbusVault repository
3. Select **Create a new team** or use personal account
4. Click **Import**
5. Configure project:
   - **Framework**: Vite (or your framework)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://nimbusvault-backend.onrender.com/api`
7. Click **Deploy**
8. Wait for deployment (2-5 minutes)
9. Copy the production URL

✅ **Your frontend is live!**

### Step 3: Update Backend CORS

1. Go back to Render
2. Go to your backend service
3. Go to **Settings**
4. Update `CORS_ORIGIN` environment variable to your Vercel URL
5. Save (auto redeploys)

---

## 4️⃣ Final Configuration

### Update API URLs

Make sure all API calls in frontend use:
```javascript
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Test the Application

1. Open your Vercel URL
2. Try registering a new user
3. Try logging in
4. Try uploading a file
5. Check MongoDB Atlas to see your data

---

## 5️⃣ Custom Domain (Optional & Free)

### Using Freenom (Free for 1 year)

1. Go to [Freenom.com](https://www.freenom.com)
2. Search for domain (e.g., `mynimbusv ault.tk`)
3. Register free domain (1 year)
4. Go to **Manage Domain** → **Manage Freenom DNS**
5. Add custom domain to Vercel:
   - In Vercel project settings
   - Go to **Domains**
   - Add your custom domain
   - Vercel will show DNS records to add
   - Copy to Freenom DNS

### Using Vercel Subdomain (Easy, Free)

Vercel gives you free subdomain: `your-app.vercel.app`
- No setup needed
- Works immediately

---

## 6️⃣ Monitoring & Maintenance

### Free Logs

**Render Backend Logs:**
- Go to your service in Render
- Click **Logs** tab
- View real-time logs

**Vercel Frontend Logs:**
- Go to your project in Vercel
- Click **Deployments**
- Click any deployment → **Logs**

### Keep Services Running

**Render Hobby Plan:**
- Spins down after 15 minutes of inactivity
- First request takes 30 seconds to wake up
- **Solution**: Use a cron job (free services like EasyCron or UptimeRobot)

**Setup Keep-Alive:**
```bash
# Visit UptimeRobot.com (free)
# Create monitor for your backend URL
# Check every 5 minutes
# Free forever!
```

### Database Backups

**MongoDB Atlas:**
- Automatic backups included (free tier)
- Go to Backup → Snapshot
- Backups retained for 7 days

---

## 7️⃣ Limitations & Workarounds

| Limitation | Free Tier | Workaround |
|-----------|-----------|----------|
| Database Storage | 512 MB | Max ~50k files, enough for testing |
| Backend Spin Down | 15 min inactivity | Use UptimeRobot ping |
| Bandwidth | 100 GB/month | Sufficient for most use cases |
| API Calls | Unlimited | No rate limiting |

---

## 8️⃣ Troubleshooting

### Backend not connecting to database

**Error**: `MongooseError` or connection timeout

**Solution**:
1. Verify MongoDB URI in Render environment variables
2. Check username/password are correct
3. Check IP whitelist includes 0.0.0.0/0
4. Test connection locally first

### CORS errors on frontend

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Update `CORS_ORIGIN` in backend to match frontend URL
2. Make sure it includes `https://` protocol
3. Redeploy backend

### Frontend API calls failing

**Error**: `API_URL undefined` or 404 errors

**Solution**:
1. Verify `VITE_API_URL` environment variable in Vercel
2. Check backend service is running (Render logs)
3. Verify API endpoint paths are correct
4. Test with curl: `curl https://your-backend.onrender.com/api/files`

### Slow initial load

**Cause**: Backend spinning up from hibernation

**Solution**: Set up UptimeRobot to ping backend every 5 minutes

---

## 9️⃣ Upgrade Paths (When You Earn Money)

If your app becomes popular:

**Render**: Upgrade to paid tier ($7/month) for always-on service
**Vercel**: Stays free for most projects
**MongoDB Atlas**: Upgrade to paid cluster ($9/month) for more storage

**Total Upgrade Cost**: ~$16/month (vs $50+ on other platforms)

---

## 🎯 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created and password saved
- [ ] Network access configured (0.0.0.0/0)
- [ ] MongoDB URI obtained and copied
- [ ] Backend Dockerfile exists
- [ ] Backend environment variables configured in Render
- [ ] Backend deployed and URL copied
- [ ] Frontend environment variables configured in Vercel
- [ ] Frontend deployed and URL copied
- [ ] Backend CORS_ORIGIN updated to frontend URL
- [ ] Frontend API URL points to backend
- [ ] All features tested (register, login, upload, download)
- [ ] UptimeRobot configured (optional but recommended)
- [ ] Custom domain setup (optional)

---

## 🚀 You're Live!

Your NimbusVault application is now:
- ✅ Deployed globally
- ✅ Backed by MongoDB
- ✅ Completely free
- ✅ Production-ready

**Next Steps:**
1. Share your app with friends
2. Get feedback and improve
3. When you're ready to monetize, upgrade to paid tiers

---

## Support

Having issues?

1. Check the logs in Render and Vercel
2. Verify all environment variables
3. Test API locally: `curl http://localhost:5000/api/health`
4. Check MongoDB connection: `mongosh` command in Atlas
5. Review GitHub issues or create one

**Happy Deploying! 🎉**
