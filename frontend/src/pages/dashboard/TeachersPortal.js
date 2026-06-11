import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActionArea,
    Avatar,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    IconButton
} from '@mui/material';
import { 
    School, 
    Person, 
    MenuBook, 
    SupervisorAccount, 
    Accessible,
    Close
} from '@mui/icons-material';
import axios from 'axios';

const TeachersPortal = () => {
    const [teachers, setTeachers] = useState({
        main_teacher: [],
        subject_teacher: [],
        assistant_teacher: [],
        special_needs_teacher: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/AllTeachers');
            
            if (response.data.message) {
                setError(response.data.message);
            } else {
                // Group teachers by type
                const grouped = {
                    main_teacher: [],
                    subject_teacher: [],
                    assistant_teacher: [],
                    special_needs_teacher: []
                };

                response.data.forEach(teacher => {
                    const type = teacher.teacherType || 'main_teacher';
                    if (grouped[type]) {
                        grouped[type].push(teacher);
                    }
                });

                setTeachers(grouped);
            }
        } catch (err) {
            setError('Failed to load teachers');
            console.error('Error fetching teachers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherSelect = (teacher) => {
        setSelectedTeacher(teacher);
        setPassword('');
        setLoginError('');
        setOpenLoginDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenLoginDialog(false);
        setSelectedTeacher(null);
        setPassword('');
        setLoginError('');
    };

    const handleTeacherLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        
        try {
            const response = await axios.post('http://localhost:5000/TeacherLogin', {
                teacherId: selectedTeacher.teacherId,
                password: password
            });
            
            if (response.data._id) {
                localStorage.setItem('teacherAccess', 'authenticated');
                localStorage.setItem('teacherId', response.data._id);
                localStorage.setItem('teacherName', response.data.name);
                localStorage.setItem('teacherEmail', response.data.email);
                localStorage.setItem('teacherRole', response.data.role);
                handleCloseDialog();
                navigate('/teacher/dashboard');
            } else {
                setLoginError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setLoginError('Login failed. Please check your password.');
            console.error('Login error:', err);
        } finally {
            setLoginLoading(false);
        }
    };

    const getSectionConfig = (type) => {
        const configs = {
            main_teacher: {
                title: 'Main Teachers',
                icon: <Person sx={{ fontSize: 32 }} />,
                color: '#059669',
                bgColor: '#d1fae5'
            },
            subject_teacher: {
                title: 'Subject Teachers',
                icon: <MenuBook sx={{ fontSize: 32 }} />,
                color: '#2563eb',
                bgColor: '#dbeafe'
            },
            assistant_teacher: {
                title: 'Assistant Teachers',
                icon: <SupervisorAccount sx={{ fontSize: 32 }} />,
                color: '#7c3aed',
                bgColor: '#ede9fe'
            },
            special_needs_teacher: {
                title: 'Special Needs Teachers',
                icon: <Accessible sx={{ fontSize: 32 }} />,
                color: '#dc2626',
                bgColor: '#fee2e2'
            }
        };
        return configs[type] || configs.main_teacher;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#1f2937' }}>
                Teachers Portal
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
                Select a teacher to access their dashboard
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Teacher Sections */}
            {Object.entries(teachers).map(([type, teacherList]) => {
                if (teacherList.length === 0) return null;
                
                const config = getSectionConfig(type);
                
                return (
                    <Paper key={type} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2, 
                            mb: 3,
                            pb: 2,
                            borderBottom: `2px solid ${config.color}`
                        }}>
                            <Box sx={{ color: config.color }}>
                                {config.icon}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                {config.title}
                            </Typography>
                            <Chip 
                                label={teacherList.length}
                                size="small"
                                sx={{ 
                                    bgcolor: config.bgColor,
                                    color: config.color,
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                        
                        <Grid container spacing={2}>
                            {teacherList.map(teacher => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={teacher._id}>
                                    <Card
                                        elevation={1}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '2px solid transparent',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                                borderColor: config.color
                                            }
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleTeacherSelect(teacher)}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                    <Avatar 
                                                        sx={{ 
                                                            width: 48, 
                                                            height: 48, 
                                                            bgcolor: config.bgColor,
                                                            color: config.color,
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {teacher.name.charAt(0)}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {teacher.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                            {teacher.teacherId}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {teacher.teachSclass?.sclassName && (
                                                    <Chip 
                                                        label={teacher.teachSclass.sclassName}
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: config.bgColor,
                                                            color: config.color,
                                                            fontWeight: 500,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    />
                                                )}
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                );
            })}

            {/* Login Dialog */}
            <Dialog 
                open={openLoginDialog} 
                onClose={handleCloseDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Teacher Login
                            </Typography>
                            {selectedTeacher && (
                                <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
                                    {selectedTeacher.name} ({selectedTeacher.teacherId})
                                </Typography>
                            )}
                        </Box>
                        <IconButton onClick={handleCloseDialog} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {loginError && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                            {loginError}
                        </Alert>
                    )}
                    <form onSubmit={handleTeacherLogin}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                            sx={{ mb: 3 }}
                            InputProps={{
                                sx: { borderRadius: '10px' }
                            }}
                            helperText="Enter your password to access your dashboard"
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
                                '&:hover': {
                                    bgcolor: '#333',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {loginLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TeachersPortal;
