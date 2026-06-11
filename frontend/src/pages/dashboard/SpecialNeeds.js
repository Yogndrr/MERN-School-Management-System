import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Chip,
    Avatar, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, InputAdornment, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, Switch,
    FormControlLabel, Divider, Alert, Tooltip, IconButton
} from '@mui/material';
import {
    Accessible, Search, Edit, FilterList,
    Assignment, Info, Close, CheckCircle, Warning
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const SpecialNeeds = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setClassFilter] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        hasSpecialNeeds: false,
        category: 'none',
        accommodations: '',
        notes: ''
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSpecialNeedsStudents();
    }, []);

    const fetchSpecialNeedsStudents = async () => {
        setLoading(true);
        try {
            // Get all students and filter locally for simplicity in this view
            const response = await axios.get(API_ENDPOINTS.STUDENTS_ALL);
            if (response.data && Array.isArray(response.data)) {
                setStudents(response.data);
            }
        } catch (err) {
            console.error('Failed to load students:', err);
            setError('Failed to load student data');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (student) => {
        setSelectedStudent(student);
        setEditData({
            hasSpecialNeeds: student.specialNeeds?.hasSpecialNeeds || false,
            category: student.specialNeeds?.category || 'none',
            accommodations: Array.isArray(student.specialNeeds?.accommodations)
                ? student.specialNeeds.accommodations.join(', ')
                : '',
            notes: student.specialNeeds?.notes || ''
        });
        setOpenEditDialog(true);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setSubmitSuccess(false);
        setError('');
    };

    const handleUpdate = async () => {
        setLoading(true);
        setError('');
        try {
            const payload = {
                specialNeeds: {
                    hasSpecialNeeds: editData.hasSpecialNeeds,
                    category: editData.category,
                    accommodations: editData.accommodations.split(',').map(s => s.trim()).filter(s => s !== ''),
                    notes: editData.notes
                }
            };

            await axios.put(API_ENDPOINTS.STUDENT_SPECIAL_NEEDS(selectedStudent._id), payload);
            setSubmitSuccess(true);
            setTimeout(() => {
                handleCloseEdit();
                fetchSpecialNeedsStudents();
            }, 1500);
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to update special needs profile');
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        const isSN = student.specialNeeds?.hasSpecialNeeds;
        const matchesCategory = categoryFilter === 'all' ||
                              (categoryFilter === 'active' && isSN) ||
                              (categoryFilter === student.specialNeeds?.category);

        return matchesSearch && matchesCategory;
    });

    const snCount = students.filter(s => s.specialNeeds?.hasSpecialNeeds).length;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Special Needs Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        {snCount} students with registered accommodations
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#eff6ff', border: '1px solid #bfdbfe', boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Accessible sx={{ color: '#2563eb' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                                    Total Accommodations
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e40af' }}>
                                {snCount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#fff7ed', border: '1px solid #ffedd5', boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Warning sx={{ color: '#ea580c' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#9a3412' }}>
                                    High Support Needed
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#9a3412' }}>
                                {students.filter(s => s.specialNeeds?.category === 'physical' || s.specialNeeds?.category === 'behavioral').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#f0fdf4', border: '1px solid #dcfce7', boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <CheckCircle sx={{ color: '#16a34a' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#166534' }}>
                                    Learning Support
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#166534' }}>
                                {students.filter(s => s.specialNeeds?.category === 'learning').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ p: 2, mb: 3, borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Filter Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            label="Filter Category"
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Students</MenuItem>
                            <MenuItem value="active">All Special Needs</MenuItem>
                            <Divider />
                            <MenuItem value="learning">Learning</MenuItem>
                            <MenuItem value="physical">Physical</MenuItem>
                            <MenuItem value="behavioral">Behavioral</MenuItem>
                            <MenuItem value="medical">Medical</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Accommodations</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student._id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: student.specialNeeds?.hasSpecialNeeds ? '#3b82f6' : '#94a3b8' }}>
                                            {student.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{student.name}</Typography>
                                            <Typography variant="caption" sx={{ color: '#666' }}>{student.studentId}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{student.sclassName?.sclassName || 'N/A'}</TableCell>
                                <TableCell>
                                    {student.specialNeeds?.hasSpecialNeeds ? (
                                        <Chip label="Active" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
                                    ) : (
                                        <Chip label="None" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {student.specialNeeds?.category !== 'none' && (
                                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                            {student.specialNeeds?.category}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {student.specialNeeds?.accommodations?.map((acc, i) => (
                                            <Chip key={i} label={acc} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#f1f5f9' }} />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Update Profile">
                                        <IconButton size="small" onClick={() => handleOpenEdit(student)}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Special Needs Profile
                    <IconButton onClick={handleCloseEdit} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {submitSuccess && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully!</Alert>}

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Student Information</Typography>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <Typography variant="body2"><strong>Name:</strong> {selectedStudent?.name}</Typography>
                            <Typography variant="body2"><strong>ID:</strong> {selectedStudent?.studentId}</Typography>
                            <Typography variant="body2"><strong>Class:</strong> {selectedStudent?.sclassName?.sclassName}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editData.hasSpecialNeeds}
                                    onChange={(e) => setEditData({ ...editData, hasSpecialNeeds: e.target.checked })}
                                />
                            }
                            label="Requires Special Accommodations"
                        />

                        <FormControl fullWidth disabled={!editData.hasSpecialNeeds}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={editData.category}
                                label="Category"
                                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            >
                                <MenuItem value="none">None</MenuItem>
                                <MenuItem value="learning">Learning Disabilities</MenuItem>
                                <MenuItem value="physical">Physical Disabilities</MenuItem>
                                <MenuItem value="behavioral">Behavioral Support</MenuItem>
                                <MenuItem value="medical">Medical Conditions</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Accommodations (comma separated)"
                            placeholder="e.g. Extra time, Front row seating, Large print"
                            value={editData.accommodations}
                            onChange={(e) => setEditData({ ...editData, accommodations: e.target.value })}
                            disabled={!editData.hasSpecialNeeds}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Support Notes"
                            value={editData.notes}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            disabled={!editData.hasSpecialNeeds}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={handleCloseEdit} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={loading || submitSuccess}
                        sx={{ bgcolor: '#000', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#333' } }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SpecialNeeds;
