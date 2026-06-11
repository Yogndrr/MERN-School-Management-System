import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { Add, CalendarMonth } from '@mui/icons-material';

const TeacherLessonPlanning = () => {
    const lessons = [
        { id: 1, title: 'Introduction to Mathematics', date: '2024-01-15', status: 'Completed' },
        { id: 2, title: 'English Grammar Basics', date: '2024-01-16', status: 'In Progress' },
        { id: 3, title: 'Science Experiment', date: '2024-01-17', status: 'Planned' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#1f2937' }}>
                        Lesson Planning
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Create and manage your lesson plans
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                        bgcolor: '#059669',
                        '&:hover': { bgcolor: '#047857' }
                    }}
                >
                    New Lesson Plan
                </Button>
            </Box>

            <Grid container spacing={3}>
                {lessons.map((lesson) => (
                    <Grid item xs={12} md={6} lg={4} key={lesson.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    {lesson.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <CalendarMonth sx={{ fontSize: 18, color: '#6b7280' }} />
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        {lesson.date}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={lesson.status}
                                    size="small"
                                    color={
                                        lesson.status === 'Completed' ? 'success' :
                                        lesson.status === 'In Progress' ? 'warning' : 'default'
                                    }
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TeacherLessonPlanning;
