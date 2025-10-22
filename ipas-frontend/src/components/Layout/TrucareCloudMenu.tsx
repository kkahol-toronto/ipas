import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';
import SearchIcon from '@mui/icons-material/Search';

const TrucareCloudMenu: React.FC = () => {
    return (
        <Box className="truCareCloudHeader">
            <Grid container spacing={3} sx={{ width: '100%', alignItems: 'center', }}>
                <Grid size="grow">
                    <Typography variant="h4" sx={{ margin: '0', fontSize: '16px', display: 'flex', alignItems: 'center', color: '#fff' }}>
                        <RecentActorsIcon sx={{ mr: 1 }} />  TruCare Cloud
                    </Typography>

                </Grid>
                <Grid size={5}>
                    <Box className="truSearchBox">
                        <select aria-label="Small select example">
                            <option selected>Member</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                        <SearchIcon />
                        <input type="text" value="" placeholder='Member or Authorization' />
                    </Box>
                </Grid>
                <Grid size="grow">
                    <Box className="iconListsHeader">
                        <NotificationsIcon />
                        <BookmarkIcon />
                        <RefreshIcon />
                        <SettingsIcon />
                        <AppsIcon />
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default TrucareCloudMenu;
