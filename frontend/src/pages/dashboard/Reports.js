import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { TableChart, PictureAsPdf, Assessment, School, People, LocalLibrary, LocalHospital } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
    const [filters, setFilters] = useState({
        reportType: '',
        class: '',
        teacher: '',
        startDate: '',
        endDate: '',
        term: ''
    });

    const reportTypes = [
        { id: 'attendance', name: 'Attendance Report', icon: <Assessment />, description: 'Daily/Monthly attendance statistics' },
        { id: 'academic', name: 'Academic Performance', icon: <School />, description: 'Student grades and performance analysis' },
        { id: 'student-list', name: 'Student Directory', icon: <People />, description: 'Complete student information list' },
        { id: 'teacher-list', name: 'Teacher Directory', icon: <School />, description: 'Teacher assignments and contact info' },
        { id: 'library', name: 'Library Report', icon: <LocalLibrary />, description: 'Book borrowing and return statistics' },
        { id: 'clinic', name: 'Clinic Report', icon: <LocalHospital />, description: 'Medical visits and leave requests' },
        { id: 'timetable', name: 'Class Timetables', icon: <TableChart />, description: 'Weekly schedules for all classes' },
        { id: 'special-needs', name: 'Special Needs Report', icon: <People />, description: 'Students requiring special accommodation' }
    ];

    const classes = [
        'Year 3 - Blue', 'Year 3 - Crimson', 'Year 3 - Cyan', 'Year 3 - Purple',
        'Year 3 - Lavender', 'Year 3 - Maroon', 'Year 3 - Violet', 'Year 3 - Green',
        'Year 3 - Red', 'Year 3 - Yellow', 'Year 3 - Magenta', 'Year 3 - Orange'
    ];

    const teachers = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
    const terms = ['Term 1', 'Term 2', 'Term 3', 'Final'];

    // Mock data generators
    const generateAttendanceData = () => {
        return [
            { date: '2024-11-15', class: 'Year 3 - Blue', present: 22, absent: 3, late: 1, total: 26 },
            { date: '2024-11-14', class: 'Year 3 - Blue', present: 24, absent: 1, late: 1, total: 26 },
            { date: '2024-11-13', class: 'Year 3 - Blue', present: 25, absent: 1, late: 0, total: 26 }
        ];
    };

    const generateStudentData = () => {
        return [
            { studentId: 'BIS20240001', name: 'Abebe Kebede', class: 'Year 3 - Blue', rollNum: 1, parentPhone: '0911234567' },
            { studentId: 'BIS20240002', name: 'Tigist Alemu', class: 'Year 3 - Blue', rollNum: 2, parentPhone: '0922345678' },
            { studentId: 'BIS20240003', name: 'Dawit Tesfaye', class: 'Year 3 - Crimson', rollNum: 1, parentPhone: '0933456789' }
        ];
    };

    const generateAcademicData = () => {
        return [
            { student: 'Abebe Kebede', class: 'Year 3 - Blue', math: 85, english: 78, science: 92, average: 85 },
            { student: 'Tigist Alemu', class: 'Year 3 - Blue', math: 92, english: 88, science: 85, average: 88.3 },
            { student: 'Dawit Tesfaye', class: 'Year 3 - Crimson', math: 78, english: 82, science: 80, average: 80 }
        ];
    };

    const handleExportExcel = (reportType) => {
        let data = [];
        let filename = '';

        switch (reportType) {
            case 'attendance':
                data = generateAttendanceData();
                filename = 'Attendance_Report';
                break;
            case 'student-list':
                data = generateStudentData();
                filename = 'Student_Directory';
                break;
            case 'academic':
                data = generateAcademicData();
                filename = 'Academic_Performance';
                break;
            default:
                data = [{ message: 'Report data not available' }];
                filename = 'Report';
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleExportPDF = (reportType) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(16);
        doc.text('British International School - NOC Gerji Campus', 20, 20);
        doc.setFontSize(12);
        doc.text(`${reportTypes.find(r => r.id === reportType)?.name || 'Report'}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);

        let data = [];
        let columns = [];

        switch (reportType) {
            case 'attendance':
                data = generateAttendanceData();
                columns = ['Date', 'Class', 'Present', 'Absent', 'Late', 'Total'];
                break;
            case 'student-list':
                data = generateStudentData();
                columns = ['Student ID', 'Name', 'Class', 'Roll No.', 'Parent Phone'];
                break;
            case 'academic':
                data = generateAcademicData();
                columns = ['Student', 'Class', 'Math', 'English', 'Science', 'Average'];
                break;
        }

        if (data.length > 0) {
            const tableData = data.map(row => Object.values(row));
            doc.autoTable({
                head: [columns],
                body: tableData,
                startY: 50
            });
        }

        doc.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Reports & Analytics</Typography>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Report Filters</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Class</InputLabel>
                                <Select
                                    value={filters.class}
                                    onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                                >
                                    <MenuItem value="">All Classes</MenuItem>
                                    {classes.map((cls) => (
                                        <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Teacher</InputLabel>
                                <Select
                                    value={filters.teacher}
                                    onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
                                >
                                    <MenuItem value="">All Teachers</MenuItem>
                                    {teachers.map((teacher) => (
                                        <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Term</InputLabel>
                                <Select
                                    value={filters.term}
                                    onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                                >
                                    <MenuItem value="">All Terms</MenuItem>
                                    {terms.map((term) => (
                                        <MenuItem key={term} value={term}>{term}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Report Types */}
            <Grid container spacing={3}>
                {reportTypes.map((report) => (
                    <Grid item xs={12} md={6} lg={4} key={report.id}>
                        <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 } }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ color: '#3b82f6', mr: 2 }}>
                                        {report.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {report.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                                    {report.description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<TableChart />}
                                        onClick={() => handleExportExcel(report.id)}
                                        sx={{ bgcolor: '#10b981', flex: 1 }}
                                    >
                                        Excel
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<PictureAsPdf />}
                                        onClick={() => handleExportPDF(report.id)}
                                        sx={{ bgcolor: '#ef4444', flex: 1 }}
                                    >
                                        PDF
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Stats */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Quick Statistics</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                                <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>96%</Typography>
                                <Typography variant="body2" sx={{ color: '#065f46' }}>Average Attendance</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#dbeafe', borderRadius: 2 }}>
                                <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>85%</Typography>
                                <Typography variant="body2" sx={{ color: '#1e40af' }}>Academic Average</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fef3c7', borderRadius: 2 }}>
                                <Typography variant="h4" sx={{ color: '#f59e0b', fontWeight: 700 }}>15</Typography>
                                <Typography variant="body2" sx={{ color: '#92400e' }}>Special Needs Students</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fce7f3', borderRadius: 2 }}>
                                <Typography variant="h4" sx={{ color: '#ec4899', fontWeight: 700 }}>3</Typography>
                                <Typography variant="body2" sx={{ color: '#be185d' }}>Pending Leave Requests</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Reports;
