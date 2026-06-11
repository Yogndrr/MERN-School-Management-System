import { Box, Typography, Paper } from '@mui/material';

const TeacherMessages = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Messages
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Messages content will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default TeacherMessages;
