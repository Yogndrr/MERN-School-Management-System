# Complete System Testing Checklist

## Prerequisites
- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend server running on `http://localhost:3000`
- [ ] MongoDB connected and running
- [ ] At least one admin account created
- [ ] Teacher data added to MongoDB

## Quick Start Testing

### 1. Verify Teacher Data
```bash
cd backend
node test-teacher-login.js
```

### 2. Add Test Teacher (if needed)
```bash
cd backend
node add-test-teacher.js
```

## System Testing

### A. Homepage (Minimalist Design)
- [ ] Visit `http://localhost:3000`
- [ ] Clean white background with dot pattern visible
- [ ] Black square logo with "B" displays
- [ ] "British International School" title in bold
- [ ] "NOC Gerji Campus" subtitle in gray
- [ ] "Get Started" button in black
- [ ] Button hover effect works (darker on hover)
- [ ] Footer copyright text visible

### B. Main Dashboard Sidebar
- [ ] Click "Get Started" → redirects to `/dashboard/home`
- [ ] Sidebar visible on left (white background)
- [ ] Logo "B" in black square at top
- [ ] "BIS NOC" and "Management System" text below logo
- [ ] All menu items visible:
  - Home
  - --- PORTALS ---
  - Admin
  - Teachers
  - Students
  - --- CLASSES ---
  - All Classes (expandable)
  - --- SERVICES ---
  - Library
  - Clinic
- [ ] Hover effects work (light gray background)
- [ ] Icons are monochrome and consistent size

### C. Admin Login
- [ ] Click "Admin" in sidebar
- [ ] Login dialog opens with rounded corners
- [ ] Two tabs: "Login" and "Register"
- [ ] Close button (X) in top right
- [ ] Input fields have rounded corners
- [ ] Black "Sign In" button
- [ ] Test Login:
  - Email: (your admin email)
  - Password: (your admin password)
- [ ] Successful login redirects to `/dashboard/admin`
- [ ] Error message displays for wrong credentials

### D. Teacher Login
- [ ] Click "Teachers" in sidebar
- [ ] Login dialog opens
- [ ] Title: "Teacher Portal"
- [ ] Input fields:
  - Teacher ID (with helper text "e.g., TCH001")
  - Password
- [ ] Black "Sign In" button
- [ ] Test Login:
  - Teacher ID: `TCH001` (or from test script)
  - Password: (from test script or `TCH001@bis`)
- [ ] Successful login redirects to `/teacher/dashboard`
- [ ] Teacher dashboard displays:
  - Welcome card with teacher name
  - Stats cards (Students, Assignments, Messages, Classes)
  - Navigation tabs
  - Logout button
- [ ] Click Logout → redirects to homepage
- [ ] localStorage cleared after logout

### E. Student Login
- [ ] Click "Students" in sidebar
- [ ] Login dialog opens
- [ ] Title: "Student Portal"
- [ ] Input fields:
  - Student ID (with helper text "e.g., BIS20240001")
  - Password
- [ ] Black "Sign In" button
- [ ] Test Login (if student exists):
  - Student ID: (from database)
  - Password: (student password)
- [ ] Successful login redirects to `/student/dashboard`
- [ ] Student dashboard displays correctly

### F. Admin Dashboard - Teacher Management
- [ ] Login as Admin
- [ ] Navigate to "Admin Dashboard" tab
- [ ] Click "Teachers Management" tab
- [ ] "Add Teacher" button visible
- [ ] Click "Add Teacher"
- [ ] Dialog opens with form fields:
  - Full Name
  - Email
  - Password (optional)
  - Teacher Role dropdown
  - Class selection (for Main/Assistant Teacher)
  - Subjects selection (for Main Teacher)
- [ ] Fill in all required fields
- [ ] Click "Add Teacher"
- [ ] Credentials dialog appears showing:
  - Teacher ID (e.g., TCH002)
  - Password
  - "Copy to Clipboard" button
  - "Done" button
- [ ] Copy credentials
- [ ] Click "Done"
- [ ] New teacher appears in teachers list
- [ ] Test login with new credentials

### G. Admin Dashboard - Student Management
- [ ] Navigate to "Student Management" tab
- [ ] "Add Student" button visible
- [ ] Click "Add Student"
- [ ] Dialog opens with form fields:
  - Name
  - Roll Number
  - Class
  - Parent Contact info
  - Special Needs (optional)
- [ ] Fill in required fields
- [ ] Click "Add Student"
- [ ] Credentials dialog appears showing:
  - Student ID (e.g., BIS20240001)
  - Password
  - "Copy to Clipboard" button
- [ ] Copy credentials
- [ ] New student appears in students list
- [ ] Test login with new credentials

### H. Dashboard Home Page (Minimalist)
- [ ] Navigate to "Home" in sidebar
- [ ] "Dashboard" title in bold black
- [ ] Subtitle in gray
- [ ] 6 stat cards displayed:
  - Students (250)
  - Teachers (36)
  - Classes (12)
  - Library Books (1,250)
  - Clinic Visits (45)
  - Attendance (96%)
- [ ] Each card has:
  - Gray icon in rounded square
  - Uppercase label in gray
  - Large number in black
  - White background with border
  - Hover effect (border color change)
- [ ] "Today's Activity" section with 3 items
- [ ] "Quick Links" section with 4 links
- [ ] All cards have consistent rounded corners

### I. Classes Navigation
- [ ] Click "All Classes" in sidebar
- [ ] Dropdown expands showing 12 classes
- [ ] All class names visible:
  - Year 3 - Blue
  - Year 3 - Crimson
  - Year 3 - Cyan
  - Year 3 - Purple
  - Year 3 - Lavender
  - Year 3 - Maroon
  - Year 3 - Violet
  - Year 3 - Green
  - Year 3 - Red
  - Year 3 - Yellow
  - Year 3 - Magenta
  - Year 3 - Orange
- [ ] Click on a class → navigates to class view
- [ ] Class view displays correctly

### J. Library & Clinic
- [ ] Click "Library" in sidebar
- [ ] Library page loads
- [ ] Click "Clinic" in sidebar
- [ ] Clinic page loads

## Design Consistency Check

### Minimalist Design Elements:
- [ ] Consistent color scheme (black, white, grays)
- [ ] No heavy shadows (only borders)
- [ ] Rounded corners (10-12px) throughout
- [ ] Consistent icon sizes (20px in sidebar)
- [ ] Clean typography hierarchy
- [ ] Subtle hover effects
- [ ] Smooth transitions (0.2s ease)
- [ ] Monochrome icons
- [ ] Generous whitespace
- [ ] Clean input fields with rounded corners

### Typography:
- [ ] Headings are bold (600-700 weight)
- [ ] Body text is regular (400-500 weight)
- [ ] Labels are uppercase with letter spacing
- [ ] Consistent font sizes
- [ ] Good contrast ratios

### Spacing:
- [ ] Consistent padding (p: 3 = 24px)
- [ ] Consistent gaps (gap: 2 = 16px)
- [ ] Proper margins between sections
- [ ] Aligned elements

## Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile responsive (resize browser)

## Performance Check
- [ ] Pages load quickly
- [ ] No console errors
- [ ] No network errors
- [ ] Smooth animations
- [ ] No layout shifts

## Security Check
- [ ] Cannot access protected routes without login
- [ ] Logout clears all session data
- [ ] Passwords are not visible in network tab
- [ ] localStorage is used correctly
- [ ] API endpoints require authentication

## Common Issues to Check

### If login fails:
1. Check backend console for errors
2. Verify MongoDB connection
3. Check teacher exists in database
4. Verify password is correct
5. Check network tab for API response

### If design looks wrong:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check if Material-UI is loaded
4. Verify CSS is not being overridden

### If navigation fails:
1. Check browser console for errors
2. Verify routes in App.js
3. Check if components are imported correctly

## Final Verification

### Complete User Flows:
- [ ] Admin can register → login → add teacher → logout
- [ ] Teacher can login → view dashboard → logout
- [ ] Student can login → view dashboard → logout
- [ ] Admin can add student → student can login
- [ ] Multiple users can be logged in different tabs
- [ ] Session persists on page refresh
- [ ] Logout works from all portals

## Success Criteria
✅ All checkboxes above are checked
✅ No console errors
✅ Clean minimalist design throughout
✅ All login flows work
✅ Credentials are generated correctly
✅ Navigation is smooth
✅ Design is consistent

## Next Steps After Testing
1. Document any bugs found
2. Test with real data
3. Add more features to teacher/student dashboards
4. Implement attendance system
5. Add assignment management
6. Create reporting features
