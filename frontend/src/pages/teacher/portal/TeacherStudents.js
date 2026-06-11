import { Box, Typography, Paper } from '@mui/material';

const TeacherStudents = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Students
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Students content will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default TeacherStudents;
