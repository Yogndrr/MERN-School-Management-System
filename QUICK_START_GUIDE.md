# Quick Start Guide - BIS NOC Management System

## 🚀 System Status

✅ **Backend Server**: Running on `http://localhost:5000`  
✅ **Frontend Server**: Running on `http://localhost:3000`  
✅ **Database**: MongoDB connected with 267 users (25 teachers + 242 students)

---

## 🌐 Access the System

### Open in Browser:
```
http://localhost:3000
```

---

## 🔐 Test Login Credentials

### 1. Teacher Login
**Portal**: Click "Teachers" in sidebar

**Test Account**:
- Teacher ID: `TCH001`
- Password: `TCH001@bis`

**Other Teachers**: TCH001 through TCH025 (all use same password pattern)

---

### 2. Student Login
**Portal**: Click "Students" in sidebar

**Test Accounts**:
- Student ID: `Blue001`
- Password: `Blue001@bis`

**More Students**:
- `Crim001` / `Crim001@bis` (Crimson class)
- `Cyan001` / `Cyan001@bis` (Cyan class)
- `Purp001` / `Purp001@bis` (Purple class)
- etc. (242 students total)

---

### 3. Admin Login
**Portal**: Click "Admin" in sidebar

**Options**:
- Register a new admin account (Register tab)
- Or use Quick Access for testing

---

## 📚 Explore Class Management

### View Students by Class:
1. Login as Admin or Teacher
2. In sidebar, expand "All Classes"
3. Click any class (e.g., "Year 3 - Blue")
4. Click "Manage Students" tab
5. See all students in that class with:
   - Student list with avatars
   - Attendance percentages
   - Average grades
   - Actions (View, Transfer, Remove)

### Class Statistics:
Each class shows:
- Total students
- Average attendance
- Average grade
- Special needs count

---

## 🎯 Key Features to Test

### 1. Homepage
- Clean minimalist design
- Single "Get Started" button
- Black square logo with "B"

### 2. Sidebar Navigation
- Click portal names to open login dialogs
- Expand "All Classes" to see 12 classes
- Access Library and Clinic

### 3. Student Management
- View complete student list per class
- Click eye icon to view student details
- Click transfer icon to move students
- Click delete icon to remove students
- Add new students with "Add Student" button

### 4. Teacher Dashboard
- Login as teacher to see:
  - Welcome card
  - Quick stats (Students, Assignments, Messages, Classes)
  - Navigation tabs

### 5. Student Dashboard
- Login as student to see:
  - Personal welcome card
  - Academic stats
  - Quick links

---

## 📊 System Overview

### Users:
- **Teachers**: 25 (TCH001-TCH025)
- **Students**: 242 across 12 classes
- **Admins**: Create your own

### Classes (12 total):
1. Year 3 - Blue (22 students)
2. Year 3 - Crimson (16 students)
3. Year 3 - Cyan (20 students)
4. Year 3 - Purple (22 students)
5. Year 3 - Lavender (21 students)
6. Year 3 - Maroon (19 students)
7. Year 3 - Violet (18 students)
8. Year 3 - Green (21 students)
9. Year 3 - Red (19 students)
10. Year 3 - Yellow (19 students)
11. Year 3 - Magenta (22 students)
12. Year 3 - Orange (23 students)

---

## 🎨 Design Features

### Minimalist Theme:
- Black, white, and gray color palette
- Clean typography
- Subtle borders (no heavy shadows)
- Rounded corners (10-12px)
- Smooth transitions

### Interactive Elements:
- Hover effects on buttons and cards
- Color-coded status indicators
- Icon-based actions
- Responsive dialogs

---

## 🔧 Troubleshooting

### If frontend doesn't load:
1. Check if server is running: `http://localhost:3000`
2. Look for errors in terminal
3. Try refreshing the browser (Ctrl+Shift+R)

### If login fails:
1. Check credentials format (case-sensitive)
2. Verify backend is running on port 5000
3. Check browser console for errors

### If students don't show in class:
1. Make sure you're on "Manage Students" tab
2. Check if backend is returning data
3. Try a different class

---

## 📝 Quick Test Checklist

- [ ] Open `http://localhost:3000`
- [ ] See minimalist homepage
- [ ] Click "Get Started"
- [ ] See sidebar with all options
- [ ] Click "Teachers" → Login with TCH001
- [ ] See teacher dashboard
- [ ] Logout and try student login (Blue001)
- [ ] See student dashboard
- [ ] Login as admin
- [ ] Navigate to a class (Year 3 - Blue)
- [ ] Click "Manage Students"
- [ ] See list of 22 students
- [ ] Click eye icon to view student details
- [ ] Test transfer and remove actions

---

## 🎉 You're All Set!

The system is fully functional with:
- ✅ 267 users ready to login
- ✅ 12 classes with students
- ✅ Complete student management
- ✅ Minimalist design throughout
- ✅ Three separate portals

**Start exploring at:** `http://localhost:3000`

---

## 💡 Tips

1. **Use Chrome DevTools** (F12) to see any console errors
2. **Check Network tab** to see API calls
3. **Try different classes** to see various student counts
4. **Test all login types** (Admin, Teacher, Student)
5. **Explore all tabs** in class view

---

## 📞 Need Help?

If you encounter any issues:
1. Check both terminal windows (frontend & backend)
2. Look for error messages
3. Verify MongoDB is running
4. Check if ports 3000 and 5000 are available

Enjoy exploring the system! 🚀
