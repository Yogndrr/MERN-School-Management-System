import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Card, CardContent, Grid, Avatar, Paper } from '@mui/material';
import { Logout, School, Assignment, CalendarMonth, Grade } from '@mui/icons-material';

const StudentDashboard = () => {
    const [studentInfo, setStudentInfo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('studentAccess');
        if (!access) {
            navigate('/');
            return;
        }

        setStudentInfo({
            name: localStorage.getItem('studentName') || 'Student',
            class: localStorage.getItem('studentClass') || 'Year 3',
            studentId: localStorage.getItem('studentId') || ''
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('studentAccess');
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentName');
        localStorage.removeItem('studentClass');
        navigate('/');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6' }}>
            <AppBar position="static" sx={{ bgcolor: '#7c3aed' }}>
                <Toolbar>
                    <School sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Student Portal - BIS NOC Gerji
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {studentInfo.name}
                    </Typography>
                    <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
                {/* Welcome Card */}
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', color: 'white' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 60, height: 60, bgcolor: 'white', color: '#7c3aed', mr: 2 }}>
                                {studentInfo.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Welcome, {studentInfo.name}
                                </Typography>
                                <Typography variant="body2">
                                    {studentInfo.class}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Grade sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>85%</Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>Average Grade</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CalendarMonth sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>96%</Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>Attendance</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Assignment sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>3</Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>Pending Assignments</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <School sx={{ fontSize: 40, color: '#ec4899', mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>12</Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280' }}>Classes This Week</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Main Content */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Recent Grades</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                View your recent test scores and assignments
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Assignments</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                Check your pending homework and projects
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>Class Schedule</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                Your weekly timetable and class schedule
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default StudentDashboard;
