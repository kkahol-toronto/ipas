import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  CameraAlt as CameraAltIcon,
  Chat as ChatIcon,
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCases } from '../../contexts/CaseContext';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const { cases, stats } = useCases();

  const menuItems = [
     {
      text: 'Case Queue',
      icon: <AssignmentIcon />,
      path: '/cases',
      permission: 'review_cases',
      badge: cases.filter(c => c.status === 'pending' || c.status === 'under_review').length
    },
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      permission: 'view_analytics'
    },
   
    {
      text: 'OCR',
      icon: <CameraAltIcon />,
      path: '/ocr',
      permission: 'ocr',
     // badge: cases.filter(c => c.status === 'pending' || c.status === 'under_review').length
    },
    {
      text: 'AI Chat',
      icon: <ChatIcon />,
      path: '/chat',
      permission: 'review_cases'
    },
    {
      text: 'Document Upload',
      icon: <UploadIcon />,
      path: '/upload',
      permission: 'submit_requests'
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics',
      permission: 'view_analytics'
    },
    {
      text: 'Audit Log',
      icon: <HistoryIcon />,
      path: '/audit',
      permission: 'view_analytics'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      permission: 'system_config'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          IPAS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prior Authorization System
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '& .MuiListItemIcon-root': {
                    color: '#1976d2',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#1976d2',
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.badge && item.badge > 0 && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total Cases: {stats.totalCases}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pending Review: {stats.pendingReview}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
