import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Button,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Select, FormControl, InputLabel,
    Chip, Alert, Tabs, Tab, IconButton, InputAdornment
} from '@mui/material';
import {
    LocalLibrary, Book, History, Warning, Add, Search,
    CheckCircle, Close, Payments
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Library = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Issue Book State
    const [openIssueDialog, setOpenIssueDialog] = useState(false);
    const [issueData, setIssueData] = useState({
        studentId: '',
        bookTitle: '',
        isbn: '',
        author: '',
        category: 'Textbook',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRecords();
        fetchStudents();
    }, [currentTab]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const endpoint = currentTab === 0 ? API_ENDPOINTS.LIBRARY_BORROWED : API_ENDPOINTS.LIBRARY_OVERDUE;
            const response = await axios.get(endpoint);
            if (response.data && Array.isArray(response.data)) {
                setRecords(response.data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.STUDENTS_ALL);
            if (response.data && Array.isArray(response.data)) setStudents(response.data);
        } catch (err) { console.error(err); }
    };

    const handleIssueBook = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(API_ENDPOINTS.LIBRARY_ISSUE, issueData);
            if (response.data.message && !response.data.success) {
                setError(response.data.message);
            } else {
                setSuccess('Book issued successfully!');
                setTimeout(() => {
                    setOpenIssueDialog(false);
                    fetchRecords();
                    setSuccess('');
                }, 1500);
            }
        } catch (err) { setError('Failed to issue book'); }
        finally { setLoading(false); }
    };

    const handleReturnBook = async (recordId) => {
        if (!window.confirm('Mark this book as returned?')) return;
        try {
            await axios.put(API_ENDPOINTS.LIBRARY_RETURN(recordId));
            fetchRecords();
        } catch (err) { console.error(err); }
    };

    const handlePayFine = async (recordId) => {
        try {
            await axios.put(API_ENDPOINTS.LIBRARY_PAY_FINE(recordId));
            fetchRecords();
        } catch (err) { console.error(err); }
    };

    const filteredRecords = records.filter(r =>
        r.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student?.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Library Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenIssueDialog(true)} sx={{ bgcolor: '#000' }}>
                    Issue Book
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Book sx={{ color: '#000' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Active Loans</Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>{records.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', bgcolor: '#fff5f5' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Warning sx={{ color: '#ef4444' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#b91c1c' }}>Overdue Books</Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#b91c1c' }}>
                                {records.filter(r => new Date(r.dueDate) < new Date()).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Currently Borrowed" icon={<LocalLibrary />} iconPosition="start" />
                    <Tab label="Overdue" icon={<Warning />} iconPosition="start" />
                </Tabs>

                <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                    <TextField fullWidth size="small" placeholder="Search by book or student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Book Title</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Issued Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status/Fine</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow> :
                             filteredRecords.length === 0 ? <TableRow><TableCell colSpan={6} align="center">No records found</TableCell></TableRow> :
                             filteredRecords.map((record) => (
                                <TableRow key={record._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{record.bookTitle}</Typography>
                                        <Typography variant="caption" sx={{ color: '#666' }}>ISBN: {record.isbn}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{record.student?.name}</Typography>
                                        <Typography variant="caption" sx={{ color: '#666' }}>{record.student?.studentId}</Typography>
                                    </TableCell>
                                    <TableCell>{new Date(record.issueDate).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ color: new Date(record.dueDate) < new Date() ? '#ef4444' : 'inherit' }}>
                                        {new Date(record.dueDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {record.fineAmount > 0 ? (
                                            <Chip label={`Fine: ${record.fineAmount} ETB`} size="small" color="error" variant="outlined" />
                                        ) : (
                                            <Chip label="On Time" size="small" color="success" variant="outlined" />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            {record.fineAmount > 0 && !record.finePaid && (
                                                <IconButton size="small" sx={{ color: '#f59e0b' }} onClick={() => handlePayFine(record._id)}>
                                                    <Payments fontSize="small" />
                                                </IconButton>
                                            )}
                                            <Button size="small" variant="outlined" sx={{ color: '#000', borderColor: '#000' }} onClick={() => handleReturnBook(record._id)}>
                                                Return
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Issue Book Dialog */}
            <Dialog open={openIssueDialog} onClose={() => setOpenIssueDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Issue New Book</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Student</InputLabel>
                                <Select value={issueData.studentId} label="Student" onChange={(e) => setIssueData({...issueData, studentId: e.target.value})}>
                                    {students.map(s => <MenuItem key={s._id} value={s._id}>{s.name} ({s.studentId})</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Book Title" value={issueData.bookTitle} onChange={(e) => setIssueData({...issueData, bookTitle: e.target.value})} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="ISBN" value={issueData.isbn} onChange={(e) => setIssueData({...issueData, isbn: e.target.value})} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Author" value={issueData.author} onChange={(e) => setIssueData({...issueData, author: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={issueData.dueDate} onChange={(e) => setIssueData({...issueData, dueDate: e.target.value})} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenIssueDialog(false)}>Cancel</Button>
                    <Button variant="contained" sx={{ bgcolor: '#000' }} onClick={handleIssueBook} disabled={loading || !issueData.studentId || !issueData.bookTitle}>
                        Confirm Issue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Library;
