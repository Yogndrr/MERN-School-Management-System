# 🚀 Deployment Guide: MongoDB Atlas + Vercel

## Part 1: MongoDB Atlas Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. After login, click **"Build a Database"**
2. Choose **FREE** tier (Shared, M0)
3. Select a cloud provider & region (choose closest to you):
   - AWS, Google Cloud, or Azure
   - Region: Choose nearest (e.g., US East, Europe West, Asia Pacific)
4. Cluster Name: `school-management` (or keep default)
5. Click **"Create"**

### Step 3: Create Database User
1. You'll see "Security Quickstart"
2. **Authentication Method**: Username and Password
3. Create credentials:
   - Username: `schooladmin` (or your choice)
   - Password: Click **"Autogenerate Secure Password"** and COPY IT!
   - ⚠️ **SAVE THIS PASSWORD** - you'll need it!
4. Click **"Create User"**

### Step 4: Set Network Access
1. Click **"Add IP Address"**
2. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed for Vercel deployment
3. Click **"Add Entry"**
4. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://schooladmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password
6. **Add database name** before the `?`:
   ```
   mongodb+srv://schooladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/school-management?retryWrites=true&w=majority
   ```

---

## Part 2: Migrate Local Data to Atlas (Optional)

### Option A: Export and Import Data

**Export from local MongoDB:**
```bash
# Export all collections
mongodump --db school --out ./backup

# Or export specific collections
mongoexport --db school --collection students --out students.json
mongoexport --db school --collection teachers --out teachers.json
mongoexport --db school --collection sclasses --out classes.json
mongoexport --db school --collection subjects --out subjects.json
mongoexport --db school --collection admins --out admins.json
```

**Import to MongoDB Atlas:**
```bash
# Replace with your Atlas connection string
mongoimport --uri "mongodb+srv://schooladmin:PASSWORD@cluster0.xxxxx.mongodb.net/school-management" --collection students --file students.json

mongoimport --uri "mongodb+srv://schooladmin:PASSWORD@cluster0.xxxxx.mongodb.net/school-management" --collection teachers --file teachers.json

mongoimport --uri "mongodb+srv://schooladmin:PASSWORD@cluster0.xxxxx.mongodb.net/school-management" --collection sclasses --file classes.json

mongoimport --uri "mongodb+srv://schooladmin:PASSWORD@cluster0.xxxxx.mongodb.net/school-management" --collection subjects --file subjects.json

mongoimport --uri "mongodb+srv://schooladmin:PASSWORD@cluster0.xxxxx.mongodb.net/school-management" --collection admins --file admins.json
```

### Option B: Start Fresh
- Skip migration and create new data in production
- Use the admin panel to add students, teachers, classes

---

## Part 3: Prepare Backend for Deployment

### Step 1: Update Environment Variables
Create/update `backend/.env`:
```env
# MongoDB Atlas Connection
MONGO_URL=mongodb+srv://schooladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/school-management?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production
```

### Step 2: Create vercel.json for Backend
Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Update Backend CORS
The backend already has CORS configured, but verify in `backend/index.js`:
```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend-app.vercel.app'  // Add after frontend deployment
    ],
    credentials: true
}));
```

---

## Part 4: Deploy Backend to Vercel

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy Backend via Vercel Dashboard

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

6. **Environment Variables** - Add these:
   ```
   MONGO_URL = mongodb+srv://schooladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/school-management?retryWrites=true&w=majority
   PORT = 5000
   NODE_ENV = production
   ```

7. Click **"Deploy"**
8. Wait for deployment (2-3 minutes)
9. Copy your backend URL: `https://your-backend.vercel.app`

---

## Part 5: Deploy Frontend to Vercel

### Step 1: Update Frontend API URL
Create `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

Update API calls in frontend to use environment variable.

### Step 2: Create vercel.json for Frontend
Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 3: Deploy Frontend

1. In Vercel Dashboard, click **"Add New Project"**
2. Select **same repository**
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://your-backend.vercel.app
   ```

5. Click **"Deploy"**
6. Wait for deployment (3-5 minutes)
7. Your app is live! 🎉

---

## Part 6: Update Backend CORS with Frontend URL

1. Go to backend Vercel project
2. Settings → Environment Variables
3. Add or update CORS origins in your code to include:
   ```
   https://your-frontend.vercel.app
   ```
4. Redeploy backend

---

## Part 7: Test Your Deployment

### Test Checklist:
- [ ] Frontend loads at Vercel URL
- [ ] Can access login page
- [ ] Admin login works
- [ ] Student list loads
- [ ] Teacher list loads
- [ ] Can add new student
- [ ] Can add new teacher
- [ ] All CRUD operations work

---

## Troubleshooting

### Issue: "Cannot connect to database"
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify connection string has correct password
- Check database user has read/write permissions

### Issue: "CORS error"
- Update backend CORS to include frontend Vercel URL
- Redeploy backend after CORS update

### Issue: "API calls failing"
- Check REACT_APP_API_URL is set correctly
- Verify backend is deployed and running
- Check browser console for exact error

### Issue: "Build failed"
- Check all dependencies are in package.json
- Verify Node version compatibility
- Check build logs in Vercel dashboard

---

## Environment Variables Summary

### Backend (.env)
```env
MONGO_URL=mongodb+srv://...
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.vercel.app
```

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Configure SSL (automatic with Vercel)
3. ✅ Set up monitoring and analytics
4. ✅ Create backup strategy for MongoDB Atlas
5. ✅ Set up CI/CD for automatic deployments

---

## Cost Breakdown

### Free Tier Limits:
- **MongoDB Atlas**: 512 MB storage (enough for ~10,000 students)
- **Vercel**: 100 GB bandwidth/month, unlimited deployments
- **Total Cost**: $0/month for small to medium schools

### When to Upgrade:
- MongoDB: When you exceed 512 MB or need better performance
- Vercel: When you exceed 100 GB bandwidth (unlikely for school use)

---

## 🎉 Congratulations!

Your school management system is now live and accessible from anywhere!

**Share your deployment URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.vercel.app`

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas monitoring
3. Review browser console errors
4. Check network tab for API calls
