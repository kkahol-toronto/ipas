import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import {
  Description as DocumentIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface ClinicalCriteriaEvaluation {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  category: 'Medical-Record-Retrival';
  size: string;
  uploadDate: string;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  url: string;
  originalUrl?: string;
  extractedUrl?: string;
  recordretrivedUrl?: string;
  jsonUrl?: string;
  isExtracted?: boolean;
}

interface ClinicalCriteriaEvaluationsProps {
  caseId: string;
}

const ClinicalCriteriaEvaluations: React.FC<ClinicalCriteriaEvaluationsProps> = ({ caseId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputId, setInputId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<ClinicalCriteriaEvaluation | null>(null);
  const [error, setError] = useState('');

  const ClinicalCriteriaEvaluationMap: Record<string, ClinicalCriteriaEvaluation[]> = {
    "PA-2024-001": [
      {
        "id": "1",
        "name": "Medical Record Retrieval",
        "type": "pdf",
        "category": "Medical-Record-Retrival",
        "size": "1.6 MB",
        "uploadDate": "2024-12-15",
        "status": "ready",
        "recordretrivedUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "url": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "originalUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "extractedUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "jsonUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "isExtracted": false
      }
    ],
    "PA-2024-002": [
      {
        "id": "1",
        "name": "Medical Record Retrieval",
        "type": "pdf",
        "category": "Medical-Record-Retrival",
        "size": "1.8 MB",
        "uploadDate": "2024-01-16",
        "status": "ready",
        "recordretrivedUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "url": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "originalUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "extractedUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "jsonUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "isExtracted": false
      }
    ],
    "PA-2024-003": [
      {
        "id": "1",
        "name": "Medical Record Retrieval",
        "type": "pdf",
        "category": "Medical-Record-Retrival",
        "size": "1.7 MB",
        "uploadDate": "2024-01-17",
        "status": "ready",
        "url": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "originalUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "extractedUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "recordretrivedUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "jsonUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "isExtracted": false
      }
    ],
    "PA-2024-006": [
      {
        "id": "1",
        "name": "Medical Record Retrieval",
        "type": "pdf",
        "category": "Medical-Record-Retrival",
        "size": "1.6 MB",
        "uploadDate": "2024-12-15",
        "status": "ready",
        "url": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "originalUrl": "/sample-documents/clinicalcriteriaeval/LCD - Positive Airway Pressure (PAP) Devices for the Treatment of Obstructive Sleep Apnea (L33718).pdf",
        "extractedUrl": '/sample-documents/cases/case-006-rebecca-hardin/prior-auth-form-original.pdf',
        "jsonUrl": '/sample-documents/cases/case-006-rebecca-hardin/PAP-policy.json',
        "recordretrivedUrl": "sample-documents/medicalrecordretrival/Rebecca_Hardin.xml",
        "isExtracted": false
      }
    ]
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setError('');
    setInputId('');
    setStartDate('');
    setEndDate('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setError('');
    setInputId('');
    setStartDate('');
    setEndDate('');
  };

  const handleSearch = () => {
    const trimmedId = inputId.trim();
    
    if (!trimmedId) {
      setError('Please enter a Member ID');
      return;
    }

    const documents = ClinicalCriteriaEvaluationMap[trimmedId];
    
    if (!documents || documents.length === 0) {
      setError(`Member ID "${trimmedId}" not found`);
      return;
    }

    setSelectedDocument(documents[0]);
    setError('');
    handleCloseDialog();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'processing':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Search Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          startIcon={<DocumentIcon />}
        >
          Search Medical Data with Member ID
        </Button>
      </Box>

      {/* Search Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Member ID</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Member ID"
            type="text"
            fullWidth
            variant="outlined"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., PA-2024-001"
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogContent>
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogContent>
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSearch} variant="contained" color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Display */}
      {selectedDocument ? (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DocumentIcon color="primary" />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                Medical Record Retrieval
              </Typography>
              <Chip 
                label="1 document" 
                size="small" 
                color="primary" 
                sx={{ ml: 2 }}
              />
            </Box>

            <List>
              <ListItem
                sx={{
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1
                  }
                }}
              >
                
                
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {selectedDocument.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Size: {selectedDocument.size} • Uploaded: {selectedDocument.uploadDate}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={selectedDocument.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(selectedDocument.status)}
                        />
                      </Box>
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleView(selectedDocument.recordretrivedUrl || selectedDocument.url)}
                      title="View Document"
                    >
                      <ViewIcon />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleDownload(selectedDocument.recordretrivedUrl || selectedDocument.url, selectedDocument.name)}
                      title="Download Document"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                color: 'text.secondary'
              }}
            >
              <DocumentIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6"></Typography>
              <Typography variant="body2">
                Click the search button above to retrieve medical data
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ClinicalCriteriaEvaluations;