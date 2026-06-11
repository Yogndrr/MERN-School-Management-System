import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert, Avatar } from '@mui/material';
import axios from 'axios';

const TeacherRoster = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [teacherInfo, setTeacherInfo] = useState(null);
    const [className, setClassName] = useState('');

    useEffect(() => {
        fetchTeacherAndStudents();
    }, []);

    const fetchTeacherAndStudents = async () => {
        try {
            const teacherId = localStorage.getItem('teacherId');
            
            if (!teacherId) {
                setError('Teacher information not found');
                setLoading(false);
                return;
            }

            // First, get teacher details to find their class
            const teacherResponse = await axios.get(`http://localhost:5000/Teacher/${teacherId}`);
            
            if (teacherResponse.data) {
                setTeacherInfo(teacherResponse.data);
                
                // Get the class ID from either teachSclass or homeroomClass
                const classId = teacherResponse.data.teachSclass?._id || 
                               teacherResponse.data.homeroomClass?._id;
                
                const classNameValue = teacherResponse.data.teachSclass?.sclassName || 
                                      teacherResponse.data.homeroomClass?.sclassName || 
                                      'No Class Assigned';
                
                setClassName(classNameValue);

                if (classId) {
                    // Fetch students for this class
                    const studentsResponse = await axios.get(`http://localhost:5000/Sclass/Students/${classId}`);
                    
                    if (Array.isArray(studentsResponse.data)) {
                        setStudents(studentsResponse.data);
                    } else if (studentsResponse.data.message) {
                        setError(studentsResponse.data.message);
                    }
                } else {
                    setError('No class assigned to this teacher');
                }
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load student roster');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#1f2937' }}>
                Class Roster
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
                {className} - {students.length} student{students.length !== 1 ? 's' : ''}
            </Typography>

            {error && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {students.length > 0 ? (
                <Paper sx={{ p: 3 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Student ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Roll Number</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student._id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        width: 32, 
                                                        height: 32, 
                                                        bgcolor: '#059669',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {student.name?.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {student.studentId || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.rollNum || 'N/A'}</TableCell>
                                        <TableCell sx={{ color: '#6b7280' }}>
                                            {student.email || 'No email'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ) : (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                        No Students Found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        There are no students assigned to your class yet.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default TeacherRoster;
