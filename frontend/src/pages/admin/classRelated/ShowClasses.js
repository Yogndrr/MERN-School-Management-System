import { useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Box } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)
  console.log(loading, error, getresponse)

  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, "Sclass"));
  }, [currentUser._id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  } else if (getresponse) {
    console.log(getresponse);
    return <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button variant="contained" onClick={() => navigate("/Admin/addclass")}>Add Class</Button>
      </Box>
    </div>;
  } else if (error) {
    console.log(error)
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address))
      .then(() => {
        dispatch(getAllSclasses(currentUser._id, "Sclass"));
      })
  }

  return (
    <div sx={styles.root}>
      <TableContainer sx={styles.tableContainer}>
        <Table aria-label="sclasses table">
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableHeadCell}>S. No.</TableCell>
              <TableCell align="center" sx={styles.tableHeadCell}>Class Name</TableCell>
              <TableCell align="center" sx={styles.tableHeadCell}>Subjects</TableCell>
              <TableCell align="center" sx={styles.tableHeadCell}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(sclassesList) && sclassesList.length > 0 && sclassesList.map((sclass, index) => (
              <TableRow key={sclass._id} sx={styles.tableRow}>
                <TableCell component="th" scope="row" style={{ color: "white" }}>
                  {index + 1}
                </TableCell>
                <TableCell align="center">{sclass.sclassName}</TableCell>
                <TableCell align="center">
                  {sclass.subjects.map((subject) => (
                    <Typography key={subject._id}>
                      {subject.subName} - {subject.subCode}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => deleteHandler(sclass._id, "Sclass")} color="secondary">
                    <DeleteIcon color="error" />
                  </IconButton>
                  <Button variant="contained" sx={styles.viewButton}
                    onClick={() => navigate("/Admin/classes/class/" + sclass._id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{
        marginTop: "10px",
        display: "flex",
        justifyContent: "space-between",
      }}>
        <Button variant="contained" color="error" onClick={() => deleteHandler(currentUser._id, "Sclasses")}>
          Delete All Classes
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate("/Admin/addclass")}>
          Add New Class
        </Button>
      </div>
    </div>
  );
};

export default ShowClasses;

const styles = {
  root: {
    color: "#fff",
  },
  tableContainer: {
    maxHeight: 430,
    color: "white",
  },
  tableHeadCell: {
    backgroundColor: "#00f",
    color: "white",
  },
  tableRow: {
    color: "white",
    "& td": {
      color: "white",
    },
  },
  deleteButton: {
    color: "#f44336",
    "&:hover": {
      backgroundColor: "#f44336",
      color: "#fff",
    },
  },
  viewButton: {
    backgroundColor: "#191fd2",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#1976d2",
    }
  }
};