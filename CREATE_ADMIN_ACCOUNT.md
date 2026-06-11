# Create Admin Account in MongoDB Atlas

## Method 1: Using MongoDB Atlas Dashboard (Easiest)

### Step 1: Go to MongoDB Atlas
1. Open: https://cloud.mongodb.com
2. Login with your credentials
3. Click on your cluster: `schoolmanagement`

### Step 2: Browse Collections
1. Click **"Browse Collections"** button
2. Find database: `school-management`
3. Find collection: `admins`
4. Click **"Insert Document"**

### Step 3: Insert Admin Document
Copy and paste this JSON (replace the password hash):

```json
{
  "name": "Mike Fikadu",
  "email": "admin@bisnoc.edu",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "Admin",
  "schoolName": "BIS NOC Gerji Campus",
  "createdAt": {"$date": "2024-01-23T00:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-23T00:00:00.000Z"}
}
```

**Problem:** We need to hash the password first!

---

## Method 2: Create Admin via Backend Script (Recommended)

I'll create a script you can run locally that will add an admin to your MongoDB Atlas database.

### Step 1: Create the script

Save this as `backend/create-admin-atlas.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB Atlas connection string
const MONGO_URL = "mongodb+srv://mike_fikadu:MsIYXiWexqEODVUg@schoolmanagement.fdvv8jd.mongodb.net/school-management?retryWrites=true&w=majority";

// Admin Schema
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "Admin" },
    schoolName: { type: String }
}, { timestamps: true });

const Admin = mongoose.model("admin", adminSchema);

async function createAdmin() {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URL);
        console.log('✅ Connected to MongoDB Atlas');

        // Admin details
        const adminData = {
            name: "Mike Fikadu",
            email: "admin@bisnoc.edu",
            password: "admin123",
            schoolName: "BIS NOC Gerji Campus",
            role: "Admin"
        };

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin already exists with this email');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Name:', existingAdmin.name);
            process.exit(0);
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin
        const admin = new Admin({
            ...adminData,
            password: hashedPassword
        });

        console.log('💾 Saving admin to database...');
        await admin.save();

        console.log('\n✅ Admin account created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', adminData.password);
        console.log('👤 Name:', adminData.name);
        console.log('🏫 School:', adminData.schoolName);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🌐 Login at: https://mern-school-management-system-js92.vercel.app/admin-login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
```

### Step 2: Run the script

```bash
cd backend
node create-admin-atlas.js
```

### Step 3: Login
1. Go to: https://mern-school-management-system-js92.vercel.app/admin-login
2. Email: `admin@bisnoc.edu`
3. Password: `admin123`
4. Click Login

---

## Method 3: Quick Fix - Check Backend Logs

The signup might have worked but there's an issue. Let's check:

1. Go to Vercel Dashboard
2. Click on your **backend** project
3. Go to **Deployments** → Click latest deployment
4. Click **Functions** → **index**
5. Check logs for any errors during signup

---

## Which method do you want to try?

1. **Method 2** (Run script locally) - Fastest and most reliable
2. **Method 3** (Check logs) - To see what went wrong
3. **Try signup again** with different email

Let me know and I'll help you through it! 🚀
