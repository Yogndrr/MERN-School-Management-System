import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { createFollowUp } from '../../../redux/followupRelated/followupHandle';
import { postDone } from '../../../redux/followupRelated/followupSlice';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

const STATUS_OPTIONS = [
  'Positive',
  'Negative',
  'Book Demo',
  'Request to Meet/Visit',
];

const AddFollowUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { teachersList } = useSelector(state => state.teacher);
  const { status } = useSelector(state => state.followup);

  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [date, setDate] = useState('');
  const [statusValue, setStatusValue] = useState('Positive');
  const [assignedTo, setAssignedTo] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderAt, setReminderAt] = useState('');

  const adminID = useMemo(() => currentUser?._id, [currentUser]);

  useEffect(() => {
    if (!teachersList || teachersList.length === 0) {
      dispatch(getAllTeachers(adminID));
    }
  }, [dispatch, adminID, teachersList]);

  useEffect(() => {
    if (status === 'added') {
      dispatch(postDone());
      navigate('/Admin/followups');
    }
  }, [status, dispatch, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    const payload = {
      parentName,
      childName,
      contactNumber,
      remarks,
      date,
      status: statusValue,
      assignedTo: assignedTo || undefined,
      adminID,
      reminderEnabled,
      reminderAt: reminderEnabled ? reminderAt : undefined,
    };
    dispatch(createFollowUp(payload));
  };

  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <span className="registerTitle">Add Follow-Up</span>

        <label>Parent Name</label>
        <input className="registerInput" type="text" placeholder="Enter parent name..."
          value={parentName}
          onChange={(e) => setParentName(e.target.value)} required />

        <label>Child Name</label>
        <input className="registerInput" type="text" placeholder="Enter child name..."
          value={childName}
          onChange={(e) => setChildName(e.target.value)} required />

        <label>Contact Number</label>
        <input className="registerInput" type="tel" placeholder="Enter contact number..."
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)} required />

        <label>Remarks/Notes</label>
        <input className="registerInput" type="text" placeholder="Enter remarks..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)} />

        <label>Follow-Up Date</label>
        <input className="registerInput" type="date" placeholder="Select follow-up date..."
          value={date}
          onChange={(e) => setDate(e.target.value)} required />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={statusValue}
            label="Status"
            onChange={(e) => setStatusValue(e.target.value)}
          >
            {STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="assignedTo-label">Assign to Teacher (optional)</InputLabel>
          <Select
            labelId="assignedTo-label"
            value={assignedTo}
            label="Assign to Teacher (optional)"
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {(teachersList || []).map(t => (
              <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <label style={{ display: 'block' }}>
            <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)} />
            {' '}Enable Reminder
          </label>
          {reminderEnabled && (
            <input className="registerInput" type="datetime-local" placeholder="Reminder at"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)} />
          )}
        </Box>

        <button className="registerButton" type="submit">
          {status === 'loading' ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Add'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddFollowUp;
