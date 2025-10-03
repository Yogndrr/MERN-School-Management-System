import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followupsList: [],
  followupDetails: null,
  loading: false,
  error: null,
  response: null,
  status: 'idle'
};

const followupSlice = createSlice({
  name: 'followup',
  initialState,
  reducers: {
    getRequest: (state) => {
      state.loading = true;
    },
    getSuccess: (state, action) => {
      state.followupsList = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },
    doneSuccess: (state, action) => {
      state.followupDetails = action.payload;
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
    postStart: (state) => {
      state.status = 'loading';
    },
    postAdded: (state) => {
      state.status = 'added';
    },
    postDone: (state) => {
      state.status = 'idle';
    }
  }
});

export const { getRequest, getSuccess, getFailed, getError, doneSuccess, postStart, postAdded, postDone } = followupSlice.actions;

export const followupReducer = followupSlice.reducer;
