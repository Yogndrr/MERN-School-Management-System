import React, { useEffect, useState } from "react";
import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';

const ClassForm = () => {
    const [sclassName, setSclassName] = useState("");
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "" }]);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const adminID = currentUser._id
    const address = "Sclass"

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    const handleSclassNameChange = (event) => {
        setSclassName(event.target.value);
    };

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        console.log({ sclassName, subjects });
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === 'added') {
            navigate('/Admin/classes');
            dispatch(underControl())
            setLoader(false)
        }
        else if (status === 'failed') {
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
        }
        else if (status === 'error') {
            console.log(error)
            setLoader(false)
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <form onSubmit={submitHandler}>
            <Box mb={2}>
                <Typography variant="h6" >Add a Class</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        sx={styles.inputField}
                        label="Class Name"
                        variant="outlined"
                        value={sclassName}
                        onChange={handleSclassNameChange}
                        required
                    />
                </Grid>
                {subjects.map((subject, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Subject Name"
                                variant="outlined"
                                value={subject.subName}
                                onChange={handleSubjectNameChange(index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                label="Subject Code"
                                variant="outlined"
                                value={subject.subCode}
                                onChange={handleSubjectCodeChange(index)}
                                sx={styles.inputField}
                                required
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Box display="flex" alignItems="flex-end">
                                {index === 0 ? (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAddSubject}
                                    >
                                        Add Subject
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleRemoveSubject(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </React.Fragment>
                ))}
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="primary" type="submit" disabled={loader}>
                            {loader ? (
                                <div className="load"></div>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </Box>
                </Grid>
                {/* {isSubmitted && (
                    <Grid item xs={12}>
                        <Box mt={2}>
                            <Typography variant="h6">Class Information</Typography>
                            <Typography>Class Name: {sclassName}</Typography>
                            <Typography variant="subtitle1">Subjects:</Typography>
                            {subjects.map((subject, index) => (
                                <Typography key={index}>
                                    {index + 1}. {subject.subName} ({subject.subCode})
                                </Typography>
                            ))}
                        </Box>
                    </Grid>
                )} */}
                {showPopup && <Popup message={message} setShowPopup={setShowPopup} />}
            </Grid>
        </form>
    );
}

export default ClassForm

const styles = {
    inputField: {
        '& .MuiOutlinedInput-input': {
            color: 'white',
        },
        '& .MuiInputLabel-root': {
            color: '#838080',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#838080',
        },
    },
};