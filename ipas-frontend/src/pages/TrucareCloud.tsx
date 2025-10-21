import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

const TrucareCloud: React.FC = () => {
  return (
    <Box>
      <Box className="authSummaryWrapper">
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="h4" sx={{ margin: '0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#000000', fontWeight: 600 }}>
            <DashboardIcon sx={{ mr: 1 }} />  Authorization Summary
          </Typography>
        </Box>
        <Box>

        </Box>
      </Box>

    </Box>
  );
};

export default TrucareCloud;
