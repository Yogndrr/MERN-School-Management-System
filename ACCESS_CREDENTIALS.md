# BIS NOC School Management System - Access Credentials

## 🔐 Welcome Page Access

### Access Code
```
BIS2024
```

**How to Access:**
1. Open http://localhost:3000
2. Click "Start Here" button
3. Enter access code: `BIS2024`
4. You'll be redirected to the login selection page

---

## 👥 Default Login Credentials

### Admin Account
After accessing the system, you can create an admin account:

**Registration:**
- Navigate to "Sign up" or go to `/Adminregister`
- Fill in the form:
  - Name: `BIS NOC Admin`
  - Email: `admin@bisnoc.edu`
  - Password: `Admin@123`
  - School Name: `British International School NOC`

**Login:**
- Email: `admin@bisnoc.edu`
- Password: `Admin@123`

---

## 🎓 Creating Teacher Accounts

Once logged in as admin, you can create teacher accounts with different roles:

### Main Teacher (12 users)
```json
{
  "username": "john_teacher",
  "email": "john@bisnoc.edu",
  "password": "Teacher@123",
  "role": "main_teacher"
}
```

**Permissions:**
- Create, read, update, delete students
- Transfer students between classes
- Mark homeroom attendance
- View all marks and generate reports

### Assistant Teacher (12 users)
```json
{
  "username": "jane_assistant",
  "email": "jane@bisnoc.edu",
  "password": "Teacher@123",
  "role": "assistant_teacher"
}
```

**Permissions:**
- Read and limited update of students
- Mark homeroom attendance
- View marks (read-only)
- Cannot delete or transfer students

### Subject Teacher (10 users)
```json
{
  "username": "mike_math",
  "email": "mike@bisnoc.edu",
  "password": "Teacher@123",
  "role": "subject_teacher"
}
```

**Permissions:**
- Mark subject-wise attendance
- Enter and update marks for their subjects
- View students in their subjects only

---

## 📝 Quick Start Guide

### Step 1: Access the System
1. Go to http://localhost:3000
2. Click "Start Here"
3. Enter access code: `BIS2024`

### Step 2: Create Admin Account
1. Click "Sign up"
2. Fill in admin details
3. Submit registration

### Step 3: Login as Admin
1. Select "Admin" from login options
2. Enter admin credentials
3. Access admin dashboard

### Step 4: Set Up School
1. Create classes (e.g., Grade 10A, Grade 11B)
2. Create subjects (e.g., Mathematics, English)
3. Create teacher accounts with appropriate roles
4. Add students to classes

### Step 5: Start Using Features
- Mark attendance (homeroom or subject-wise)
- Enter marks and grades
- Transfer students between classes
- Track special needs students
- Generate reports and analytics

---

## 🔒 Security Notes

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Recommended Passwords
- Admin: `Admin@2024BIS`
- Teachers: `Teacher@2024BIS`
- Students: `Student@2024BIS`

### Changing Access Code
To change the welcome page access code, edit:
```javascript
// frontend/src/pages/Homepage.js
// Line ~25
if (accessCode === 'BIS2024') {  // Change 'BIS2024' to your desired code
    navigate('/choose');
}
```

---

## 🎨 Customization

### School Branding
The welcome page displays:
- **School Name:** British International School
- **Campus:** NOC - Gerji Campus
- **Colors:** Blue (#1e40af) and Lemon (#fde047)

### Features Highlighted
✓ Multi-role access control
✓ Real-time attendance tracking
✓ Academic performance analytics
✓ Special needs accommodation

---

## 📞 Support

### Common Issues

**Issue:** Can't access the welcome page
**Solution:** Make sure frontend is running on http://localhost:3000

**Issue:** Access code not working
**Solution:** Code is case-sensitive. Use exactly: `BIS2024`

**Issue:** Can't create admin account
**Solution:** Make sure backend is running on http://localhost:5000

**Issue:** Forgot admin password
**Solution:** Check MongoDB database or create a new admin account

---

## 🚀 Next Steps

1. ✅ Access the system with code `BIS2024`
2. ✅ Create admin account
3. ✅ Set up classes and subjects
4. ✅ Create teacher accounts
5. ✅ Add students
6. ✅ Start marking attendance
7. ✅ Enter academic marks
8. ✅ Generate reports

---

**System Status:** ✅ Running
**Frontend:** http://localhost:3000
**Backend:** http://localhost:5000
**Database:** MongoDB (bis_noc_school)

**Access Code:** `BIS2024` 🔑
