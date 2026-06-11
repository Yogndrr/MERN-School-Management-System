import { Box, Typography, Paper } from '@mui/material';

const AdminSettings = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Settings
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Admin settings will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminSettings;
