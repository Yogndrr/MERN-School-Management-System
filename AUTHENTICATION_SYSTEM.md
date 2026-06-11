# Authentication & Login System

## Overview
Complete authentication system for British International School with three portals: Admin, Teacher, and Student.

## Portal Access

### 1. Admin Portal
**URL:** `/admin-login`
**Features:**
- Login with email and password
- Registration for new admins
- Quick Access (Guest mode for testing)

**Default Credentials:**
- Register a new admin account or use Quick Access

### 2. Teacher Portal
**URL:** `/teacher-login`
**Features:**
- Login with Teacher ID and password
- Access to class management, attendance, assignments, and messages

**Credentials Generation:**
- When admin adds a teacher, credentials are auto-generated
- Format: `TCH001`, `TCH002`, etc.
- Default password: `{TeacherID}@bis` (e.g., `TCH001@bis`)
- Credentials displayed in popup dialog after creation

### 3. Student Portal
**URL:** `/login`
**Features:**
- Login with Student ID and password
- Access to personal dashboard, grades, attendance, and assignments

**Credentials Generation:**
- When admin adds a student, credentials are auto-generated
- Format: `BIS2024XXXX` (e.g., `BIS20240001`)
- Default password: `{StudentID}@bis` (e.g., `BIS20240001@bis`)
- Credentials displayed in popup dialog after creation

## Homepage Navigation
The homepage (`/`) provides a single "Start Here" button that takes users to the main dashboard.

## Sidebar Login System
When users click on any portal section in the sidebar, a login dialog appears:
1. **Admin Dashboard** - Shows login/register tabs (blue theme)
2. **Teachers Portal** - Shows teacher login form (green theme)
3. **Students Portal** - Shows student login form (purple theme)

## Credential Management

### Adding Teachers
1. Navigate to Admin Dashboard → Teachers Management
2. Click "Add Teacher"
3. Fill in teacher details (name, email, role, etc.)
4. Optional: Set custom password (otherwise auto-generated)
5. After saving, credentials popup appears with:
   - Teacher ID
   - Password
   - Copy to clipboard option

### Adding Students
1. Navigate to Admin Dashboard → Student Management
2. Click "Add Student"
3. Fill in student details (name, roll number, class, etc.)
4. Optional: Set custom password (otherwise auto-generated)
5. After saving, credentials popup appears with:
   - Student ID
   - Password
   - Copy to clipboard option

## Backend Updates

### Teacher Schema
Added `teacherId` field:
```javascript
teacherId: {
    type: String,
    unique: true,
    sparse: true
}
```

### Teacher Login Controller
Updated to support login with either email or teacherId:
```javascript
const loginField = req.body.email || req.body.teacherId;
let teacher = await Teacher.findOne({ 
    $or: [
        { email: loginField },
        { teacherId: loginField }
    ]
});
```

### Teacher Registration
Auto-generates teacherId if not provided:
```javascript
const teacherCount = await Teacher.countDocuments();
generatedTeacherId = `TCH${String(teacherCount + 1).padStart(3, '0')}`;
```

## Security Features
- Passwords are hashed using bcrypt
- Unique IDs prevent duplicates
- Session management with localStorage
- Protected routes require authentication

## User Flow

### Admin Flow
1. Visit homepage → Click "Start Here"
2. In the sidebar, click "Admin Dashboard"
3. Login dialog appears with Login/Register tabs
4. Login or Register
5. Access full dashboard with all management features
6. Add teachers/students and receive their credentials
7. Distribute credentials to respective users

### Teacher Flow
1. Receive credentials from admin
2. Visit homepage → Click "Start Here"
3. In the sidebar, click "Teachers Portal"
4. Login dialog appears
5. Enter Teacher ID and password
6. Access teacher dashboard with class management tools

### Student Flow
1. Receive credentials from admin
2. Visit homepage → Click "Start Here"
3. In the sidebar, click "Students Portal"
4. Login dialog appears
5. Enter Student ID and password
6. Access student dashboard with personal information

## Routes Summary

### Frontend Routes
- `/` - Homepage with portal selection
- `/admin-login` - Admin login/registration
- `/teacher-login` - Teacher login
- `/login` - Student login
- `/dashboard/*` - Admin dashboard (protected)
- `/teacher/dashboard` - Teacher dashboard (protected)

### Backend Routes
- `POST /AdminReg` - Admin registration
- `POST /AdminLogin` - Admin login
- `POST /TeacherReg` - Teacher registration
- `POST /TeacherLogin` - Teacher login (email or teacherId)
- `POST /StudentReg` - Student registration
- `POST /StudentLogin` - Student login

## Notes
- All credentials are displayed only once during creation
- Admins should save credentials immediately
- Default passwords follow the pattern: `{ID}@bis`
- Custom passwords can be set during user creation
- Credentials can be copied to clipboard for easy sharing
