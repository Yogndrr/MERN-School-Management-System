import React from 'react'
import styled from 'styled-components';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const teachSclass = currentUser.teachSclass
  const teachSubject = currentUser.teachSubject
  const teachSchool = currentUser.school

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText variant="h3" style={{ marginBottom: "20px" }}>Profile</ProfileText>
          <ProfileText>Name: {currentUser.name}</ProfileText>
          <ProfileText>Email: {currentUser.email}</ProfileText>
          <ProfileText>Class: {teachSclass.sclassName}</ProfileText>
          <ProfileText>Subject: {teachSubject.subName}</ProfileText>
          <ProfileText>School: {teachSchool.schoolName}</ProfileText>
        </ProfileCardContent>
      </ProfileCard>
      <br /><br />
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText variant="h5" style={{ marginBottom: "20px" }}>Attendance</ProfileText>
          <Button type="contained" color="primary">Today</Button>
        </ProfileCardContent>
      </ProfileCard>
    </>
  )
}

export default TeacherProfile

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