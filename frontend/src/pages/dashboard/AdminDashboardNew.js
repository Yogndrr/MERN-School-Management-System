import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import { Dashboard, People, School, Message, Assessment, Accessible, LocalLibrary, LocalHospital } from '@mui/icons-material';

// Modular components
import AdminHome from './admin/AdminHome';
import AdminStudentManagement from './admin/AdminStudentManagement';
import AdminTeacherManagement from './admin/AdminTeacherManagement';
import SpecialNeeds from './SpecialNeeds';
import Library from './Library';
import Clinic from './Clinic';
import AdminSendMessage from './admin/AdminSendMessage';
import AdminReports from './admin/AdminReports';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const AdminDashboardNew = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Admin Control Center
            </Typography>

            <Paper sx={{ borderRadius: '16px', mb: 3 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<Dashboard />} label="Home" iconPosition="start" />
                    <Tab icon={<People />} label="Students" iconPosition="start" />
                    <Tab icon={<School />} label="Teachers" iconPosition="start" />
                    <Tab icon={<Accessible />} label="Special Needs" iconPosition="start" />
                    <Tab icon={<LocalLibrary />} label="Library" iconPosition="start" />
                    <Tab icon={<LocalHospital />} label="Clinic" iconPosition="start" />
                    <Tab icon={<Message />} label="Messages" iconPosition="start" />
                    <Tab icon={<Assessment />} label="Reports" iconPosition="start" />
                </Tabs>

                <TabPanel value={currentTab} index={0}><AdminHome /></TabPanel>
                <TabPanel value={currentTab} index={1}><AdminStudentManagement /></TabPanel>
                <TabPanel value={currentTab} index={2}><AdminTeacherManagement /></TabPanel>
                <TabPanel value={currentTab} index={3}><SpecialNeeds /></TabPanel>
                <TabPanel value={currentTab} index={4}><Library /></TabPanel>
                <TabPanel value={currentTab} index={5}><Clinic /></TabPanel>
                <TabPanel value={currentTab} index={6}><AdminSendMessage /></TabPanel>
                <TabPanel value={currentTab} index={7}><AdminReports /></TabPanel>
            </Paper>
        </Box>
    );
};

export default AdminDashboardNew;
