import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Chip, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Send, AttachFile } from '@mui/icons-material';

const SendMessages = () => {
    const [messageData, setMessageData] = useState({
        recipients: [],
        recipientType: '',
        subject: '',
        message: '',
        priority: 'normal'
    });

    const [sentMessages, setSentMessages] = useState([
        { id: 1, to: 'All Teachers', subject: 'Staff Meeting', date: '2024-11-15', priority: 'high' },
        { id: 2, to: 'Year 3 - Blue', subject: 'Field Trip', date: '2024-11-14', priority: 'normal' }
    ]);

    const recipientTypes = ['Individual Teacher', 'Multiple Teachers', 'All Teachers', 'Specific Class', 'All Classes'];
    
    const teachers = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
    
    const classes = [
        'Year 3 - Blue', 'Year 3 - Crimson', 'Year 3 - Cyan', 'Year 3 - Purple',
        'Year 3 - Lavender', 'Year 3 - Maroon', 'Year 3 - Violet', 'Year 3 - Green',
        'Year 3 - Red', 'Year 3 - Yellow', 'Year 3 - Magenta', 'Year 3 - Orange'
    ];

    const handleSendMessage = () => {
        const newMessage = {
            id: Date.now(),
            to: messageData.recipientType === 'Individual Teacher' || messageData.recipientType === 'Multiple Teachers' 
                ? messageData.recipients.join(', ')
                : messageData.recipientType === 'Specific Class'
                ? messageData.recipients[0]
                : messageData.recipientType,
            subject: messageData.subject,
            date: new Date().toISOString().split('T')[0],
            priority: messageData.priority
        };

        setSentMessages([newMessage, ...sentMessages]);
        setMessageData({
            recipients: [],
            recipientType: '',
            subject: '',
            message: '',
            priority: 'normal'
        });
        alert('Message sent successfully!');
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>Send Messages</Typography>

            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Compose Message */}
                <Paper sx={{ flex: 1, p: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Compose New Message
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl required>
                            <InputLabel>Recipient Type</InputLabel>
                            <Select
                                value={messageData.recipientType}
                                onChange={(e) => setMessageData({ ...messageData, recipientType: e.target.value, recipients: [] })}
                            >
                                {recipientTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {messageData.recipientType === 'Individual Teacher' && (
                            <FormControl>
                                <InputLabel>Select Teacher</InputLabel>
                                <Select
                                    value={messageData.recipients[0] || ''}
                                    onChange={(e) => setMessageData({ ...messageData, recipients: [e.target.value] })}
                                >
                                    {teachers.map((teacher) => (
                                        <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {messageData.recipientType === 'Multiple Teachers' && (
                            <FormControl>
                                <InputLabel>Select Teachers</InputLabel>
                                <Select
                                    multiple
                                    value={messageData.recipients}
                                    onChange={(e) => setMessageData({ ...messageData, recipients: e.target.value })}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {teachers.map((teacher) => (
                                        <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {messageData.recipientType === 'Specific Class' && (
                            <FormControl>
                                <InputLabel>Select Class</InputLabel>
                                <Select
                                    value={messageData.recipients[0] || ''}
                                    onChange={(e) => setMessageData({ ...messageData, recipients: [e.target.value] })}
                                >
                                    {classes.map((cls) => (
                                        <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={messageData.priority}
                                onChange={(e) => setMessageData({ ...messageData, priority: e.target.value })}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                                <MenuItem value="urgent">Urgent</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Subject"
                            value={messageData.subject}
                            onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                            required
                        />

                        <TextField
                            label="Message"
                            multiline
                            rows={6}
                            value={messageData.message}
                            onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                            required
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<AttachFile />}
                            >
                                Attach File
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Send />}
                                onClick={handleSendMessage}
                                sx={{ bgcolor: '#3b82f6', flex: 1 }}
                                disabled={!messageData.recipientType || !messageData.subject || !messageData.message}
                            >
                                Send Message
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Sent Messages */}
                <Paper sx={{ width: 350, p: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Sent Messages
                    </Typography>
                    <List>
                        {sentMessages.map((msg, index) => (
                            <React.Fragment key={msg.id}>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {msg.subject}
                                                </Typography>
                                                {msg.priority === 'high' || msg.priority === 'urgent' ? (
                                                    <Chip label={msg.priority} size="small" color="error" />
                                                ) : null}
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="caption" sx={{ display: 'block' }}>
                                                    To: {msg.to}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                                                    {msg.date}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < sentMessages.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Box>
    );
};

export default SendMessages;
