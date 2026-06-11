import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { 
    Box, 
    Drawer, 
    List, 
    ListItemButton, 
    ListItemText, 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton,
    Avatar,
    Divider,
    Menu,
    MenuItem
} from '@mui/material';
import { 
    Dashboard as DashboardIcon,
    People,
    MenuBook,
    Folder,
    Person,
    Settings,
    Logout,
    Menu as MenuIcon
} from '@mui/icons-material';

// Import teacher pages (we'll create these)
import TeacherDashboardHome from './TeacherDashboardHome';
import TeacherRoster from './TeacherRoster';
import TeacherLessonPlanning from './TeacherLessonPlanning';
import TeacherResourceRepo from './TeacherResourceRepo';

const drawerWidth = 260;

const TeacherDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [teacherInfo, setTeacherInfo] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentPath, setCurrentPath] = useState('/teacher/dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const access = localStorage.getItem('teacherAccess');
        if (!access) {
            navigate('/teacher-login');
            return;
        }

        setTeacherInfo({
            name: localStorage.getItem('teacherName') || 'Teacher',
            email: localStorage.getItem('teacherEmail') || '',
            role: localStorage.getItem('teacherRole') || 'Teacher',
            teacherId: localStorage.getItem('teacherId') || ''
        });
    }, [navigate]);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('teacherAccess');
        localStorage.removeItem('teacherId');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('teacherEmail');
        localStorage.removeItem('teacherRole');
        navigate('/dashboard/teachers');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher/dashboard' },
        { text: 'Roster', icon: <People />, path: '/teacher/dashboard/roster' },
        { text: 'Lesson Planning', icon: <MenuBook />, path: '/teacher/dashboard/lesson-planning' },
        { text: 'Resource Repo', icon: <Folder />, path: '/teacher/dashboard/resources' }
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
            {/* Logo */}
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff',
                    mb: 1
                }}>
                    T
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                    Teacher Portal
                </Typography>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                    BIS NOC Gerji
                </Typography>
            </Box>
            
            <List sx={{ flex: 1, py: 2 }}>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            setCurrentPath(item.path);
                            setMobileOpen(false);
                        }}
                        selected={currentPath === item.path}
                        sx={{
                            mx: 1.5,
                            borderRadius: '8px',
                            mb: 0.5,
                            '&:hover': { bgcolor: '#f5f5f5' },
                            '&.Mui-selected': {
                                bgcolor: '#e8f5f1',
                                '&:hover': { bgcolor: '#d1f0e6' }
                            }
                        }}
                    >
                        <Box sx={{ 
                            fontSize: 20, 
                            mr: 2, 
                            color: currentPath === item.path ? '#059669' : '#666',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {item.icon}
                        </Box>
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: currentPath === item.path ? 600 : 500,
                                color: currentPath === item.path ? '#059669' : '#000'
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Divider />

            {/* Bottom Section */}
            <List sx={{ py: 2 }}>
                <ListItemButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                        mx: 1.5,
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#059669',
                            fontSize: '0.875rem',
                            mr: 2
                        }}
                    >
                        {teacherInfo.name?.charAt(0)}
                    </Avatar>
                    <ListItemText
                        primary={teacherInfo.name}
                        secondary="View Profile"
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                </ListItemButton>

                <ListItemButton
                    onClick={() => navigate('/teacher/dashboard/settings')}
                    sx={{
                        mx: 1.5,
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <Settings sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText
                        primary="Settings"
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                </ListItemButton>

                <ListItemButton
                    onClick={handleLogout}
                    sx={{
                        mx: 1.5,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#fee2e2' }
                    }}
                >
                    <Logout sx={{ fontSize: 20, mr: 2, color: '#dc2626' }} />
                    <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#dc2626' }}
                    />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
            {/* Top Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: '#fff',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <Toolbar sx={{ minHeight: '64px !important' }}>
                    <IconButton
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: '#000' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', fontSize: '1rem', flexGrow: 1 }}>
                        British International School - Teacher Portal
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mr: 2, display: { xs: 'none', md: 'block' } }}>
                        {teacherInfo.name}
                    </Typography>
                    <Avatar
                        sx={{ width: 36, height: 36, bgcolor: '#059669', cursor: 'pointer' }}
                        onClick={handleProfileMenuOpen}
                    >
                        {teacherInfo.name?.charAt(0)}
                    </Avatar>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', borderRight: '1px solid #f0f0f0' },
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
                    mt: '64px'
                }}
            >
                <Routes>
                    <Route path="/" element={<TeacherDashboardHome teacherInfo={teacherInfo} />} />
                    <Route path="/roster" element={<TeacherRoster />} />
                    <Route path="/lesson-planning" element={<TeacherLessonPlanning />} />
                    <Route path="/resources" element={<TeacherResourceRepo />} />
                    <Route path="*" element={<Navigate to="/teacher/dashboard" />} />
                </Routes>
            </Box>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                    sx: { mt: 1, minWidth: 200 }
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {teacherInfo.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                        {teacherInfo.email}
                    </Typography>
                </Box>
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/teacher/dashboard/profile'); }}>
                    <Person sx={{ fontSize: 20, mr: 1.5 }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/teacher/dashboard/settings'); }}>
                    <Settings sx={{ fontSize: 20, mr: 1.5 }} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: '#dc2626' }}>
                    <Logout sx={{ fontSize: 20, mr: 1.5 }} /> Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default TeacherDashboard;
