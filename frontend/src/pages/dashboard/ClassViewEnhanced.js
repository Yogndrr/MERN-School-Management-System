import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Grid, Card, CardContent, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { CheckCircle, People, Schedule, Note, Message, Assessment, Grade, Add, Delete, SwapHoriz, Visibility, TrendingUp, School, Phone, Email } from '@mui/icons-material';
import axios from 'axios';

function TabPanel({ children, value, index }) {
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

const ClassViewEnhanced = () => {
    console.log('🚀 ClassViewEnhanced component rendered!');
    
    const { className } = useParams();
    console.log('📍 URL className param:', className);
    
    const [currentTab, setCurrentTab] = useState(1); // Start with Manage Students
    const [students, setStudents] = useState([]);
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openTransferDialog, setOpenTransferDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNum: '',
        password: '',
        parentContact: { phone: '', email: '', emergencyContact: '' }
    });

    const displayName = className.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    console.log('📝 Display name:', displayName);

    // Map URL class name to database class name
    // URL format: "year-3---blue" (all spaces become hyphens, including the space after hyphen)
    const classNameMap = {
        'year-3---blue': 'Year 3 - Blue',
        'year-3---crimson': 'Year 3 - Crimson',
        'year-3---cyan': 'Year 3 - Cyan',
        'year-3---purple': 'Year 3 - Purple',
        'year-3---lavender': 'Year 3 - Lavender',
        'year-3---maroon': 'Year 3 - Maroon',
        'year-3---violet': 'Year 3 - Violet',
        'year-3---green': 'Year 3 - Green',
        'year-3---red': 'Year 3 - Red',
        'year-3---yellow': 'Year 3 - Yellow',
        'year-3---magenta': 'Year 3 - Magenta',
        'year-3---orange': 'Year 3 - Orange'
    };

    const dbClassName = classNameMap[className] || displayName;
    console.log('🗺️ Mapping:', className, '→', dbClassName);
    console.log('🔑 Match found:', classNameMap[className] ? 'YES' : 'NO');

    useEffect(() => {
        console.log('🔄 Component mounted, loading data...');
        loadStudents();
        loadTeacher();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [className]);

    const loadTeacher = async () => {
        try {
            console.log('🎨 Looking for teacher with class:', dbClassName);
            
            // Get all teachers
            const response = await axios.get('http://localhost:5000/AllTeachers');
            
            if (response.data && Array.isArray(response.data)) {
                console.log('👨‍🏫 Total teachers:', response.data.length);
                
                // Find the teacher assigned to this class
                // Check teachSclass or homeroomClass (both should match for main teachers)
                const classTeacher = response.data.find(t => {
                    // Check teachSclass (object with sclassName)
                    if (t.teachSclass?.sclassName === dbClassName) return true;
                    
                    // Check homeroomClass (object with sclassName)
                    if (t.homeroomClass?.sclassName === dbClassName) return true;
                    
                    return false;
                });
                
                if (classTeacher) {
                    console.log('✅ Found teacher for class:', classTeacher.name);
                    console.log('📋 Teacher data:', classTeacher);
                    setTeacher(classTeacher);
                } else {
                    console.log('⚠️ No teacher assigned to this class');
                    console.log('🔍 Available teachers:', response.data.map(t => ({
                        name: t.name,
                        teachSclass: t.teachSclass?.sclassName,
                        homeroomClass: t.homeroomClass?.sclassName
                    })));
                }
            }
        } catch (error) {
            console.error('❌ Error loading teacher:', error);
        }
    };

    const loadStudents = async () => {
        setLoading(true);
        console.log('🔍 Loading students for class:', dbClassName);
        console.log('🔍 URL className:', className);
        try {
            // Get all students and filter by class
            const response = await axios.get('http://localhost:5000/Students/all');
            console.log('📊 API Response received, length:', response.data?.length);
            console.log('📊 First student:', response.data[0]);
            
            if (response.data && Array.isArray(response.data)) {
                console.log(`✅ Total students from API: ${response.data.length}`);
                
                // Log first few class names to debug
                const classNames = [...new Set(response.data.map(s => s.sclassName?.sclassName))];
                console.log('📚 Classes in data:', classNames);
                
                const classStudents = response.data.filter(
                    student => student.sclassName?.sclassName === dbClassName
                );
                console.log(`✅ Students in ${dbClassName}: ${classStudents.length}`);
                console.log('👥 Filtered students:', classStudents.map(s => s.name));
                
                const sortedStudents = classStudents.sort((a, b) => a.rollNum - b.rollNum);
                console.log('📋 Setting students state with:', sortedStudents.length, 'students');
                setStudents(sortedStudents);
            } else {
                console.log('❌ Invalid response format, using mock data');
                loadMockStudents();
            }
        } catch (error) {
            console.error('❌ Error loading students:', error);
            console.error('❌ Error details:', error.response?.data || error.message);
            // Use mock data if API fails
            loadMockStudents();
        } finally {
            console.log('✅ Loading complete, setting loading to false');
            setLoading(false);
        }
    };

    const loadMockStudents = () => {
        // Mock data based on class
        const mockData = {
            'Year 3 - Blue': [
                { _id: '1', name: 'Abigiya Biniam', rollNum: 1, studentId: 'Blue001', attendance: 96, avgGrade: 85 },
                { _id: '2', name: 'Absalat Amha', rollNum: 2, studentId: 'Blue002', attendance: 98, avgGrade: 88 },
                { _id: '3', name: 'Beamlak Tsega', rollNum: 3, studentId: 'Blue003', attendance: 94, avgGrade: 82 }
            ]
        };
        setStudents(mockData[dbClassName] || []);
    };

    const handleAddStudent = async () => {
        try {
            // Get the class ID
            const classResponse = await axios.get('http://localhost:5000/Students/all');
            const firstStudent = classResponse.data.find(s => s.sclassName?.sclassName === dbClassName);
            
            if (!firstStudent) {
                alert('Could not find class information');
                return;
            }

            const classId = firstStudent.sclassName._id;
            const adminId = localStorage.getItem('adminId') || firstStudent.school;

            // Generate student ID based on class
            const classPrefix = {
                'Year 3 - Blue': 'Blue',
                'Year 3 - Crimson': 'Crim',
                'Year 3 - Cyan': 'Cyan',
                'Year 3 - Purple': 'Purp',
                'Year 3 - Lavender': 'Lave',
                'Year 3 - Maroon': 'Maro',
                'Year 3 - Violet': 'Viol',
                'Year 3 - Green': 'Gree',
                'Year 3 - Red': 'Red',
                'Year 3 - Yellow': 'Yell',
                'Year 3 - Magenta': 'Mage',
                'Year 3 - Orange': 'Oran'
            }[dbClassName];

            const nextRollNum = students.length + 1;
            const studentId = `${classPrefix}${String(nextRollNum).padStart(3, '0')}`;
            const password = newStudent.password || `${studentId}@bis`;

            const response = await axios.post('http://localhost:5000/StudentReg', {
                name: newStudent.name,
                rollNum: nextRollNum,
                studentId: studentId,
                password: password,
                sclassName: classId,
                adminID: adminId,
                parentContact: newStudent.parentContact
            });

            if (response.data._id) {
                alert(`Student added successfully!\n\nStudent ID: ${studentId}\nPassword: ${password}`);
                setOpenAddDialog(false);
                setNewStudent({
                    name: '',
                    rollNum: '',
                    password: '',
                    parentContact: { phone: '', email: '', emergencyContact: '' }
                });
                loadStudents(); // Reload the list
            } else {
                alert('Failed to add student: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Error adding student: ' + error.message);
        }
    };

    const handleTransferStudent = () => {
        // Transfer student logic
        setOpenTransferDialog(false);
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setOpenViewDialog(true);
    };

    const handleDeleteStudent = (studentId) => {
        if (window.confirm('Are you sure you want to remove this student from the class?')) {
            setStudents(students.filter(s => s._id !== studentId));
        }
    };

    // Calculate class statistics
    const classStats = {
        total: students.length,
        avgAttendance: students.length > 0 
            ? (students.reduce((sum, s) => sum + (s.attendance || 95), 0) / students.length).toFixed(1)
            : 0,
        avgGrade: students.length > 0
            ? (students.reduce((sum, s) => sum + (s.avgGrade || 85), 0) / students.length).toFixed(1)
            : 0,
        specialNeeds: students.filter(s => s.specialNeeds?.hasSpecialNeeds).length
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 1, letterSpacing: '-0.02em' }}>
                    {displayName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                    Class management and student overview
                </Typography>
            </Box>

            {/* Teacher Info Card */}
            {teacher && (
                <Card sx={{ mb: 3, borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none', bgcolor: '#f8fffe' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                                sx={{ 
                                    width: 56, 
                                    height: 56, 
                                    bgcolor: '#059669',
                                    fontSize: '1.25rem',
                                    fontWeight: 600
                                }}
                            >
                                {teacher.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    Main Teacher
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
                                    {teacher.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    {teacher.teacherId} • {teacher.email}
                                </Typography>
                            </Box>
                            <Chip 
                                label="Main Teacher"
                                sx={{ 
                                    bgcolor: '#d1fae5',
                                    color: '#059669',
                                    fontWeight: 600
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Class Statistics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
                                        Total Students
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mt: 0.5 }}>
                                        {classStats.total}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <People sx={{ color: '#666' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
                                        Avg Attendance
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mt: 0.5 }}>
                                        {classStats.avgAttendance}%
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle sx={{ color: '#666' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
                                        Avg Grade
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mt: 0.5 }}>
                                        {classStats.avgGrade}%
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp sx={{ color: '#666' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' }}>
                                        Special Needs
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#000', mt: 0.5 }}>
                                        {classStats.specialNeeds}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <School sx={{ color: '#666' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Paper sx={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: 'none' }}>
                <Tabs 
                    value={currentTab} 
                    onChange={(_, v) => setCurrentTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ 
                        borderBottom: 1, 
                        borderColor: '#f0f0f0',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                        }
                    }}
                >
                    <Tab icon={<CheckCircle sx={{ fontSize: 20 }} />} label="Attendance" iconPosition="start" />
                    <Tab icon={<People sx={{ fontSize: 20 }} />} label="Manage Students" iconPosition="start" />
                    <Tab icon={<Schedule sx={{ fontSize: 20 }} />} label="Timetable" iconPosition="start" />
                    <Tab icon={<Note sx={{ fontSize: 20 }} />} label="Daily Notes" iconPosition="start" />
                    <Tab icon={<Message sx={{ fontSize: 20 }} />} label="Messages" iconPosition="start" />
                    <Tab icon={<Assessment sx={{ fontSize: 20 }} />} label="Reports" iconPosition="start" />
                    <Tab icon={<Grade sx={{ fontSize: 20 }} />} label="Marksheet" iconPosition="start" />
                </Tabs>

                {/* Attendance Tab */}
                <TabPanel value={currentTab} index={0}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Attendance</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Mark daily attendance for all students
                    </Typography>
                </TabPanel>

                {/* Manage Students Tab */}
                <TabPanel value={currentTab} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Students ({students.length})
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setOpenAddDialog(true)}
                                sx={{
                                    bgcolor: '#000',
                                    color: '#fff',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                                }}
                            >
                                Add Student
                            </Button>
                        </Box>
                    </Box>

                    {loading ? (
                        <Typography>Loading students...</Typography>
                    ) : students.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <People sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>No students in this class</Typography>
                            <Typography variant="body2" sx={{ color: '#999' }}>
                                Click "Add Student" to add students to this class
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Roll</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Student ID</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Attendance</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Avg Grade</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student._id} hover>
                                            <TableCell>{student.rollNum}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {student.studentId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#000', fontSize: '0.875rem' }}>
                                                        {student.name?.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {student.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={`${student.attendance || 95}%`}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: (student.attendance || 95) >= 90 ? '#f0fdf4' : '#fef3c7',
                                                        color: (student.attendance || 95) >= 90 ? '#065f46' : '#92400e',
                                                        fontWeight: 500,
                                                        border: 'none'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {student.avgGrade || 85}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {student.specialNeeds?.hasSpecialNeeds ? (
                                                    <Chip label="Special Needs" size="small" sx={{ bgcolor: '#fce7f3', color: '#be185d', fontWeight: 500 }} />
                                                ) : (
                                                    <Chip label="Regular" size="small" sx={{ bgcolor: '#f0f0f0', color: '#666', fontWeight: 500 }} />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleViewStudent(student)}
                                                        sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                                                    >
                                                        <Visibility sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setOpenTransferDialog(true);
                                                        }}
                                                        sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                                                    >
                                                        <SwapHoriz sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => handleDeleteStudent(student._id)}
                                                        sx={{ '&:hover': { bgcolor: '#fee2e2' } }}
                                                    >
                                                        <Delete sx={{ fontSize: 18, color: '#dc2626' }} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </TabPanel>

                {/* Other Tabs */}
                <TabPanel value={currentTab} index={2}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Timetable</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Weekly schedule with 6 periods per day
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={3}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Daily Notes</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Daily to-do lists and notes
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={4}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Messages</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Communication with admin
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={5}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Reports</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Generate class reports
                    </Typography>
                </TabPanel>

                <TabPanel value={currentTab} index={6}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Marksheet</Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Input grades for students
                    </Typography>
                </TabPanel>
            </Paper>

            {/* View Student Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 600 }}>Student Details</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                    <Avatar sx={{ width: 100, height: 100, bgcolor: '#000', fontSize: '2rem', mx: 'auto', mb: 2 }}>
                                        {selectedStudent.name?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        {selectedStudent.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                        {selectedStudent.studentId}
                                    </Typography>
                                    <Chip label={`Roll No. ${selectedStudent.rollNum}`} sx={{ bgcolor: '#f5f5f5' }} />
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#999', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                        Academic Performance
                                    </Typography>
                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                        <Grid item xs={6}>
                                            <Paper sx={{ p: 2, bgcolor: '#fafafa', borderRadius: '10px' }}>
                                                <Typography variant="caption" sx={{ color: '#999' }}>Attendance</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedStudent.attendance || 95}%</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Paper sx={{ p: 2, bgcolor: '#fafafa', borderRadius: '10px' }}>
                                                <Typography variant="caption" sx={{ color: '#999' }}>Average Grade</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedStudent.avgGrade || 85}%</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#999', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                        Contact Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone sx={{ fontSize: 18, color: '#666' }} />
                                            <Typography variant="body2">{selectedStudent.parentContact?.phone || 'Not provided'}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Email sx={{ fontSize: 18, color: '#666' }} />
                                            <Typography variant="body2">{selectedStudent.parentContact?.email || 'Not provided'}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpenViewDialog(false)} sx={{ textTransform: 'none', color: '#666' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Student Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 600 }}>Add New Student</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Student Name"
                            value={newStudent.name}
                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password (optional)"
                            type="password"
                            value={newStudent.password}
                            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                            helperText="Leave empty to auto-generate"
                        />
                        <TextField
                            fullWidth
                            label="Parent Phone"
                            value={newStudent.parentContact.phone}
                            onChange={(e) => setNewStudent({ 
                                ...newStudent, 
                                parentContact: { ...newStudent.parentContact, phone: e.target.value }
                            })}
                        />
                        <TextField
                            fullWidth
                            label="Parent Email"
                            type="email"
                            value={newStudent.parentContact.email}
                            onChange={(e) => setNewStudent({ 
                                ...newStudent, 
                                parentContact: { ...newStudent.parentContact, email: e.target.value }
                            })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpenAddDialog(false)} sx={{ textTransform: 'none', color: '#666' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddStudent}
                        variant="contained"
                        disabled={!newStudent.name}
                        sx={{ 
                            bgcolor: '#000',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                        }}
                    >
                        Add Student
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Transfer Student Dialog */}
            <Dialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ fontWeight: 600 }}>Transfer Student</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                            Transfer {selectedStudent?.name} to another class
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Select Class</InputLabel>
                            <Select label="Select Class">
                                {Object.values(classNameMap).filter(c => c !== dbClassName).map((cls) => (
                                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Reason for Transfer"
                            multiline
                            rows={3}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpenTransferDialog(false)} sx={{ textTransform: 'none', color: '#666' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleTransferStudent}
                        variant="contained"
                        sx={{ 
                            bgcolor: '#000',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                        }}
                    >
                        Transfer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClassViewEnhanced;
