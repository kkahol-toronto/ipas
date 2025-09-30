import React from 'react';
import { Grid, Box, Typography, Card, CardContent } from '@mui/material';
import ApprovalStatusChart from '../components/Dashboard/ApprovalStatusChart';
import RecentCasesTable from '../components/Dashboard/RecentCasesTable';
import AnalyticsReports from '../components/Dashboard/AnalyticsReports';
import GeographicHeatMap from '../components/Dashboard/GeographicHeatMap';
import HospitalPerformance from '../components/Dashboard/HospitalPerformance';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        IPAS Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to the Intelligent Prior Authorization System
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Total Cases
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                25
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#fff3cd' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#856404' }} gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#d4edda' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#155724' }} gutterBottom>
                Auto Approved
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                13
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#f8d7da' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#721c24' }} gutterBottom>
                Denied
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', backgroundColor: '#e8f5e8' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#2e7d32' }} gutterBottom>
                Patients Serviced
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                1,247
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Status Chart */}
      <Box sx={{ mb: 4 }}>
        <ApprovalStatusChart />
      </Box>

      {/* Recent Cases Table */}
      <Box sx={{ mb: 4 }}>
        <RecentCasesTable />
      </Box>

      {/* Geographic Heat Map */}
      <Box sx={{ mb: 4 }}>
        <GeographicHeatMap />
      </Box>

      {/* Hospital Performance */}
      <Box sx={{ mb: 4 }}>
        <HospitalPerformance />
      </Box>

      {/* Analytics & Reports */}
      <AnalyticsReports />
    </Box>
  );
};

export default Dashboard;
