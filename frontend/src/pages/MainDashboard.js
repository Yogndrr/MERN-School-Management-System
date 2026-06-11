import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, AppBar, Toolbar, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Tabs, Tab, Alert } from '@mui/material';
import { Home, Dashboard, School, Person, Class, LocalLibrary, LocalHospital, ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 280;

const classColors = [
    'Year 3 - Blue',
    'Year 3 - Crimson',
    'Year 3 - Cyan',
    'Year 3 - Purple',
    'Year 3 - Lavender',
    'Year 3 - Maroon',
    'Year 3 - Violet',
    'Year 3 - Green',
    'Year 3 - Red',
    'Year 3 - Yellow',
    'Year 3 - Magenta',
    'Year 3 - Orange'
];

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

const MainDashboard = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [classesOpen, setClassesOpen] = useState(false);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [loginType, setLoginType] = useState(''); // 'admin', 'teacher', 'student'
    const [currentTab, setCurrentTab] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });
    const [adminSignupData, setAdminSignupData] = useState({ name: '', email: '', password: '', schoolName: '' });
    const [teacherLoginData, setTeacherLoginData] = useState({ teacherId: '', password: '' });
    const [studentLoginData, setStudentLoginData] = useState({ studentId: '', password: '' });
    
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClassesClick = () => {
        setClassesOpen(!classesOpen);
    };

    const handleOpenLogin = (type) => {
        setLoginType(type);
        setCurrentTab(0);
        setError('');
        setOpenLoginDialog(true);
    };

    const handleCloseLogin = () => {
        setOpenLoginDialog(false);
        setError('');
        setAdminLoginData({ email: '', password: '' });
        setAdminSignupData({ name: '', email: '', password: '', schoolName: '' });
        setTeacherLoginData({ teacherId: '', password: '' });
        setStudentLoginData({ rollNum: '', password: '' });
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/AdminLogin', adminLoginData);
            if (response.data._id) {
                localStorage.setItem('adminAccess', 'authenticated');
                localStorage.setItem('adminId', response.data._id);
                localStorage.setItem('adminName', response.data.name);
                localStorage.setItem('adminEmail', response.data.email);
                localStorage.setItem('schoolName', response.data.schoolName);
                handleCloseLogin();
                navigate('/dashboard/admin');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/AdminReg', {
                ...adminSignupData,
                role: 'Admin'
            });
            if (response.data._id) {
                setError('');
                alert('Registration successful! Please login.');
                setCurrentTab(0);
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/TeacherLogin', teacherLoginData);
            if (response.data._id) {
                localStorage.setItem('teacherAccess', 'authenticated');
                localStorage.setItem('teacherId', response.data._id);
                localStorage.setItem('teacherName', response.data.name);
                localStorage.setItem('teacherEmail', response.data.email);
                localStorage.setItem('teacherRole', response.data.role);
                handleCloseLogin();
                navigate('/teacher/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/StudentLogin', studentLoginData);
            if (response.data._id) {
                localStorage.setItem('studentAccess', 'authenticated');
                localStorage.setItem('studentId', response.data._id);
                localStorage.setItem('studentName', response.data.name);
                localStorage.setItem('studentClass', response.data.sclassName?.sclassName);
                handleCloseLogin();
                navigate('/student/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const drawer = (
        <Box>
            <Toolbar sx={{ bgcolor: '#1e40af', color: 'white' }}>
                <Typography variant="h6" noWrap component="div">
                    BIS NOC
                </Typography>
            </Toolbar>
            
            <List>
                {/* Home */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/dashboard/home')}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                {/* Section 1: Portals */}
                <ListItem sx={{ bgcolor: '#f3f4f6', mt: 1 }}>
                    <ListItemText primary="PORTALS" primaryTypographyProps={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }} />
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleOpenLogin('admin')}>
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Admin Dashboard" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleOpenLogin('teacher')}>
                        <ListItemIcon>
                            <School />
                        </ListItemIcon>
                        <ListItemText primary="Teachers Portal" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleOpenLogin('student')}>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <ListItemText primary="Students Portal" />
                    </ListItemButton>
                </ListItem>

                {/* Section 2: Classes */}
                <ListItem sx={{ bgcolor: '#f3f4f6', mt: 2 }}>
                    <ListItemText primary="CLASSES" primaryTypographyProps={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }} />
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={handleClassesClick}>
                        <ListItemIcon>
                            <Class />
                        </ListItemIcon>
                        <ListItemText primary="All Classes" />
                        {classesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>

                <Collapse in={classesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {classColors.map((className, index) => (
                            <ListItemButton 
                                key={index} 
                                sx={{ pl: 4 }}
                                onClick={() => navigate(`/dashboard/class/${className.toLowerCase().replace(/\s+/g, '-')}`)}
                            >
                                <ListItemText 
                                    primary={className} 
                                    primaryTypographyProps={{ fontSize: 14 }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                {/* Section 3: Services */}
                <ListItem sx={{ bgcolor: '#f3f4f6', mt: 2 }}>
                    <ListItemText primary="SERVICES" primaryTypographyProps={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }} />
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/dashboard/library')}>
                        <ListItemIcon>
                            <LocalLibrary />
                        </ListItemIcon>
                        <ListItemText primary="Library" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/dashboard/clinic')}>
                        <ListItemIcon>
                            <LocalHospital />
                        </ListItemIcon>
                        <ListItemText primary="Clinic" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: '#1f2937',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        British International School - NOC Gerji Campus
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: '#f9fafb',
                    minHeight: '100vh'
                }}
            >
                <Toolbar />
                {children}
            </Box>

            {/* Login Dialog */}
            <Dialog open={openLoginDialog} onClose={handleCloseLogin} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: loginType === 'admin' ? '#1e40af' : loginType === 'teacher' ? '#059669' : '#7c3aed', color: 'white' }}>
                    {loginType === 'admin' ? 'Admin Portal' : loginType === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </DialogTitle>

                {loginType === 'admin' && (
                    <>
                        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }} centered>
                            <Tab label="Login" />
                            <Tab label="Register" />
                        </Tabs>

                        <TabPanel value={currentTab} index={0}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <form onSubmit={handleAdminLogin}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={adminLoginData.email}
                                    onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={adminLoginData.password}
                                    onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: '#1e40af' }}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </form>
                        </TabPanel>

                        <TabPanel value={currentTab} index={1}>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <form onSubmit={handleAdminSignup}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={adminSignupData.name}
                                    onChange={(e) => setAdminSignupData({ ...adminSignupData, name: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="School Name"
                                    value={adminSignupData.schoolName}
                                    onChange={(e) => setAdminSignupData({ ...adminSignupData, schoolName: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={adminSignupData.email}
                                    onChange={(e) => setAdminSignupData({ ...adminSignupData, email: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={adminSignupData.password}
                                    onChange={(e) => setAdminSignupData({ ...adminSignupData, password: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: '#10b981' }}>
                                    {loading ? 'Registering...' : 'Register'}
                                </Button>
                            </form>
                        </TabPanel>
                    </>
                )}

                {loginType === 'teacher' && (
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <form onSubmit={handleTeacherLogin}>
                            <TextField
                                fullWidth
                                label="Teacher ID"
                                value={teacherLoginData.teacherId}
                                onChange={(e) => setTeacherLoginData({ ...teacherLoginData, teacherId: e.target.value })}
                                sx={{ mb: 2 }}
                                required
                                helperText="Use your assigned Teacher ID (e.g., TCH001)"
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={teacherLoginData.password}
                                onChange={(e) => setTeacherLoginData({ ...teacherLoginData, password: e.target.value })}
                                sx={{ mb: 2 }}
                                required
                            />
                            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: '#059669' }}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </DialogContent>
                )}

                {loginType === 'student' && (
                    <DialogContent>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <form onSubmit={handleStudentLogin}>
                            <TextField
                                fullWidth
                                label="Student ID"
                                value={studentLoginData.studentId}
                                onChange={(e) => setStudentLoginData({ ...studentLoginData, studentId: e.target.value })}
                                sx={{ mb: 2 }}
                                required
                                helperText="Use your assigned Student ID (e.g., BIS20240001)"
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={studentLoginData.password}
                                onChange={(e) => setStudentLoginData({ ...studentLoginData, password: e.target.value })}
                                sx={{ mb: 2 }}
                                required
                            />
                            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ bgcolor: '#7c3aed' }}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </DialogContent>
                )}

                <DialogActions>
                    <Button onClick={handleCloseLogin}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MainDashboard;
