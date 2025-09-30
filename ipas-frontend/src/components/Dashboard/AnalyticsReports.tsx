import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const AnalyticsReports: React.FC = () => {
  // Dummy analytics data
  const performanceMetrics = [
    {
      title: 'Average Processing Time',
      value: '2.3 hours',
      change: '+15%',
      trend: 'up',
      color: '#4caf50'
    },
    {
      title: 'Auto-Approval Rate',
      value: '68%',
      change: '+5%',
      trend: 'up',
      color: '#2196f3'
    },
    {
      title: 'Denial Rate',
      value: '4.2%',
      change: '-2%',
      trend: 'down',
      color: '#4caf50'
    },
    {
      title: 'Cost Savings',
      value: '$45,230',
      change: '+12%',
      trend: 'up',
      color: '#ff9800'
    }
  ];

  const topProviders = [
    { name: 'Dr. Sarah Johnson', cases: 45, approvalRate: '94%', avgTime: '1.8h' },
    { name: 'Dr. Michael Chen', cases: 38, approvalRate: '89%', avgTime: '2.1h' },
    { name: 'Dr. Emily Rodriguez', cases: 32, approvalRate: '91%', avgTime: '2.4h' },
    { name: 'Dr. James Thompson', cases: 28, approvalRate: '86%', avgTime: '2.7h' }
  ];

  const procedureStats = [
    { procedure: 'MRI Brain with Contrast', count: 15, avgCost: '$2,500', approvalRate: '93%' },
    { procedure: 'Cardiac Catheterization', count: 12, avgCost: '$15,000', approvalRate: '88%' },
    { procedure: 'Knee Arthroscopy', count: 18, avgCost: '$8,000', approvalRate: '91%' },
    { procedure: 'Colonoscopy', count: 25, avgCost: '$1,200', approvalRate: '96%' }
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Analytics & Reports
      </Typography>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {performanceMetrics.map((metric, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ color: metric.color, mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {metric.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {metric.trend === 'up' ? (
                    <TrendingUpIcon sx={{ color: '#4caf50', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#f44336', mr: 0.5 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: metric.trend === 'up' ? '#4caf50' : '#f44336',
                      fontWeight: 'bold'
                    }}
                  >
                    {metric.change}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    vs last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Top Providers */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Top Performing Providers
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell align="right">Cases</TableCell>
                      <TableCell align="right">Approval Rate</TableCell>
                      <TableCell align="right">Avg Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProviders.map((provider, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {provider.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{provider.cases}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={provider.approvalRate}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {provider.avgTime}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Procedure Statistics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Procedure Statistics
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Procedure</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Avg Cost</TableCell>
                      <TableCell align="right">Approval Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {procedureStats.map((procedure, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 150 }}>
                            {procedure.procedure}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{procedure.count}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {procedure.avgCost}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={procedure.approvalRate}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Processing Time Trends */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            Processing Time Trends
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  This Week
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2">2.1 hours avg</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last Week
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={68}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2">2.4 hours avg</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  This Month
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="body2">2.3 hours avg</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalyticsReports;
