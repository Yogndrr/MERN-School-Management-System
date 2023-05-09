import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentsList: [],
    loading: false,
    error: null,
    response: null,
    attendanceMode: JSON.parse(localStorage.getItem('attenStatus')) || false,
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        underStudentControl: (state) => {
            state.response = null;
        },
        postDone: (state) => {
            state.loading = false;
            state.error = null;
        },
        getSuccess: (state, action) => {
            state.studentsList = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setAttendanceMode: (state) => {
            state.attendanceMode = !state.attendanceMode;
            localStorage.setItem('attenStatus', JSON.stringify(state.attendanceMode));
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    setAttendanceMode,
    postDone,
    underStudentControl
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;