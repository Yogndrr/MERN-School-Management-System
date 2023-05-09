import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getClassDetails } from '../../redux/sclassRelated/sclassHandle';
import { Container, Typography } from '@mui/material';

const StudentSubjects = () => {

    const dispatch = useDispatch();
    const { sclassDetails, loading } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getClassDetails(currentUser.sclassName, "Sclass"));
    }, [dispatch]);

    return (
        <>
            {
                loading
                    ?
                    <div>
                        Loading...
                    </div>
                    :
                    <Container sx={styles.containerStyled}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Class Details
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            Your are currently in Class {sclassDetails && sclassDetails.sclassName}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            And these are the subjects:
                        </Typography>
                        {sclassDetails && Array.isArray(sclassDetails.subjects) && sclassDetails.subjects.map((subject, index) => (
                            <div key={index}>
                                <Typography variant="subtitle1">
                                    {subject.subName} ({subject.subCode})
                                </Typography>
                            </div>
                        ))}
                    </Container>
            }
        </>
    )
}

export default StudentSubjects

const styles = {
    containerStyled: {
        color: 'white'
    },
}