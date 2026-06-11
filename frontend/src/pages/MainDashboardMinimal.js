import { useState } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemText, Collapse, AppBar, Toolbar, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Tabs, Tab, Alert, Divider } from '@mui/material';
import { Home, Dashboard, School, Person, Class, LocalLibrary, LocalHospital, ExpandLess, ExpandMore, Menu as MenuIcon, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const drawerWidth = 260;

const classColors = [
    'Year 3 - Blue', 'Year 3 - Crimson', 'Year 3 - Cyan', 'Year 3 - Purple',
    'Year 3 - Lavender', 'Year 3 - Maroon', 'Year 3 - Violet', 'Year 3 - Green',
    'Year 3 - Red', 'Year 3 - Yellow', 'Year 3 - Magenta', 'Year 3 - Orange'
];

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box>{children}</Box>}</div>;
}

const MainDashboardMinimal = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [classesOpen, setClassesOpen] = useState(false);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [loginType, setLoginType] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });
    const [adminSignupData, setAdminSignupData] = useState({ name: '', email: '', password: '', schoolName: '' });
    const [teacherLoginData, setTeacherLoginData] = useState({ teacherId: '', password: '' });
    const [studentLoginData, setStudentLoginData] = useState({ studentId: '', password: '' });
    
    const navigate = useNavigate();

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleClassesClick = () => setClassesOpen(!classesOpen);

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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
            {/* Logo */}
            <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff',
                    mb: 1
                }}>
                    B
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                    BIS NOC
                </Typography>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                    Management System
                </Typography>
            </Box>
            
            <List sx={{ flex: 1, py: 2 }}>
                {/* Home */}
                <ListItemButton 
                    onClick={() => navigate('/dashboard/home')}
                    sx={{ 
                        mx: 1.5, 
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <Home sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText 
                        primary="Home" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                </ListItemButton>

                <Divider sx={{ my: 2, mx: 2 }} />

                {/* Portals */}
                <Typography variant="caption" sx={{ px: 3, color: '#999', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                    PORTALS
                </Typography>

                <ListItemButton 
                    onClick={() => handleOpenLogin('admin')}
                    sx={{ 
                        mx: 1.5, 
                        mt: 1,
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <Dashboard sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText 
                        primary="Admin" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                </ListItemButton>

                <ListItemButton 
                    onClick={() => navigate('/dashboard/teachers')}
                    sx={{ 
                        mx: 1.5, 
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <School sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText 
                        primary="Teachers" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                </ListItemButton>



                <Divider sx={{ my: 2, mx: 2 }} />

                {/* Classes */}
                <Typography variant="caption" sx={{ px: 3, color: '#999', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                    CLASSES
                </Typography>

                <ListItemButton 
                    onClick={handleClassesClick}
                    sx={{ 
                        mx: 1.5, 
                        mt: 1,
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <Class sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText 
                        primary="All Classes" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                    {classesOpen ? <ExpandLess sx={{ fontSize: 18, color: '#999' }} /> : <ExpandMore sx={{ fontSize: 18, color: '#999' }} />}
                </ListItemButton>

                <Collapse in={classesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {classColors.map((className, index) => (
                            <ListItemButton 
                                key={index} 
                                sx={{ 
                                    pl: 6, 
                                    py: 0.75,
                                    '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                                onClick={() => navigate(`/dashboard/class/${className.toLowerCase().replace(/\s+/g, '-')}`)}
                            >
                                <ListItemText 
                                    primary={className} 
                                    primaryTypographyProps={{ fontSize: '0.8125rem', color: '#666' }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                <Divider sx={{ my: 2, mx: 2 }} />

                {/* Services */}
                <Typography variant="caption" sx={{ px: 3, color: '#999', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                    SERVICES
                </Typography>

                <ListItemButton 
                    onClick={() => navigate('/dashboard/library')}
                    sx={{ 
                        mx: 1.5, 
                        mt: 1,
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <LocalLibrary sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText 
                        primary="Library" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                </ListItemButton>

                <ListItemButton 
                    onClick={() => navigate('/dashboard/clinic')}
                    sx={{ 
                        mx: 1.5, 
                        borderRadius: '8px',
                        mb: 0.5,
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                >
                    <LocalHospital sx={{ fontSize: 20, mr: 2, color: '#666' }} />
                    <ListItemText 
                        primary="Clinic" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500, color: '#000' }}
                    />
                </ListItemButton>

                <Divider sx={{ my: 2, mx: 2 }} />

                {/* Back to Homepage */}
                <ListItemButton 
                    onClick={() => navigate('/')}
                    sx={{ 
                        mx: 1.5, 
                        borderRadius: '8px',
                        mb: 0.5,
                        bgcolor: '#f8f9fa',
                        '&:hover': { bgcolor: '#e9ecef' }
                    }}
                >
                    <Home sx={{ fontSize: 20, mr: 2, color: '#059669' }} />
                    <ListItemText 
                        primary="Back to Homepage" 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}
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
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', fontSize: '1rem' }}>
                        British International School
                    </Typography>
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
                {children}
            </Box>

            {/* Login Dialog - Minimalist Design */}
            <Dialog 
                open={openLoginDialog} 
                onClose={handleCloseLogin} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <Box sx={{ p: 4 }}>
                    <IconButton
                        onClick={handleCloseLogin}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            color: '#999'
                        }}
                    >
                        <Close />
                    </IconButton>

                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
                        {loginType === 'admin' ? 'Admin Portal' : loginType === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                        Sign in to continue
                    </Typography>

                    {loginType === 'admin' && (
                        <>
                            <Tabs 
                                value={currentTab} 
                                onChange={(e, v) => setCurrentTab(v)}
                                sx={{ 
                                    mb: 3,
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }
                                }}
                            >
                                <Tab label="Login" />
                                <Tab label="Register" />
                            </Tabs>

                            <TabPanel value={currentTab} index={0}>
                                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
                                <form onSubmit={handleAdminLogin}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={adminLoginData.email}
                                        onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                                        sx={{ mb: 2 }}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: '10px' }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={adminLoginData.password}
                                        onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                                        sx={{ mb: 3 }}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: '10px' }
                                        }}
                                    />
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth 
                                        disabled={loading}
                                        sx={{ 
                                            bgcolor: '#000',
                                            color: '#fff',
                                            py: 1.5,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': {
                                                bgcolor: '#333',
                                                boxShadow: 'none'
                                            }
                                        }}
                                    >
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </form>
                            </TabPanel>

                            <TabPanel value={currentTab} index={1}>
                                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
                                <form onSubmit={handleAdminSignup}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={adminSignupData.name}
                                        onChange={(e) => setAdminSignupData({ ...adminSignupData, name: e.target.value })}
                                        sx={{ mb: 2 }}
                                        required
                                        InputProps={{ sx: { borderRadius: '10px' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="School Name"
                                        value={adminSignupData.schoolName}
                                        onChange={(e) => setAdminSignupData({ ...adminSignupData, schoolName: e.target.value })}
                                        sx={{ mb: 2 }}
                                        required
                                        InputProps={{ sx: { borderRadius: '10px' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={adminSignupData.email}
                                        onChange={(e) => setAdminSignupData({ ...adminSignupData, email: e.target.value })}
                                        sx={{ mb: 2 }}
                                        required
                                        InputProps={{ sx: { borderRadius: '10px' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={adminSignupData.password}
                                        onChange={(e) => setAdminSignupData({ ...adminSignupData, password: e.target.value })}
                                        sx={{ mb: 3 }}
                                        required
                                        InputProps={{ sx: { borderRadius: '10px' } }}
                                    />
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        fullWidth 
                                        disabled={loading}
                                        sx={{ 
                                            bgcolor: '#000',
                                            py: 1.5,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            boxShadow: 'none',
                                            '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                                        }}
                                    >
                                        {loading ? 'Creating account...' : 'Create Account'}
                                    </Button>
                                </form>
                            </TabPanel>
                        </>
                    )}

                    {loginType === 'teacher' && (
                        <DialogContent sx={{ p: 0 }}>
                            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
                            <form onSubmit={handleTeacherLogin}>
                                <TextField
                                    fullWidth
                                    label="Teacher ID"
                                    value={teacherLoginData.teacherId}
                                    onChange={(e) => setTeacherLoginData({ ...teacherLoginData, teacherId: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                    helperText="e.g., TCH001"
                                    InputProps={{ sx: { borderRadius: '10px' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={teacherLoginData.password}
                                    onChange={(e) => setTeacherLoginData({ ...teacherLoginData, password: e.target.value })}
                                    sx={{ mb: 3 }}
                                    required
                                    InputProps={{ sx: { borderRadius: '10px' } }}
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    fullWidth 
                                    disabled={loading}
                                    sx={{ 
                                        bgcolor: '#000',
                                        py: 1.5,
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </DialogContent>
                    )}

                    {loginType === 'student' && (
                        <DialogContent sx={{ p: 0 }}>
                            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
                            <form onSubmit={handleStudentLogin}>
                                <TextField
                                    fullWidth
                                    label="Student ID"
                                    value={studentLoginData.studentId}
                                    onChange={(e) => setStudentLoginData({ ...studentLoginData, studentId: e.target.value })}
                                    sx={{ mb: 2 }}
                                    required
                                    helperText="e.g., Blue001, Crim001"
                                    InputProps={{ sx: { borderRadius: '10px' } }}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={studentLoginData.password}
                                    onChange={(e) => setStudentLoginData({ ...studentLoginData, password: e.target.value })}
                                    sx={{ mb: 3 }}
                                    required
                                    InputProps={{ sx: { borderRadius: '10px' } }}
                                />
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    fullWidth 
                                    disabled={loading}
                                    sx={{ 
                                        bgcolor: '#000',
                                        py: 1.5,
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        boxShadow: 'none',
                                        '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </DialogContent>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default MainDashboardMinimal;
