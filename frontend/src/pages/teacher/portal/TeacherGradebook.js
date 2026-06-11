import { Box, Typography, Paper } from '@mui/material';

const TeacherGradebook = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Gradebook
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Gradebook content will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default TeacherGradebook;
