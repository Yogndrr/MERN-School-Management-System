# BIS NOC School Management System - API Testing Guide

## 🧪 Testing the Enhanced APIs

### Prerequisites
- Backend running on `http://localhost:5000`
- MongoDB running locally
- Postman or similar API testing tool

## 1. Admin Setup (First Time)

### Create Admin Account
```http
POST http://localhost:5000/AdminReg
Content-Type: application/json

{
  "name": "BIS NOC Admin",
  "email": "admin@bisnoc.edu",
  "password": "admin123",
  "schoolName": "BIS NOC Campus"
}
```

### Admin Login (Get Token)
```http
POST http://localhost:5000/api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@bisnoc.edu",
  "password": "admin123"
}
```

**Response**: Save the `token` from response for subsequent requests.

## 2. User Management (Admin Only)

### Create Main Teacher
```http
POST http://localhost:5000/api/auth/register
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "username": "john_teacher",
  "email": "john@bisnoc.edu",
  "password": "Teacher@123",
  "role": "main_teacher",
  "schoolId": "YOUR_SCHOOL_ID",
  "assignedClasses": [],
  "assignedSubjects": []
}
```

### Create Assistant Teacher
```http
POST http://localhost:5000/api/auth/register
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "username": "jane_assistant",
  "email": "jane@bisnoc.edu",
  "password": "Teacher@123",
  "role": "assistant_teacher",
  "schoolId": "YOUR_SCHOOL_ID",
  "assignedClasses": []
}
```

### Create Subject Teacher
```http
POST http://localhost:5000/api/auth/register
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "username": "mike_math",
  "email": "mike@bisnoc.edu",
  "password": "Teacher@123",
  "role": "subject_teacher",
  "schoolId": "YOUR_SCHOOL_ID",
  "assignedSubjects": []
}
```

## 3. Class & Subject Setup (Use existing endpoints)

### Create Class
```http
POST http://localhost:5000/SclassCreate
Content-Type: application/json

{
  "sclassName": "Grade 10A",
  "adminID": "YOUR_SCHOOL_ID"
}
```

### Create Subject
```http
POST http://localhost:5000/SubjectCreate
Content-Type: application/json

{
  "subName": "Mathematics",
  "subCode": "MATH101",
  "sessions": "40",
  "sclassName": "CLASS_ID",
  "adminID": "YOUR_SCHOOL_ID"
}
```

## 4. Enhanced Student Registration

### Register Student with Special Needs
```http
POST http://localhost:5000/api/student/register
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "studentId": "BIS202400001",
  "name": "Alice Johnson",
  "rollNum": 1,
  "password": "student123",
  "sclassName": "CLASS_ID",
  "adminID": "YOUR_SCHOOL_ID",
  "parentContact": {
    "phone": "1234567890",
    "email": "parent@email.com",
    "emergencyContact": "0987654321"
  },
  "specialNeeds": {
    "hasSpecialNeeds": true,
    "category": "learning",
    "accommodations": ["Extra time on tests", "Front row seating"],
    "notes": "Requires additional support in mathematics"
  }
}
```

## 5. Attendance Management

### Mark Homeroom Attendance (Bulk)
```http
POST http://localhost:5000/api/attendance/mark
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "attendanceRecords": [
    {
      "studentId": "STUDENT_ID_1",
      "status": "P",
      "reason": ""
    },
    {
      "studentId": "STUDENT_ID_2",
      "status": "L",
      "reason": "Traffic delay"
    },
    {
      "studentId": "STUDENT_ID_3",
      "status": "A",
      "reason": "Sick"
    },
    {
      "studentId": "STUDENT_ID_4",
      "status": "AP",
      "reason": "Doctor appointment"
    }
  ],
  "date": "2024-01-15",
  "classId": "CLASS_ID",
  "attendanceType": "homeroom"
}
```

### Mark Subject Attendance
```http
POST http://localhost:5000/api/attendance/mark
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "attendanceRecords": [
    {
      "studentId": "STUDENT_ID_1",
      "status": "P",
      "reason": ""
    }
  ],
  "date": "2024-01-15",
  "classId": "CLASS_ID",
  "attendanceType": "subject",
  "subjectId": "SUBJECT_ID"
}
```

### Get Attendance by Class and Date
```http
GET http://localhost:5000/api/attendance/class?classId=CLASS_ID&date=2024-01-15&attendanceType=homeroom
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Student Attendance History
```http
GET http://localhost:5000/api/attendance/student/STUDENT_ID?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Attendance Analytics
```http
GET http://localhost:5000/api/attendance/analytics?schoolId=SCHOOL_ID&startDate=2024-01-01&endDate=2024-01-31&classId=CLASS_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

## 6. Marksheet Management

### Create/Update Marksheet
```http
POST http://localhost:5000/api/marksheet/upsert
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "subjectId": "SUBJECT_ID",
  "term": "Term 1",
  "marks": {
    "assignment1": 85,
    "assignment2": 90,
    "midterm": 88,
    "project": 92
  },
  "maxMarks": 400,
  "classId": "CLASS_ID"
}
```

### Get Marksheets by Class and Term
```http
GET http://localhost:5000/api/marksheet/class?classId=CLASS_ID&term=Term 1&subjectId=SUBJECT_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Student Marksheet
```http
GET http://localhost:5000/api/marksheet/student/STUDENT_ID?term=Term 1
Authorization: Bearer YOUR_TOKEN_HERE
```

### Get Academic Analytics
```http
GET http://localhost:5000/api/marksheet/analytics?schoolId=SCHOOL_ID&term=Term 1&classId=CLASS_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

### Bulk Import Marksheets
```http
POST http://localhost:5000/api/marksheet/bulk-import
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "marksheets": [
    {
      "studentId": "STUDENT_ID_1",
      "subjectId": "SUBJECT_ID",
      "term": "Term 1",
      "marks": {
        "test1": 85,
        "test2": 90
      },
      "maxMarks": 200,
      "classId": "CLASS_ID"
    },
    {
      "studentId": "STUDENT_ID_2",
      "subjectId": "SUBJECT_ID",
      "term": "Term 1",
      "marks": {
        "test1": 78,
        "test2": 82
      },
      "maxMarks": 200,
      "classId": "CLASS_ID"
    }
  ]
}
```

## 7. Student Transfer

### Transfer Student to Another Class
```http
PUT http://localhost:5000/api/student/transfer/STUDENT_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "toClassId": "NEW_CLASS_ID",
  "reason": "Better fit for student's learning pace"
}
```

### Get Transfer History
```http
GET http://localhost:5000/api/student/transfer-history/STUDENT_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

## 8. Special Needs Management

### Update Special Needs
```http
PUT http://localhost:5000/api/student/special-needs/STUDENT_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "hasSpecialNeeds": true,
  "category": "physical",
  "accommodations": ["Wheelchair accessible classroom", "Extra time for movement"],
  "notes": "Requires ground floor classroom"
}
```

### Get All Special Needs Students
```http
GET http://localhost:5000/api/student/special-needs?schoolId=SCHOOL_ID&category=learning
Authorization: Bearer YOUR_TOKEN_HERE
```

## 9. User Profile & Authentication

### Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### Change Password
```http
PUT http://localhost:5000/api/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

### Logout
```http
POST http://localhost:5000/api/auth/logout
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🔍 Testing Checklist

### Authentication
- [ ] Admin can login and get token
- [ ] Admin can create users with different roles
- [ ] Users can login with their credentials
- [ ] Token expires after 8 hours
- [ ] Invalid credentials are rejected
- [ ] Password change works correctly

### Attendance
- [ ] Main teacher can mark homeroom attendance
- [ ] Subject teacher can mark subject attendance
- [ ] Bulk attendance marking works
- [ ] Attendance status (P/L/A/AP) saved correctly
- [ ] Reason required for absences
- [ ] Analytics show correct statistics
- [ ] Student attendance history displays properly

### Marksheet
- [ ] Subject teacher can enter marks
- [ ] Marks auto-calculate total and percentage
- [ ] Grade assigned correctly based on percentage
- [ ] Marksheet can be updated
- [ ] Analytics show performance trends
- [ ] Bulk import works correctly

### Student Management
- [ ] Student registration with special needs
- [ ] Student profile shows complete information
- [ ] Transfer updates class and history
- [ ] Transfer history tracked correctly
- [ ] Special needs can be updated
- [ ] Special needs students can be filtered

### Authorization
- [ ] Admin has full access
- [ ] Main teacher can transfer students
- [ ] Assistant teacher cannot delete
- [ ] Subject teacher limited to their subjects
- [ ] Unauthorized requests return 403

## 📊 Expected Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [ ... ]
}
```

### Authentication Response
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "...",
    "email": "...",
    "role": "..."
  }
}
```

## 🐛 Common Issues

1. **401 Unauthorized**: Token missing or expired - Login again
2. **403 Forbidden**: Insufficient permissions - Check user role
3. **400 Bad Request**: Invalid data - Check request body
4. **404 Not Found**: Resource doesn't exist - Verify IDs
5. **500 Server Error**: Check server logs for details

## 💡 Tips

- Always include `Authorization: Bearer TOKEN` header for protected routes
- Use the admin token for initial setup
- Create classes and subjects before students
- Test with different user roles to verify permissions
- Check MongoDB to verify data is saved correctly
- Use the health check endpoint: `GET http://localhost:5000/health`

---

**Happy Testing! 🚀**
