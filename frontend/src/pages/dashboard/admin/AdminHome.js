import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Grid, Paper, Card, CardContent, Button, Chip, 
    Avatar, LinearProgress, Divider, List, ListItem, ListItemText,
    ListItemAvatar, IconButton, Badge
} from '@mui/material';
import { 
    People, School, Class, TrendingUp, PersonAdd, GroupAdd, Assessment,
    Campaign, Settings, Upload, CheckCircle, Warning, Event, ArrowForward,
    TrendingDown, CalendarToday, Notifications, MoreVert
} from '@mui/icons-material';

const AdminHome = () => {
    const navigate = useNavigate();
    const adminName = localStorage.getItem('adminName') || 'Admin';

    // KPI Stats with trends
    const stats = [
        { 
            title: 'Total Students', 
            value: '1,234', 
            trend: '+5.2%',
            trendUp: true,
            icon: <People />, 
            color: '#667eea', 
            bg: '#f0f4ff' 
        },
        { 
            title: 'Total Staff', 
            value: '89', 
            trend: '+2.1%',
            trendUp: true,
            icon: <School />, 
            color: '#f093fb', 
            bg: '#fef0ff' 
        },
        { 
            title: 'Total Classes', 
            value: '24', 
            trend: '0%',
            trendUp: true,
            icon: <Class />, 
            color: '#4facfe', 
            bg: '#f0f9ff' 
        },
        { 
            title: 'Attendance Today', 
            value: '94%', 
            trend: '-1.2%',
            trendUp: false,
            icon: <TrendingUp />, 
            color: '#43e97b', 
            bg: '#f0fdf4' 
        },
    ];

    // Quick Actions
    const quickActions = [
        { title: 'Add New Student', icon: <PersonAdd />, color: '#667eea', path: '/admin-dashboard/students' },
        { title: 'Add New Staff', icon: <GroupAdd />, color: '#f093fb', path: '/admin-dashboard/teachers' },
        { title: 'Generate Report', icon: <Assessment />, color: '#4facfe', path: '/admin-dashboard/reports' },
        { title: 'Send Announcement', icon: <Campaign />, color: '#43e97b', path: '/admin-dashboard/messages' },
        { title: 'System Settings', icon: <Settings />, color: '#fa709a', path: '/admin-dashboard/settings' },
        { title: 'Bulk Operations', icon: <Upload />, color: '#feca57', path: '/admin-dashboard/students' },
    ];

    // System Alerts
    const systemAlerts = [
        { type: 'warning', message: '3 pending leave requests', action: 'Review' },
        { type: 'info', message: 'System backup completed', action: 'View' },
        { type: 'error', message: '2 failed login attempts', action: 'Check' },
    ];

    // Upcoming Events
    const upcomingEvents = [
        { title: 'Parent-Teacher Meeting', date: 'Nov 25, 2024', time: '2:00 PM', type: 'meeting' },
        { title: 'Mid-Term Exams Begin', date: 'Nov 28, 2024', time: 'All Day', type: 'exam' },
        { title: 'Staff Training Workshop', date: 'Nov 30, 2024', time: '10:00 AM', type: 'training' },
        { title: 'School Holiday', date: 'Dec 1, 2024', time: 'All Day', type: 'holiday' },
    ];

    // Recent Activity
    const recentActivity = [
        { user: 'John Doe', action: 'New student enrolled', time: '5 mins ago', avatar: 'J' },
        { user: 'Jane Smith', action: 'Updated class schedule', time: '15 mins ago', avatar: 'J' },
        { user: 'Mike Johnson', action: 'Generated attendance report', time: '1 hour ago', avatar: 'M' },
        { user: 'Sarah Williams', action: 'Added new teacher', time: '2 hours ago', avatar: 'S' },
    ];

    // Attendance Overview
    const attendanceData = [
        { class: 'Grade 10A', present: 28, total: 30, percentage: 93 },
        { class: 'Grade 10B', present: 25, total: 28, percentage: 89 },
        { class: 'Grade 11A', present: 30, total: 30, percentage: 100 },
        { class: 'Grade 9A', present: 22, total: 25, percentage: 88 },
    ];

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome Back, {adminName}! 👋
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Here's what's happening in your school today
                </Typography>
            </Box>

            {/* KPI Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '12px',
                                        bgcolor: stat.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: stat.color
                                    }}>
                                        {stat.icon}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {stat.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            {stat.trendUp ? (
                                                <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
                                            ) : (
                                                <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
                                            )}
                                            <Typography 
                                                variant="caption" 
                                                sx={{ color: stat.trendUp ? '#10b981' : '#ef4444', fontWeight: 600 }}
                                            >
                                                {stat.trend}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* System Alerts */}
            {systemAlerts.length > 0 && (
                <Paper sx={{ p: 2, borderRadius: '16px', mb: 3, bgcolor: '#fef3c7', border: '1px solid #fbbf24' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Warning sx={{ color: '#f59e0b' }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                System Alerts
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                                {systemAlerts.length} items need your attention
                            </Typography>
                        </Box>
                        <Button size="small" sx={{ textTransform: 'none' }}>
                            View All
                        </Button>
                    </Box>
                </Paper>
            )}

            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => navigate(action.path)}
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            borderColor: '#f0f0f0',
                                            color: action.color,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: action.color,
                                                bgcolor: `${action.color}10`
                                            }
                                        }}
                                    >
                                        {action.icon}
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {action.title}
                                        </Typography>
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* Today's Attendance Overview */}
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Today's Attendance Overview
                            </Typography>
                            <Button 
                                size="small" 
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/admin-dashboard/overview')}
                                sx={{ textTransform: 'none' }}
                            >
                                View Details
                            </Button>
                        </Box>
                        {attendanceData.map((item, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {item.class}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        {item.present}/{item.total} ({item.percentage}%)
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={item.percentage} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        bgcolor: '#f0f0f0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: item.percentage >= 90 ? '#10b981' : item.percentage >= 75 ? '#f59e0b' : '#ef4444'
                                        }
                                    }} 
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Upcoming Events */}
                    <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Upcoming Events
                            </Typography>
                            <IconButton size="small">
                                <CalendarToday fontSize="small" />
                            </IconButton>
                        </Box>
                        {upcomingEvents.map((event, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    mb: 2, 
                                    pb: 2, 
                                    borderBottom: index < upcomingEvents.length - 1 ? '1px solid #f0f0f0' : 'none' 
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {event.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Event sx={{ fontSize: 14, color: '#666' }} />
                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                        {event.date} • {event.time}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        <Button 
                            fullWidth 
                            variant="outlined" 
                            onClick={() => navigate('/admin-dashboard/calendar')}
                            sx={{ mt: 1, textTransform: 'none', borderRadius: '10px' }}
                        >
                            View Calendar
                        </Button>
                    </Paper>

                    {/* Recent Activity */}
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Recent Activity
                        </Typography>
                        <List sx={{ p: 0 }}>
                            {recentActivity.map((activity, index) => (
                                <ListItem 
                                    key={index} 
                                    sx={{ 
                                        px: 0,
                                        borderBottom: index < recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none'
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#667eea', width: 36, height: 36 }}>
                                            {activity.avatar}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {activity.user}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="caption" sx={{ display: 'block' }}>
                                                    {activity.action}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#999' }}>
                                                    {activity.time}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminHome;
