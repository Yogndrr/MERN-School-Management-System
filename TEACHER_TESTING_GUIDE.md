# Teacher System Testing Guide

## Teacher Data in MongoDB

Now that you have teacher data in MongoDB, here's how to test the complete teacher workflow:

## 1. Verify Teacher Data in Database

### Check MongoDB directly:
```bash
# Connect to MongoDB
mongosh

# Switch to your database
use school

# View all teachers
db.teachers.find().pretty()

# Check specific teacher
db.teachers.findOne({ teacherId: "TCH001" })
```

### Expected Teacher Document Structure:
```json
{
  "_id": ObjectId("..."),
  "name": "John Smith",
  "teacherId": "TCH001",
  "email": "john@bisnoc.edu",
  "password": "$2b$10$...", // hashed
  "role": "Teacher",
  "teacherType": "main_teacher",
  "school": ObjectId("..."),
  "homeroomClass": ObjectId("..."),
  "teachSubjects": [...],
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## 2. Test Teacher Login Flow

### A. Via Homepage
1. Go to `http://localhost:3000`
2. Click "Get Started"
3. In sidebar, click "Teachers"
4. Login dialog appears
5. Enter credentials:
   - **Teacher ID**: `TCH001` (or your teacher's ID)
   - **Password**: Your teacher's password
6. Click "Sign In"
7. Should redirect to `/teacher/dashboard`

### B. Test Login API Directly

#### Using curl:
```bash
# Test with Teacher ID
curl -X POST http://localhost:5000/TeacherLogin \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "TCH001",
    "password": "your_password"
  }'

# Test with Email
curl -X POST http://localhost:5000/TeacherLogin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@bisnoc.edu",
    "password": "your_password"
  }'
```

#### Expected Success Response:
```json
{
  "_id": "...",
  "name": "John Smith",
  "teacherId": "TCH001",
  "email": "john@bisnoc.edu",
  "role": "Teacher",
  "teacherType": "main_teacher",
  "school": {
    "_id": "...",
    "schoolName": "British International School"
  },
  "teachSclass": {
    "_id": "...",
    "sclassName": "Year 3 - Blue"
  }
}
```

#### Expected Error Responses:
```json
// Wrong password
{ "message": "Invalid password" }

// Teacher not found
{ "message": "Teacher not found" }
```

## 3. Test Teacher Registration (Admin Adding Teacher)

### Via Admin Dashboard:
1. Login as Admin
2. Go to "Admin Dashboard" → "Teachers Management"
3. Click "Add Teacher"
4. Fill in details:
   - Name: "Jane Doe"
   - Email: "jane@bisnoc.edu"
   - Role: "Main Teacher"
   - Class: "Year 3 - Crimson"
   - Subjects: Select 4 subjects
5. Click "Add Teacher"
6. Credentials dialog appears with:
   - Teacher ID: `TCH002`
   - Password: `TCH002@bis` (or custom)
7. Copy credentials
8. Test login with new credentials

### Test Registration API:
```bash
curl -X POST http://localhost:5000/TeacherReg \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@bisnoc.edu",
    "password": "TCH002@bis",
    "role": "Teacher",
    "teacherType": "main_teacher",
    "school": "ADMIN_ID_HERE",
    "teachSclass": "CLASS_ID_HERE",
    "teachSubject": "SUBJECT_ID_HERE"
  }'
```

## 4. Test Teacher Dashboard Features

After successful login, verify:

### Dashboard Elements:
- ✅ Welcome card with teacher name
- ✅ Teacher role displayed
- ✅ Quick stats cards:
  - Students count
  - Assignments count
  - Messages count
  - Classes this week
- ✅ Navigation tabs:
  - My Classes
  - Attendance
  - Assignments
  - Messages

### Test Logout:
1. Click "Logout" button
2. Should clear localStorage
3. Redirect to homepage
4. Verify cannot access `/teacher/dashboard` without login

## 5. Common Issues & Solutions

### Issue: "Teacher not found"
**Solution:**
- Verify teacher exists in database
- Check teacherId spelling (case-sensitive)
- Ensure teacher has teacherId field

### Issue: "Invalid password"
**Solution:**
- Password is case-sensitive
- Check if password was hashed correctly
- Try resetting password in database

### Issue: Login successful but redirect fails
**Solution:**
- Check browser console for errors
- Verify localStorage is being set
- Check route configuration in App.js

### Issue: Teacher data not populating
**Solution:**
- Check if school/class references exist
- Verify populate() is working in backend
- Check network tab for API response

## 6. Testing Checklist

### Backend Tests:
- [ ] Teacher can login with teacherId
- [ ] Teacher can login with email
- [ ] Wrong password returns error
- [ ] Non-existent teacher returns error
- [ ] Teacher registration creates teacherId
- [ ] Password is hashed in database
- [ ] Teacher data includes all required fields

### Frontend Tests:
- [ ] Login dialog opens from sidebar
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Success redirects to dashboard
- [ ] Dashboard displays teacher info
- [ ] Logout clears session
- [ ] Protected routes work
- [ ] Credentials dialog shows after adding teacher

### Integration Tests:
- [ ] Admin can add teacher
- [ ] New teacher receives credentials
- [ ] New teacher can login immediately
- [ ] Teacher data syncs across pages
- [ ] Multiple teachers can login simultaneously

## 7. Sample Test Data

### Create Test Teachers:
```javascript
// In MongoDB shell or via API
db.teachers.insertMany([
  {
    name: "John Smith",
    teacherId: "TCH001",
    email: "john@bisnoc.edu",
    password: "$2b$10$hashed_password_here",
    role: "Teacher",
    teacherType: "main_teacher",
    school: ObjectId("admin_id"),
    homeroomClass: ObjectId("class_id")
  },
  {
    name: "Jane Doe",
    teacherId: "TCH002",
    email: "jane@bisnoc.edu",
    password: "$2b$10$hashed_password_here",
    role: "Teacher",
    teacherType: "subject_teacher",
    school: ObjectId("admin_id"),
    primarySubject: ObjectId("subject_id")
  }
])
```

## 8. Browser Console Tests

### Check localStorage after login:
```javascript
// In browser console
console.log('Teacher Access:', localStorage.getItem('teacherAccess'));
console.log('Teacher ID:', localStorage.getItem('teacherId'));
console.log('Teacher Name:', localStorage.getItem('teacherName'));
console.log('Teacher Email:', localStorage.getItem('teacherEmail'));
console.log('Teacher Role:', localStorage.getItem('teacherRole'));
```

### Test API call from console:
```javascript
fetch('http://localhost:5000/TeacherLogin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    teacherId: 'TCH001',
    password: 'your_password'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

## 9. Next Steps

After verifying teacher login works:
1. Test student login similarly
2. Verify admin can manage both teachers and students
3. Test cross-portal navigation
4. Implement teacher-specific features (attendance, assignments)
5. Add role-based permissions

## 10. Quick Test Script

Run this to test all teacher endpoints:
```bash
#!/bin/bash

echo "Testing Teacher Login with ID..."
curl -X POST http://localhost:5000/TeacherLogin \
  -H "Content-Type: application/json" \
  -d '{"teacherId": "TCH001", "password": "test123"}'

echo "\n\nTesting Teacher Login with Email..."
curl -X POST http://localhost:5000/TeacherLogin \
  -H "Content-Type: application/json" \
  -d '{"email": "john@bisnoc.edu", "password": "test123"}'

echo "\n\nTesting Invalid Login..."
curl -X POST http://localhost:5000/TeacherLogin \
  -H "Content-Type: application/json" \
  -d '{"teacherId": "INVALID", "password": "wrong"}'
```

## Support

If you encounter issues:
1. Check backend console for errors
2. Check browser console for frontend errors
3. Verify MongoDB connection
4. Check network tab in DevTools
5. Verify all environment variables are set
