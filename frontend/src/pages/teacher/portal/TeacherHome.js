import { Box, Typography, Grid, Paper, Card, CardContent, Button, Chip, Avatar, LinearProgress } from '@mui/material';
import { 
    Assignment, CheckCircle, Message, TrendingUp, Schedule, 
    Add, Grade, People, CalendarToday 
} from '@mui/icons-material';

const TeacherHome = () => {
    const teacherName = localStorage.getItem('teacherName') || 'Teacher';
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Quick Stats
    const stats = [
        { title: 'Classes Today', value: '4', icon: <Schedule />, color: '#f093fb', bg: '#fef0ff' },
        { title: 'Pending Grades', value: '12', icon: <Grade />, color: '#4facfe', bg: '#f0f9ff' },
        { title: 'Unread Messages', value: '3', icon: <Message />, color: '#43e97b', bg: '#f0fdf4' },
        { title: 'Attendance Due', value: '2', icon: <CheckCircle />, color: '#fa709a', bg: '#fff0f5' },
    ];

    // Today's Schedule
    const todaySchedule = [
        { time: '08:00 - 09:00', subject: 'Mathematics', class: 'Grade 10A', room: 'Room 201', status: 'completed' },
        { time: '09:15 - 10:15', subject: 'Mathematics', class: 'Grade 10B', room: 'Room 201', status: 'completed' },
        { time: '10:30 - 11:30', subject: 'Algebra', class: 'Grade 11A', room: 'Room 201', status: 'current' },
        { time: '12:00 - 13:00', subject: 'Free Period', class: '-', room: '-', status: 'upcoming' },
        { time: '13:30 - 14:30', subject: 'Mathematics', class: 'Grade 9A', room: 'Room 201', status: 'upcoming' },
    ];

    // Quick Actions
    const quickActions = [
        { title: 'Create Assignment', icon: <Assignment />, color: '#667eea' },
        { title: 'Take Attendance', icon: <CheckCircle />, color: '#43e97b' },
        { title: 'Enter Grades', icon: <Grade />, color: '#4facfe' },
        { title: 'Message Parents', icon: <Message />, color: '#f093fb' },
        { title: 'Upload Resource', icon: <Add />, color: '#fa709a' },
        { title: 'Plan Lesson', icon: <Schedule />, color: '#feca57' },
    ];

    // Recent Activity
    const recentActivity = [
        { student: 'John Doe', action: 'Submitted Assignment', subject: 'Math Quiz 5', time: '10 mins ago' },
        { student: 'Jane Smith', action: 'Submitted Assignment', subject: 'Math Quiz 5', time: '25 mins ago' },
        { student: 'Mike Johnson', action: 'Absent', subject: 'Grade 10A', time: '1 hour ago' },
    ];

    return (
        <Box>
            {/* Welcome Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {getGreeting()}, {teacherName}! 👋
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Here's what's happening with your classes today
                </Typography>
            </Box>

            {/* Quick Stats */}
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
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Today's Schedule */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Today's Schedule
                            </Typography>
                            <Chip label={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} />
                        </Box>
                        
                        {todaySchedule.map((period, index) => (
                            <Box 
                                key={index}
                                sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    mb: 2,
                                    borderRadius: '12px',
                                    bgcolor: period.status === 'current' ? '#fef3c7' : '#f9fafb',
                                    border: period.status === 'current' ? '2px solid #f59e0b' : '1px solid #f0f0f0'
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                        {period.time}
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        {period.subject}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                        {period.class} • {period.room}
                                    </Typography>
                                </Box>
                                {period.status === 'current' && (
                                    <Chip label="Current" color="warning" size="small" />
                                )}
                                {period.status === 'completed' && (
                                    <CheckCircle sx={{ color: '#10b981' }} />
                                )}
                                {period.status === 'upcoming' && period.subject !== 'Free Period' && (
                                    <Button size="small" variant="outlined" sx={{ textTransform: 'none' }}>
                                        View Class
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </Paper>

                    {/* Quick Actions */}
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            {quickActions.map((action, index) => (
                                <Grid item xs={6} sm={4} key={index}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
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
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    {/* Recent Activity */}
                    <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Recent Activity
                        </Typography>
                        {recentActivity.map((activity, index) => (
                            <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < recentActivity.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f093fb' }}>
                                        {activity.student.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {activity.student}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                            {activity.action}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#999' }}>
                                    {activity.subject} • {activity.time}
                                </Typography>
                            </Box>
                        ))}
                    </Paper>

                    {/* Class Performance */}
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Class Performance
                        </Typography>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Grade 10A</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>85%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Grade 10B</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>78%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Grade 11A</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>92%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={92} sx={{ height: 8, borderRadius: 4 }} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeacherHome;
