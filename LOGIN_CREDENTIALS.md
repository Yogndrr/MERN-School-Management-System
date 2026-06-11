# Login Credentials - BIS NOC Management System

## ✅ System Ready!

All users have been configured and are ready to login.

---

## 👨‍💼 Admin Login

**Portal:** Admin Dashboard  
**Access:** Click "Admin" in sidebar

### Test Credentials:
- Create your own admin account via the "Register" tab
- Or use Quick Access for testing

---

## 👨‍🏫 Teacher Login (25 Teachers)

**Portal:** Teachers Portal  
**Access:** Click "Teachers" in sidebar

### Login Format:
- **Teacher ID**: `TCH001` to `TCH025`
- **Password**: `{TeacherID}@bis` (e.g., `TCH001@bis`)

### Sample Teachers:

| Teacher ID | Name | Type | Password |
|------------|------|------|----------|
| TCH001 | Abigia Alemayehu | Main Teacher | TCH001@bis |
| TCH002 | Abigiya Tadele | Main Teacher | TCH002@bis |
| TCH003 | Deginet Engida | Main Teacher | TCH003@bis |
| TCH004 | Denebe Abu | Main Teacher | TCH004@bis |
| TCH005 | Mariamawit Belay | Main Teacher | TCH005@bis |
| TCH014 | Andu Getachew | Art Teacher | TCH014@bis |
| TCH015 | Amanuel Teamu | ICT Teacher | TCH015@bis |
| TCH021 | Micheal | English Teacher | TCH021@bis |
| TCH023 | Solomon | English Teacher | TCH023@bis |

### Teacher Types:
- **Main Teachers** (TCH001-TCH012): 12 homeroom teachers
- **Subject Teachers** (TCH014-TCH024): Art, ICT, Amharic, PE, French, English, Music
- **Assistant Teachers** (TCH013, TCH025): Cover and assistant teachers

---

## 👨‍🎓 Student Login (242 Students across 12 Classes)

**Portal:** Students Portal  
**Access:** Click "Students" in sidebar

### Login Format:
- **Student ID**: Class prefix + number (e.g., `Blue001`, `Crim001`)
- **Password**: `{StudentID}@bis` (e.g., `Blue001@bis`)

### Classes & Student Count:

| Class | Students | ID Range | Example Login |
|-------|----------|----------|---------------|
| Year 3 - Blue | 22 | Blue001-Blue022 | Blue001 / Blue001@bis |
| Year 3 - Crimson | 16 | Crim001-Crim016 | Crim001 / Crim001@bis |
| Year 3 - Cyan | 20 | Cyan001-Cyan020 | Cyan001 / Cyan001@bis |
| Year 3 - Purple | 22 | Purp001-Purp022 | Purp001 / Purp001@bis |
| Year 3 - Lavender | 21 | Lave001-Lave021 | Lave001 / Lave001@bis |
| Year 3 - Maroon | 19 | Maro001-Maro019 | Maro001 / Maro001@bis |
| Year 3 - Violet | 18 | Viol001-Viol018 | Viol001 / Viol001@bis |
| Year 3 - Green | 21 | Gree001-Gree021 | Gree001 / Gree001@bis |
| Year 3 - Red | 19 | Red001-Red019 | Red001 / Red001@bis |
| Year 3 - Yellow | 19 | Yell001-Yell019 | Yell001 / Yell001@bis |
| Year 3 - Magenta | 22 | Mage001-Mage022 | Mage001 / Mage001@bis |
| Year 3 - Orange | 23 | Oran001-Oran023 | Oran001 / Oran001@bis |

### Sample Students:

**Year 3 - Blue:**
- Blue001 / Blue001@bis - Abigiya Biniam
- Blue002 / Blue002@bis - Absalat Amha
- Blue003 / Blue003@bis - Beamlak Tsega

**Year 3 - Crimson:**
- Crim001 / Crim001@bis - Abigel Henkok
- Crim002 / Crim002@bis - Adriel Eyuel
- Crim003 / Crim003@bis - Anna Yetimwork

**Year 3 - Cyan:**
- Cyan001 / Cyan001@bis - Amen mulualem
- Cyan002 / Cyan002@bis - Anamiel mekonnen
- Cyan003 / Cyan003@bis - Bekir aklilu

---

## 🧪 Quick Test

### Test Teacher Login:
1. Go to `http://localhost:3000`
2. Click "Get Started"
3. Click "Teachers" in sidebar
4. Enter:
   - Teacher ID: `TCH001`
   - Password: `TCH001@bis`
5. Click "Sign In"

### Test Student Login:
1. Go to `http://localhost:3000`
2. Click "Get Started"
3. Click "Students" in sidebar
4. Enter:
   - Student ID: `Blue001`
   - Password: `Blue001@bis`
5. Click "Sign In"

---

## 📝 Notes

### Password Format:
All default passwords follow the pattern: `{ID}@bis`
- Teachers: `TCH001@bis`, `TCH002@bis`, etc.
- Students: `Blue001@bis`, `Crim001@bis`, etc.

### Security:
- All passwords are hashed with bcrypt
- Passwords can be changed by admin
- Default passwords should be changed in production

### Adding New Users:
When admin adds new teachers or students:
1. Credentials are auto-generated
2. A popup shows the login details
3. Copy and share with the user
4. User can login immediately

---

## 🔧 Troubleshooting

### "Student not found" error:
- Make sure you're using the correct Student ID format (e.g., `Blue001`, not `BIS20240001`)
- Check capitalization (case-sensitive)
- Verify student exists in database

### "Invalid password" error:
- Password is case-sensitive
- Default format is `{StudentID}@bis`
- No spaces before or after

### "Teacher not found" error:
- Use Teacher ID (e.g., `TCH001`), not email
- Check capitalization
- Verify teacher exists in database

---

## 📊 System Statistics

- **Total Users**: 267
  - Admins: Variable (create your own)
  - Teachers: 25
  - Students: 242
- **Classes**: 12 (Year 3 - all colors)
- **Average Class Size**: ~20 students

---

## 🎉 Ready to Use!

The system is fully configured with:
- ✅ 25 teachers with credentials
- ✅ 242 students across 12 classes
- ✅ All users can login immediately
- ✅ Minimalist design throughout
- ✅ Three separate portals (Admin, Teacher, Student)

Start testing by logging in with any of the credentials above!
