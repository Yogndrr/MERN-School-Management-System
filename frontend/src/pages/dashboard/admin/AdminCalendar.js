import { Box, Typography, Paper } from '@mui/material';

const AdminCalendar = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Calendar & Events
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    School calendar and events management will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminCalendar;
