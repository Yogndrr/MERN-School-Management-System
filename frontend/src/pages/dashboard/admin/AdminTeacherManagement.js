import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, TextField, InputAdornment, 
    MenuItem, Select, FormControl, InputLabel, Chip, Tooltip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider, Alert
} from '@mui/material';
import { Add, Search, Edit, Delete, Close } from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';

const AdminTeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
    const [teacherTypeFilter, setTeacherTypeFilter] = useState('all');

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teacherFormData, setTeacherFormData] = useState({
        name: '', email: '', password: '', teacherId: '', teacherType: 'main_teacher',
        homeroomClass: '', primarySubject: '', teachClasses: [], specialization: 'general'
    });
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchTeachers();
        fetchClasses();
        fetchSubjects();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.TEACHERS_ALL);
            if (response.data && Array.isArray(response.data)) setTeachers(response.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchClasses = async () => {
        try {
            const adminID = JSON.parse(localStorage.getItem('user'))?.schoolId || JSON.parse(localStorage.getItem('user'))?._id;
            const response = await axios.get(API_ENDPOINTS.CLASS_LIST(adminID));
            if (response.data && Array.isArray(response.data)) setClasses(response.data);
        } catch (err) { console.error(err); }
    };

    const fetchSubjects = async () => {
        try {
            const adminID = JSON.parse(localStorage.getItem('user'))?.schoolId || JSON.parse(localStorage.getItem('user'))?._id;
            const response = await axios.get(API_ENDPOINTS.SUBJECTS_ALL(adminID));
            if (response.data && Array.isArray(response.data)) setSubjects(response.data);
        } catch (err) { console.error(err); }
    };

    const handleOpenAssign = (teacher) => {
        setSelectedTeacher(teacher);
        setTeacherFormData({
            ...teacherFormData,
            teacherType: teacher.teacherType || 'main_teacher',
            homeroomClass: teacher.homeroomClass?._id || teacher.homeroomClass || '',
            primarySubject: teacher.primarySubject?._id || teacher.primarySubject || '',
            teachClasses: teacher.teachClasses?.map(c => c._id || c) || [],
            specialization: teacher.specialization || 'general'
        });
        setOpenAssignDialog(true);
    };

    const handleUpdateAssignment = async () => {
        setLoading(true);
        setSubmitError('');
        try {
            const payload = { ...teacherFormData };
            await axios.put(API_ENDPOINTS.TEACHER_UPDATE(selectedTeacher._id), payload);
            setSubmitSuccess(true);
            setTimeout(() => {
                setOpenAssignDialog(false);
                fetchTeachers();
                setSubmitSuccess(false);
            }, 1500);
        } catch (err) { setSubmitError('Update failed'); }
        finally { setLoading(false); }
    };

    const filteredTeachers = teachers.filter(t => {
        const matchesSearch = t.name?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
                            t.teacherId?.toLowerCase().includes(teacherSearchTerm.toLowerCase());
        const matchesType = teacherTypeFilter === 'all' || t.teacherType === teacherTypeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Teachers Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)} sx={{ bgcolor: '#000' }}>
                    Add Teacher
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField fullWidth placeholder="Search teachers..." value={teacherSearchTerm} onChange={(e) => setTeacherSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Type</InputLabel>
                    <Select value={teacherTypeFilter} label="Type" onChange={(e) => setTeacherTypeFilter(e.target.value)}>
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="main_teacher">Main Teacher</MenuItem>
                        <MenuItem value="subject_teacher">Subject Teacher</MenuItem>
                        <MenuItem value="assistant_teacher">Assistant Teacher</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '16px' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Assignment</TableCell>
                            <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTeachers.map((teacher) => (
                            <TableRow key={teacher._id} hover>
                                <TableCell>{teacher.teacherId}</TableCell>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>
                                    <Chip label={teacher.teacherType?.replace('_', ' ').toUpperCase()} size="small"
                                        sx={{ bgcolor: teacher.teacherType === 'main_teacher' ? '#000' : '#666', color: '#fff' }} />
                                </TableCell>
                                <TableCell>
                                    {teacher.teacherType === 'main_teacher' ? `Class: ${teacher.homeroomClass?.sclassName || 'N/A'}` : `Sub: ${teacher.primarySubject?.subName || 'N/A'}`}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => handleOpenAssign(teacher)}><Edit fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Teacher: {selectedTeacher?.name}</DialogTitle>
                <DialogContent dividers>
                    {submitSuccess && <Alert severity="success" sx={{ mb: 2 }}>Updated successfully!</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Teacher Type</InputLabel>
                                <Select value={teacherFormData.teacherType} label="Teacher Type" onChange={(e) => setTeacherFormData({...teacherFormData, teacherType: e.target.value})}>
                                    <MenuItem value="main_teacher">Main Teacher</MenuItem>
                                    <MenuItem value="subject_teacher">Subject Teacher</MenuItem>
                                    <MenuItem value="assistant_teacher">Assistant Teacher</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {teacherFormData.teacherType === 'main_teacher' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Homeroom Class</InputLabel>
                                    <Select value={teacherFormData.homeroomClass} label="Homeroom Class" onChange={(e) => setTeacherFormData({...teacherFormData, homeroomClass: e.target.value})}>
                                        {classes.map(c => <MenuItem key={c._id} value={c._id}>{c.sclassName}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {teacherFormData.teacherType === 'subject_teacher' && (
                            <>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Primary Subject</InputLabel>
                                        <Select value={teacherFormData.primarySubject} label="Primary Subject" onChange={(e) => setTeacherFormData({...teacherFormData, primarySubject: e.target.value})}>
                                            {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.subName}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Classes</InputLabel>
                                        <Select multiple value={teacherFormData.teachClasses} label="Classes" onChange={(e) => setTeacherFormData({...teacherFormData, teachClasses: e.target.value})}
                                            renderValue={(s) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{s.map(v => <Chip key={v} label={classes.find(c => c._id === v)?.sclassName} size="small" />)}</Box>}>
                                            {classes.map(c => <MenuItem key={c._id} value={c._id}>{c.sclassName}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
                    <Button variant="contained" sx={{ bgcolor: '#000' }} onClick={handleUpdateAssignment} disabled={loading}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminTeacherManagement;
