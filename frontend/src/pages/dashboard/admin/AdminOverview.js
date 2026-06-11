import { Box, Typography, Paper } from '@mui/material';

const AdminOverview = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Overview
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    School overview and analytics will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminOverview;
