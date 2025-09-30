import React from 'react';
import { Box, Typography } from '@mui/material';
import CaseQueue from '../components/Cases/CaseQueue';
import { useCases } from '../contexts/CaseContext';

const Cases: React.FC = () => {
  const { cases, setSelectedCase } = useCases();

  const handleCaseSelect = (case_: any) => {
    setSelectedCase(case_);
    // Navigate to case details or open modal
    console.log('Selected case:', case_);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Case Queue
      </Typography>
      
      <CaseQueue cases={cases} onCaseSelect={handleCaseSelect} />
    </Box>
  );
};

export default Cases;
