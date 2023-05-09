import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, Button, Box
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';

const ShowNotices = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user)
    console.log(loading, error, response)

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        console.log(response);
        return <div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" sx={styles.noticeAddButton} onClick={() => navigate("/Admin/addnotice")}>Add Notice</Button>
            </Box>
        </div>;
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            })
    }

    const columns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const rows = noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
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
                            <TableCell align="center" style={styles.tableHeadCell}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.title} sx={styles.tableRow}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell align="center">
                                            <Button variant="contained" startIcon={<DeleteIcon />} sx={styles.deleteButton} onClick={() => deleteHandler(row.id, "Notice")}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                style={styles.tablePagination}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt
                        (event.target.value, 10));
                    setPage(0);
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" sx={styles.noticeAddButton} onClick={() => navigate("/Admin/addnotice")}>Add Notice</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="contained" startIcon={<DeleteIcon />} sx={styles.deleteAllButton} onClick={() => deleteHandler(currentUser._id, "Notices")}>Delete All</Button>
            </Box>
        </Paper>
    );
};

export default ShowNotices;

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
    noticeAddButton: {
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
    },
};