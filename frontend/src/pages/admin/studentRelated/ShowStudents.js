import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { attendStudent, getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';

import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Button, Box,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { setAttendanceMode } from '../../../redux/studentRelated/studentSlice';

const ShowStudents = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleAttendanceClick = () => {
        dispatch(setAttendanceMode());
    };

    const addAttendance = (id, attenStatus) => {
        let date = new Date()
        let fields = { date, attenStatus }
        dispatch(attendStudent(id, fields))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
    }

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { studentsList, attendanceMode, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    console.log(loading, error, response)

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }
    else if (response) {
        console.log(response);
        return <div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" sx={styles.studentAddButton} onClick={() => navigate("/Admin/addstudents")}>Add Students</Button>
            </Box>
        </div>;
    }
    else if (error) {
        console.log(error);
    }
    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllStudents(currentUser._id));
            })
    }

    const columns = attendanceMode
        ? [
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'attenStatus', label: 'Attendance', minWidth: 100 },
            { id: 'date', label: 'Date', minWidth: 170 },
        ]
        : [
            { id: 'name', label: 'Name', minWidth: 170 },
            { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
            { id: 'sclassName', label: 'Class', minWidth: 170 },
        ]

    const rows = studentsList.map((student) => {
        console.log(student.attendance);
        console.log(student.sclassName);
        if (attendanceMode) {
            return {
                name: student.name,
                attenStatus: student.attendance.attenStatus,
                date: student.attendance.date ? new Date(student.attendance.date).toISOString().substring(0, 10) : "",
                id: student._id,
            };
        } else {
            return {
                name: student.name,
                rollNum: student.rollNum,
                sclassName: student.sclassName.sclassName,
                attenStatus: '',
                id: student._id,
            };
        }
    });

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} style={styles.tablePaper}>
            <TableContainer sx={styles.tableContainer}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, ...styles.tableHeadCell }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell align="center" style={styles.tableHeadCell}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={styles.tableRow}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'attenStatus' ? row.attenStatus : (
                                                        column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                        {attendanceMode ?
                                            <TableCell align="center">
                                                <Button variant="contained" sx={styles.viewButton}
                                                    onClick={() => addAttendance(row.id, "Present")}>
                                                    Present
                                                </Button>
                                                <Button variant="contained" sx={styles.deleteButton}
                                                    onClick={() => addAttendance(row.id, "Absent")}>
                                                    Absent
                                                </Button>
                                            </TableCell>
                                            :
                                            <TableCell align="center">
                                                <Button variant="contained" sx={styles.viewButton}
                                                    onClick={() => navigate("/Admin/students/student/" + row.id)}>
                                                    View
                                                </Button>
                                                <Button variant="contained" startIcon={<DeleteIcon />} sx={styles.deleteButton}
                                                    onClick={() => deleteHandler(row.id, "Student")}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                style={styles.tablePagination}
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 5));
                    setPage(0);
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" sx={styles.attendanceButton} onClick={handleAttendanceClick}>
                    {attendanceMode ? "Cancel" : "Attendance"}
                </Button>
            </Box>
            {attendanceMode ?
                null
                :
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button variant="contained" sx={styles.studentAddButton} onClick={() => navigate("/Admin/addstudents")}>Add Students</Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Button variant="contained" startIcon={<DeleteIcon />} sx={styles.deleteAllButton} onClick={() => deleteHandler(currentUser._id, "Students")}>Delete All</Button>
                    </Box>
                </>}
        </Paper>

    );
};

export default ShowStudents;

const styles = {
    tableContainer: {
        maxHeight: 430,
        color: 'white',
    },
    tableHeadCell: {
        backgroundColor: "#00f",
        color: 'white',
    },
    tableRow: {
        backgroundColor: '#1f1f38',
        color: 'white',
        '& td': {
            color: 'white',
        },
    },
    tablePagination: {
        color: 'white',
    },
    tablePaper: {
        backgroundColor: '#1f1f38',
        color: 'white',
    },
    deleteButton: {
        backgroundColor: "#f00",
        color: 'white',
        marginLeft: 4,
        '&:hover': {
            backgroundColor: '#eb7979',
            borderColor: '#f26767',
            boxShadow: 'none',
        }
    },
    viewButton: {
        backgroundColor: "#00f",
        color: 'white',
    },
    attendanceButton: {
        backgroundColor: "#083109",
        color: 'white',
        '&:hover': {
            backgroundColor: '#266412',
            boxShadow: 'none',
        }
    },
    attendanceAddButton: {
        backgroundColor: "#00f",
        color: 'white',
    },
    studentAddButton: {
        backgroundColor: "#00f",
        color: 'white',
    },
    deleteAllButton: {
        backgroundColor: "#650909",
        color: 'white',
        '&:hover': {
            backgroundColor: '#eb7979',
            borderColor: '#f26767',
            boxShadow: 'none',
        }
    }
};