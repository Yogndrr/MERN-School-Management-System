import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { School } from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const TeacherLogin = () => {
    const [loginData, setLoginData] = useState({ teacherId: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(API_ENDPOINTS.TEACHER_LOGIN, loginData);
            
            if (response.data._id) {
                localStorage.setItem('teacherAccess', 'authenticated');
                localStorage.setItem('teacherId', response.data._id);
                localStorage.setItem('teacherName', response.data.name);
                localStorage.setItem('teacherEmail', response.data.email);
                localStorage.setItem('teacherRole', response.data.role);
                navigate('/teacher-portal/home');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            padding: '20px'
        }}>
            <Paper elevation={6} sx={{ maxWidth: 450, width: '100%', borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                    <School sx={{ fontSize: 60, color: '#059669', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Teacher Portal
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        British International School - NOC Gerji Campus
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Teacher ID"
                            value={loginData.teacherId}
                            onChange={(e) => setLoginData({ ...loginData, teacherId: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                            helperText="Use your assigned Teacher ID (e.g., TCH001)"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            sx={{ mb: 3 }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                bgcolor: '#059669',
                                '&:hover': { bgcolor: '#047857' },
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                            Don't have credentials? Contact your administrator.
                        </Typography>
                        <Button
                            variant="text"
                            onClick={() => navigate('/')}
                            sx={{ color: '#6b7280' }}
                        >
                            ← Back to Homepage
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default TeacherLogin;
