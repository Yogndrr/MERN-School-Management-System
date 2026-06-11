import { Box, Typography, Paper } from '@mui/material';

const AdminProfile = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Admin Profile
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Admin profile information will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminProfile;
