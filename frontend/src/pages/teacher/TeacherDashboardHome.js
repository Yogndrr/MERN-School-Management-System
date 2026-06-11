import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Paper, Avatar, CircularProgress } from '@mui/material';
import { People, Assignment, Message, CalendarMonth } from '@mui/icons-material';
import axios from 'axios';

const TeacherDashboardHome = ({ teacherInfo }) => {
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [className, setClassName] = useState('');

    useEffect(() => {
        fetchStudentCount();
    }, []);

    const fetchStudentCount = async () => {
        try {
            const teacherId = localStorage.getItem('teacherId');
            
            if (teacherId) {
                const teacherResponse = await axios.get(`http://localhost:5000/Teacher/${teacherId}`);
                
                if (teacherResponse.data) {
                    const classId = teacherResponse.data.teachSclass?._id || 
                                   teacherResponse.data.homeroomClass?._id;
                    
                    const classNameValue = teacherResponse.data.teachSclass?.sclassName || 
                                          teacherResponse.data.homeroomClass?.sclassName || 
                                          'No Class';
                    
                    setClassName(classNameValue);

                    if (classId) {
                        const studentsResponse = await axios.get(`http://localhost:5000/Sclass/Students/${classId}`);
                        
                        if (Array.isArray(studentsResponse.data)) {
                            setStudentCount(studentsResponse.data.length);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching student count:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* Welcome Card */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: 'white', color: '#059669', mr: 2, fontWeight: 600 }}>
                            {teacherInfo.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Welcome, {teacherInfo.name}
                            </Typography>
                            <Typography variant="body2">
                                {teacherInfo.role} • {className}
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
                            <People sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{studentCount}</Typography>
                            )}
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>Students</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Assignment sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>5</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>Assignments</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Message sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>3</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>New Messages</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <CalendarMonth sx={{ fontSize: 40, color: '#ec4899', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>12</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>Classes This Week</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Recent Activity
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Your recent classroom activities will appear here
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Upcoming Classes
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Your schedule for today
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeacherDashboardHome;
