import React, { useState } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Grid,
    FormControl, InputLabel, Select, MenuItem, Chip,
    Divider, Alert, List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import { Send, People, School, Class, Campaign, History } from '@mui/icons-material';

const AdminSendMessage = () => {
    const [message, setMessage] = useState('');
    const [targetType, setTargetType] = useState('all');
    const [sentMessages, setSentMessages] = useState([
        { id: 1, to: 'All Staff', text: 'Staff meeting tomorrow at 3 PM.', time: '2 hours ago' },
        { id: 2, to: 'Year 3 - Blue', text: 'Field trip permission slips due Friday.', time: '1 day ago' },
    ]);

    const handleSend = () => {
        if (!message) return;
        const newMessage = {
            id: Date.now(),
            to: targetType.charAt(0).toUpperCase() + targetType.slice(1),
            text: message,
            time: 'Just now'
        };
        setSentMessages([newMessage, ...sentMessages]);
        setMessage('');
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Send Announcement</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, borderRadius: '16px' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Create New Message</Typography>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Target Audience</InputLabel>
                            <Select value={targetType} label="Target Audience" onChange={(e) => setTargetType(e.target.value)}>
                                <MenuItem value="all">All School</MenuItem>
                                <MenuItem value="teachers">All Teachers</MenuItem>
                                <MenuItem value="students">All Students</MenuItem>
                                <MenuItem value="class">Specific Class</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            label="Message Content"
                            placeholder="Type your announcement here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Send />}
                            onClick={handleSend}
                            disabled={!message}
                            sx={{ bgcolor: '#000', py: 1.5, borderRadius: '10px' }}
                        >
                            Send Announcement
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                            <History />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Recently Sent</Typography>
                        </Box>

                        <List>
                            {sentMessages.map((msg, index) => (
                                <React.Fragment key={msg.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: '#f5f5f5', color: '#666' }}>
                                                <Campaign fontSize="small" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>To: {msg.to}</Typography>}
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="textPrimary" sx={{ my: 0.5 }}>{msg.text}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{msg.time}</Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < sentMessages.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminSendMessage;
