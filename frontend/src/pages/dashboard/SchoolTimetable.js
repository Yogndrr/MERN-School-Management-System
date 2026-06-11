import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Edit, Share, Download, Add } from '@mui/icons-material';
import * as XLSX from 'xlsx';

const SchoolTimetable = () => {
    const [viewMode, setViewMode] = useState('class'); // 'class' or 'teacher'
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [editDialog, setEditDialog] = useState(false);
    const [editCell, setEditCell] = useState({ day: '', period: '', subject: '' });

    const timeSlots = [
        { period: 'Registration', time: '8:10 - 8:30' },
        { period: 'Lesson 1', time: '8:30 - 9:20' },
        { period: 'Lesson 2', time: '9:20 - 10:10' },
        { period: 'Recess', time: '10:10 - 10:40' },
        { period: 'Lesson 3', time: '10:40 - 11:30' },
        { period: 'Lesson 4', time: '11:30 - 12:20' },
        { period: 'Lunch', time: '12:20 - 13:10' },
        { period: 'Lesson 5', time: '13:10 - 14:00' },
        { period: 'Mini Break', time: '14:00 - 14:10' },
        { period: 'Lesson 6', time: '14:10 - 15:00' }
    ];

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const classes = [
        'Year 3 - Blue', 'Year 3 - Crimson', 'Year 3 - Cyan', 'Year 3 - Purple',
        'Year 3 - Lavender', 'Year 3 - Maroon', 'Year 3 - Violet', 'Year 3 - Green',
        'Year 3 - Red', 'Year 3 - Yellow', 'Year 3 - Magenta', 'Year 3 - Orange'
    ];

    const teachers = [
        'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'David Brown'
    ];

    // Mock timetable data
    const [timetable, setTimetable] = useState({
        'Year 3 - Blue': {
            Monday: { 'Lesson 1': 'Mathematics', 'Lesson 2': 'English', 'Lesson 3': 'Science', 'Lesson 4': 'History', 'Lesson 5': 'Art', 'Lesson 6': 'PE' },
            Tuesday: { 'Lesson 1': 'English', 'Lesson 2': 'Mathematics', 'Lesson 3': 'Geography', 'Lesson 4': 'Science', 'Lesson 5': 'Music', 'Lesson 6': 'IT' },
            Wednesday: { 'Lesson 1': 'Mathematics', 'Lesson 2': 'Science', 'Lesson 3': 'English', 'Lesson 4': 'PE', 'Lesson 5': 'History', 'Lesson 6': 'Art' },
            Thursday: { 'Lesson 1': 'Science', 'Lesson 2': 'English', 'Lesson 3': 'Mathematics', 'Lesson 4': 'Music', 'Lesson 5': 'Geography', 'Lesson 6': 'IT' },
            Friday: { 'Lesson 1': 'English', 'Lesson 2': 'Mathematics', 'Lesson 3': 'Art', 'Lesson 4': 'Science', 'Lesson 5': 'PE', 'Lesson 6': 'History' }
        }
    });

    const handleEditCell = (day, period) => {
        const currentSubject = timetable[selectedClass]?.[day]?.[period] || '';
        setEditCell({ day, period, subject: currentSubject });
        setEditDialog(true);
    };

    const handleSaveEdit = () => {
        setTimetable(prev => ({
            ...prev,
            [selectedClass]: {
                ...prev[selectedClass],
                [editCell.day]: {
                    ...prev[selectedClass]?.[editCell.day],
                    [editCell.period]: editCell.subject
                }
            }
        }));
        setEditDialog(false);
    };

    const handleExportExcel = () => {
        const data = [];
        
        // Header row
        const header = ['Time', ...days];
        data.push(header);

        // Data rows
        timeSlots.forEach(slot => {
            const row = [`${slot.period}\n${slot.time}`];
            days.forEach(day => {
                const subject = timetable[selectedClass]?.[day]?.[slot.period] || '-';
                row.push(subject);
            });
            data.push(row);
        });

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Timetable');
        XLSX.writeFile(wb, `${selectedClass}_Timetable.xlsx`);
    };

    const handleShare = () => {
        alert(`Timetable for ${selectedClass} will be shared via email/notification system`);
    };

    const getCellColor = (period) => {
        if (period === 'Registration') return '#e0e7ff';
        if (period === 'Recess' || period === 'Lunch' || period === 'Mini Break') return '#fef3c7';
        return '#ffffff';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">School Timetable</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>View Mode</InputLabel>
                        <Select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                            label="View Mode"
                        >
                            <MenuItem value="class">By Class</MenuItem>
                            <MenuItem value="teacher">By Teacher</MenuItem>
                        </Select>
                    </FormControl>

                    {viewMode === 'class' ? (
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Select Class</InputLabel>
                            <Select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                label="Select Class"
                            >
                                {classes.map((cls) => (
                                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Select Teacher</InputLabel>
                            <Select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                label="Select Teacher"
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </Box>

            {(selectedClass || selectedTeacher) && (
                <>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={handleExportExcel}
                            sx={{ bgcolor: '#10b981' }}
                        >
                            Export to Excel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Share />}
                            onClick={handleShare}
                            sx={{ bgcolor: '#3b82f6' }}
                        >
                            Share Timetable
                        </Button>
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#1e40af' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 150 }}>
                                        Time
                                    </TableCell>
                                    {days.map((day) => (
                                        <TableCell key={day} align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                                            {day}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {timeSlots.map((slot) => (
                                    <TableRow key={slot.period}>
                                        <TableCell sx={{ bgcolor: '#f3f4f6', fontWeight: 600 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {slot.period}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                {slot.time}
                                            </Typography>
                                        </TableCell>
                                        {days.map((day) => {
                                            const subject = timetable[selectedClass]?.[day]?.[slot.period] || '-';
                                            const isBreak = slot.period === 'Recess' || slot.period === 'Lunch' || slot.period === 'Mini Break' || slot.period === 'Registration';
                                            
                                            return (
                                                <TableCell 
                                                    key={day} 
                                                    align="center"
                                                    sx={{ 
                                                        bgcolor: getCellColor(slot.period),
                                                        position: 'relative',
                                                        '&:hover': !isBreak && { bgcolor: '#f9fafb' }
                                                    }}
                                                >
                                                    {isBreak ? (
                                                        <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                                                            {slot.period}
                                                        </Typography>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                            <Typography variant="body2">
                                                                {subject}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditCell(day, slot.period)}
                                                                sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {!selectedClass && !selectedTeacher && (
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafb' }}>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Please select a class or teacher to view their timetable
                    </Typography>
                </Paper>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
                <DialogTitle>Edit Timetable</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {editCell.day} - {editCell.period}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Subject"
                            value={editCell.subject}
                            onChange={(e) => setEditCell({ ...editCell, subject: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SchoolTimetable;
