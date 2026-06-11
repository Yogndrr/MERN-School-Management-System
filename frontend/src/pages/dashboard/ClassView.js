import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CheckCircle, People, Schedule, Note, Message, Assessment, Grade } from '@mui/icons-material';

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

const ClassView = () => {
    const { className } = useParams();
    const [currentTab, setCurrentTab] = useState(0);

    const displayName = className.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>
                {displayName}
            </Typography>

            <Paper sx={{ borderRadius: 3 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={(e, v) => setCurrentTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<CheckCircle />} label="Attendance" iconPosition="start" />
                    <Tab icon={<People />} label="Manage Students" iconPosition="start" />
                    <Tab icon={<Schedule />} label="Timetable" iconPosition="start" />
                    <Tab icon={<Note />} label="Daily Notes" iconPosition="start" />
                    <Tab icon={<Message />} label="Messages" iconPosition="start" />
                    <Tab icon={<Assessment />} label="Reports" iconPosition="start" />
                    <Tab icon={<Grade />} label="Marksheet" iconPosition="start" />
                </Tabs>

                <TabPanel value={currentTab} index={0}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Attendance</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        • List of student names<br/>
                        • Calendar to select date<br/>
                        • Mark Present, Late, or Absent<br/>
                        • Mini summary showing totals
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Manage Students</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        • Add/Remove/Transfer students<br/>
                        • Student Analytics<br/>
                        • View individual student summaries
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Timetable</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        6 periods per day grid showing designated subjects for each period
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={3}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Daily Notes</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Notepad for daily to-do lists with calendar integration
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={4}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Messages</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Communication channel with Admin
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={5}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Reports</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Compile reports based on attendance, marksheets, and student data
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={6}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Marksheet</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Main Teacher inputs marks for the 4 subjects they teach to this class
                    </Typography>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default ClassView;
