import { Box, Typography, Paper } from '@mui/material';

const TeacherAttendance = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Attendance
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    Attendance content will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default TeacherAttendance;
