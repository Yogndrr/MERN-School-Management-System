import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, Button, MenuItem, Select,
    FormControl, InputLabel, TextField, Alert, Stepper, Step,
    StepLabel, Divider, Card, CardContent, CircularProgress,
    List, ListItem, ListItemText, ListItemIcon, Checkbox
} from '@mui/material';
import {
    SwapHoriz, CheckCircle, Warning, Info,
    Assignment, Assessment, LocalLibrary, LocalHospital
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const TransferWizard = ({ student, classes, onComplete, onCancel }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [targetClass, setTargetClass] = useState('');
    const [reason, setTransferReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [dataMigration, setDataMigration] = useState({
        attendance: true,
        marks: true,
        library: true,
        clinic: true
    });

    const steps = ['Select Class', 'Preview Migration', 'Confirm'];

    const handleNext = () => {
        if (activeStep === 0 && !targetClass) {
            setError('Please select a destination class');
            return;
        }
        setError('');
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleTransfer = async () => {
        setLoading(true);
        setError('');
        try {
            // Using the enhanced transfer route that handles data migration
            const response = await axios.put(API_ENDPOINTS.STUDENT_TRANSFER_WITH_DATA(student._id), {
                toClassId: targetClass,
                reason: reason,
                migrateAttendance: dataMigration.attendance,
                migrateMarks: dataMigration.marks,
                migrateLibrary: dataMigration.library,
                migrateClinic: dataMigration.clinic
            });

            if (response.data.message && !response.data.success) {
                setError(response.data.message);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    onComplete();
                }, 2000);
            }
        } catch (err) {
            console.error('Transfer failed:', err);
            setError(err.response?.data?.message || 'Student transfer failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getTargetClassName = () => {
        const cls = classes.find(c => c._id === targetClass);
        return cls ? cls.sclassName : 'Unknown Class';
    };

    return (
        <Box sx={{ p: 1 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {success ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                        Transfer Successful!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                        {student.name} has been moved to {getTargetClassName()}.
                    </Typography>
                </Box>
            ) : (
                <>
                    {activeStep === 0 && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                You are about to transfer <strong>{student.name}</strong> from <strong>{student.sclassName?.sclassName}</strong>.
                            </Alert>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Destination Class</InputLabel>
                                <Select
                                    value={targetClass}
                                    label="Destination Class"
                                    onChange={(e) => setTargetClass(e.target.value)}
                                >
                                    {classes
                                        .filter(cls => cls._id !== student.sclassName?._id)
                                        .map((cls) => (
                                            <MenuItem key={cls._id} value={cls._id}>
                                                {cls.sclassName}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Reason for Transfer"
                                value={reason}
                                onChange={(e) => setTransferReason(e.target.value)}
                                placeholder="e.g., Parent request, class balancing..."
                            />
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Data Migration Preview
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                                Select the data you want to migrate to the new class:
                            </Typography>

                            <List sx={{ bgcolor: '#f8fafc', borderRadius: '12px' }}>
                                <ListItem>
                                    <ListItemIcon><Checkbox checked={dataMigration.attendance} onChange={(e) => setDataMigration({...dataMigration, attendance: e.target.checked})} /></ListItemIcon>
                                    <ListItemText
                                        primary="Attendance Records"
                                        secondary="Migrate daily attendance history to the new class"
                                    />
                                    <Assignment sx={{ color: '#3b82f6', opacity: 0.7 }} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><Checkbox checked={dataMigration.marks} onChange={(e) => setDataMigration({...dataMigration, marks: e.target.checked})} /></ListItemIcon>
                                    <ListItemText
                                        primary="Academic Marks"
                                        secondary="Migrate exam scores and term results"
                                    />
                                    <Assessment sx={{ color: '#8b5cf6', opacity: 0.7 }} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><Checkbox checked={dataMigration.library} onChange={(e) => setDataMigration({...dataMigration, library: e.target.checked})} /></ListItemIcon>
                                    <ListItemText
                                        primary="Library Records"
                                        secondary="Migrate borrowing history and active books"
                                    />
                                    <LocalLibrary sx={{ color: '#10b981', opacity: 0.7 }} />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemIcon><Checkbox checked={dataMigration.clinic} onChange={(e) => setDataMigration({...dataMigration, clinic: e.target.checked})} /></ListItemIcon>
                                    <ListItemText
                                        primary="Clinic Records"
                                        secondary="Migrate medical history and incident reports"
                                    />
                                    <LocalHospital sx={{ color: '#ef4444', opacity: 0.7 }} />
                                </ListItem>
                            </List>

                            <Alert severity="warning" sx={{ mt: 3 }}>
                                Data not selected for migration will remain archived under the previous class record.
                            </Alert>
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                                Confirm Transfer
                            </Typography>

                            <Card variant="outlined" sx={{ mb: 3, borderRadius: '12px' }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={5} sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Current Class</Typography>
                                            <Typography variant="h6">{student.sclassName?.sclassName}</Typography>
                                        </Grid>
                                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                            <SwapHoriz sx={{ fontSize: 32, color: '#94a3b8' }} />
                                        </Grid>
                                        <Grid item xs={5} sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ color: '#3b82f6', display: 'block' }}>Target Class</Typography>
                                            <Typography variant="h6" sx={{ color: '#3b82f6' }}>{getTargetClassName()}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: '8px', mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Student:</strong> {student.name}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Reason:</strong> {reason || 'No reason provided'}</Typography>
                                <Typography variant="body2"><strong>Migrating:</strong> {
                                    Object.entries(dataMigration)
                                        .filter(([_, v]) => v)
                                        .map(([k, _]) => k.charAt(0).toUpperCase() + k.slice(1))
                                        .join(', ')
                                }</Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            onClick={onCancel}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Box>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{ mr: 1, textTransform: 'none' }}>
                                    Back
                                </Button>
                            )}
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleTransfer}
                                    disabled={loading}
                                    sx={{
                                        bgcolor: '#000',
                                        textTransform: 'none',
                                        px: 4,
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Transfer'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                        bgcolor: '#000',
                                        textTransform: 'none',
                                        px: 4,
                                        '&:hover': { bgcolor: '#333' }
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default TransferWizard;
