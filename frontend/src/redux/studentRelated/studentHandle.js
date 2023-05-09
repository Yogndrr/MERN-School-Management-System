import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone
} from './studentSlice';

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`http://localhost:5000/Students/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const attendStudent = (id, fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`http://localhost:5000/StudentAttendance/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        dispatch(postDone());
        console.log(result.data)
    } catch (error) {
        dispatch(getError(error));
    }
}