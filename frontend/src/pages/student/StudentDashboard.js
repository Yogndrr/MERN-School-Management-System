import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../../redux/noticeRelated/noticeHandle';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

const StudentDashboard = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        dispatch(getAllNotices(currentUser.school, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
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
        <div style={{ marginTop: '50px', marginRight: '20px' }}>
            <h1 style={{ fontSize: '40px', marginBottom: '40px' }}>Welcome {currentUser.name}</h1>
            {loading ? (
                <div style={{ fontSize: '20px' }}>Loading...</div>
            ) : response ? (
                <div style={{ fontSize: '20px' }}>No Notices to Show Right Now</div>
            ) : (
                <>
                    <h3 style={{ fontSize: '30px', marginBottom: '40px', color:"#ffffff" }}>Notices</h3>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }} style={styles.tablePaper}>
                        <TableContainer sx={styles.tableContainer}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, ...styles.tableHeadCell }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.title}
                                                    sx={styles.tableRow}
                                                >
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
                                setRowsPerPage(parseInt(event.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </Paper>
                </>
            )}
        </div>

    )
}

export default StudentDashboard

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