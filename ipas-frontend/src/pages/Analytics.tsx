import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useCases } from '../contexts/CaseContext';
import DashboardStats from '../components/Dashboard/DashboardStats';
import DashboardCharts from '../components/Dashboard/DashboardCharts';

const Analytics: React.FC = () => {
  const { stats } = useCases();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Analytics & Reporting
      </Typography>
      
      <DashboardStats stats={stats} />
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={12}>
          <DashboardCharts stats={stats} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Performance Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed performance analysis and key performance indicators for the IPAS system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Compliance Reports
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Regulatory compliance reports and audit trail summaries.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
