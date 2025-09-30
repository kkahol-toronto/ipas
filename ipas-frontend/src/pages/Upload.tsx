import React from 'react';
import { Box, Typography } from '@mui/material';
import DocumentUpload from '../components/Upload/DocumentUpload';

const Upload: React.FC = () => {
  const handleDocumentsUploaded = (documents: any[]) => {
    console.log('Documents uploaded:', documents);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Document Upload
      </Typography>
      
      <DocumentUpload onDocumentsUploaded={handleDocumentsUploaded} />
    </Box>
  );
};

export default Upload;
