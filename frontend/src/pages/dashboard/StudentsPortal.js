import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Card, CardContent } from '@mui/material';
import { Person } from '@mui/icons-material';

const StudentsPortal = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple validation - format: year_3_Blue
        if (username && password.startsWith('year_')) {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid credentials. Password format: year_3_Blue');
        }
    };

    if (!isLoggedIn) {
        return (
            <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Person sx={{ fontSize: 60, color: '#3b82f6', mb: 2 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            Student Portal Login
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Enter your credentials to access your dashboard
                        </Typography>
                    </Box>

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Username (Full Name)"
                            placeholder="e.g., Abebe Kebede"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            placeholder="e.g., year_3_Blue"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!error}
                            helperText={error}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ py: 1.5, bgcolor: '#3b82f6' }}
                        >
                            Login
                        </Button>
                    </form>

                    <Box sx={{ mt: 3, p: 2, bgcolor: '#fef9c3', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: '#92400e' }}>
                            💡 Password format: year_3_Blue (year_Year_Color)
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>
                Welcome, {username}
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Mathematics</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                View your grade report
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>English</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                View your grade report
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Science</Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                View your grade report
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Button
                variant="outlined"
                onClick={() => setIsLoggedIn(false)}
                sx={{ mt: 3 }}
            >
                Logout
            </Button>
        </Box>
    );
};

export default StudentsPortal;
