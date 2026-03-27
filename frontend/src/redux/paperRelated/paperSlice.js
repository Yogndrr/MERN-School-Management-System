import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    papersList: [],
    loading: false,
    error: null,
    response: null,
};

const paperSlice = createSlice({
    name: 'paper',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.papersList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
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
        doneSuccess: (state, action) => {
            state.papersList = state.papersList.map((paper) => (paper._id === action.payload._id ? action.payload : paper));
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        addedSuccess: (state, action) => {
            state.papersList.push(action.payload);
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        deletedSuccess: (state, action) => {
            state.papersList = state.papersList.filter((paper) => paper._id !== action.payload._id);
            state.loading = false;
            state.error = null;
            state.response = null;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    doneSuccess,
    addedSuccess,
    deletedSuccess
} = paperSlice.actions;

export const paperReducer = paperSlice.reducer;
