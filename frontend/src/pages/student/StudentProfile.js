import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';

const StudentProfile = () => {
    const { currentUser } = useSelector(state => state.user);

    const dispatch = useDispatch();
    const { userDetails, response, loading, error } = useSelector((state) => state.user);
    console.log(userDetails, loading, error, response)
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails
            (currentUser._id, address));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [attendance, setAttendance] = useState('');

    const date = attendance.date !== undefined ? new Date(userDetails.attendance.date).toISOString().substring(0, 10) : "Date Unavailable"

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setAttendance(userDetails.attendance || '');
        }
    }, [userDetails]);

    return (
        <ProfileCard>
            {loading ? (
                <ProfileCardContent>
                    <LoadingText>Loading...</LoadingText>
                </ProfileCardContent>
            ) : (
                <ProfileCardContent>
                    <ProfileText variant="h3" style={{marginBottom:"20px"}}>Profile</ProfileText>
                    <ProfileText>Name: {userDetails.name}</ProfileText>
                    <ProfileText>Roll Number: {userDetails.rollNum}</ProfileText>
                    <ProfileText>Class: {sclassName.sclassName}</ProfileText>
                    <ProfileText>Subjects:</ProfileText>
                    <List>
                        {sclassName?.subjects?.map((subject, index) => (
                            <ListItem key={index}>
                                {subject.subName} - {subject.subCode}
                            </ListItem>
                        ))}
                    </List>
                    <ProfileText>School: {studentSchool.schoolName}</ProfileText>
                    <ProfileText>
                        Attendance: {attendance.attenStatus} - {date}
                    </ProfileText>
                </ProfileCardContent>
            )}
        </ProfileCard>
    )
}

export default StudentProfile


const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
  color:white;
  background-color:#2c2c6c;
  &:hover {
    background-color: #1f1f38;
  }
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color:white;
  background-color:#2c2c6c;
  &:hover {
    background-color: #1f1f38;
  }
`;

const ProfileText = styled(Typography)`
  margin: 10px;
  color:white;
  &:hover {
    background-color: #1f1f38;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px;
  color:white;
`;

const ListItem = styled.li`
  margin: 5px;
  color:white;
`;

const LoadingText = styled.div`
  margin: 20px;
  font-size: 18px;
  color:white;
`;