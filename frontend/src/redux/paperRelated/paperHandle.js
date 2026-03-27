import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    doneSuccess,
    addedSuccess,
    deletedSuccess
} from './paperSlice';

export const getAllPapers = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/SchoolPapers/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const getTeacherPapers = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherPapers/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const createPaper = (fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/PaperCreate`, fields);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(addedSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const updatePaperStatus = (id, fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/PaperStatus/${id}`, fields);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const updatePaperContent = (id, fields) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/PaperContent/${id}`, fields);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
};

export const deletePaper = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Paper/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(deletedSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error.message));
    }
}
