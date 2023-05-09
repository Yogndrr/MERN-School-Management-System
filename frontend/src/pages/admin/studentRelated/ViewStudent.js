import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);

    const buttonText = showTab ? 'Cancel' : 'Edit student';

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);
    console.log(userDetails, loading, error, response)
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(params.id, address));
    }, [dispatch, params.id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [attendance, setAttendance] = useState('');

    const [attendanceRadio, setAttendanceRadio] = useState("");

    const date = attendance.date !== undefined ? new Date(userDetails.attendance.date).toISOString().substring(0, 10) : "Date Unavailable"
    console.log(userDetails);

    let currentDate = new Date()
    const attendanceFields = { currentDate, attendanceRadio }
    console.log(attendanceFields);

    const fields = password === ""
        ? { name, rollNum, sclassName, attendanceFields }
        : { name, rollNum, password, sclassName, attendanceFields }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setAttendance(userDetails.attendance || '');
            setAttendanceRadio(attendance.attenStatus || '');
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, params.id, address))
            .then(() => {
                dispatch(getUserDetails(params.id, address));
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteHandler = () => {
        dispatch(deleteUser(params.id, address))
            .then(() => {
                navigate(-1)
            })
    }

    return (
        <>
            {loading
                ?
                <>
                    <div>Loading...</div>
                </>
                :
                <div>
                    Name: {userDetails.name}
                    <br />
                    Roll Number: {userDetails.rollNum}
                    <br />
                    Class: {sclassName.sclassName}
                    <br />
                    Subjects:
                    <ul>
                        {
                            sclassName?.subjects?.map((subject, index) => (
                                <div key={index}>
                                    <li>{subject.subName} - {subject.subCode}</li>
                                </div>
                            ))
                        }
                    </ul>
                    <br />
                    School: {studentSchool.schoolName}
                    <br />
                    Attendance: {attendance.attenStatus} - {date}
                    <button onClick={deleteHandler}>Delete</button>
                    <button className="show-tab" onClick={() => { setShowTab(!showTab) }}>{buttonText}</button>
                    {
                        showTab &&
                        <>
                            <div className="register">
                                <form className="registerForm" onSubmit={submitHandler}>
                                    <span className="registerTitle">Edit Details</span>
                                    <label>Name</label>
                                    <input className="registerInput" type="text" placeholder="Enter user's name..."
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        autoComplete="name" required />

                                    <label>Class</label>
                                    <input className="registerInput" type="text" placeholder="Enter user's class..."
                                        value={sclassName}
                                        onChange={(event) => setSclassName(event.target.value)}
                                        autoComplete="name" required />

                                    <label>Roll Number</label>
                                    <input className="registerInput" type="number" placeholder="Enter user's Roll Number..."
                                        value={rollNum}
                                        onChange={(event) => setRollNum(event.target.value)}
                                        required />

                                    <label>Password</label>
                                    <input className="registerInput" type="password" placeholder="Enter user's password..."
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        autoComplete="new-password" />

                                    <RadioGroup sx={styles.radioGrouper}>
                                        <FormControlLabel value="Present" control={<Radio />} label="Present"
                                            onChange={() => {
                                                setAttendanceRadio("Present");
                                            }} />
                                        <FormControlLabel value="Absent" control={<Radio />} label="Absent"
                                            onChange={() => {
                                                setAttendanceRadio("Absent");
                                            }} />
                                    </RadioGroup>

                                    <button className="registerButton" type="submit" >Update</button>
                                </form>
                            </div>
                        </>
                    }
                </div>}
        </>
    )
}

export default ViewStudent

const styles = {
    radioGrouper: {
        display: "flex",
        flexDirection: 'row'
    }
}