import { useNavigate } from 'react-router-dom';
import { 
    Box, Container, Grid, Card, CardContent, Typography, IconButton
} from '@mui/material';
import { 
    AdminPanelSettings, Person, LocalLibrary, LocalHospital, ArrowBack, School
} from '@mui/icons-material';

const PortalSelection = () => {
    const navigate = useNavigate();

    const portals = [
        {
            title: 'Admin Portal',
            description: 'Manage school operations, students, teachers, and more',
            icon: AdminPanelSettings,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            path: '/admin-login'
        },
        {
            title: 'Teacher Portal',
            description: 'Access your classes, students, and teaching resources',
            icon: Person,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            path: '/teacher-login'
        },
        {
            title: 'Library',
            description: 'Browse books, resources, and manage borrowing',
            icon: LocalLibrary,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            path: '/dashboard/library'
        },
        {
            title: 'Clinic',
            description: 'Access health records and medical services',
            icon: LocalHospital,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            path: '/dashboard/clinic'
        }
    ];

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                backgroundImage: 'radial-gradient(circle at 2px 2px, #000 2px, transparent 0)',
                backgroundSize: '50px 50px'
            }} />

            {/* Header */}
            <Box sx={{ 
                position: 'relative', 
                zIndex: 1,
                pt: 4,
                pb: 2
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton 
                            onClick={() => navigate('/')}
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.9)',
                                '&:hover': { bgcolor: '#fff' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '10px',
                                background: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#fff'
                            }}>
                                B
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                                BIS NOC
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
                {/* Title Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <School sx={{ fontSize: 80, color: '#000', mb: 2, opacity: 0.8 }} />
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            color: '#000',
                            mb: 2,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Choose Your Portal
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#666',
                            fontWeight: 400,
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Select the portal you want to access to get started
                    </Typography>
                </Box>

                {/* Portal Cards Grid */}
                <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
                    {portals.map((portal, index) => {
                        const IconComponent = portal.icon;
                        return (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card 
                                    onClick={() => navigate(portal.path)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            transform: 'translateY(-12px) scale(1.02)',
                                            boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                                        }
                                    }}
                                >
                                    {/* Gradient Header */}
                                    <Box sx={{
                                        height: 200,
                                        background: portal.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Decorative circles */}
                                        <Box sx={{
                                            position: 'absolute',
                                            width: 150,
                                            height: 150,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            top: -50,
                                            right: -50
                                        }} />
                                        <Box sx={{
                                            position: 'absolute',
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.1)',
                                            bottom: -30,
                                            left: -30
                                        }} />
                                        
                                        <IconComponent sx={{ 
                                            fontSize: 100, 
                                            color: '#fff', 
                                            opacity: 0.95,
                                            position: 'relative',
                                            zIndex: 1
                                        }} />
                                    </Box>
                                    
                                    {/* Content */}
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                mb: 2,
                                                color: '#1a1a1a'
                                            }}
                                        >
                                            {portal.title}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: '#666',
                                                lineHeight: 1.7,
                                                fontSize: '1.05rem'
                                            }}
                                        >
                                            {portal.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Footer Note */}
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                        Need help? Contact the school administrator
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default PortalSelection;
