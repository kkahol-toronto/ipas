import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    Box,
    Chip,
    Button
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    AccountCircle,
    Settings,
    Logout
} from '@mui/icons-material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import CallToActionOutlinedIcon from '@mui/icons-material/CallToActionOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { useCases } from '../../contexts/CaseContext';

const ZyterHeaderMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const { notifications } = useCases();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchor(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchor(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#fff', zIndex: 1200, borderBottom: '5px solid #00ac2b' }}>
            <Toolbar>
                {/* <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, fontWeight: 'bold' }}>
          <img src="/assets/images/zyter-trucare-logo.png" alt="zyter-trucare-logo" style={{marginRight: '1rem', height:"38px"}} />Smart Auth - Intelligent Prior Authorization System
        </Typography> */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img src="/assets/images/zyter-trucare-logo.png" alt="zyter-trucare-logo" style={{marginRight: '2rem', height:"38px"}} />
                    <Button variant="contained" color="success" size="small" sx={{ background: '#00ac2b'}}>Production</Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    <ul className='headerMenuLists'>
                        <li><a href=""><SpaceDashboardIcon />Dashboard</a></li>
                        <li><a href=""><PeopleOutlineIcon />Members</a></li>
                        <li><a href=""><AssignmentIcon />Tasks</a></li>
                        <li><a href=""><LocalHospitalOutlinedIcon />Providers</a></li>
                        <li><a href=""><VerifiedIcon />Authorizations</a></li>
                        <li><a href=""><CallToActionOutlinedIcon />Scheduler</a></li>
                    </ul>



                    {user && (
                        <Chip
                            label={`${user.name} (${user.role})`}
                            color="secondary"
                            size="small"
                            sx={{ color: 'white' }}
                        />
                    )}

                    <IconButton
                        size="large"
                        aria-label="notifications"
                        color="info"
                        onClick={handleNotificationClick}
                    >
                        <Badge badgeContent={unreadNotifications} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>
                            <AccountCircle sx={{ mr: 1 }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Settings sx={{ mr: 1 }} />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <Logout sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>

                    <Menu
                        anchorEl={notificationAnchor}
                        open={Boolean(notificationAnchor)}
                        onClose={handleNotificationClose}
                        PaperProps={{
                            style: {
                                maxHeight: 300,
                                width: 350,
                            },
                        }}
                    >
                        {notifications.length === 0 ? (
                            <MenuItem disabled>No notifications</MenuItem>
                        ) : (
                            notifications.slice(0, 5).map((notification) => (
                                <MenuItem key={notification.id} onClick={handleNotificationClose}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                                            {notification.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(notification.timestamp).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default ZyterHeaderMenu;
