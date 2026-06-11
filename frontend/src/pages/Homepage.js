import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Button, Typography, Container, Grid, Card, CardContent, Avatar, 
    AppBar, Toolbar, IconButton, Menu, MenuItem, Dialog, DialogTitle, 
    DialogContent, TextField, Alert, Tabs, Tab 
} from '@mui/material';
import { ArrowForward, School, Menu as MenuIcon, Person, AdminPanelSettings, Close, LocalLibrary, LocalHospital } from '@mui/icons-material';
import axios from 'axios';

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 2 }}>{children}</Box>}</div>;
}

const Homepage = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [showAllTeachers, setShowAllTeachers] = useState(false);
    const [openTeacherLogin, setOpenTeacherLogin] = useState(false);
    const [loginTab, setLoginTab] = useState(0);
    const [loginData, setLoginData] = useState({ teacherId: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', teacherId: '' });
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.get(`${API_URL}/AllTeachers`);
            if (response.data && Array.isArray(response.data)) {
                // Get all main teachers
                const mainTeachers = response.data
                    .filter(t => t.teacherType === 'main_teacher')
                    .sort((a, b) => (a.teacherId || '').localeCompare(b.teacherId || ''));
                setTeachers(mainTeachers);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleTeacherLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/TeacherLogin`, loginData);
            
            if (response.data._id) {
                localStorage.setItem('teacherAccess', 'authenticated');
                localStorage.setItem('teacherId', response.data._id);
                localStorage.setItem('teacherName', response.data.name);
                localStorage.setItem('teacherEmail', response.data.email);
                localStorage.setItem('teacherRole', response.data.role);
                setOpenTeacherLogin(false);
                navigate('/teacher/dashboard');
            } else {
                setLoginError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setLoginError('Login failed. Please check your credentials.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
            {/* Header */}
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                            color: '#fff'
                        }}>
                            B
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#000', display: { xs: 'none', sm: 'block' } }}>
                            BIS NOC
                        </Typography>
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
                        <Button sx={{ color: '#000', textTransform: 'none', fontWeight: 500 }} href="#home">
                            Home
                        </Button>
                        <Button sx={{ color: '#666', textTransform: 'none', fontWeight: 500 }} href="#teachers">
                            Our Teachers
                        </Button>
                        <Button sx={{ color: '#666', textTransform: 'none', fontWeight: 500 }} href="#gallery">
                            Gallery
                        </Button>
                        <Button sx={{ color: '#666', textTransform: 'none', fontWeight: 500 }} href="#about">
                            About
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Person />}
                            onClick={() => setOpenTeacherLogin(true)}
                            sx={{
                                borderColor: '#000',
                                color: '#000',
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: '8px',
                                '&:hover': { borderColor: '#000', bgcolor: 'rgba(0,0,0,0.05)' }
                            }}
                        >
                            Teacher Login
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AdminPanelSettings />}
                            onClick={() => navigate('/admin-login')}
                            sx={{
                                bgcolor: '#000',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 500,
                                borderRadius: '8px',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                            }}
                        >
                            Admin
                        </Button>
                    </Box>

                    {/* Mobile Menu */}
                    <IconButton
                        sx={{ display: { xs: 'block', md: 'none' }, color: '#000' }}
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => { handleMenuClose(); window.location.href = '#home'; }}>Home</MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); window.location.href = '#teachers'; }}>Our Teachers</MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); window.location.href = '#gallery'; }}>Gallery</MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); window.location.href = '#about'; }}>About</MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); setOpenTeacherLogin(true); }}>Teacher Login</MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); navigate('/admin-login'); }}>Admin Login</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box id="home" sx={{ 
                minHeight: '90vh', 
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #000 2px, transparent 0)',
                    backgroundSize: '50px 50px'
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography 
                                variant="h2" 
                                sx={{ 
                                    fontWeight: 800,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    color: '#000',
                                    mb: 2,
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2
                                }}
                            >
                                British International School
                            </Typography>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 400,
                                    color: '#666',
                                    mb: 4,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    fontSize: '1rem'
                                }}
                            >
                                NOC Gerji Campus
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: '#666',
                                    mb: 4,
                                    lineHeight: 1.8,
                                    fontSize: '1.125rem',
                                    maxWidth: 500
                                }}
                            >
                                Empowering young minds through excellence in education. 
                                A modern school management platform for seamless administration and communication.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/get-started')}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        background: '#000',
                                        color: '#fff',
                                        py: 1.5,
                                        px: 4,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            background: '#333',
                                            boxShadow: 'none',
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Get Started
                                </Button>

                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                width: '100%',
                                height: 400,
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                            }}>
                                <School sx={{ fontSize: 150, color: 'rgba(255,255,255,0.9)' }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Our Teachers Section - Horizontal Carousel */}
            <Box id="teachers" sx={{ py: 10, bgcolor: '#fff' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mb: 2 }}>
                            Our Teachers
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', fontSize: '1.125rem', maxWidth: 600, mx: 'auto' }}>
                            Meet our dedicated team of educators committed to nurturing excellence
                        </Typography>
                    </Box>

                    {/* Horizontal Scrolling Carousel */}
                    <Box sx={{ 
                        display: 'flex',
                        overflowX: 'auto',
                        gap: 3,
                        pb: 3,
                        px: { xs: 2, sm: 0 },
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '10px',
                            '&:hover': {
                                background: '#555',
                            }
                        }
                    }}>
                        {teachers.map((teacher, index) => {
                            // Array of beautiful gradient combinations
                            const gradients = [
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                                'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
                            ];
                            
                            const gradient = gradients[index % gradients.length];
                            
                            return (
                                <Card key={teacher._id} sx={{
                                    minWidth: { xs: 280, sm: 320 },
                                    maxWidth: { xs: 280, sm: 320 },
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                    position: 'relative',
                                    '&:hover': {
                                        transform: 'translateY(-12px)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                    }
                                }}>
                                    {/* Gradient Header */}
                                    <Box sx={{
                                        height: 120,
                                        background: gradient,
                                        position: 'relative'
                                    }} />
                                    
                                    {/* Profile Content */}
                                    <CardContent sx={{ 
                                        p: 3, 
                                        textAlign: 'center',
                                        mt: -5,
                                        position: 'relative'
                                    }}>
                                        {/* Avatar with white border */}
                                        <Avatar
                                            sx={{
                                                width: 100,
                                                height: 100,
                                                background: gradient,
                                                fontSize: '2.5rem',
                                                fontWeight: 700,
                                                mx: 'auto',
                                                mb: 2,
                                                border: '4px solid #fff',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                color: '#fff'
                                            }}
                                        >
                                            {teacher.name?.charAt(0)}
                                        </Avatar>
                                        
                                        {/* Teacher Info */}
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 700, 
                                            mb: 0.5,
                                            color: '#1a1a1a'
                                        }}>
                                            {teacher.name}
                                        </Typography>
                                        
                                        <Typography variant="body2" sx={{ 
                                            color: '#666', 
                                            mb: 1,
                                            fontWeight: 500
                                        }}>
                                            {teacher.teachSclass?.sclassName || teacher.homeroomClass?.sclassName || 'Main Teacher'}
                                        </Typography>
                                        
                                        {/* Teacher ID Badge */}
                                        <Box sx={{
                                            display: 'inline-block',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: '20px',
                                            background: 'rgba(0,0,0,0.05)',
                                            mt: 1
                                        }}>
                                            <Typography variant="caption" sx={{ 
                                                color: '#666',
                                                fontWeight: 600,
                                                letterSpacing: '0.5px'
                                            }}>
                                                {teacher.teacherId}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>

                    {teachers.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="body1" sx={{ color: '#999' }}>
                                No teachers available at the moment.
                            </Typography>
                        </Box>
                    )}

                    {teachers.length > 0 && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Typography variant="body2" sx={{ color: '#999' }}>
                                Scroll horizontally to see all {teachers.length} teachers →
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Student Life Gallery Section */}
            <Box id="gallery" sx={{ py: 10, bgcolor: '#f9fafb' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mb: 2 }}>
                            Student Life Gallery
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', fontSize: '1.125rem', maxWidth: 600, mx: 'auto' }}>
                            Capturing moments of learning, growth, and joy at BIS NOC
                        </Typography>
                    </Box>

                    {/* Image Grid */}
                    <Grid container spacing={3}>
                        {/* Large Featured Image */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                height: { xs: 300, md: 500 },
                                borderRadius: '20px',
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    '& .overlay': {
                                        opacity: 1
                                    }
                                }
                            }}>
                                <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    color: '#fff'
                                }}>
                                    <School sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        Classroom Learning
                                    </Typography>
                                </Box>
                                <Box className="overlay" sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease'
                                }}>
                                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                        View Gallery
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Grid of Smaller Images */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={3}>
                                {/* Sports & Activities */}
                                <Grid item xs={6}>
                                    <Box sx={{
                                        height: 240,
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            '& .overlay': {
                                                opacity: 1
                                            }
                                        }
                                    }}>
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#fff'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', px: 2 }}>
                                                Sports & Activities
                                            </Typography>
                                        </Box>
                                        <Box className="overlay" sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }}>
                                            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                                View
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Science Lab */}
                                <Grid item xs={6}>
                                    <Box sx={{
                                        height: 240,
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            '& .overlay': {
                                                opacity: 1
                                            }
                                        }
                                    }}>
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#fff'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', px: 2 }}>
                                                Science Lab
                                            </Typography>
                                        </Box>
                                        <Box className="overlay" sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }}>
                                            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                                View
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Library */}
                                <Grid item xs={6}>
                                    <Box sx={{
                                        height: 240,
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            '& .overlay': {
                                                opacity: 1
                                            }
                                        }
                                    }}>
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#fff'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', px: 2 }}>
                                                Library
                                            </Typography>
                                        </Box>
                                        <Box className="overlay" sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }}>
                                            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                                View
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Events & Celebrations */}
                                <Grid item xs={6}>
                                    <Box sx={{
                                        height: 240,
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            '& .overlay': {
                                                opacity: 1
                                            }
                                        }
                                    }}>
                                        <Box sx={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#fff'
                                        }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', px: 2 }}>
                                                Events
                                            </Typography>
                                        </Box>
                                        <Box className="overlay" sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease'
                                        }}>
                                            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                                                View
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* View All Button */}
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: '#000',
                                color: '#000',
                                py: 1.5,
                                px: 4,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: '12px',
                                textTransform: 'none',
                                borderWidth: '2px',
                                '&:hover': {
                                    borderWidth: '2px',
                                    borderColor: '#000',
                                    background: 'rgba(0,0,0,0.05)'
                                }
                            }}
                        >
                            View Full Gallery
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: '#000', color: '#fff', py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#000'
                                }}>
                                    B
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    BIS NOC
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.8 }}>
                                British International School - NOC Gerji Campus
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Quick Links
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button sx={{ color: '#999', textTransform: 'none', justifyContent: 'flex-start', p: 0 }} href="#home">
                                    Home
                                </Button>
                                <Button sx={{ color: '#999', textTransform: 'none', justifyContent: 'flex-start', p: 0 }} href="#teachers">
                                    Our Teachers
                                </Button>
                                <Button sx={{ color: '#999', textTransform: 'none', justifyContent: 'flex-start', p: 0 }} href="#gallery">
                                    Gallery
                                </Button>
                                <Button sx={{ color: '#999', textTransform: 'none', justifyContent: 'flex-start', p: 0 }} onClick={() => setOpenTeacherLogin(true)}>
                                    Teacher Login
                                </Button>
                                <Button sx={{ color: '#999', textTransform: 'none', justifyContent: 'flex-start', p: 0 }} onClick={() => navigate('/admin-login')}>
                                    Admin Login
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Contact
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#999', lineHeight: 1.8 }}>
                                NOC Gerji Campus<br />
                                Addis Ababa, Ethiopia<br />
                                Email: info@bisnoc.edu<br />
                                Phone: +251 11 XXX XXXX
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ borderTop: '1px solid #333', mt: 6, pt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            © 2024 British International School - NOC Gerji Campus. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Teacher Login Dialog */}
            <Dialog 
                open={openTeacherLogin} 
                onClose={() => setOpenTeacherLogin(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Teacher Access
                        </Typography>
                        <IconButton onClick={() => setOpenTeacherLogin(false)} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Tabs 
                        value={loginTab} 
                        onChange={(e, v) => setLoginTab(v)}
                        sx={{ 
                            mb: 3,
                            borderBottom: 1,
                            borderColor: 'divider'
                        }}
                    >
                        <Tab label="Login" sx={{ textTransform: 'none', fontWeight: 600 }} />
                        <Tab label="Sign Up" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    </Tabs>

                    {/* Login Tab */}
                    <TabPanel value={loginTab} index={0}>
                        {loginError && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                                {loginError}
                            </Alert>
                        )}
                        <form onSubmit={handleTeacherLogin}>
                            <TextField
                                fullWidth
                                label="Teacher ID"
                                value={loginData.teacherId}
                                onChange={(e) => setLoginData({ ...loginData, teacherId: e.target.value })}
                                sx={{ mb: 2 }}
                                required
                                helperText="e.g., TCH001"
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                sx={{ mb: 3 }}
                                required
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loginLoading}
                                sx={{
                                    bgcolor: '#000',
                                    color: '#fff',
                                    py: 1.5,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                                }}
                            >
                                {loginLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </TabPanel>

                    {/* Sign Up Tab */}
                    <TabPanel value={loginTab} index={1}>
                        <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }}>
                            Please contact the administrator to create a teacher account.
                        </Alert>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            sx={{ mb: 2 }}
                            disabled
                            InputProps={{ sx: { borderRadius: '10px' } }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            sx={{ mb: 2 }}
                            disabled
                            InputProps={{ sx: { borderRadius: '10px' } }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            sx={{ mb: 3 }}
                            disabled
                            InputProps={{ sx: { borderRadius: '10px' } }}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            disabled
                            sx={{
                                bgcolor: '#ccc',
                                color: '#666',
                                py: 1.5,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: 'none'
                            }}
                        >
                            Contact Administrator
                        </Button>
                    </TabPanel>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Homepage;
