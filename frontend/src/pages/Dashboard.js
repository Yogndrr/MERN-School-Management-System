import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper } from '@mui/material';
import {
    People as PeopleIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import MainLayout from '../components/MainLayout';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        bgcolor: `${color}15`,
                        p: 1.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Icon sx={{ fontSize: 32, color }} />
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    return (
        <MainLayout>
            <Box>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1e40af' }}>
                    Welcome to BIS NOC Dashboard
                </Typography>

                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Students"
                            value="250"
                            icon={PeopleIcon}
                            color="#1e40af"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Teachers"
                            value="36"
                            icon={SchoolIcon}
                            color="#10b981"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Classes"
                            value="12"
                            icon={ClassIcon}
                            color="#f59e0b"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Attendance Today"
                            value="95%"
                            icon={TrendingUpIcon}
                            color="#8b5cf6"
                        />
                    </Grid>
                </Grid>

                {/* Quick Actions */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: '#e0e7ff',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#c7d2fe' },
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Mark Attendance
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: '#d1fae5',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#a7f3d0' },
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Enter Marks
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: '#fef3c7',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#fde68a' },
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    View Timetable
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: '#e9d5ff',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#d8b4fe' },
                                    textAlign: 'center'
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Generate Reports
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Today's Summary */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Today's Summary
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Present Students
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#10b981' }}>
                                    238 / 250
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Absent Students
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ef4444' }}>
                                    12 / 250
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </MainLayout>
    );
};

export default Dashboard;
