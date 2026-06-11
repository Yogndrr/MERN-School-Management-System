import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, FormControlLabel, Checkbox } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const TeachersManagement = () => {
    const [teachers, setTeachers] = useState([
        { id: 1, name: 'John Smith', email: 'john@bisnoc.edu', role: 'Main Teacher', class: 'Year 3 - Blue', subjects: ['Math', 'Science', 'English', 'History'] },
        { id: 2, name: 'Jane Doe', email: 'jane@bisnoc.edu', role: 'Subject Teacher', subject: 'English', classes: ['All 12 classes'] },
        { id: 3, name: 'Mike Johnson', email: 'mike@bisnoc.edu', role: 'Assistant Teacher', class: 'Year 3 - Crimson', subjects: [] }
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [openCredentialsDialog, setOpenCredentialsDialog] = useState(false);
    const [newCredentials, setNewCredentials] = useState({ teacherId: '', password: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        class: '',
        subjects: [],
        classes: []
    });

    const teacherRoles = ['Main Teacher', 'Subject Teacher', 'Assistant Teacher', 'Special Needs Teacher'];
    const allClasses = [
        'Year 3 - Blue', 'Year 3 - Crimson', 'Year 3 - Cyan', 'Year 3 - Purple',
        'Year 3 - Lavender', 'Year 3 - Maroon', 'Year 3 - Violet', 'Year 3 - Green',
        'Year 3 - Red', 'Year 3 - Yellow', 'Year 3 - Magenta', 'Year 3 - Orange'
    ];
    const allSubjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'PE', 'IT'];

    const handleAddTeacher = () => {
        setEditMode(false);
        setCurrentTeacher({
            name: '',
            email: '',
            password: '',
            role: '',
            class: '',
            subjects: [],
            classes: []
        });
        setOpenDialog(true);
    };

    const handleEditTeacher = (teacher) => {
        setEditMode(true);
        setCurrentTeacher(teacher);
        setOpenDialog(true);
    };

    const handleSaveTeacher = () => {
        if (editMode) {
            setTeachers(teachers.map(t => t.id === currentTeacher.id ? currentTeacher : t));
            setOpenDialog(false);
        } else {
            // Generate teacher ID and default password
            const teacherCount = teachers.length + 1;
            const teacherId = `TCH${String(teacherCount).padStart(3, '0')}`;
            const defaultPassword = currentTeacher.password || `${teacherId}@bis`;
            
            const newTeacher = {
                ...currentTeacher,
                id: Date.now(),
                teacherId,
                password: defaultPassword
            };
            
            setTeachers([...teachers, newTeacher]);
            
            // Show credentials in dialog
            setNewCredentials({ teacherId, password: defaultPassword });
            setOpenDialog(false);
            setOpenCredentialsDialog(true);
        }
    };

    const handleDeleteTeacher = (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Teachers Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddTeacher}
                    sx={{ bgcolor: '#10b981' }}
                >
                    Add Teacher
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell><strong>Class/Subjects</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachers.map((teacher) => (
                            <TableRow key={teacher.id} hover>
                                <TableCell>{teacher.name}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>
                                    <Chip label={teacher.role} size="small" color="primary" />
                                </TableCell>
                                <TableCell>
                                    {teacher.class && <Typography variant="body2">{teacher.class}</Typography>}
                                    {teacher.subjects?.length > 0 && (
                                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                            {teacher.subjects.join(', ')}
                                        </Typography>
                                    )}
                                    {teacher.subject && <Typography variant="body2">{teacher.subject}</Typography>}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" onClick={() => handleEditTeacher(teacher)} sx={{ color: '#3b82f6' }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteTeacher(teacher.id)} sx={{ color: '#ef4444' }}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Teacher Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Full Name"
                            value={currentTeacher.name}
                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={currentTeacher.email}
                            onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                            required
                        />
                        {!editMode && (
                            <TextField
                                label="Password"
                                type="password"
                                value={currentTeacher.password}
                                onChange={(e) => setCurrentTeacher({ ...currentTeacher, password: e.target.value })}
                                required
                            />
                        )}
                        <FormControl required>
                            <InputLabel>Teacher Role</InputLabel>
                            <Select
                                value={currentTeacher.role}
                                onChange={(e) => setCurrentTeacher({ ...currentTeacher, role: e.target.value })}
                            >
                                {teacherRoles.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {(currentTeacher.role === 'Main Teacher' || currentTeacher.role === 'Assistant Teacher') && (
                            <FormControl>
                                <InputLabel>Homeroom Class</InputLabel>
                                <Select
                                    value={currentTeacher.class}
                                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, class: e.target.value })}
                                >
                                    {allClasses.map((cls) => (
                                        <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {currentTeacher.role === 'Main Teacher' && (
                            <FormControl>
                                <InputLabel>Teaching Subjects (Select 4)</InputLabel>
                                <Select
                                    multiple
                                    value={currentTeacher.subjects || []}
                                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, subjects: e.target.value })}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {allSubjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            <Checkbox checked={(currentTeacher.subjects || []).indexOf(subject) > -1} />
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {currentTeacher.role === 'Subject Teacher' && (
                            <FormControl>
                                <InputLabel>Primary Subject</InputLabel>
                                <Select
                                    value={currentTeacher.subject}
                                    onChange={(e) => setCurrentTeacher({ ...currentTeacher, subject: e.target.value })}
                                >
                                    {allSubjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveTeacher} variant="contained" sx={{ bgcolor: '#10b981' }}>
                        {editMode ? 'Update' : 'Add'} Teacher
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Credentials Display Dialog */}
            <Dialog open={openCredentialsDialog} onClose={() => setOpenCredentialsDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#10b981', color: 'white' }}>
                    Teacher Added Successfully!
                </DialogTitle>
                <DialogContent sx={{ mt: 3 }}>
                    <Box sx={{ bgcolor: '#f0fdf4', p: 3, borderRadius: 2, border: '2px solid #10b981' }}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#065f46' }}>
                            Login Credentials - Please save these details:
                        </Typography>
                        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Teacher ID:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                {newCredentials.teacherId}
                            </Typography>
                        </Box>
                        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Password:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                                {newCredentials.password}
                            </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#065f46' }}>
                            ⚠️ The teacher can use these credentials to login at the Teacher Portal
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            navigator.clipboard.writeText(`Teacher ID: ${newCredentials.teacherId}\nPassword: ${newCredentials.password}`);
                        }}
                        variant="outlined"
                    >
                        Copy to Clipboard
                    </Button>
                    <Button onClick={() => setOpenCredentialsDialog(false)} variant="contained" sx={{ bgcolor: '#10b981' }}>
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeachersManagement;
