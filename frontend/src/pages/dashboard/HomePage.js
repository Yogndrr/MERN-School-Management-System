import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { School, Person, Class, LocalLibrary, LocalHospital, TrendingUp } from '@mui/icons-material';

const HomePage = () => {
    const stats = [
        { title: 'Students', value: '250', icon: <Person />, color: '#000' },
        { title: 'Teachers', value: '36', icon: <School />, color: '#000' },
        { title: 'Classes', value: '12', icon: <Class />, color: '#000' },
        { title: 'Library Books', value: '1,250', icon: <LocalLibrary />, color: '#000' },
        { title: 'Clinic Visits', value: '45', icon: <LocalHospital />, color: '#000' },
        { title: 'Attendance', value: '96%', icon: <TrendingUp />, color: '#000' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#000', letterSpacing: '-0.02em' }}>
                Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
                Overview of school statistics and activities
            </Typography>

            <Grid container spacing={2}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ 
                            height: '100%',
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            boxShadow: 'none',
                            '&:hover': {
                                borderColor: '#e0e0e0',
                                transition: 'all 0.2s ease'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mt: 1 }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ 
                                        width: 40,
                                        height: 40,
                                        borderRadius: '10px',
                                        bgcolor: '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#666'
                                    }}>
                                        {stat.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#000' }}>
                            Today's Activity
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: '10px', borderLeft: '3px solid #000' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#000', mb: 0.5 }}>
                                    Attendance
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    240/250 students present (96%)
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: '10px', borderLeft: '3px solid #666' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#000', mb: 0.5 }}>
                                    Clinic
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    3 pending leave requests
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2.5, bgcolor: '#fafafa', borderRadius: '10px', borderLeft: '3px solid #999' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: '#000', mb: 0.5 }}>
                                    Library
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    5 books due for return today
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#000' }}>
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ 
                                p: 1.5, 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#fafafa' },
                                transition: 'all 0.2s ease'
                            }}>
                                <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                                    Mark Attendance →
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                p: 1.5, 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#fafafa' },
                                transition: 'all 0.2s ease'
                            }}>
                                <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                                    View Timetable →
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                p: 1.5, 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#fafafa' },
                                transition: 'all 0.2s ease'
                            }}>
                                <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                                    Check Messages →
                                </Typography>
                            </Box>
                            <Box sx={{ 
                                p: 1.5, 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#fafafa' },
                                transition: 'all 0.2s ease'
                            }}>
                                <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                                    Generate Reports →
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;
