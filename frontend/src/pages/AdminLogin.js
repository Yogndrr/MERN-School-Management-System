import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Tabs, Tab, Alert } from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

const AdminLogin = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', schoolName: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Quick Access (Free) - No authentication
    const handleQuickAccess = () => {
        localStorage.setItem('adminAccess', 'quick');
        localStorage.setItem('adminName', 'Guest Admin');
        navigate('/admin-dashboard/home');
    };

    // Login Handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(API_ENDPOINTS.ADMIN_LOGIN, loginData);
            
            if (response.data._id) {
                // Successful login
                localStorage.setItem('adminAccess', 'authenticated');
                localStorage.setItem('adminId', response.data._id);
                localStorage.setItem('adminName', response.data.name);
                localStorage.setItem('adminEmail', response.data.email);
                localStorage.setItem('schoolName', response.data.schoolName);
                navigate('/admin-dashboard/home');
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

    // Signup Handler
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(API_ENDPOINTS.ADMIN_REGISTER, {
                ...signupData,
                role: 'Admin'
            });
            
            if (response.data._id) {
                // Successful registration
                setSuccess('Registration successful! Please login.');
                setSignupData({ name: '', email: '', password: '', schoolName: '' });
                setTimeout(() => {
                    setCurrentTab(0); // Switch to login tab
                    setSuccess('');
                }, 2000);
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error('Signup error:', err);
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
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            padding: '20px'
        }}>
            <Paper elevation={6} sx={{ maxWidth: 500, width: '100%', borderRadius: 3 }}>
                <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
                    <AdminPanelSettings sx={{ fontSize: 60, color: '#1e40af', mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        Admin Access
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        British International School - NOC Gerji Campus
                    </Typography>
                </Box>

                <Tabs 
                    value={currentTab} 
                    onChange={(_, v) => setCurrentTab(v)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                    centered
                >
                    <Tab label="Login" />
                    <Tab label="Register" />
                    <Tab label="Quick Access" />
                </Tabs>

                {/* Login Tab */}
                <TabPanel value={currentTab} index={0}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            sx={{ mb: 2 }}
                            required
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
                                bgcolor: '#1e40af',
                                '&:hover': { bgcolor: '#1e3a8a' },
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </TabPanel>

                {/* Register Tab */}
                <TabPanel value={currentTab} index={1}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <form onSubmit={handleSignup}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="School Name"
                            value={signupData.schoolName}
                            onChange={(e) => setSignupData({ ...signupData, schoolName: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            sx={{ mb: 3 }}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                bgcolor: '#10b981',
                                '&:hover': { bgcolor: '#059669' },
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </TabPanel>

                {/* Quick Access Tab */}
                <TabPanel value={currentTab} index={2}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
                            Access the system without authentication for testing purposes.
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleQuickAccess}
                            sx={{
                                bgcolor: '#f59e0b',
                                '&:hover': { bgcolor: '#d97706' },
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Quick Access (Guest)
                        </Button>
                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#6b7280' }}>
                            Limited features available in guest mode
                        </Typography>
                    </Box>
                </TabPanel>

                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{ color: '#6b7280' }}
                    >
                        ← Back to Homepage
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminLogin;
