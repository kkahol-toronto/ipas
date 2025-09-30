import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Description as DocumentIcon,
  Psychology as PsychologyIcon,
  Psychology as AIIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import SimpleDraggableFlowchart from './SimpleDraggableFlowchart';
import CaseDocuments from './CaseDocuments';

interface CaseDetailsEnhancedProps {
  caseId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CaseDetailsEnhanced: React.FC<CaseDetailsEnhancedProps> = ({ caseId }) => {
  const [tabValue, setTabValue] = useState(0);

  // Mock case data
  const caseData = {
    id: caseId,
    patientName: 'John Smith',
    patientId: 'P-2024-001',
    dateOfBirth: '1985-03-15',
    provider: 'Dr. Sarah Johnson',
    providerId: 'PR-001',
    hospital: 'UCLA Medical Center',
    procedure: 'MRI Brain with Contrast',
    diagnosis: 'Suspected Brain Tumor',
    status: 'In Review',
    priority: 'High',
    submittedDate: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-15T14:45:00Z',
    insurance: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    estimatedCost: 2500,
    documents: [
      { id: 'doc1', name: 'Prior Auth Request Form.pdf', type: 'PDF', size: '2.3 MB', status: 'Processed' },
      { id: 'doc2', name: 'MRI Scan - Brain.jpg', type: 'Image', size: '4.1 MB', status: 'Analyzed' },
      { id: 'doc3', name: 'Patient Medical Records.pdf', type: 'PDF', size: '1.8 MB', status: 'Processed' },
      { id: 'doc4', name: 'Insurance Card.png', type: 'Image', size: '0.9 MB', status: 'Processed' }
    ],
    clinicalNotes: [
      { timestamp: '2024-01-15T10:30:00Z', note: 'Patient presents with persistent headaches and visual disturbances', author: 'Dr. Sarah Johnson' },
      { timestamp: '2024-01-15T11:15:00Z', note: 'MRI recommended to rule out brain tumor', author: 'Dr. Sarah Johnson' },
      { timestamp: '2024-01-15T12:00:00Z', note: 'Prior authorization submitted to insurance', author: 'Nurse Mary Wilson' }
    ],
    aiAnalysis: {
      clinicalNecessity: 0.94,
      coverageEligibility: 0.87,
      riskAssessment: 'Medium',
      recommendedAction: 'Approve with monitoring',
      confidence: 0.91
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'success';
      case 'denied': return 'error';
      case 'in review': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Case Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Case #{caseData.id}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {caseData.procedure} - {caseData.patientName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label={caseData.status}
                  color={getStatusColor(caseData.status) as any}
                  size="small"
                />
                <Chip
                  label={caseData.priority}
                  color={getPriorityColor(caseData.priority) as any}
                  size="small"
                />
                <Chip
                  label={`$${caseData.estimatedCost.toLocaleString()}`}
                  color="info"
                  size="small"
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Download Case">
                <IconButton>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Case">
                <IconButton>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share Case">
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Name:</strong> {caseData.patientName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">
                  <strong>Patient ID:</strong> {caseData.patientId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">
                  <strong>Date of Birth:</strong> {new Date(caseData.dateOfBirth).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">
                  <strong>Insurance:</strong> {caseData.insurance} ({caseData.policyNumber})
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Provider Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HospitalIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Provider:</strong> {caseData.provider}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">
                  <strong>Provider ID:</strong> {caseData.providerId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2">
                  <strong>Hospital:</strong> {caseData.hospital}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">
                  <strong>Diagnosis:</strong> {caseData.diagnosis}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="case details tabs">
            <Tab label="Orchestration" icon={<AIIcon />} />
            <Tab label="Documents" icon={<DocumentIcon />} />
            <Tab label="Clinical Notes" icon={<TimelineIcon />} />
            <Tab label="AI Analysis" icon={<PsychologyIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <SimpleDraggableFlowchart caseId={caseId} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CaseDocuments caseId={caseId} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Clinical Timeline
          </Typography>
          {caseData.clinicalNotes.map((note, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  {new Date(note.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {note.author}
                </Typography>
              </Box>
              <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2">
                  {note.note}
                </Typography>
              </Paper>
              {index < caseData.clinicalNotes.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            AI Analysis Results
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Clinical Assessment
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Clinical Necessity Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          backgroundColor: '#e0e0e0',
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${caseData.aiAnalysis.clinicalNecessity * 100}%`,
                            height: '100%',
                            backgroundColor: '#4caf50'
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {(caseData.aiAnalysis.clinicalNecessity * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Coverage Eligibility
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <Box
                        sx={{
                          width: '100%',
                          height: 8,
                          backgroundColor: '#e0e0e0',
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${caseData.aiAnalysis.coverageEligibility * 100}%`,
                            height: '100%',
                            backgroundColor: '#2196f3'
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {(caseData.aiAnalysis.coverageEligibility * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Risk Assessment
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Risk Level
                  </Typography>
                  <Chip
                    label={caseData.aiAnalysis.riskAssessment}
                    color={caseData.aiAnalysis.riskAssessment === 'Low' ? 'success' : 
                           caseData.aiAnalysis.riskAssessment === 'Medium' ? 'warning' : 'error'}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Recommended Action
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {caseData.aiAnalysis.recommendedAction}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Overall Confidence
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {(caseData.aiAnalysis.confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default CaseDetailsEnhanced;
