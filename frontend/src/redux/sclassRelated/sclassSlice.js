import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sclassesList: [],
    sclassStudents: [],
    sclassDetails: [],
    loading: false,
    error: null,
    response: null,
    getresponse: null,
};

const sclassSlice = createSlice({
    name: 'sclass',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.sclassesList = action.payload;
            state.loading = false;
            state.error = null;
        },
        getStudentsSuccess: (state, action) => {
            state.sclassStudents = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailedTwo: (state, action) => {
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        detailsSuccess: (state, action) => {
            state.sclassDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        classUnderControl: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    classUnderControl
} = sclassSlice.actions;

export const sclassReducer = sclassSlice.reducer;