import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Grid
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { DashboardStats as Stats } from '../../types';

interface DashboardStatsProps {
  stats: Stats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Cases',
      value: stats.totalCases,
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#1976d2',
      trend: '+12%'
    },
    {
      title: 'Pending Review',
      value: stats.pendingReview,
      icon: <PendingIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: '#ff9800',
      trend: '-5%'
    },
    {
      title: 'Auto Approved',
      value: stats.autoApproved,
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#4caf50',
      trend: '+8%'
    },
    {
      title: 'Human Reviewed',
      value: stats.humanReviewed,
      icon: <WarningIcon sx={{ fontSize: 40, color: '#f44336' }} />,
      color: '#f44336',
      trend: '+3%'
    },
    {
      title: 'Avg Processing Time',
      value: `${stats.averageProcessingTime}h`,
      icon: <ScheduleIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: '#9c27b0',
      trend: '-15%'
    },
    {
      title: 'Approval Rate',
      value: `${(stats.approvalRate * 100).toFixed(1)}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#00bcd4' }} />,
      color: '#00bcd4',
      trend: '+2%'
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {card.icon}
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip
                  label={card.trend}
                  size="small"
                  color={card.trend.startsWith('+') ? 'success' : 'error'}
                  sx={{ fontSize: '0.75rem' }}
                />
                {index === 4 && (
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{ width: 60, height: 4, borderRadius: 2 }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;
