import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import Popup from '../../components/Popup';
import { BlueButton } from '../../components/buttonStyles';
import { addStuff } from '../../redux/userRelated/userHandle';
import { useDispatch, useSelector } from 'react-redux';
import SafeHtml from '../../components/SafeHtml';
import { COMPLAINT_MAX, sanitizeRichText } from '../../utils/sanitize';

const StudentComplain = () => {
    const [complaint, setComplaint] = useState("");
    const [date, setDate] = useState("");

    const dispatch = useDispatch()

    const { status, currentUser, error, tempDetails, response } = useSelector(state => state.user);

    const user = currentUser._id
    const school = currentUser.school._id
    const address = "Complain"

    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const complaintPreview = useMemo(() => sanitizeRichText(complaint), [complaint]);

    const fields = {
        user,
        date,
        complaint: complaintPreview.value,
        school,
    };

    const submitHandler = (event) => {
        event.preventDefault()
        if (!complaintPreview.value) {
            setMessage('Complaint is empty after removing unsafe HTML');
            setShowPopup(true);
            return;
        }
        setLoader(true)
        dispatch(addStuff(fields, address))
    };

    useEffect(() => {
        if (status === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage(
                tempDetails?.security?.xssDetected
                    ? "Unsafe HTML was stripped before this complaint was saved."
                    : "Done Successfully"
            )
            setComplaint("");
        }
        else if (status === "failed") {
            setLoader(false)
            setShowPopup(true)
            setMessage(response || "Could not add complaint")
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Network Error")
        }
    }, [status, error, tempDetails, response])

    return (
        <>
            <Box
                sx={{
                    flex: '1 1 auto',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box
                    sx={{
                        maxWidth: 550,
                        px: 3,
                        py: '100px',
                        width: '100%'
                    }}
                >
                    <div>
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            <Typography variant="h4">Complain</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Complaint text is sanitized before it is stored. Scripts and event handlers are removed.
                            </Typography>
                        </Stack>
                        <form onSubmit={submitHandler}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Select Date"
                                    type="date"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)} required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Write your complain"
                                    variant="outlined"
                                    value={complaint}
                                    onChange={(event) => {
                                        setComplaint(event.target.value);
                                    }}
                                    required
                                    multiline
                                    maxRows={4}
                                    inputProps={{ maxLength: COMPLAINT_MAX }}
                                    helperText={`${complaint.length}/${COMPLAINT_MAX}`}
                                />
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: complaintPreview.xssDetected ? 'warning.main' : 'divider',
                                        bgcolor: complaintPreview.xssDetected ? 'warning.light' : 'action.hover',
                                    }}
                                >
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Sanitized preview
                                        {complaintPreview.xssDetected ? ' — unsafe HTML detected' : ''}
                                    </Typography>
                                    {complaintPreview.value
                                        ? <SafeHtml html={complaintPreview.value} allowMarkup />
                                        : <Typography variant="body2">—</Typography>}
                                </Box>
                            </Stack>
                            <BlueButton
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                variant="contained"
                                type="submit"
                                disabled={loader}
                            >
                                {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
                            </BlueButton>
                        </form>
                    </div>
                </Box>
            </Box>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default StudentComplain;
