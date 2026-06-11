import { useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import {
    Home, Dashboard, People, School, Class, Assessment, Message,
    Person, Settings, Logout, Menu as MenuIcon, Schedule, CalendarMonth,
    Accessible, LocalLibrary, LocalHospital
} from '@mui/icons-material';

// Import dashboard pages
import AdminHome from './admin/AdminHome';
import AdminOverview from './admin/AdminOverview';
import AdminStudentManagement from './admin/AdminStudentManagement';
import AdminTeacherManagement from './admin/AdminTeacherManagement';
import AdminAllClasses from './admin/AdminAllClasses';
import AdminTimetable from './admin/AdminTimetable';
import AdminCalendar from './admin/AdminCalendar';
import AdminReports from './admin/AdminReports';
import AdminSendMessage from './admin/AdminSendMessage';
import AdminProfile from './admin/AdminProfile';
import AdminSettings from './admin/AdminSettings';
import SpecialNeeds from './SpecialNeeds';
import Library from './Library';
import Clinic from './Clinic';

const drawerWidth = 280;

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const adminName = localStorage.getItem('adminName') || 'Admin User';
    const adminEmail = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : 'admin@bisnoc.edu';

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/admin-dashboard/home' },
        { text: 'Overview', icon: <Dashboard />, path: '/admin-dashboard/overview' },
        { divider: true },
        { text: 'Student Management', icon: <People />, path: '/admin-dashboard/students' },
        { text: 'Teachers Management', icon: <School />, path: '/admin-dashboard/teachers' },
        { text: 'Special Needs', icon: <Accessible />, path: '/admin-dashboard/special-needs' },
        { divider: true },
        { text: 'All Classes', icon: <Class />, path: '/admin-dashboard/classes' },
        { text: 'Timetable', icon: <Schedule />, path: '/admin-dashboard/timetable' },
        { divider: true },
        { text: 'Library', icon: <LocalLibrary />, path: '/admin-dashboard/library' },
        { text: 'Clinic', icon: <LocalHospital />, path: '/admin-dashboard/clinic' },
        { divider: true },
        { text: 'Calendar & Events', icon: <CalendarMonth />, path: '/admin-dashboard/calendar' },
        { text: 'Reports', icon: <Assessment />, path: '/admin-dashboard/reports' },
        { text: 'Send Message', icon: <Message />, path: '/admin-dashboard/messages' },
        { divider: true },
        { text: 'Profile', icon: <Person />, path: '/admin-dashboard/profile' },
        { text: 'Settings', icon: <Settings />, path: '/admin-dashboard/settings' },
    ];

    const drawer = (
        <Box>
            {/* Logo Section */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff'
                }}>
                    B
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        BIS NOC
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                        Admin Portal
                    </Typography>
                </Box>
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
                                    bgcolor: isActive ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                                    '&:hover': {
                                        bgcolor: isActive ? 'rgba(30, 64, 175, 0.15)' : 'rgba(0,0,0,0.04)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    minWidth: 40,
                                    color: isActive ? '#1e40af' : '#666'
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? '#1e40af' : '#333'
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

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        Admin Dashboard
                    </Typography>

                    {/* Profile Menu */}
                    <IconButton onClick={handleProfileMenuOpen}>
                        <Avatar sx={{ 
                            width: 40, 
                            height: 40,
                            bgcolor: '#1e40af',
                            fontWeight: 700
                        }}>
                            {adminName.charAt(0)}
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
                                {adminName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                                {adminEmail}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin-dashboard/profile'); }}>
                            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin-dashboard/settings'); }}>
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
                    <Route path="/" element={<Navigate to="/admin-dashboard/home" />} />
                    <Route path="/home" element={<AdminHome />} />
                    <Route path="/overview" element={<AdminOverview />} />
                    <Route path="/students" element={<AdminStudentManagement />} />
                    <Route path="/teachers" element={<AdminTeacherManagement />} />
                    <Route path="/special-needs" element={<SpecialNeeds />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/clinic" element={<Clinic />} />
                    <Route path="/classes" element={<AdminAllClasses />} />
                    <Route path="/timetable" element={<AdminTimetable />} />
                    <Route path="/calendar" element={<AdminCalendar />} />
                    <Route path="/reports" element={<AdminReports />} />
                    <Route path="/messages" element={<AdminSendMessage />} />
                    <Route path="/profile" element={<AdminProfile />} />
                    <Route path="/settings" element={<AdminSettings />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
