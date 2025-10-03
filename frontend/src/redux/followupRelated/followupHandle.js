import axios from 'axios';
import { getRequest, getSuccess, getFailed, getError, doneSuccess, postStart, postAdded, postDone } from './followupSlice';

export const getAllFollowUps = (adminId, upcoming = false) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FollowUpList/${adminId}?upcoming=${upcoming}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const getFollowUpDetail = (id) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FollowUp/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const createFollowUp = (fields) => async (dispatch) => {
  dispatch(postStart());
  try {
    const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/FollowUpCreate`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(postAdded());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

export const updateFollowUp = (id, fields) => async (dispatch) => {
  dispatch(getRequest());
  try {
    const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/FollowUp/${id}`, fields, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};
