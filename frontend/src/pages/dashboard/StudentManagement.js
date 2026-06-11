import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Alert } from '@mui/material';
import { Add, Delete, SwapHoriz, Search } from '@mui/icons-material';
import axios from 'axios';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [openCredentialsDialog, setOpenCredentialsDialog] = useState(false);
    const [newCredentials, setNewCredentials] = useState({ studentId: '', password: '' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNum: '',
        password: '',
        sclassName: '',
        parentContact: {
            phone: '',
            email: '',
            emergencyContact: ''
        },
        specialNeeds: {
            hasSpecialNeeds: false,
            category: 'none',
            accommodations: [],
            notes: ''
        }
    });

    const [transferData, setTransferData] = useState({
        toClassId: '',
        reason: ''
    });

    const classColors = [
        { id: 'year-3-blue', name: 'Year 3 - Blue' },
        { id: 'year-3-crimson', name: 'Year 3 - Crimson' },
        { id: 'year-3-cyan', name: 'Year 3 - Cyan' },
        { id: 'year-3-purple', name: 'Year 3 - Purple' },
        { id: 'year-3-lavender', name: 'Year 3 - Lavender' },
        { id: 'year-3-maroon', name: 'Year 3 - Maroon' },
        { id: 'year-3-violet', name: 'Year 3 - Violet' },
        { id: 'year-3-green', name: 'Year 3 - Green' },
        { id: 'year-3-red', name: 'Year 3 - Red' },
        { id: 'year-3-yellow', name: 'Year 3 - Yellow' },
        { id: 'year-3-magenta', name: 'Year 3 - Magenta' },
        { id: 'year-3-orange', name: 'Year 3 - Orange' }
    ];

    // Mock data for now - will be replaced with API calls
    useEffect(() => {
        // Load students from API
        loadStudents();
    }, []);

    const loadStudents = () => {
        // Mock data
        setStudents([
            { _id: '1', name: 'Abebe Kebede', rollNum: 1, studentId: 'BIS20240001', sclassName: { sclassName: 'Year 3 - Blue' }, specialNeeds: { hasSpecialNeeds: false } },
            { _id: '2', name: 'Tigist Alemu', rollNum: 2, studentId: 'BIS20240002', sclassName: { sclassName: 'Year 3 - Blue' }, specialNeeds: { hasSpecialNeeds: true, category: 'learning' } },
            { _id: '3', name: 'Dawit Tesfaye', rollNum: 3, studentId: 'BIS20240003', sclassName: { sclassName: 'Year 3 - Crimson' }, specialNeeds: { hasSpecialNeeds: false } },
        ]);
    };

    const handleAddStudent = async () => {
        try {
            const adminID = localStorage.getItem('adminId') || 'temp-admin-id';
            const studentId = `BIS${new Date().getFullYear()}${String(newStudent.rollNum).padStart(4, '0')}`;
            
            // Generate default password if not provided
            const password = newStudent.password || `${studentId}@bis`;
            
            const response = await axios.post('http://localhost:5000/StudentReg', {
                ...newStudent,
                adminID,
                studentId,
                password
            });

            if (response.data._id) {
                setMessage({ 
                    type: 'success', 
                    text: 'Student added successfully!' 
                });
                
                // Show credentials dialog
                setNewCredentials({ studentId, password });
                setOpenAddDialog(false);
                setOpenCredentialsDialog(true);
                
                setNewStudent({
                    name: '',
                    rollNum: '',
                    password: '',
                    sclassName: '',
                    parentContact: { phone: '', email: '', emergencyContact: '' },
                    specialNeeds: { hasSpecialNeeds: false, category: 'none', accommodations: [], notes: '' }
                });
                loadStudents();
            } else {
                setMessage({ type: 'error', text: response.data.message || 'Failed to add student' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error adding student' });
            console.error('Add student error:', error);
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`http://localhost:5000/Student/${studentId}`);
                setMessage({ type: 'success', text: 'Student deleted successfully!' });
                loadStudents();
            } catch (error) {
                setMessage({ type: 'error', text: 'Error deleting student' });
                console.error('Delete student error:', error);
            }
        }
    };

    const handleTransferStudent = async () => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/transfer/student/${selectedStudent._id}`,
                transferData
            );

            if (response.data.student) {
                setMessage({ type: 'success', text: 'Student transferred successfully!' });
                setOpenTransferDialog(false);
                setTransferData({ toClassId: '', reason: '' });
                setSelectedStudent(null);
                loadStudents();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error transferring student' });
            console.error('Transfer student error:', error);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = !selectedClass || student.sclassName?.sclassName === selectedClass;
        return matchesSearch && matchesClass;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Student Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenAddDialog(true)}
                    sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                >
                    Add Student
                </Button>
            </Box>

            {message.text && (
                <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
                    {message.text}
                </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search by name or student ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: '#6b7280' }} />
                    }}
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Class</InputLabel>
                    <Select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        label="Filter by Class"
                    >
                        <MenuItem value="">All Classes</MenuItem>
                        {classColors.map((cls) => (
                            <MenuItem key={cls.id} value={cls.name}>{cls.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                            <TableCell><strong>Student ID</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Roll No.</strong></TableCell>
                            <TableCell><strong>Class</strong></TableCell>
                            <TableCell><strong>Special Needs</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student._id} hover>
                                <TableCell>{student.studentId}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.rollNum}</TableCell>
                                <TableCell>{student.sclassName?.sclassName || 'N/A'}</TableCell>
                                <TableCell>
                                    {student.specialNeeds?.hasSpecialNeeds ? (
                                        <Chip 
                                            label={student.specialNeeds.category} 
                                            size="small" 
                                            color="warning"
                                        />
                                    ) : (
                                        <Chip label="None" size="small" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setOpenTransferDialog(true);
                                        }}
                                        sx={{ color: '#3b82f6' }}
                                    >
                                        <SwapHoriz />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteStudent(student._id)}
                                        sx={{ color: '#ef4444' }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Student Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Full Name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            required
                        />
                        <TextField
                            label="Roll Number"
                            type="number"
                            value={newStudent.rollNum}
                            onChange={(e) => setNewStudent({ ...newStudent, rollNum: e.target.value })}
                            required
                        />
                        <FormControl required>
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={newStudent.sclassName}
                                onChange={(e) => setNewStudent({ ...newStudent, sclassName: e.target.value })}
                            >
                                {classColors.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Password"
                            type="password"
                            value={newStudent.password}
                            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                            required
                        />
                        <TextField
                            label="Parent Phone"
                            value={newStudent.parentContact.phone}
                            onChange={(e) => setNewStudent({
                                ...newStudent,
                                parentContact: { ...newStudent.parentContact, phone: e.target.value }
                            })}
                        />
                        <TextField
                            label="Parent Email"
                            type="email"
                            value={newStudent.parentContact.email}
                            onChange={(e) => setNewStudent({
                                ...newStudent,
                                parentContact: { ...newStudent.parentContact, email: e.target.value }
                            })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddStudent} variant="contained" sx={{ bgcolor: '#10b981' }}>
                        Add Student
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Transfer Student Dialog */}
            <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Transfer Student</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Typography variant="body2">
                            Transfer <strong>{selectedStudent?.name}</strong> to a new class
                        </Typography>
                        <FormControl required>
                            <InputLabel>New Class</InputLabel>
                            <Select
                                value={transferData.toClassId}
                                onChange={(e) => setTransferData({ ...transferData, toClassId: e.target.value })}
                            >
                                {classColors.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Reason for Transfer"
                            multiline
                            rows={3}
                            value={transferData.reason}
                            onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenTransferDialog(false)}>Cancel</Button>
                    <Button onClick={handleTransferStudent} variant="contained" sx={{ bgcolor: '#3b82f6' }}>
                        Transfer Student
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Credentials Display Dialog */}
            <Dialog open={openCredentialsDialog} onClose={() => setOpenCredentialsDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white' }}>
                    Student Added Successfully!
                </DialogTitle>
                <DialogContent sx={{ mt: 3 }}>
                    <Box sx={{ bgcolor: '#eff6ff', p: 3, borderRadius: 2, border: '2px solid #3b82f6' }}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#1e40af' }}>
                            Login Credentials - Please save these details:
                        </Typography>
                        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Student ID:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                {newCredentials.studentId}
                            </Typography>
                        </Box>
                        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Password:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                {newCredentials.password}
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#1e40af' }}>
                            ⚠️ The student can use these credentials to login at the Student Portal
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            navigator.clipboard.writeText(`Student ID: ${newCredentials.studentId}\nPassword: ${newCredentials.password}`);
                        }}
                        variant="outlined"
                    >
                        Copy to Clipboard
                    </Button>
                    <Button onClick={() => setOpenCredentialsDialog(false)} variant="contained" sx={{ bgcolor: '#3b82f6' }}>
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentManagement;
