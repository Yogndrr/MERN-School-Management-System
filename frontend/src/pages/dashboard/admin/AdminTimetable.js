import { Box, Typography, Paper } from '@mui/material';

const AdminTimetable = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                School Timetable
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="body1">
                    School timetable management will be displayed here...
                </Typography>
            </Paper>
        </Box>
    );
};

export default AdminTimetable;
