import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { PriorAuthRequest } from '../../types';

interface RecentCasesProps {
  cases: PriorAuthRequest[];
}

const RecentCases: React.FC<RecentCasesProps> = ({ cases }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'denied': return 'error';
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const recentCases = cases.slice(0, 5);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Recent Cases
          </Typography>
        </Box>
        
        <List>
          {recentCases.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No recent cases"
                secondary="Cases will appear here as they are processed"
              />
            </ListItem>
          ) : (
            recentCases.map((case_, index) => (
              <React.Fragment key={case_.id}>
                <ListItem alignItems="flex-start">
                  <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                    <PersonIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {case_.caseId}
                        </Typography>
                        <Chip
                          label={case_.priority}
                          size="small"
                          color={getPriorityColor(case_.priority)}
                        />
                        <Chip
                          label={case_.status}
                          size="small"
                          color={getStatusColor(case_.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {case_.patient.name} • {case_.requestedService.serviceType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dr. {case_.provider.name} • {case_.requestedService.diagnosisCode}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Submitted: {formatDate(case_.submittedDate)}
                          </Typography>
                        </Box>
                        {case_.humanReviewRequired && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <WarningIcon sx={{ fontSize: 16, mr: 0.5, color: '#ff9800' }} />
                            <Typography variant="caption" color="warning.main">
                              Human review required
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        Due: {formatDate(case_.dueDate)}
                      </Typography>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < recentCases.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentCases;
