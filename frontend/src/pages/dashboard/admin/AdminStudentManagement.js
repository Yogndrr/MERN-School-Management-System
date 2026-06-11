import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, TextField, InputAdornment, MenuItem,
    Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent,
    DialogActions, Grid, Chip, Switch, FormControlLabel, Divider, Alert, Tooltip,
    IconButton
} from '@mui/material';
import { 
    Dashboard, Schedule, School, Message, Assessment, People, Add, Search,
    Close, Phone, Email, ContactPhone, Accessible, Edit, Delete, SwapHoriz
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';
import TransferWizard from '../TransferWizard';

const AdminStudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [classes, setClasses] = useState([]);
    const [classesData, setClassesData] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        rollNum: '',
        password: '',
        studentId: '',
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
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.STUDENTS_ALL);
            if (response.data && Array.isArray(response.data)) {
                setStudents(response.data);
                const uniqueClasses = [...new Set(response.data.map(s => s.sclassName?.sclassName).filter(Boolean))];
                setClasses(uniqueClasses);
            }
        } catch (err) {
            console.error('Failed to load students:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const adminID = JSON.parse(localStorage.getItem('user'))?.schoolId ||
                           JSON.parse(localStorage.getItem('user'))?._id;
            const response = await axios.get(API_ENDPOINTS.CLASS_LIST(adminID));
            if (response.data && Array.isArray(response.data)) {
                setClassesData(response.data);
            }
        } catch (err) {
            console.error('Failed to load classes:', err);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleParentContactChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            parentContact: {
                ...prev.parentContact,
                [field]: value
            }
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.rollNum) errors.rollNum = 'Roll number is required';
        if (!formData.sclassName) errors.sclassName = 'Class is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddStudent = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setSubmitError('');
        try {
            const adminID = JSON.parse(localStorage.getItem('user'))?.schoolId || 
                           JSON.parse(localStorage.getItem('user'))?._id;
            const payload = {
                ...formData,
                school: adminID,
                role: 'Student'
            };
            const response = await axios.post(API_ENDPOINTS.STUDENT_REGISTER, payload);
            if (response.data.message) {
                setSubmitError(response.data.message);
            } else {
                setSubmitSuccess(true);
                setTimeout(() => {
                    setOpenAddDialog(false);
                    fetchStudents();
                    resetForm();
                }, 1500);
            }
        } catch (err) {
            setSubmitError('Failed to add student');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStudent = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            await axios.put(API_ENDPOINTS.STUDENT_UPDATE(selectedStudent._id), formData);
            setSubmitSuccess(true);
            setTimeout(() => {
                setOpenEditDialog(false);
                fetchStudents();
            }, 1500);
        } catch (err) {
            setSubmitError('Failed to update student');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async () => {
        setLoading(true);
        try {
            await axios.delete(API_ENDPOINTS.STUDENT_DELETE(selectedStudent._id));
            setOpenDeleteDialog(false);
            fetchStudents();
        } catch (err) {
            setSubmitError('Failed to delete student');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', rollNum: '', password: '', studentId: '', sclassName: '',
            parentContact: { phone: '', email: '', emergencyContact: '' },
            specialNeeds: { hasSpecialNeeds: false, category: 'none', accommodations: [], notes: '' }
        });
        setSubmitError('');
        setSubmitSuccess(false);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = classFilter === 'all' || student.sclassName?.sclassName === classFilter;
        return matchesSearch && matchesClass;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Student Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)}
                    sx={{ bgcolor: '#000', textTransform: 'none', borderRadius: '10px' }}>
                    Add Student
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField fullWidth placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Class</InputLabel>
                    <Select value={classFilter} label="Class" onChange={(e) => setClassFilter(e.target.value)}>
                        <MenuItem value="all">All Classes</MenuItem>
                        {classes.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Roll No</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                            <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student._id} hover>
                                <TableCell>{student.studentId}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.rollNum}</TableCell>
                                <TableCell>{student.sclassName?.sclassName || 'N/A'}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <IconButton size="small" color="primary" onClick={() => { setSelectedStudent(student); setFormData({...student, sclassName: student.sclassName?._id}); setOpenEditDialog(true); }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" sx={{ color: '#f59e0b' }} onClick={() => { setSelectedStudent(student); setOpenTransferDialog(true); }}>
                                            <SwapHoriz fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => { setSelectedStudent(student); setOpenDeleteDialog(true); }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Transfer Dialog */}
            <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 600 }}>Transfer Student</DialogTitle>
                <DialogContent dividers>
                    <TransferWizard
                        student={selectedStudent}
                        classes={classesData}
                        onComplete={() => { fetchStudents(); setOpenTransferDialog(false); }}
                        onCancel={() => setOpenTransferDialog(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ color: '#ef4444', fontWeight: 600 }}>Delete Student</DialogTitle>
                <DialogContent dividers>
                    <Typography>Are you sure you want to remove <strong>{selectedStudent?.name}</strong>?</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteStudent}>Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Dialogs could be added here similarly */}
        </Box>
    );
};

export default AdminStudentManagement;
