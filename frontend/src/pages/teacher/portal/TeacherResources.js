import { Box, Typography, Paper } from '@mui/material';

const TeacherResources = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Resources
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Resources content will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default TeacherResources;
