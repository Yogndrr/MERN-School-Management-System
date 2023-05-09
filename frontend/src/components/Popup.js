import React from 'react';
import { useDispatch } from 'react-redux';
import { underControl } from '../redux/userRelated/userSlice';

const Popup = ({ message, setShowPopup }) => {
    const dispatch = useDispatch();

    const okClickHandler = () => {
        dispatch(underControl())
        setShowPopup(false);
    };

    return (
        <>
            <div className="msg-popups">
                <div className="msg-popups-content">
                    <h2>{message}</h2>
                    <div className="msg-popup-buttons">
                        <button className="msg-popup-ok-button msg-popupButton" onClick={okClickHandler}>
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Popup;
