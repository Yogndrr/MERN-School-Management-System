import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const TestStudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadStudents = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching from: http://localhost:5000/Students/all');
            const response = await axios.get('http://localhost:5000/Students/all');
            console.log('Response:', response.data);
            
            if (Array.isArray(response.data)) {
                setStudents(response.data);
            } else {
                setError('Invalid response format');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // Group by class
    const byClass = {};
    students.forEach(student => {
        const className = student.sclassName?.sclassName || 'No Class';
        if (!byClass[className]) byClass[className] = [];
        byClass[className].push(student);
    });

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Student List Test</Typogra