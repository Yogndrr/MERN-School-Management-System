import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Divider } from '@mui/material';
import { Assessment, Description, Download, ShowChart, People, School } from '@mui/icons-material';

const AdminReports = () => {
    const reports = [
        { title: 'Academic Performance', desc: 'Overall grade distribution and class rankings.', icon: <ShowChart />, color: '#8b5cf6' },
        { title: 'Attendance Summary', desc: 'Daily and monthly attendance trends school-wide.', icon: <People />, color: '#3b82f6' },
        { title: 'Staff Activity', desc: 'Teacher lesson plans and attendance logs.', icon: <School />, color: '#10b981' },
        { title: 'Clinic Usage', desc: 'Visit trends and medication inventory reports.', icon: <Description />, color: '#ef4444' },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Reports & Analytics</Typography>

            <Grid container spacing={3}>
                {reports.map((report, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Card sx={{ border: '1px solid #f0f0f0', boxShadow: 'none', borderRadius: '16px' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: `${report.color}15`, color: report.color }}>
                                        {report.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{report.title}</Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                    {report.desc}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="outlined" size="small" startIcon={<Download />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                                        Export PDF
                                    </Button>
                                    <Button variant="outlined" size="small" startIcon={<Download />} sx={{ textTransform: 'none', borderRadius: '8px' }}>
                                        Excel
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ mt: 4, p: 3, borderRadius: '16px' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>System Statistics (Current Term)</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary">AVG. ATTENDANCE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>94.2%</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary">PASS RATE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>88.5%</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary">CLINIC VISITS</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>142</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Typography variant="caption" color="textSecondary">BOOKS ISSUED</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>315</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AdminReports;
