import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Divider,
    Badge, InputBase, Paper, Grid, Card, CardContent, Chip, Button
} from '@mui/material';
import {
    Home, Class, Assignment, Grade, People, CalendarMonth, Message,
    Folder, Settings, Logout, Menu as MenuIcon, Search, Notifications,
    CheckCircle, Schedule, TrendingUp, School
} from '@mui/icons-material';

// Import teacher pages (we'll create these)
import TeacherHome from './portal/TeacherHome';
import TeacherClasses from './portal/TeacherClasses';
import TeacherAssignments from './portal/TeacherAssignments';
import TeacherGradebook from './portal/TeacherGradebook';
import TeacherAttendance from './portal/TeacherAttendance';
import TeacherStudents from './portal/TeacherStudents';
import TeacherCalendar from './portal/TeacherCalendar';
import TeacherMessages from './portal/TeacherMessages';
import TeacherResources from './portal/TeacherResources';
import TeacherLessonPlans from './portal/TeacherLessonPlans';
import TeacherProfile from './portal/TeacherProfile';
import TeacherSettings from './portal/TeacherSettings';

const drawerWidth = 280;

const TeacherPortalDashboard = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);

    const teacherName = localStorage.getItem('teacherName') || 'Teacher';
    const teacherEmail = localStorage.getItem('teacherEmail') || 'teacher@bisnoc.edu';

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationOpen = (event) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/teacher-portal/home' },
        { divider: true },
        { text: 'My Classes', icon: <Class />, path: '/teacher-portal/classes' },
        { text: 'Assignments', icon: <Assignment />, path: '/teacher-portal/assignments', badge: 5 },
        { text: 'Gradebook', icon: <Grade />, path: '/teacher-portal/gradebook' },
        { text: 'Attendance', icon: <CheckCircle />, path: '/teacher-portal/attendance' },
        { divider: true },
        { text: 'Students', icon: <People />, path: '/teacher-portal/students' },
        { text: 'Lesson Plans', icon: <Schedule />, path: '/teacher-portal/lesson-plans' },
        { divider: true },
        { text: 'Calendar', icon: <CalendarMonth />, path: '/teacher-portal/calendar' },
        { text: 'Messages', icon: <Message />, path: '/teacher-portal/messages', badge: 3 },
        { text: 'Resources', icon: <Folder />, path: '/teacher-portal/resources' },
        { divider: true },
        { text: 'Profile', icon: <School />, path: '/teacher-portal/profile' },
        { text: 'Settings', icon: <Settings />, path: '/teacher-portal/settings' },
    ];

    const drawer = (
        <Box>
            {/* Logo & Greeting */}
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#fff'
                    }}>
                        T
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            BIS NOC
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                            Teacher Portal
                        </Typography>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                    {getGreeting()}, {teacherName}! 👋
                </Typography>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item, index) => {
                    if (item.divider) {
                        return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
                    }

                    const isActive = window.location.pathname === item.path;

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    bgcolor: isActive ? 'rgba(240, 147, 251, 0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: isActive ? 'rgba(240, 147, 251, 0.15)' : 'rgba(0,0,0,0.04)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    minWidth: 40,
                                    color: isActive ? '#f093fb' : '#666'
                                }}>
                                    {item.badge ? (
                                        <Badge badgeContent={item.badge} color="error">
                                            {item.icon}
                                        </Badge>
                                    ) : item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? '#f093fb' : '#333'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Logout Button */}
            <Box sx={{ px: 2, pb: 2 }}>
                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        borderRadius: '12px',
                        py: 1.5,
                        bgcolor: '#fee2e2',
                        '&:hover': {
                            bgcolor: '#fecaca'
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: '#dc2626' }}>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Logout"
                        primaryTypographyProps={{
                            fontWeight: 600,
                            color: '#dc2626'
                        }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f9fafb' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: '#fff',
                    color: '#000',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Search Bar */}
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            width: 400,
                            maxWidth: '100%',
                            boxShadow: 'none',
                            border: '1px solid #e5e7eb',
                            borderRadius: '10px'
                        }}
                    >
                        <Search sx={{ color: '#9ca3af', mr: 1 }} />
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search students, assignments, resources..."
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Paper>

                    <Box sx={{ flexGrow: 1 }} />

                    {/* Notifications */}
                    <IconButton onClick={handleNotificationOpen} sx={{ mr: 1 }}>
                        <Badge badgeContent={4} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <Menu
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={handleNotificationClose}
                        PaperProps={{
                            sx: { borderRadius: '12px', minWidth: 300, maxWidth: 400 }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Notifications
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleNotificationClose}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    5 new assignments submitted
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    2 minutes ago
                                </Typography>
                            </Box>
                        </MenuItem>
                        <MenuItem onClick={handleNotificationClose}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Parent message received
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    1 hour ago
                                </Typography>
                            </Box>
                        </MenuItem>
                        <MenuItem onClick={handleNotificationClose}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    Staff meeting tomorrow at 3 PM
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    3 hours ago
                                </Typography>
                            </Box>
                        </MenuItem>
                    </Menu>

                    {/* Profile Menu */}
                    <IconButton onClick={handleProfileMenuOpen}>
                        <Avatar sx={{ 
                            width: 40, 
                            height: 40,
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            fontWeight: 700
                        }}>
                            {teacherName.charAt(0)}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        PaperProps={{
                            sx: { borderRadius: '12px', minWidth: 200 }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {teacherName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                                {teacherEmail}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/teacher-portal/profile'); }}>
                            <ListItemIcon><School fontSize="small" /></ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/teacher-portal/settings'); }}>
                            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: '#dc2626' }}>
                            <ListItemIcon><Logout fontSize="small" sx={{ color: '#dc2626' }} /></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box', 
                            width: drawerWidth,
                            borderRight: '1px solid #f0f0f0'
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8
                }}
            >
                <Routes>
                    <Route path="/" element={<Navigate to="/teacher-portal/home" />} />
                    <Route path="/home" element={<TeacherHome />} />
                    <Route path="/classes" element={<TeacherClasses />} />
                    <Route path="/assignments" element={<TeacherAssignments />} />
                    <Route path="/gradebook" element={<TeacherGradebook />} />
                    <Route path="/attendance" element={<TeacherAttendance />} />
                    <Route path="/students" element={<TeacherStudents />} />
                    <Route path="/lesson-plans" element={<TeacherLessonPlans />} />
                    <Route path="/calendar" element={<TeacherCalendar />} />
                    <Route path="/messages" element={<TeacherMessages />} />
                    <Route path="/resources" element={<TeacherResources />} />
                    <Route path="/profile" element={<TeacherProfile />} />
                    <Route path="/settings" element={<TeacherSettings />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default TeacherPortalDashboard;
