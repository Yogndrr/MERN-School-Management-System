# 🏫 SE4030 – Secure Software Development
# Security Remediation & Developer Roadmap

> **Target Application:** MERN School Management System  
> **Original Upstream Repository:** [https://github.com/Yogndrr/MERN-School-Management-System](https://github.com/Yogndrr/MERN-School-Management-System)  
> **Group Modified Repository:** [https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System](https://github.com/YenuliAmaratunga/SE4030-MERN-School-Management-System)  
> **Target Group Size:** 4 Members  

---

## 📌 Table of Contents
1. [Project Overview & Domain](#1-project-overview--domain)
2. [Team Workload & Responsibilities Matrix](#2-team-workload--responsibilities-matrix)
3. [Git Branching Strategy & Workflow](#3-git-branching-strategy--workflow)
4. [The 7 Distinct Vulnerabilities Remediation Roadmap](#4-the-7-distinct-vulnerabilities-remediation-roadmap)
5. [OAuth 2.0 / OpenID Connect Implementation Plan](#5-oauth-20--openid-connect-implementation-plan)
6. [Testing & Verification Protocol (SAST & DAST)](#6-testing--verification-protocol-sast--dast)
7. [Local Setup & Running Instructions](#7-local-setup--running-instructions)

---

## 1. Project Overview & Domain

The **MERN School Management System** is a full-featured educational enterprise resource planning (ERP) platform supporting three distinct user hierarchies:
* **School Administrator:** Manages school classes, subjects, faculty allocation, notices, and system policies.
* **Teacher:** Records attendance, assesses grades/marks, and reviews student performance.
* **Student:** Views academic results, attendance logs, and submits feedback/complaints.

### Architecture
* **Backend:** Node.js, Express.js, MongoDB with Mongoose ODM
* **Frontend:** React.js, Material-UI, Redux Toolkit
* **Authentication:** Multi-portal JWT authentication (`Admin`, `Teacher`, `Student`)

---

## 2. Team Workload & Responsibilities Matrix

Each member owns an equal, heavyweight security engineering domain (~25% workload) covering two distinct OWASP Top 10 vulnerabilities or major architectural modules:

| Team Member | Security Domain | Assigned Tasks & Vulnerabilities | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Member 1** | **Access Control & RBAC Lead** | • **V1:** Missing Role Verification / Privilege Escalation<br>• **V5:** Mass Assignment in Student Registration | Reusable RBAC middleware (`authorizeRoles`), DTO parameter whitelisting, route-level guards. |
| **Member 2** | **Data Privacy & Injection Lead** | • **V2:** BOLA / IDOR on Student Academic Records<br>• **V3:** NoSQL Operator Query Injection | Context-aware ABAC guard engine, `express-mongo-sanitize`, Zod runtime validation schemas. |
| **Member 3** | **Content Security & Hardening Lead** | • **V4:** Stored XSS in School Notice Board & Complaints<br>• **V7:** Authentication Rate Limiting & Account Lockout | `isomorphic-dompurify` backend sanitization, Helmet CSP headers, `express-rate-limit` lockout. |
| **Member 4** | **Auth Architecture & OAuth Lead** | • **V6:** Insecure Session / JWT Storage in LocalStorage<br>• **Feature:** Google OAuth 2.0 / OpenID Connect Login | HttpOnly/Secure cookie session transport, token revocation, Google Identity OAuth 2.0 integration. |

---

## 3. Git Branching Strategy & Workflow

To maintain a clean commit history for academic grading:

```
main (Production / Stable Baseline)
  │
  └── dev (Active Integration Branch)
        ├── fix/member1-rbac-mass-assignment
        ├── fix/member2-idor-nosql-injection
        ├── fix/member3-xss-rate-limiting
        └── feat/member4-session-google-oauth
```

### Branch Guidelines:
1. **Never commit directly to `main`.**
2. Feature and fix branches must branch off `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b fix/<member>-<topic>
   ```
3. Commit messages must be descriptive (avoid generic messages like `fixed bug`):
   * *Example:* `fix: implement context-aware ABAC guard on student records to prevent BOLA (CWE-639)`
   * *Example:* `fix: sanitize JSON AST inputs using express-mongo-sanitize and Zod (CWE-943)`
4. Merge into `dev` using GitHub Pull Requests with peer review before final release into `main`.

---

## 4. The 7 Distinct Vulnerabilities Remediation Roadmap

---

### 🛡️ Vulnerability 1: Missing Role Verification & Privilege Escalation
* **OWASP / CWE:** A01:2021 – Broken Access Control | **CWE-285**
* **Location:** `backend/controllers/subject-controller.js` (`subjectCreate`), `backend/controllers/notice-controller.js` (`noticeCreate`)
* **Vulnerability:** Standard Student or Teacher JWT tokens can call administrative endpoints (e.g., creating subjects, deleting classes, issuing school-wide notices).
* **Remediation:**
  ```javascript
  // backend/middleware/authMiddleware.js
  const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access forbidden: Insufficient privileges' });
      }
      next();
    };
  };
  ```

---

### 🛡️ Vulnerability 2: BOLA / IDOR on Student Academic Records
* **OWASP / CWE:** A01:2021 – Broken Access Control | **CWE-639 / API1:2023**
* **Location:** `backend/controllers/student_controller.js` (`getStudentDetail`, `updateStudent`, `updateExamResult`, `studentAttendance`, `deleteStudent`)
* **Vulnerability:** Unauthenticated/unauthorized students or cross-tenant teachers could read, modify, or tamper with confidential student marks, grades, and attendance records by altering the ID in the URL parameter.
* **Remediation:**
  1. Centralized **Context-Aware Attribute-Based Access Control (ABAC)** guard (`isAuthorizedForStudent`):
     - **Self-Access:** Students may view only their own record; disallowed from altering grades/attendance.
     - **School Admin Access:** Strictly scoped to administrators belonging to the exact same school tenant (`req.user.schoolId === student.school`).
     - **Class Teacher Access (Multi-Tenant Isolation):** Enforces dual-condition matching: teacher must belong to the same school AND be assigned to the student's specific class (`teacherSchoolId === studentSchoolId && teacher.teachSclass === student.sclassName`).
  2. **Identifier Enumeration Neutralization (CWE-200):** Unifies all unauthorized access rejections to generic `404 Not Found` with `{ "message": "No student found" }`, eliminating side-channel ID harvesting.
  3. **Full Lifecycle Protection:** Enforces the ABAC guard across read (`getStudentDetail`) and mutation endpoints (`updateStudent`, `updateExamResult`, `studentAttendance`, `deleteStudent`).

---

### 🛡️ Vulnerability 3: NoSQL Operator Query Injection
* **OWASP / CWE:** A03:2021 – Injection | **CWE-943**
* **Location:** `backend/controllers/admin-controller.js` (`adminLogIn`), `student_controller.js` (`studentLogIn`), `teacher-controller.js` (`teacherLogIn`), `backend/dto/loginDto.js`, `backend/index.js`
* **Vulnerability:** Unsanitized JSON payloads allow attackers to pass MongoDB query operators (`{"email": {"$gt": ""}}`, `{"rollNum": {"$ne": null}}`), triggering unhandled server exceptions or bypassing authentication.
* **Remediation:**
  1. **Global AST-Level Sanitization:** Register `express-mongo-sanitize` middleware in `index.js` to strip `$` and `.` operators from `req.body`, `req.query`, and `req.params`.
  2. **Strict Runtime Type Contracts via Zod:**
     - Validate incoming payloads against strict Zod schemas (`adminLoginSchema`, `studentLoginSchema`, `teacherLoginSchema`) before any database operation.
     - For student logins, enforce that `rollNum` converts strictly to a **finite positive integer** ($\ge 1$), rejecting non-numeric types, objects, strings representing `0`, negative numbers, and `Infinity` via a dual validation-transformation pipeline.
  3. **Standardized Error Boundary:** Invalid payloads fail fast with `400 Bad Request` and structured `VALIDATION_ERROR` details before reaching the Mongoose driver.

---

### 🛡️ Vulnerability 4: Stored XSS in Notice Board & Complaints
* **OWASP / CWE:** A03:2021 – Injection | **CWE-79**
* **Location:** `backend/controllers/notice-controller.js` (`noticeCreate`), `complain-controller.js`
* **Vulnerability:** Notice content and student complaints accept unescaped HTML/scripts that execute inside teacher/student administrative dashboards.
* **Remediation:**
  1. Sanitize text fields server-side with `isomorphic-dompurify`.
  2. Configure strict Content Security Policy (CSP) via `helmet`:
     ```javascript
     app.use(helmet({
       contentSecurityPolicy: {
         directives: {
           defaultSrc: ["'self'"],
           scriptSrc: ["'self'"],
         }
       }
     }));
     ```

---

### 🛡️ Vulnerability 5: Mass Assignment in Student Registration
* **OWASP / CWE:** A01:2021 – Broken Access Control | **CWE-915**
* **Location:** `backend/controllers/student_controller.js` (`studentRegister`)
* **Vulnerability:** Passing dynamic request objects (`new Student(req.body)`) allows tampering with school IDs or injecting elevated permissions.
* **Remediation:** Whitelist explicitly permitted fields through a strict DTO schema; inject `school` and `role: 'Student'` strictly from the authenticated session context.

---

### 🛡️ Vulnerability 6: Insecure Session Lifecycle & JWT in LocalStorage
* **OWASP / CWE:** A07:2021 – Identification and Authentication Failures | **CWE-384 / CWE-522**
* **Location:** Frontend authentication state (`localStorage`) & backend token generation
* **Vulnerability:** Long-lived JWT tokens stored in `localStorage` are vulnerable to theft via XSS and cannot be revoked on logout.
* **Remediation:**
  1. Store tokens exclusively in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
  2. Implement short-lived Access Tokens (15 min) paired with server-side token revocation on logout.

---

### 🛡️ Vulnerability 7: Missing Rate Limiting & Account Lockout
* **OWASP / CWE:** A07:2021 – Identification and Authentication Failures | **CWE-307**
* **Location:** `backend/routes/route.js` (`/Adminlogin`, `/Studentlogin`, `/Teacherlogin`)
* **Vulnerability:** Unthrottled login requests allow automated dictionary attacks and password spraying.
* **Remediation:**
  ```javascript
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many failed login attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  router.post('/Adminlogin', loginLimiter, adminSignIn);
  ```

---

## 5. OAuth 2.0 / OpenID Connect Implementation Plan

### **Feature:** "Sign in with Google Workspace for Education" (OAuth 2.0 / OpenID Connect)
* **Grant Type:** Authorization Code Grant with PKCE
* **Scope:** `openid profile email`
* **Workflow:**
  1. Register the application in the **Google Cloud Console** under APIs & Services $\rightarrow$ Credentials.
  2. Set authorized redirect URI: `http://localhost:5000/api/auth/google/callback`.
  3. In the backend, use `passport-google-oauth20` to verify the ID token, link the Google ID to the existing Student/Teacher record, and issue an `HttpOnly` session cookie.
  4. Embed a "Sign in with Google" button on the frontend login portal.

---

## 6. Testing & Verification Protocol (SAST & DAST)

1. **Static Analysis (SAST):**
   * Run **Semgrep** taint-analysis rules before and after fixes to verify that tainted inputs no longer flow into Mongoose sinks or unescaped HTML responses.
   * Run `npm audit` to verify dependency security.
2. **Dynamic Analysis (DAST):**
   * Perform automated baseline and active scans using **OWASP ZAP**.
   * Run the group's **Postman Collection** demonstrating attack payloads failing post-fix (e.g., verifying `404/403` status on IDOR and NoSQL bypasses).

---

## 7. Local Setup & Running Instructions

### Backend:
```bash
cd backend
npm install
# Configure your .env file:
# MONGO_URL=your_mongodb_connection_string
# PORT=5000
# JWT_SECRET=your_jwt_secret
npm start
```

### Frontend:
```bash
cd frontend
npm install
npm start
```
The application will launch on `http://localhost:3000` with the backend running on `http://localhost:5000`.
