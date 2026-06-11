import { Box, Typography, Paper, Grid, Card, CardContent, CardActionArea, Button } from '@mui/material';
import { Folder, PictureAsPdf, Description, Image, VideoLibrary, Add } from '@mui/icons-material';

const TeacherResourceRepo = () => {
    const resources = [
        { id: 1, name: 'Math Worksheets', type: 'pdf', icon: <PictureAsPdf />, count: 12 },
        { id: 2, name: 'Science Videos', type: 'video', icon: <VideoLibrary />, count: 8 },
        { id: 3, name: 'English Materials', type: 'doc', icon: <Description />, count: 15 },
        { id: 4, name: 'Images & Charts', type: 'image', icon: <Image />, count: 24 },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: '#1f2937' }}>
                        Resource Repository
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280' }}>
                        Access and manage your teaching resources
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                        bgcolor: '#059669',
                        '&:hover': { bgcolor: '#047857' }
                    }}
                >
                    Upload Resource
                </Button>
            </Box>

            <Grid container spacing={3}>
                {resources.map((resource) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
                        <Card>
                            <CardActionArea>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ 
                                        fontSize: 48, 
                                        color: '#059669', 
                                        mb: 2,
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        {resource.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                        {resource.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                        {resource.count} files
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TeacherResourceRepo;
