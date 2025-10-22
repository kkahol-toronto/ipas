import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Fab, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RecentCasesTable from '../components/Dashboard/RecentCasesTable';
import ErrorBoundary from '../components/ErrorBoundary';
import CaseDetailsEnhanced from '../components/Cases/CaseDetailsEnhanced';
import AddIcon from '@mui/icons-material/Add';
import RocketLaunchSharpIcon from '@mui/icons-material/RocketLaunchSharp';

const TrucareCloud: React.FC = () => {

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(false);

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCaseDetailsOpen(true);
  };

  const handleCloseCaseDetails = () => {
    setCaseDetailsOpen(false);
    setSelectedCaseId(null);
  };

  return (
    <Box>
      <Box className="rocketLaunch"><RocketLaunchSharpIcon /></Box>
      <Box className="actionBtn"><AddIcon /> Actions</Box>
      <Box className="authSummaryWrapper">
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="h4" sx={{ margin: '0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#000000', fontWeight: 600 }}>
            <DashboardIcon sx={{ mr: 1 }} />  Authorization Summary
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <Fab color="primary" className="fabWhiteBtn" aria-label="add" size="medium">
              <ExpandMoreIcon />
            </Fab>
          </Box>
          <Box className="authSummaryRight">
            <Box className="authSummaryBox">
              <Box className="authSummaryTitle">PAUL HAMILTON</Box>
              <Box className="authSummaryDetails">67yrs 0mo (10/04/1958)</Box>
            </Box>
            <Box className="authSummaryBox">
              <Box className="authSummaryTitle">Eligibility</Box>
              <Box className="authSummaryDetails">Single Enrollment</Box>
            </Box>
            <Box className="authSummaryBox">
              <Box className="authSummaryTitle">Medicare</Box>
              <Box className="authSummaryDetails">Active 4GR1QQ4HU07</Box>
            </Box>
            <Box className="authSummaryBox">
              <Box className="authSummaryTitle">302-593-5060</Box>
              <Box className="authSummaryDetails">Phone</Box>
            </Box>
            <Box className="authSummaryBox">
              <Button variant="contained" size='small' color="secondary" startIcon={<VisibilityIcon />}>
                1 Notices
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '1600px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <Box sx={{ mr: 'auto' }}>
            <Typography variant="h4" sx={{ margin: '0', fontSize: '24px', display: 'flex', alignItems: 'center', color: '#000000', fontWeight: 600 }}>
              Authorizations
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ margin: '0 1.5rem 0 0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#00777a', fontWeight: 600, textTransform: 'uppercase' }}>
                View member documents
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ margin: '0 1.5rem 0 0', fontSize: '18px', display: 'flex', alignItems: 'center', color: '#00777a', fontWeight: 600, textTransform: 'uppercase' }}>
                View member correspondence
              </Typography>
            </Box>
            <Box>
              <Button variant="contained" className='truGreenBtn' sx={{textTransform: 'uppercase', fontSize: '15px', fontWeight: '600'}} color="secondary" startIcon={<AddIcon />}>
                create new
              </Button>
            </Box>
          </Box>
        </Box>
        <Box>
          <RecentCasesTable onCaseClick={handleCaseClick} />
        </Box>
      </Box>
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

export default TrucareCloud;
