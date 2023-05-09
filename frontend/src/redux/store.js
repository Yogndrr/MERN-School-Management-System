import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './userRelated/userSlice';
import { studentReducer } from './studentRelated/studentSlice';
import { noticeReducer } from './noticeRelated/noticeSlice';
import { sclassReducer } from './sclassRelated/sclassSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        student: studentReducer,
        notice: noticeReducer,
        sclass: sclassReducer
    },
});

export default store;
