import React, { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, Alert, IconButton, Button } from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon, Description as DescriptionIcon } from '@mui/icons-material';
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
  const [showLetterNotification, setShowLetterNotification] = useState(false);

  // Check if letter was generated for PA-2024-001
  React.useEffect(() => {
    const checkLetterGeneration = () => {
      const letterKey = 'ipas_letter_generated_PA-2024-001';
      const dismissedKey = 'ipas_letter_notification_dismissed_PA-2024-001';
      
      const letterGenerated = localStorage.getItem(letterKey);
      const notificationDismissed = localStorage.getItem(dismissedKey);
      
      // Show notification if letter was generated and notification hasn't been dismissed
      if (letterGenerated && !notificationDismissed) {
        setShowLetterNotification(true);
      }
    };

    checkLetterGeneration();
    
    // Poll for changes every 2 seconds to detect when letter is generated
    const interval = setInterval(checkLetterGeneration, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Consistent data for today
  const todayData = {
    totalCases: 12,
    pendingReview: 2,
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
        Smart Auth Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome to Smart Auth - Intelligent Prior Authorization System
      </Typography>

      {/* Letter Generation Notification */}
      {showLetterNotification && (
        <Alert 
          severity="success" 
          icon={<DescriptionIcon />}
          sx={{ 
            mb: 3,
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            '& .MuiAlert-icon': {
              color: '#155724'
            }
          }}
          action={
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/sample-documents/approval-letters/PA-2024-001-approval-letter.pdf';
                  link.download = 'PA-2024-001-approval-letter.pdf';
                  link.click();
                }}
              >
                Download
              </Button>
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setShowLetterNotification(false);
                  localStorage.setItem('ipas_letter_notification_dismissed_PA-2024-001', 'true');
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Box>
          }
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#155724' }}>
            📄 Approval Letter Generated
          </Typography>
          <Typography variant="body2" sx={{ color: '#155724' }}>
            Approval letter for Case <strong>PA-2024-001 (John Smith)</strong> has been generated and is ready for download
          </Typography>
        </Alert>
      )}

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
