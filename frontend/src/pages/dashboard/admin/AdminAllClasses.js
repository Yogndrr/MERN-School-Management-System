import { Box, Typography, Paper } from '@mui/material';

const AdminAllClasses = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                All Classes
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    All classes list and management will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminAllClasses;
