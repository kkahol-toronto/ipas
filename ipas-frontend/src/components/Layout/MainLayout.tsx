import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import SidebarMenu from './SidebarMenu';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      {/* <Sidebar open={sidebarOpen} onClose={handleSidebarClose} /> */}
      <SidebarMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // width: { sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
          // ml: { sm: `${isMobile ? 0 : 240}px` },
          marginLeft: '60px',
          width: "100%",
          mt: 8, // Account for AppBar height
          backgroundColor: 'white', // Force white background
          // minHeight: '100vh',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
