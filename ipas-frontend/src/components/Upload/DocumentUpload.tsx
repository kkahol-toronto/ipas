import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { Document } from '../../types';

interface DocumentUploadProps {
  onDocumentsUploaded: (documents: Document[]) => void;
  caseId?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentsUploaded, caseId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);
    setUploadProgress(0);

    // Simulate file upload and parsing
    const uploadPromises = acceptedFiles.map(async (file, index) => {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(progress);
      }

      // Simulate document parsing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const document: Document = {
        id: `doc_${Date.now()}_${index}`,
        name: file.name,
        type: getDocumentType(file.name),
        url: URL.createObjectURL(file),
        uploadedDate: new Date().toISOString(),
        parsedContent: generateMockParsedContent(file.name),
        extractedData: generateMockExtractedData(file.name)
      };

      return document;
    });

    Promise.all(uploadPromises)
      .then((documents) => {
        setUploadedFiles(prev => [...prev, ...documents]);
        onDocumentsUploaded(documents);
        setUploading(false);
        setUploadProgress(0);
      })
      .catch((err) => {
        setError('Failed to upload files. Please try again.');
        setUploading(false);
        setUploadProgress(0);
      });
  }, [onDocumentsUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    disabled: uploading
  });

  const getDocumentType = (filename: string): Document['type'] => {
    const lowerName = filename.toLowerCase();
    if (lowerName.includes('auth') || lowerName.includes('request')) return 'prior_auth_form';
    if (lowerName.includes('note') || lowerName.includes('clinical')) return 'clinical_note';
    if (lowerName.includes('lab') || lowerName.includes('result')) return 'lab_result';
    if (lowerName.includes('imaging') || lowerName.includes('xray') || lowerName.includes('mri')) return 'imaging';
    if (lowerName.includes('discharge')) return 'discharge_summary';
    return 'clinical_note';
  };

  const generateMockParsedContent = (filename: string): string => {
    return `Parsed content from ${filename}:\n\nPatient: John Smith\nDOB: 03/15/1965\nDiagnosis: Pneumonia (J18.9)\nProvider: Dr. Sarah Wilson\nRequested Service: Inpatient hospitalization for 3 days\nClinical Notes: Patient presents with severe respiratory symptoms, oxygen saturation 85%, requires IV antibiotics and monitoring.`;
  };

  const generateMockExtractedData = (filename: string): Record<string, any> => {
    return {
      patientName: 'John Smith',
      patientDOB: '03/15/1965',
      diagnosisCode: 'J18.9',
      procedureCode: '99223',
      providerName: 'Dr. Sarah Wilson',
      requestedService: 'Inpatient hospitalization',
      requestedLength: 3,
      clinicalNotes: 'Patient presents with severe respiratory symptoms, oxygen saturation 85%, requires IV antibiotics and monitoring.'
    };
  };

  const handleDeleteDocument = (documentId: string) => {
    setUploadedFiles(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleViewDocument = (document: Document) => {
    window.open(document.url, '_blank');
  };

  const getDocumentTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'prior_auth_form': return 'primary';
      case 'clinical_note': return 'secondary';
      case 'lab_result': return 'success';
      case 'imaging': return 'info';
      case 'discharge_summary': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Document Upload & Processing
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              cursor: uploading ? 'not-allowed' : 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <input {...getInputProps()} />
            <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to select files
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supports PDF, DOC, DOCX, JPG, PNG files
            </Typography>
            
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Uploading and processing... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Upload Guidelines
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Prior Authorization Forms"
                    secondary="Upload the completed PA request form"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Clinical Notes"
                    secondary="Include physician notes and assessments"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Lab Results"
                    secondary="Recent laboratory test results"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Imaging Studies"
                    secondary="X-rays, CT scans, MRI reports"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Discharge Summaries"
                    secondary="Previous hospitalization records"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Uploaded Documents ({uploadedFiles.length})
          </Typography>
          <List>
            {uploadedFiles.map((document) => (
              <ListItem key={document.id} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{document.name}</Typography>
                      <Chip
                        label={document.type.replace('_', ' ')}
                        size="small"
                        color={getDocumentTypeColor(document.type)}
                      />
                      <CheckIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Uploaded: {new Date(document.uploadedDate).toLocaleString()}
                      </Typography>
                      {document.extractedData && (
                        <Typography variant="caption" color="text.secondary">
                          Data extracted: Patient, Diagnosis, Provider info
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDocument(document)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default DocumentUpload;
