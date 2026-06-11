# BIS NOC School Management System - Complete Overview

## 🎓 British International School NOC - Gerji Campus

### System Architecture
**Full-Stack MERN Application**
- **Frontend**: React 18+ with Material-UI v5
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with 8-hour expiry
- **Security**: Helmet, rate limiting, input sanitization

---

## 👥 User Roles & Counts

### Total Users: 36
1. **Admins**: 2 users
2. **Main Teachers**: 12 users
3. **Assistant Teachers**: 12 users
4. **Subject Teachers**: 10 users

### Students
- **Total**: ~250 students
- **Classes**: 12 classes
- **Average per class**: ~21 students

---

## 🎯 Key Features Implemented

### 1. Multi-Role Authentication System
- JWT-based authentication with 8-hour token expiry
- Role-based access control (RBAC)
- Login history tracking
- Password strength validation
- Secure password hashing with bcrypt

### 2. Complex Teacher-Subject-Class Relationships

#### Main Teachers (12)
- Manage one homeroom class
- Teach 4 different subjects
- Can teach same subject to multiple classes
- Full student management permissions
- Can transfer students

#### Subject Teachers (10)
- Teach one subject (e.g., English)
- Access all 12 classes for their subject
- Mark subject-wise attendance
- Enter marks for their subject only

#### Assistant Teachers (12)
- Support main teachers
- Mark homeroom attendance
- Limited student update permissions
- Cannot delete or transfer students

#### Special Needs Teachers
- Support students with special needs
- Track accommodations
- Assigned to specific students

### 3. Student Management
- Unique student IDs (e.g., BIS202400001)
- Complete profile with parent contact
- Special needs tracking (5 categories)
- Transfer history with full data migration
- Active/inactive status

### 4. Dual Attendance System

#### Homeroom Attendance
- Marked by main teachers or assistant teachers
- Once per day
- Class-level tracking

#### Subject-Wise Attendance
- Marked by subject teachers
- Per subject per class
- Session-based tracking

#### Attendance Status
- **P**: Present
- **L**: Late
- **A**: Absent (reason required)
- **AP**: Absent with Permission (reason required)

### 5. Academic Management

#### Term-Based Marksheets
- 4 terms: Term 1, Term 2, Term 3, Final
- Dynamic marks entry (flexible components)
- Auto-calculation: total, percentage, grade
- Grade system: A+, A, B+, B, C, D, F

#### Features
- Subject teachers enter marks
- Main teachers view all marks
- Performance analytics
- Grade distribution
- Top performers tracking

### 6. Library Management System

#### Features
- Book borrowing and returning
- ISBN and author tracking
- Book categories (8 types)
- Condition tracking (borrowed vs returned)
- Maximum 3 books per student
- Overdue prevention
- Automatic fine calculation (5 ETB/day)
- Fine payment tracking

#### Book Categories
- Fiction, Non-Fiction, Science, Mathematics
- History, Literature, Reference, Other

### 7. Clinic Management System

#### Comprehensive Medical Records
- Detailed incident documentation
- Vital signs tracking
- Symptoms and diagnosis
- Treatment documentation
- Medication tracking

#### Incident Types
- Illness, Injury, Accident, Emergency
- Routine Checkup, Medication, First Aid, Other

#### Severity Levels
- Minor, Moderate, Severe, Critical

#### Leave Request System
- Nurse/staff records visit
- Requests leave if needed
- Admin reviews case report
- Admin approves/rejects with notes
- Parent notification tracking

#### Follow-Up Management
- Schedule follow-up visits
- Track completion
- Add follow-up notes

### 8. Enhanced Student Transfer System

#### Seamless Data Migration
When a student transfers from one class to another:
1. Student record updated
2. Transfer history recorded
3. **All data migrated automatically**:
   - Attendance records
   - Marksheet records
   - Library records
   - Clinic records

#### Benefits
- No data loss during transfers
- Complete history maintained
- Streamlined class management
- Main teacher controls transfers

---

## 📊 Database Models

### Core Models
1. **Admin** - School administrators
2. **User** - Multi-role users (teachers, staff)
3. **Student** - Student records with special needs
4. **Teacher** - Enhanced with multiple subjects/classes
5. **Class (Sclass)** - Class information
6. **Subject** - Subject details

### Academic Models
7. **Attendance** - Dual tracking (homeroom + subject)
8. **Marksheet** - Term-based academic records

### Support Services Models
9. **Library** - Book borrowing system
10. **Clinic** - Medical records and leave requests

### Relationships
- One student → Multiple attendance records
- One student → Multiple marksheet records
- One student → Multiple library records
- One student → Multiple clinic records
- One teacher → Multiple subjects
- One teacher → Multiple classes
- One subject → Multiple teachers
- One subject → Multiple classes

---

## 🔐 Security Features

### Authentication
- JWT tokens with 8-hour expiry
- Secure password hashing (bcrypt)
- Login history tracking
- IP address logging

### Authorization
- Role-based access control
- Permission checking middleware
- Route-level protection

### API Security
- Helmet.js security headers
- Rate limiting (5 req/15min for auth, 100 req/15min for API)
- Input sanitization
- XSS protection
- CORS configuration

---

## 📈 Analytics & Reporting

### Attendance Analytics
- Daily distribution (P/L/A/AP)
- Monthly trends
- Class-wise comparison
- Absence reasons breakdown
- Special needs student tracking

### Academic Analytics
- Performance charts
- Subject-wise analysis
- Grade distribution
- Class averages
- Top performers
- Student progress tracking

### Library Analytics
- Total books borrowed
- Currently borrowed
- Overdue books
- Popular books (top 10)
- Category distribution
- Fine statistics

### Clinic Analytics
- Total visits
- Visits by incident type
- Visits by severity
- Daily trends
- Leave request statistics
- Frequent visitors
- Outcome distribution

---

## 🚀 API Endpoints Summary

### Authentication (8 endpoints)
- Login, logout, register, current user, change password

### Attendance (5 endpoints)
- Mark, view by class, student history, analytics, delete

### Marksheet (6 endpoints)
- Upsert, view by class, student marksheet, analytics, delete, bulk import

### Students (7 endpoints)
- Register, profile, transfer, transfer history, special needs, bulk import

### Library (7 endpoints)
- Issue, return, student history, borrowed, overdue, pay fine, analytics

### Clinic (8 endpoints)
- Record visit, student history, all visits, leave requests, process leave, follow-up, analytics, case report

### Transfer (1 endpoint)
- Transfer with complete data migration

**Total**: 42+ API endpoints

---

## 🎨 Frontend Features

### Welcome Page
- Beautiful branded design
- BIS NOC - Gerji Campus branding
- Access gate with code: **BIS2024**
- Blue and yellow color scheme
- Responsive design

### Theme
- Primary Blue: #1e40af
- Secondary Blue: #3b82f6
- Accent Lemon: #fde047
- Material-UI v5 custom theme

### Utilities
- Date formatting (date-fns)
- Form validation (yup, react-hook-form)
- Chart visualization (Chart.js, Recharts)
- Export functionality (file-saver)
- API service layer (Axios with interceptors)

---

## 📝 Workflow Examples

### Main Teacher Daily Workflow
1. Login with credentials
2. Mark homeroom attendance (P/L/A/AP)
3. Teach 4 different subjects across classes
4. Mark subject-wise attendance
5. Enter marks for subjects
6. Issue/return library books
7. Record clinic visits if needed
8. Transfer students if necessary
9. View analytics and reports

### Subject Teacher (English) Workflow
1. Login with credentials
2. Access all 12 classes
3. Mark attendance for English class
4. Enter marks for English subject
5. View student performance
6. Generate subject reports

### Student Transfer Example
```
Student: John Doe (BIS202400015)
Current Class: Grade 10A
Transfer To: Grade 10B
Reason: Better learning pace match

Main Teacher Actions:
1. Initiate transfer
2. Select new class
3. Add reason
4. Confirm transfer

System Actions:
1. Update student record
2. Add to transfer history
3. Migrate 52 attendance records
4. Migrate 12 marksheet records
5. Migrate 1 library record
6. Migrate 2 clinic records
7. Generate transfer summary

Result: All data now in Grade 10B
```

### Library Workflow
```
Student borrows "To Kill a Mockingbird"
- Issue date: Jan 15, 2024
- Due date: Jan 29, 2024 (14 days)
- Condition: Good

Student returns late: Feb 5, 2024
- Days late: 7 days
- Fine: 7 × 5 ETB = 35 ETB
- Return condition: Good
- Fine paid: Yes
```

### Clinic Workflow
```
Student: Alice Johnson
Incident: Fell during PE class
Type: Injury
Severity: Moderate

Clinic Visit:
- Chief complaint: Sprained ankle
- Vital signs recorded
- Diagnosis: Grade 1 ankle sprain
- Treatment: Ice, compression, elevation
- Outcome: Sent home

Leave Request:
- Duration: 2 days
- Reason: Rest and recovery
- Status: Pending

Admin Reviews:
- Reads case report
- Contacts parent
- Approves leave
- Status: Approved
```

---

## 🎯 System Capabilities

### For 250 Students Across 12 Classes
- ✅ Track daily attendance (homeroom + subjects)
- ✅ Manage academic performance (4 terms)
- ✅ Monitor library usage (up to 750 books borrowed)
- ✅ Record medical incidents
- ✅ Process leave requests
- ✅ Transfer students seamlessly
- ✅ Track special needs (5 categories)
- ✅ Generate comprehensive reports
- ✅ Export data (CSV, PDF, BIS NOC format)

### Performance Targets
- Page load: < 3 second