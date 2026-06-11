import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    AdminPanelSettings as AdminIcon,
    School as TeacherIcon,
    Person as StudentIcon,
    Class as ClassIcon,
    LocalLibrary as LibraryIcon,
    LocalHospital as ClinicIcon,
    ExpandLess,
    ExpandMore,
    Logout as LogoutIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/userRelated/userHandle';

const drawerWidth = 280;

const classColors = [
    { name: 'Year 3 - Blue', color: '#2196F3', id: 'year3_blue' },
    { name: 'Year 3 - Crimson', color: '#DC143C', id: 'year3_crimson' },
    { name: 'Year 3 - Cyan', color: '#00BCD4', id: 'year3_cyan' },
    { name: 'Year 3 - Purple', color: '#9C27B0', id: 'year3_purple' },
    { name: 'Year 3 - Lavender', color: '#E6E6FA', id: 'year3_lavender' },
    { name: 'Year 3 - Maroon', color: '#800000', id: 'year3_maroon' },
    { name: 'Year 3 - Violet', color: '#8B00FF', id: 'year3_violet' },
    { name: 'Year 3 - Green', color: '#4CAF50', id: 'year3_green' },
    { name: 'Year 3 - Red', color: '#F44336', id: 'year3_red' },
    { name: 'Year 3 - Yellow', color: '#FDD835', id: 'year3_yellow' },
    { name: 'Year 3 - Magenta', color: '#E91E63', id: 'year3_magenta' },
    { name: 'Year 3 - Orange', color: '#FF9800', id: 'year3_orange' }
];

const MainLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [classesOpen, setClassesOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser, currentRole } = useSelector(state => state.user);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClassesClick = () => {
        setClassesOpen(!classesOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo/Header */}
            <Box sx={{ p: 2, bgcolor: '#1e40af', color: 'white', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    BIS NOC
                </Typography>
                <Typography variant="caption">
                    Gerji Campus
                </Typography>
            </Box>

            <Divider />

            {/* Navigation */}
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {/* Home */}
                <ListItem disablePadding>
                    <ListItemButton
                        selected={isActive('/dashboard')}
                        onClick={() => navigate('/dashboard')}
                    >
                        <ListItemIcon>
                            <HomeIcon color={isActive('/dashboard') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                {/* Section 1: Portals */}
                <ListItem>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        PORTALS
                    </Typography>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={isActive('/admin-dashboard')}
                        onClick={() => navigate('/admin-dashboard')}
                    >
                        <ListItemIcon>
                            <AdminIcon color={isActive('/admin-dashboard') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Admin Dashboard" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={isActive('/teachers-portal')}
                        onClick={() => navigate('/teachers-portal')}
                    >
                        <ListItemIcon>
                            <TeacherIcon color={isActive('/teachers-portal') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Teachers Portal" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={isActive('/students-portal')}
                        onClick={() => navigate('/students-portal')}
                    >
                        <ListItemIcon>
                            <StudentIcon color={isActive('/students-portal') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Students Portal" />
                    </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />

                {/* Section 2: Classes */}
                <ListItem>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        CLASSES
                    </Typography>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={handleClassesClick}>
                        <ListItemIcon>
                            <ClassIcon />
                        </ListItemIcon>
                        <ListItemText primary="All Classes" />
                        {classesOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>

                <Collapse in={classesOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {classColors.map((classItem) => (
                            <ListItemButton
                                key={classItem.id}
                                sx={{ pl: 4 }}
                                selected={isActive(`/class/${classItem.id}`)}
                                onClick={() => navigate(`/class/${classItem.id}`)}
                            >
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: classItem.color,
                                        mr: 2,
                                        border: '2px solid white',
                                        boxShadow: 1
                                    }}
                                />
                                <ListItemText 
                                    primary={classItem.name}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                <Divider sx={{ my: 1 }} />

                {/* Section 3: Services */}
                <ListItem>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        SERVICES
                    </Typography>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={isActive('/library')}
                        onClick={() => navigate('/library')}
                    >
                        <ListItemIcon>
                            <LibraryIcon color={isActive('/library') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Library" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={isActive('/clinic')}
                        onClick={() => navigate('/clinic')}
                    >
                        <ListItemIcon>
                            <ClinicIcon color={isActive('/clinic') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Clinic" />
                    </ListItemButton>
                </ListItem>
            </List>

            {/* User Info at Bottom */}
            <Divider />
            <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1e40af' }}>
                        {currentUser?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                            {currentUser?.name || 'User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {currentRole || 'Role'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: 'text.primary',
                    boxShadow: 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#1e40af', fontWeight: 600 }}>
                        British International School - NOC Campus
                    </Typography>
                    <IconButton onClick={handleProfileMenuOpen}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#1e40af' }}>
                            {currentUser?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                            <SettingsIcon sx={{ mr: 1 }} fontSize="small" />
                            Profile Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8,
                    bgcolor: '#f8fafc',
                    minHeight: '100vh'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
