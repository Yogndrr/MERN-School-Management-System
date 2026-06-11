-- BIS NOC School Management System - Supabase Schema
-- Generated on 2024-06-08

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schools (Previously Admins)
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    school_name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS sclasses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sclass_name TEXT NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers (Create first to satisfy subject FK)
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    teacher_id_str TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Teacher',
    teacher_type TEXT CHECK (teacher_type IN ('main_teacher', 'subject_teacher', 'assistant_teacher', 'special_needs_teacher')),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    homeroom_class_id UUID REFERENCES sclasses(id),
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_name TEXT NOT NULL,
    sub_code TEXT NOT NULL,
    sessions TEXT NOT NULL,
    sclass_id UUID REFERENCES sclasses(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add primary_subject_id to teachers now that subjects table exists
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS primary_subject_id UUID REFERENCES subjects(id);

-- Teacher-Subject-Class Mapping (Multi-assignment)
CREATE TABLE IF NOT EXISTS teacher_subject_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    sclass_id UUID REFERENCES sclasses(id) ON DELETE CASCADE
);

-- Students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id_str TEXT UNIQUE,
    name TEXT NOT NULL,
    roll_num INTEGER NOT NULL,
    email TEXT UNIQUE,
    sclass_id UUID REFERENCES sclasses(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'Student',
    parent_phone TEXT,
    parent_email TEXT,
    emergency_contact TEXT,
    has_special_needs BOOLEAN DEFAULT FALSE,
    special_needs_category TEXT,
    special_needs_notes TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Special Needs Accommodations
CREATE TABLE IF NOT EXISTS student_accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    accommodation TEXT NOT NULL
);

-- Student Transfer History
CREATE TABLE IF NOT EXISTS student_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    from_class_id UUID REFERENCES sclasses(id),
    to_class_id UUID REFERENCES sclasses(id),
    transferred_by UUID,
    transferred_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT
);

-- Attendance
CREATE TABLE IF NOT EXISTS student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('Present', 'Absent')),
    subject_id UUID REFERENCES subjects(id),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    UNIQUE(student_id, date, subject_id)
);

CREATE TABLE IF NOT EXISTS teacher_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    present_count TEXT,
    absent_count TEXT,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE
);

-- Clinic Visits
CREATE TABLE IF NOT EXISTS clinic_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    visit_time TEXT,
    incident_type TEXT,
    incident_location TEXT,
    severity TEXT,
    incident_description TEXT,
    chief_complaint TEXT,
    diagnosis TEXT,
    outcome TEXT,
    leave_required BOOLEAN DEFAULT FALSE,
    leave_duration TEXT,
    leave_reason TEXT,
    leave_status TEXT DEFAULT 'pending',
    notified_parent BOOLEAN DEFAULT FALSE,
    notified_time TIMESTAMPTZ,
    notification_method TEXT,
    attended_by UUID,
    sclass_id UUID REFERENCES sclasses(id),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    confidential BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Transactions
CREATE TABLE IF NOT EXISTS library_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    book_title TEXT NOT NULL,
    book_isbn TEXT,
    book_author TEXT,
    book_category TEXT,
    borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status TEXT DEFAULT 'borrowed',
    condition_borrowed TEXT,
    condition_returned TEXT,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT FALSE,
    issued_by UUID,
    sclass_id UUID REFERENCES sclasses(id),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marksheets
CREATE TABLE IF NOT EXISTS marksheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    marks_json JSONB DEFAULT '{}',
    total_marks DECIMAL(10,2) DEFAULT 0,
    max_marks DECIMAL(10,2) DEFAULT 100,
    percentage DECIMAL(5,2) DEFAULT 0,
    grade TEXT,
    entered_by UUID,
    sclass_id UUID REFERENCES sclasses(id),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, subject_id, term)
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    date DATE NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    complaint TEXT NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE
);

-- Profiles linked to Auth
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    role TEXT NOT NULL,
    school_id UUID REFERENCES schools(id),
    related_id UUID,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
