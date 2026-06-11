import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Button,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Select, FormControl, InputLabel,
    FormControlLabel, Switch,
    Chip, Alert, Tabs, Tab, IconButton, InputAdornment, Divider
} from '@mui/material';
import {
    LocalHospital, Assignment, Approval, History, Add, Search,
    CheckCircle, Close, Medication, Visibility, FilterList
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Clinic = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [visits, setVisits] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Visit Recording State
    const [openVisitDialog, setOpenVisitDialog] = useState(false);
    const [visitData, setVisitData] = useState({
        studentId: '',
        incidentType: 'illness',
        severity: 'minor',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        medicationGiven: '',
        requestLeave: false,
        parentNotified: false
    });

    const [selectedVisit, setSelectedVisit] = useState(null);
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchVisits();
        fetchLeaveRequests();
        fetchStudents();
    }, [currentTab]);

    const fetchVisits = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_ENDPOINTS.CLINIC_VISITS_ALL);
            if (response.data && Array.isArray(response.data)) {
                setVisits(response.data);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.CLINIC_LEAVE_REQUESTS);
            if (response.data && Array.isArray(response.data)) {
                setLeaveRequests(response.data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.STUDENTS_ALL);
            if (response.data && Array.isArray(response.data)) setStudents(response.data);
        } catch (err) { console.error(err); }
    };

    const handleRecordVisit = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(API_ENDPOINTS.CLINIC_VISIT, visitData);
            setSuccess('Visit recorded successfully!');
            setTimeout(() => {
                setOpenVisitDialog(false);
                fetchVisits();
                setSuccess('');
            }, 1500);
        } catch (err) { setError('Failed to record visit'); }
        finally { setLoading(false); }
    };

    const handleProcessLeave = async (recordId, status) => {
        try {
            await axios.put(API_ENDPOINTS.CLINIC_PROCESS_LEAVE(recordId), { status });
            fetchLeaveRequests();
            fetchVisits();
        } catch (err) { console.error(err); }
    };

    const handleViewReport = (visit) => {
        setSelectedVisit(visit);
        setOpenReportDialog(true);
    };

    const filteredVisits = visits.filter(v =>
        v.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Clinic Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenVisitDialog(true)} sx={{ bgcolor: '#000' }}>
                    Record Visit
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <LocalHospital sx={{ color: '#000' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Total Visits Today</Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>{visits.filter(v => new Date(v.visitDate).toDateString() === new Date().toDateString()).length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', bgcolor: '#fffbeb' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Approval sx={{ color: '#f59e0b' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#92400e' }}>Pending Leave</Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#92400e' }}>{leaveRequests.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Recent Visits" icon={<History />} iconPosition="start" />
                    <Tab label="Leave Requests" icon={<Assignment />} iconPosition="start" />
                </Tabs>

                <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                    <TextField fullWidth size="small" placeholder="Search visits..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }} />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Incident/Diagnosis</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Severity</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Leave Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? <TableRow><TableCell colSpan={6} align="center">Loading...</TableCell></TableRow> :
                             (currentTab === 0 ? filteredVisits : leaveRequests).map((visit) => (
                                <TableRow key={visit._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{visit.student?.name}</Typography>
                                        <Typography variant="caption" sx={{ color: '#666' }}>{visit.student?.studentId}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={visit.incidentType?.toUpperCase()} size="small" sx={{ mr: 1, height: 20, fontSize: '0.65rem' }} />
                                        <Typography variant="body2" component="span">{visit.diagnosis}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={visit.severity} size="small"
                                            color={visit.severity === 'critical' || visit.severity === 'severe' ? 'error' : 'default'} />
                                    </TableCell>
                                    <TableCell>
                                        {visit.leaveRequest?.requested ? (
                                            <Chip label={visit.leaveRequest.status?.toUpperCase()} size="small"
                                                color={visit.leaveRequest.status === 'approved' ? 'success' :
                                                       visit.leaveRequest.status === 'pending' ? 'warning' : 'error'} />
                                        ) : 'None'}
                                    </TableCell>
                                    <TableCell>{new Date(visit.visitDate).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            {currentTab === 1 && (
                                                <>
                                                    <IconButton size="small" color="success" onClick={() => handleProcessLeave(visit._id, 'approved')}><CheckCircle fontSize="small" /></IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleProcessLeave(visit._id, 'rejected')}><Close fontSize="small" /></IconButton>
                                                </>
                                            )}
                                            <IconButton size="small" onClick={() => handleViewReport(visit)}><Visibility fontSize="small" /></IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Record Visit Dialog */}
            <Dialog open={openVisitDialog} onClose={() => setOpenVisitDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Record Clinic Visit</DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Student</InputLabel>
                                <Select value={visitData.studentId} label="Student" onChange={(e) => setVisitData({...visitData, studentId: e.target.value})}>
                                    {students.map(s => <MenuItem key={s._id} value={s._id}>{s.name} ({s.studentId})</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Incident Type</InputLabel>
                                <Select value={visitData.incidentType} label="Incident Type" onChange={(e) => setVisitData({...visitData, incidentType: e.target.value})}>
                                    <MenuItem value="illness">Illness</MenuItem>
                                    <MenuItem value="injury">Injury</MenuItem>
                                    <MenuItem value="accident">Accident</MenuItem>
                                    <MenuItem value="checkup">Check-up</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Severity</InputLabel>
                                <Select value={visitData.severity} label="Severity" onChange={(e) => setVisitData({...visitData, severity: e.target.value})}>
                                    <MenuItem value="minor">Minor</MenuItem>
                                    <MenuItem value="moderate">Moderate</MenuItem>
                                    <MenuItem value="severe">Severe</MenuItem>
                                    <MenuItem value="critical">Critical</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={2} label="Symptoms" value={visitData.symptoms} onChange={(e) => setVisitData({...visitData, symptoms: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Treatment Provided" value={visitData.treatment} onChange={(e) => setVisitData({...visitData, treatment: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel control={<Switch checked={visitData.requestLeave} onChange={(e) => setVisitData({...visitData, requestLeave: e.target.checked})} />} label="Request Sick Leave" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenVisitDialog(false)}>Cancel</Button>
                    <Button variant="contained" sx={{ bgcolor: '#000' }} onClick={handleRecordVisit} disabled={loading || !visitData.studentId}>
                        Record Visit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Case Report Dialog */}
            <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, bgcolor: '#000', color: '#fff' }}>Medical Case Report</DialogTitle>
                <DialogContent>
                    {selectedVisit && (
                        <Box sx={{ py: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="textSecondary">STUDENT NAME</Typography>
                                    <Typography variant="h6">{selectedVisit.student?.name}</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="textSecondary">DATE</Typography>
                                    <Typography variant="h6">{new Date(selectedVisit.visitDate).toLocaleDateString()}</Typography>
                                </Grid>
                                <Grid item xs={12}><Divider /></Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>CLINICAL FINDINGS</Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                                        <Typography variant="body2"><strong>Symptoms:</strong> {selectedVisit.symptoms}</Typography>
                                        <Typography variant="body2"><strong>Diagnosis:</strong> {selectedVisit.diagnosis || 'Pending'}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>TREATMENT & MEDICATION</Typography>
                                    <Typography variant="body2">{selectedVisit.treatment}</Typography>
                                    {selectedVisit.medicationGiven && (
                                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Medication fontSize="small" sx={{ color: '#ef4444' }} />
                                            <Typography variant="body2">{selectedVisit.medicationGiven}</Typography>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenReportDialog(false)} variant="contained" sx={{ bgcolor: '#000' }}>Close Report</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Clinic;
