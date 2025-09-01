import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const ParentDashboard = () => {
  // Dummy data for demonstration
  const children = [
    {
      name: "John Doe",
      attendance: "95%",
      marks: [
        { subject: "Math", score: 88 },
        { subject: "Science", score: 92 },
        { subject: "English", score: 85 }
      ]
    },
    {
      name: "Jane Doe",
      attendance: "98%",
      marks: [
        { subject: "Math", score: 91 },
        { subject: "Science", score: 89 },
        { subject: "English", score: 94 }
      ]
    }
  ];

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(to bottom, #411d70, #19118b)', minHeight: '100vh' }}>
      <Typography variant="h4" color="white" gutterBottom>
        Parent Dashboard
      </Typography>
      <Typography variant="subtitle1" color="white" gutterBottom>
        View your children's attendance and marks.
      </Typography>
      <Grid container spacing={3}>
        {children.map((child, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Paper sx={{ p: 3, backgroundColor: '#1f1f38', color: 'white' }}>
              <Typography variant="h6">{child.name}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Attendance: {child.attendance}
              </Typography>
              <Typography variant="subtitle2">Marks:</Typography>
              <ul>
                {child.marks.map((mark, i) => (
                  <li key={i}>{mark.subject}: {mark.score}</li>
                ))}
              </ul>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ParentDashboard;