import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import SidebarMenu from './SidebarMenu';
import ZyterHeaderMenu from './ZyterHeaderMenu'
import { useLocation } from 'react-router-dom';
import TrucareCloudMenu from './TrucareCloudMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {location.pathname === '/Tasks' && <ZyterHeaderMenu />}
      {location.pathname === '/TrucareCloud' && <TrucareCloudMenu />}
      {!(location.pathname === '/Tasks' || location.pathname === '/TrucareCloud') && <Header /> }
      
      {/* <Sidebar open={sidebarOpen} onClose={handleSidebarClose} /> */}
      <SidebarMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // p: 3,
          // width: { sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
          // ml: { sm: `${isMobile ? 0 : 240}px` },
          marginLeft: '60px',
          width: "100%",
          mt: location.pathname === '/Tasks' ? 9 : 8, // Account for AppBar height
          backgroundColor: location.pathname === '/Tasks' ? '#f6f8fa' : '#fff', // Force white background
          // minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          minHeight: 'calc(100vh - 72px);'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
