import React, { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent } from '@mui/material';
import ApprovalStatusChart from '../components/Dashboard/ApprovalStatusChart';
import RecentCasesTable from '../components/Dashboard/RecentCasesTable';
import AnalyticsReports from '../components/Dashboard/AnalyticsReports';
import GeographicHeatMap from '../components/Dashboard/GeographicHeatMap';
import HospitalPerformance from '../components/Dashboard/HospitalPerformance';
import CaseDetailsEnhanced from '../components/Cases/CaseDetailsEnhanced';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(false);

  // Consistent data for today
  const todayData = {
    totalCases: 12,
    pendingReview: 0, // All cases have been processed
    autoApproved: 8,
    partiallyApproved: 3,
    denied: 1,
    patientsServiced: 1247
  };

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCaseDetailsOpen(true);
  };

  const handleCloseCaseDetails = () => {
    setCaseDetailsOpen(false);
    setSelectedCaseId(null);
  };

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
                {todayData.totalCases}
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
                {todayData.pendingReview}
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
                {todayData.autoApproved}
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
                {todayData.denied}
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
                {todayData.patientsServiced.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

        {/* Approval Status Chart */}
        <Box sx={{ mb: 4 }}>
          <ApprovalStatusChart todayData={todayData} />
        </Box>

      {/* Recent Cases Table */}
      <Box sx={{ mb: 4 }}>
        <RecentCasesTable onCaseClick={handleCaseClick} />
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

      {/* Case Details Dialog */}
      <Dialog
        open={caseDetailsOpen}
        onClose={handleCloseCaseDetails}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          Case Details
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedCaseId && (
            <ErrorBoundary>
              <CaseDetailsEnhanced caseId={selectedCaseId} />
            </ErrorBoundary>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
