import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CaseQueue from '../components/Cases/CaseQueue';
import CaseDetailsEnhanced from '../components/Cases/CaseDetailsEnhanced';
import { useCases } from '../contexts/CaseContext';

const Cases: React.FC = () => {
  const { cases, setSelectedCase } = useCases();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(false);

  const handleCaseSelect = (case_: any) => {
    setSelectedCase(case_);
    setSelectedCaseId(case_.id);
    setCaseDetailsOpen(true);
    console.log('Selected case:', case_);
  };

  const handleCloseCaseDetails = () => {
    setCaseDetailsOpen(false);
    setSelectedCaseId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Case Queue
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* Handle new case */}}
        >
          New Case
        </Button>
      </Box>
      
      <CaseQueue cases={cases} onCaseSelect={handleCaseSelect} />
      
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
            <CaseDetailsEnhanced caseId={selectedCaseId} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Cases;
