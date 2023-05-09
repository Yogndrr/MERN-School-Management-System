import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { classUnderControl } from '../redux/sclassRelated/sclassSlice';

export const RoleDetection = () => {
    const location = useLocation();
    const [role, setRole] = useState('');
    const dispatch = useDispatch()

    useEffect(() => {
        switch (location.pathname) {
            case '/adminlogin':
                setRole('Admin');
                break;
            case '/studentlogin':
                setRole('Student');
                break;
            case '/teacherlogin':
                setRole('Teacher');
                break;
            case '/adminregister':
                setRole('Admin');
                break;
            case '/Admin/classes':
                dispatch(classUnderControl())
                break;
            default:
                setRole('');
                break;
        }
    }, [location.pathname]);

    return role;
};
