import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert, Divider } from '@mui/material';
import { School, Person, SupervisorAccount, Accessible } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeachersPortalEnhanced = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        setLoading(true);
        try {
            // For now, use mock data. Replace with API call when ready
            const mockTeachers = [
                // Main Teachers
                { _id: '1', teacherId: 'TCH001', name: 'Abigia Alemayehu', teacherType: 'main_teacher', email: 'abigia-violet@bisnoc.edu', homeroomClass: 'Year 3 - Blue' },
                { _id: '2', teacherId: 'TCH002', name: 'Abigiya Tadele', teacherType: 'main_teacher', email: 'abigya-magenta@bisnoc.edu', homeroomClass: 'Year 3 - Crimson' },
                { _id: '3', teacherId: 'TCH003', name: 'Deginet Engida', teacherType: 'main_teacher', email: 'degnet-green@bisnoc.edu', homeroomClass: 'Year 3 - Cyan' },
                { _id: '4', teacherId: 'TCH004', name: 'Denebe Abu', teacherType: 'main_teacher', email: 'denebe-red@bisnoc.edu', homeroomClass: 'Year 3 - Purple' },
                { _id: '5', teacherId: 'TCH005', name: 'Mariamawit Belay', teacherType: 'main_teacher', email: 'mariamawit-cyan@bisnoc.edu', homeroomClass: 'Year 3 - Lavender' },
                { _id: '6', teacherId: 'TCH006', name: 'Mekdelawit Abate', teacherType: 'main_teacher', email: 'mekdelawit-maroon@bisnoc.edu', homeroomClass: 'Year 3 - Maroon' },
                { _id: '7', teacherId: 'TCH007', name: 'Mekdelawit Nigusu', teacherType: 'main_teacher', email: 'mekdelawit-yellow@bisnoc.edu', homeroomClass: 'Year 3 - Violet' },
                { _id: '8', teacherId: 'TCH008', name: 'Meron Abebe', teacherType: 'main_teacher', email: 'meron-orange@bisnoc.edu', homeroomClass: 'Year 3 - Green' },
                { _id: '9', teacherId: 'TCH009', name: 'Mulugeta Jemberu', teacherType: 'main_teacher', email: 'mulugeta-green@bisnoc.edu', homeroomClass: 'Year 3 - Red' },
                { _id: '10', teacherId: 'TCH010', name: 'Selam Goyte', teacherType: 'main_teacher', email: 'selam-lavender@bisnoc.edu', homeroomClass: 'Year 3 - Yellow' },
                { _id: '11', teacherId: 'TCH011', name: 'Simegn Yilma', teacherType: 'main_teacher', email: 'simegn-crimson@bisnoc.edu', homeroomClass: 'Year 3 - Magenta' },
                { _id: '12', teacherId: 'TCH012', name: 'Yeabsira Amdie', teacherType: 'main_teacher', email: 'yeabsira-purple@bisnoc.edu', homeroomClass: 'Year 3 - Orange' },
                
                // Subject Teachers
                { _id: '14', teacherId: 'TCH014', name: 'Andu Getachew', teacherType: 'subject_teacher', email: 'andu-fineart@bisnoc.edu', subject: 'Art' },
                { _id: '15', teacherId: 'TCH015', name: 'Amanuel Teamu', teacherType: 'subject_teacher', email: 'Amanuel-ict@bisnoc.edu', subject: 'ICT' },
                { _id: '16', teacherId: 'TCH016', name: 'Fremnet Mamo', teacherType: 'subject_teacher', email: 'Fremnet-amharic@bisnoc.edu', subject: 'Amharic' },
                { _id: '17', teacherId: 'TCH017', name: 'Gebremariam Yismaw', teacherType: 'subject_teacher', email: 'gebremaiam-pe@bisnoc.edu', subject: 'PE' },
                { _id: '18', teacherId: 'TCH018', name: 'Kaleab Bizueinh', teacherType: 'subject_teacher', email: 'kaleab-fineart@bisnoc.edu', subject: 'Art' },
                { _id: '19', teacherId: 'TCH019', name: 'Kalkidan Megersa', teacherType: 'subject_teacher', email: 'kalkidan-french@bisnoc.edu', subject: 'French' },
                { _id: '20', teacherId: 'TCH020', name: 'Mihiret Moges', teacherType: 'subject_teacher', email: 'mihiret-amharic@bisnoc.edu', subject: 'Amharic' },
                { _id: '21', teacherId: 'TCH021', name: 'Micheal', teacherType: 'subject_teacher', email: 'micheal-english@bisnoc.edu', subject: 'English' },
                { _id: '22', teacherId: 'TCH022', name: 'Sena Elias', teacherType: 'subject_teacher', email: 'sena-music@bisnoc.edu', subject: 'Music' },
                { _id: '23', teacherId: 'TCH023', name: 'Solomon', teacherType: 'subject_teacher', email: 'solomon-english@bisnoc.edu', subject: 'English' },
                { _id: '24', teacherId: 'TCH024', name: 'Yalew Endale', teacherType: 'subject_teacher', email: 'yalew-pe@bisnoc.edu', subject: 'PE' },
                
                // Assistant Teachers
                { _id: '13', teacherId: 'TCH013', name: 'Abeba Wendifraw', teacherType: 'assistant_teacher', email: 'abeba-cover@bisnoc.edu' },
                { _id: '25', teacherId: 'TCH025', name: 'Haregeweyn Guesh', teacherType: 'assistant_teacher', email: 'haregeweynguesh@bisnoc.edu' }
            ];
            
            setTeachers(mockTeachers);
        } catch (error) {
            console.error('Error loading teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher);
        setPassword('');
        setError('');
        setOpenLoginDialog(true);
    };

    const handleLogin = async () => {
        if (!password) {
            setError('Please enter password');
            return;
        }

        setLoginLoading(true);
        setError('');

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
                navigate('/teacher/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please check your password.');
        } finally {
            setLoginLoading(false);
        }
    };

    const groupedTeachers = {
        main_teacher: teachers.filter(t => t.teacherType === 'main_teacher'),
        subject_teacher: teachers.filter(t => t.teacherType === 'subject_teacher'),
        assistant_teacher: teachers.filter(t => t.teacherType === 'assistant_teacher'),
        special_needs_teacher: teachers.filter(t => t.teacherType === 'special_needs_teacher')
    };

    const sections = [
        {
            key: 'main_teacher',
            title: 'Main Teachers',
            subtitle: 'Homeroom class teachers',
            icon: <School />,
            color: '#3b82f6'
        },
        {
            key: 'subject_teacher',
            title: 'Subject Teachers',
            subtitle: 'Specialized subject instructors',
            icon: <Person />,
            color: '#10b981'
        },
        {
            key: 'assistant_teacher',
            title: 'Assistant Teachers',
            subtitle: 'Support and cover teachers',
            icon: <SupervisorAccount />,
            color: '#f59e0b'
        },
        {
            key: 'special_needs_teacher',
            title: 'Special Needs Teachers',
            subtitle: 'Special education support',
            icon: <Accessible />,
            color: '#ec4899'
        }
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 1, letterSpacing: '-0.02em' }}>
                Teachers Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                Select a teacher to login to their portal
            </Typography>

            {loading ? (
                <Typography>Loading teachers...</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {sections.map((section) => {
                        const sectionTeachers = groupedTeachers[section.key];
                        if (sectionTeachers.length === 0) return null;

                        return (
                            <Box key={section.key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '10px', 
                                        bgcolor: `${section.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: section.color,
                                        mr: 2
                                    }}>
                                        {section.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {section.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                            {section.subtitle} • {sectionTeachers.length} teacher{sectionTeachers.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={2}>
                                    {sectionTeachers.map((teacher) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={teacher._id}>
                                            <Card 
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    borderRadius: '12px',
                                                    border: '1px solid #f0f0f0',
                                                    boxShadow: 'none',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        borderColor: section.color,
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: `0 4px 12px ${section.color}20`
                                                    }
                                                }}
                                                onClick={() => handleTeacherClick(teacher)}
                                            >
                                                <CardContent sx={{ p: 2.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                        <Avatar 
                                                            sx={{ 
                                                                width: 48, 
                                                                height: 48, 
                                                                bgcolor: section.color,
                                                                mr: 1.5,
                                                                fontSize: '1.25rem',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {teacher.name.charAt(0)}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography 
                                                                variant="subtitle2" 
                                                                sx={{ 
                                                                    fontWeight: 600,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {teacher.name}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#666' }}>
                                                                {teacher.teacherId}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    
                                                    {teacher.homeroomClass && (
                                                        <Chip 
                                                            label={teacher.homeroomClass}
                                                            size="small"
                                                            sx={{ 
                                                                bgcolor: `${section.color}15`,
                                                                color: section.color,
                                                                fontWeight: 500,
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    )}
                                                    
                                                    {teacher.subject && (
                                                        <Chip 
                                                            label={teacher.subject}
                                                            size="small"
                                                            sx={{ 
                                                                bgcolor: `${section.color}15`,
                                                                color: section.color,
                                                                fontWeight: 500,
                                                                fontSize: '0.75rem'
                                                            }}
                                                        />
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* Login Dialog */}
            <Dialog 
                open={openLoginDialog} 
                onClose={() => setOpenLoginDialog(false)} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>
                    Login as {selectedTeacher?.name}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>}
                        
                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
                            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                                Teacher ID
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {selectedTeacher?.teacherId}
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            autoFocus
                            InputProps={{ sx: { borderRadius: '10px' } }}
                            helperText={`Default: ${selectedTeacher?.teacherId}@bis`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button 
                        onClick={() => setOpenLoginDialog(false)} 
                        sx={{ textTransform: 'none', color: '#666' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleLogin}
                        variant="contained"
                        disabled={loginLoading || !password}
                        sx={{ 
                            bgcolor: '#000',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                        }}
                    >
                        {loginLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeachersPortalEnhanced;
