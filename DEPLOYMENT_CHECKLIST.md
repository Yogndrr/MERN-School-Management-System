# 📋 Deployment Checklist

## Pre-Deployment

### MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user with password
- [ ] Whitelist all IP addresses (0.0.0.0/0)
- [ ] Get connection string
- [ ] Replace `<password>` in connection string
- [ ] Add database name to connection string
- [ ] Test connection locally (optional)

### Data Migration (Optional)
- [ ] Export data from local MongoDB
- [ ] Import data to MongoDB Atlas
- [ ] Verify data in Atlas dashboard

### Code Preparation
- [ ] Commit all changes to GitHub
- [ ] Push to main branch
- [ ] Verify all files are pushed

## Backend Deployment

### Vercel Setup
- [ ] Create Vercel account (sign up with GitHub)
- [ ] Import GitHub repository
- [ ] Select backend as root directory

### Backend Configuration
- [ ] Set Framework Preset: Other
- [ ] Set Root Directory: `backend`
- [ ] Leave Build Command empty
- [ ] Leave Output Directory empty
- [ ] Set Install Command: `npm install`

### Backend Environment Variables
Add these in Vercel dashboard:
- [ ] `MONGO_URL` = Your MongoDB Atlas connection string
- [ ] `PORT` = 5000
- [ ] `NODE_ENV` = production
- [ ] `FRONTEND_URL` = (will add after frontend deployment)

### Deploy Backend
- [ ] Click Deploy
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://your-backend.vercel.app`)
- [ ] Test health endpoint: `https://your-backend.vercel.app/health`

## Frontend Deployment

### Frontend Configuration
- [ ] Update `frontend/.env.production` with backend URL
- [ ] Commit and push changes

### Vercel Setup
- [ ] Create new project in Vercel
- [ ] Import same GitHub repository
- [ ] Select frontend as root directory

### Frontend Configuration
- [ ] Set Framework Preset: Create React App
- [ ] Set Root Directory: `frontend`
- [ ] Set Build Command: `npm run build`
- [ ] Set Output Directory: `build`
- [ ] Set Install Command: `npm install`

### Frontend Environment Variables
Add in Vercel dashboard:
- [ ] `REACT_APP_API_URL` = Your backend URL

### Deploy Frontend
- [ ] Click Deploy
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL (e.g., `https://your-app.vercel.app`)

## Post-Deployment

### Update Backend CORS
- [ ] Go to backend Vercel project
- [ ] Settings → Environment Variables
- [ ] Add `FRONTEND_URL` = Your frontend Vercel URL
- [ ] Redeploy backend (Deployments → Click ⋯ → Redeploy)

### Testing
- [ ] Open frontend URL in browser
- [ ] Test admin login
- [ ] Test student list loading
- [ ] Test teacher list loading
- [ ] Test adding new student
- [ ] Test adding new teacher
- [ ] Test all CRUD operations
- [ ] Test on mobile device
- [ ] Test on different browsers

### Security
- [ ] Verify HTTPS is working (automatic with Vercel)
- [ ] Check MongoDB Atlas network access
- [ ] Review environment variables (no secrets exposed)
- [ ] Test rate limiting

## Optional Enhancements

### Custom Domain (Optional)
- [ ] Purchase domain
- [ ] Add domain in Vercel
- [ ] Update DNS records
- [ ] Wait for SSL certificate

### Monitoring
- [ ] Set up Vercel Analytics
- [ ] Configure MongoDB Atlas alerts
- [ ] Set up error tracking (Sentry, etc.)

### Backup Strategy
- [ ] Enable MongoDB Atlas automated backups
- [ ] Document backup restoration process
- [ ] Test backup restoration

## Troubleshooting

### If frontend doesn't load:
1. Check Vercel deployment logs
2. Verify build completed successfully
3. Check browser console for errors

### If API calls fail:
1. Verify backend is deployed and running
2. Check CORS configuration
3. Verify REACT_APP_API_URL is correct
4. Check browser network tab

### If database connection fails:
1. Verify MongoDB Atlas connection string
2. Check IP whitelist (should be 0.0.0.0/0)
3. Verify database user credentials
4. Check MongoDB Atlas status

## Success Criteria

✅ Frontend loads without errors
✅ Admin can login
✅ Student list displays
✅ Teacher list displays
✅ Can add/edit/delete students
✅ Can add/edit/delete teachers
✅ All features work as in local development

## Deployment URLs

**Frontend:** ___________________________________

**Backend:** ___________________________________

**MongoDB Atlas:** ___________________________________

**Deployment Date:** ___________________________________

---

## 🎉 Deployment Complete!

Your school management system is now live and accessible worldwide!

**Next Steps:**
1. Share URLs with stakeholders
2. Create user accounts
3. Import/create school data
4. Train users on the system
5. Monitor performance and usage
