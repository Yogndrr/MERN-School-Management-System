import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getFollowUpDetail, updateFollowUp } from '../../../redux/followupRelated/followupHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

const STATUS_OPTIONS = [
  'Positive',
  'Negative',
  'Book Demo',
  'Request to Meet/Visit',
];

const EditFollowUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { followupDetails, loading } = useSelector(state => state.followup);
  const { teachersList } = useSelector(state => state.teacher);

  const [form, setForm] = useState({
    parentName: '',
    childName: '',
    contactNumber: '',
    remarks: '',
    date: '',
    status: 'Positive',
    assignedTo: '',
  });

  useEffect(() => {
    dispatch(getFollowUpDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!teachersList || teachersList.length === 0) {
      dispatch(getAllTeachers((followupDetails && followupDetails.school) || ''));
    }
  }, [dispatch, teachersList, followupDetails]);

  useEffect(() => {
    if (followupDetails && followupDetails._id === id) {
      setForm({
        parentName: followupDetails.parentName || '',
        childName: followupDetails.childName || '',
        contactNumber: followupDetails.contactNumber || '',
        remarks: followupDetails.remarks || '',
        date: followupDetails.date ? new Date(followupDetails.date).toISOString().substring(0, 10) : '',
        status: followupDetails.status || 'Positive',
        assignedTo: followupDetails.assignedTo?._id || '',
      });
    }
  }, [followupDetails, id]);

  const submitHandler = (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      assignedTo: form.assignedTo || undefined,
    };
    dispatch(updateFollowUp(id, payload)).then(() => navigate('/Admin/followups'));
  };

  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <span className="registerTitle">Edit Follow-Up</span>

        <label>Parent Name</label>
        <input className="registerInput" type="text"
          value={form.parentName}
          onChange={(e) => setForm({ ...form, parentName: e.target.value })} required />

        <label>Child Name</label>
        <input className="registerInput" type="text" 
          value={form.childName}
          onChange={(e) => setForm({ ...form, childName: e.target.value })} required />

        <label>Contact Number</label>
        <input className="registerInput" type="tel" 
          value={form.contactNumber}
          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />

        <label>Remarks/Notes</label>
        <input className="registerInput" type="text" 
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })} />

        <label>Follow-Up Date</label>
        <input className="registerInput" type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} required />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={form.status}
            label="Status"
            onChange={(e) => setForm({ ...form, status: e.target.value })}
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
            value={form.assignedTo}
            label="Assign to Teacher (optional)"
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {(teachersList || []).map(t => (
              <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <button className="registerButton" type="submit">
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
};

export default EditFollowUp;
