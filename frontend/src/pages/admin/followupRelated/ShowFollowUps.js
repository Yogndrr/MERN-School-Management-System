import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Box, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import { getAllFollowUps } from '../../../redux/followupRelated/followupHandle';

const ShowFollowUps = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { followupsList, loading, response } = useSelector((state) => state.followup);
  const { currentUser } = useSelector(state => state.user)

  const [filterUpcoming, setFilterUpcoming] = useState(true);

  const adminID = useMemo(() => currentUser?._id, [currentUser]);

  useEffect(() => {
    dispatch(getAllFollowUps(adminID, filterUpcoming));
  }, [dispatch, adminID, filterUpcoming]);

  const followupColumns = [
    { id: 'date', label: 'Follow-Up Date', minWidth: 120 },
    { id: 'parentName', label: 'Parent Name', minWidth: 150 },
    { id: 'childName', label: 'Child Name', minWidth: 150 },
    { id: 'contactNumber', label: 'Contact', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 140 },
    { id: 'assignedTo', label: 'Assigned To', minWidth: 140 },
  ];

  const followupRows = (followupsList || []).map((f) => {
    const date = new Date(f.date);
    const dateString = date.toString() !== 'Invalid Date' ? date.toISOString().substring(0, 10) : 'Invalid Date';
    return {
      id: f._id,
      date: dateString,
      parentName: f.parentName,
      childName: f.childName,
      contactNumber: f.contactNumber,
      status: f.status,
      assignedTo: f.assignedTo?.name || 'Unassigned',
    };
  });

  const FollowUpButtonHaver = ({ row }) => (
    <>
      <IconButton onClick={() => navigate(`/Admin/followups/${row.id}`)}>
        <EditIcon color="primary" />
      </IconButton>
    </>
  );

  const actions = [
    {
      icon: <NoteAddIcon color="primary" />, name: 'Add Follow-Up',
      action: () => navigate('/Admin/addfollowup')
    }
  ];

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {response ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              No Follow-Ups Right Now
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <ToggleButtonGroup
                  value={filterUpcoming ? 'upcoming' : 'all'}
                  exclusive
                  onChange={(e, val) => setFilterUpcoming(val === 'upcoming')}
                >
                  <ToggleButton value="upcoming">
                    <EventAvailableIcon sx={{ mr: 1 }} /> Upcoming
                  </ToggleButton>
                  <ToggleButton value="all">All</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {(followupRows || []).length > 0 && (
                  <TableTemplate buttonHaver={FollowUpButtonHaver} columns={followupColumns} rows={followupRows} />
                )}
                <SpeedDialTemplate actions={actions} />
              </Paper>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ShowFollowUps;
