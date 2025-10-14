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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Share as ShareIcon,
  Computer as ComputerIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import SimpleDraggableFlowchart from './SimpleDraggableFlowchart';
import CaseDocuments from './CaseDocuments';
import ClinicalSummary from './ClinicalSummary';
import ClinicalCriteriaEval from './ClinicalCriteriaEval';
import MedicalRecordRetrival from './MedicalRecordRetrival'
import EMRNotificationPanel from '../Notifications/EMRNotificationPanel';

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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [shareNote, setShareNote] = useState('');
  const [editNotesOpen, setEditNotesOpen] = useState(false);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [observabilityDialogOpen, setObservabilityDialogOpen] = useState(false);
  const [observabilityData, setObservabilityData] = useState<any>(null);  
  const [selectedOption, setSelectedOption] = useState('Approved');
  const [emrIntegrationOpen, setEmrIntegrationOpen] = useState(false);

 
  // Dynamic case data based on caseId
  const getCaseData = (caseId: string) => {
const caseDataMap: { [key: string]: any } = {
  'PA-2024-001': {
    id: 'PA-2024-001',
    patientName: 'John Smith',
    patientId: 'P-2024-001',
    dateOfBirth: '1985-03-15',
    provider: 'Sarah Johnson',
    providerId: 'PR-001',
    hospital: 'UCLA Medical Center',
    procedure: 'MRI Brain with Contrast',
    diagnosis: 'Suspected Brain Tumor',
    status: 'In Review',
    priority: 'High',
    submittedDate: '2025-10-08T10:32:00Z',
    lastUpdated: '2025-10-08T14:45:00Z',
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
      { timestamp: '2025-10-08T10:32:00Z', note: 'Patient presents with persistent headaches and visual disturbances', author: 'Sarah Johnson' },
      { timestamp: '2025-10-08T11:15:00Z', note: 'MRI recommended to rule out brain tumor', author: 'Sarah Johnson' },
      { timestamp: '2025-10-08T12:00:00Z', note: 'Prior authorization submitted to insurance', author: 'Nurse Mary Wilson' }
    ],
    aiAnalysis: {
      clinicalNecessity: 0.94,
      coverageEligibility: 0.87,
      riskAssessment: 'Standard',
      recommendedAction: 'Approve with monitoring',
      confidence: 0.91
    }
  },
  'PA-2024-002': {
    id: 'PA-2024-002',
    patientName: 'Mary Johnson',
    patientId: 'P-2024-002',
    dateOfBirth: '1972-08-22',
    provider: 'Dr. Michael Chen',
    providerId: 'PR-002',
    hospital: 'Cedars-Sinai Medical Center',
    procedure: 'Cardiac Catheterization',
    diagnosis: 'Coronary Artery Disease',
    status: 'In Review',
    priority: 'High',
    submittedDate: '2025-10-09T09:18:00Z',
    lastUpdated: '2025-10-09T13:24:00Z',
    insurance: 'Aetna',
    policyNumber: 'AET987654321',
    estimatedCost: 15000,
    documents: [
      { id: 'doc1', name: 'Prior Auth Request Form.pdf', type: 'PDF', size: '2.1 MB', status: 'Processed' },
      { id: 'doc2', name: 'EKG Results.pdf', type: 'PDF', size: '0.8 MB', status: 'Analyzed' },
      { id: 'doc3', name: 'Stress Test Results.pdf', type: 'PDF', size: '1.2 MB', status: 'Processed' },
      { id: 'doc4', name: 'Insurance Card.png', type: 'Image', size: '0.9 MB', status: 'Processed' }
    ],
    clinicalNotes: [
      { timestamp: '2025-10-09T09:18:00Z', note: 'Patient presents with chest pain and shortness of breath', author: 'Dr. Michael Chen' },
      { timestamp: '2025-10-09T10:30:00Z', note: 'EKG shows ST elevation, cardiac catheterization recommended', author: 'Dr. Michael Chen' },
      { timestamp: '2025-10-09T11:45:00Z', note: 'Prior authorization submitted for cardiac catheterization', author: 'Nurse Jennifer Lee' }
    ],
    aiAnalysis: {
      clinicalNecessity: 0.98,
      coverageEligibility: 0.92,
      riskAssessment: 'High',
      recommendedAction: 'Approve immediately',
      confidence: 0.95
    }
  },
  'PA-2024-003': {
    id: 'PA-2024-003',
    patientName: 'Robert Davis',
    patientId: 'P-2024-003',
    dateOfBirth: '1965-12-03',
    provider: 'Dr. Emily Rodriguez',
    providerId: 'PR-003',
    hospital: 'Kaiser Permanente',
    procedure: 'Knee Arthroscopy',
    diagnosis: 'Meniscal Tear',
    status: 'In Review',
    priority: 'Standard',
    submittedDate: '2025-10-10T14:22:00Z',
    lastUpdated: '2025-10-10T16:48:00Z',
    insurance: 'Kaiser Permanente',
    policyNumber: 'KP456789123',
    estimatedCost: 8000,
    documents: [
      { id: 'doc1', name: 'Prior Auth Request Form.pdf', type: 'PDF', size: '2.0 MB', status: 'Processed' },
      { id: 'doc2', name: 'MRI Knee Results.pdf', type: 'PDF', size: '3.2 MB', status: 'Analyzed' },
      { id: 'doc3', name: 'Robert Davis Medical Records.pdf', type: 'PDF', size: '1.5 MB', status: 'Processed' },
      { id: 'doc4', name: 'Insurance Card.png', type: 'Image', size: '0.9 MB', status: 'Processed' }
    ],
    clinicalNotes: [
      { timestamp: '2025-10-10T14:22:00Z', note: 'Patient reports persistent knee pain and limited mobility', author: 'Dr. Emily Rodriguez' },
      { timestamp: '2025-10-10T15:30:00Z', note: 'MRI confirms meniscal tear, arthroscopy recommended', author: 'Dr. Emily Rodriguez' },
      { timestamp: '2025-10-10T16:00:00Z', note: 'Prior authorization submitted for knee arthroscopy', author: 'Nurse David Kim' }
    ],
    aiAnalysis: {
      clinicalNecessity: 0.89,
      coverageEligibility: 0.85,
      riskAssessment: 'Standard',
      recommendedAction: 'Approve with coverage limit',
      confidence: 0.87
    }
  },
  'PA-2024-004': {
    id: 'PA-2024-004',
    patientName: 'Lisa Wilson',
    patientId: 'P-2024-004',
    dateOfBirth: '1985-03-15',
    provider: 'Andrew Thomson',
    providerId: 'PR-004',
    hospital: 'UCLA Medical Center',
    procedure: 'MRI Brain with Contrast',
    diagnosis: 'Suspected Brain Tumor',
    status: 'In Review',
    priority: 'High',
    submittedDate: '2025-10-08T11:02:00Z',
    lastUpdated: '2025-10-08T14:47:00Z',
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
      { timestamp: '2025-10-08T11:02:00Z', note: 'Patient presents with persistent headaches and visual disturbances', author: 'Sarah Johnson' },
      { timestamp: '2025-10-08T11:45:00Z', note: 'MRI recommended to rule out brain tumor', author: 'Sarah Johnson' },
      { timestamp: '2025-10-08T12:10:00Z', note: 'Prior authorization submitted to insurance', author: 'Nurse Mary Wilson' }
    ],
    aiAnalysis: {
      clinicalNecessity: 0.94,
      coverageEligibility: 0.87,
      riskAssessment: 'Standard',
      recommendedAction: 'Approve with monitoring',
      confidence: 0.91
    }
  },
  'PA-2024-006': {
    id: 'PA-2024-006',
    patientName: 'Rebecca Hardin',
    patientId: 'P-2024-006',
    dateOfBirth: '1976-08-25',
    provider: 'Amy Diane Kelly, NP',
    providerId: 'PR-006',
    hospital: 'Prisma Health Pulmonology - Sumter',
    procedure: 'CPAP Device Replacement',
    diagnosis: 'Obstructive Sleep Apnea (G47.33)',
    status: 'In Review',
    priority: 'Standard',
    submittedDate: '2025-10-09T12:14:00Z',
    lastUpdated: '2025-10-09T15:46:00Z',
    insurance: 'Ambetter / Absolute Total Care',
    policyNumber: 'U7131533302',
    estimatedCost: 2500,
    documents: [
      { id: 'doc1', name: 'Prior Auth Request Form.pdf', type: 'PDF', size: '2.1 MB', status: 'Processed' },
      { id: 'doc2', name: 'Medical Records.pdf', type: 'PDF', size: '3.2 MB', status: 'Analyzed' },
      { id: 'doc3', name: 'Polysomnography Report.pdf', type: 'PDF', size: '1.8 MB', status: 'Processed' },
      { id: 'doc4', name: 'Doctor Notes.pdf', type: 'PDF', size: '1.2 MB', status: 'Processed' },
      { id: 'doc5', name: 'Insurance Card.pdf', type: 'PDF', size: '0.9 MB', status: 'Processed' }
    ],
    clinicalNotes: [
      { timestamp: '2025-10-09T12:14:00Z', note: 'Patient compliant with CPAP therapy, Epworth score 3/24', author: 'Amy Diane Kelly, NP' },
      { timestamp: '2025-10-09T15:46:00Z', note: "CPAP Device Replacement needed as member is requesting for a personal device. She is currently using father-in-law's device", author: 'Amy Diane Kelly, NP' },
      { timestamp: '2025-10-09T13:10:00Z', note: 'Prior authorization submitted for CPAP replacement and supplies', author: 'Maria Griffin' }
    ],
    aiAnalysis: {
      clinicalNecessity: 0.96,
      coverageEligibility: 0.94,
      riskAssessment: 'Low',
      recommendedAction: 'Approve - clear medical necessity',
      confidence: 0.95
    }


      },
      'PA-2024-007': {
        id: 'PA-2024-007',
        patientName: 'Amanda Williams',
        patientId: 'P-2024-007',
        dateOfBirth: '1976-08-25',
        provider: 'Amy Diane Kelly, NP',
        providerId: 'PR-007',
        hospital: 'Prisma Health Pulmonology - Sumter',
        procedure: 'CPAP Device Replacement',
        diagnosis: 'Obstructive Sleep Apnea (G47.33)',
        status: 'Denied',
        priority: 'Standard',
        submittedDate: '2024-04-25T12:16:34Z',
        lastUpdated: '2024-04-25T15:48:00Z',
        insurance: 'Ambetter / Absolute Total Care',
        policyNumber: 'U7131533302',
        estimatedCost: 2500,
        documents: [
          { id: 'doc1', name: 'Prior Auth Request Form.pdf', type: 'PDF', size: '2.1 MB', status: 'Processed' },
          { id: 'doc2', name: 'Medical Records.pdf', type: 'PDF', size: '3.2 MB', status: 'Analyzed' }
        ],
        clinicalNotes: [
          { timestamp: '2024-04-24T15:05:00Z', note: 'Patient compliant with CPAP therapy, Epworth score 3/24', author: 'Amy Diane Kelly, NP' },
          { timestamp: '2024-04-24T15:48:00Z', note: "CPAP Device Replacement needed as member is requesting for a personal device. She is currently using father in law's device ", author: 'Amy Diane Kelly, NP' },
          { timestamp: '2024-04-25T12:16:34Z', note: 'Prior authorization submitted for CPAP replacement and supplies', author: 'Maria Griffin' }
        ],
        aiAnalysis: {
          clinicalNecessity: 0.95,
          coverageEligibility: 0.94,
          riskAssessment: 'Low',
          recommendedAction: 'Deny - clear medical necessity',
          confidence: 0.95
        }
      }

    };

    return caseDataMap[caseId] || {
      id: caseId,
      patientName: 'Unknown Patient',
      patientId: 'P-UNKNOWN',
      dateOfBirth: 'Unknown',
      provider: 'Unknown Provider',
      providerId: 'PR-UNKNOWN',
      hospital: 'Unknown Hospital',
      procedure: 'Unknown Procedure',
      diagnosis: 'Unknown Diagnosis',
      status: 'Unknown',
      priority: 'Unknown',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      insurance: 'Unknown Insurance',
      policyNumber: 'UNKNOWN',
      estimatedCost: 0,
      documents: [],
      clinicalNotes: [],
      aiAnalysis: {
        clinicalNecessity: 0,
        coverageEligibility: 0,
        riskAssessment: 'Unknown',
        recommendedAction: 'Unknown',
        confidence: 0
      }
    };
  };

  const caseData = getCaseData(caseId);

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
      case 'Standard': return 'warning';
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
              <Tooltip title="EMR Integration">
                <IconButton
                  onClick={() => setEmrIntegrationOpen(true)}
                >
                  <ComputerIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="View Observability & Explanation">
                <IconButton
                  color="info"
                  onClick={async () => {
                    try {
                      const folderName = caseId === 'PA-2024-001' ? 'case-001-john-doe' : caseId === 'PA-2024-002' ? 'case-002-jane-smith' : caseId === 'PA-2024-003' ? 'case-003-mike-johnson' : caseId === 'PA-2024-004' ? 'case-004-sarah-wilson' : caseId === 'PA-2024-005' ? 'case-005-david-brown' : caseId === 'PA-2024-006' ? 'case-006-rebecca-hardin' : 'case-001-john-doe';
                      const response = await fetch(`/sample-documents/cases/${folderName}/observability_and_explanation.json`);
                      const data = await response.json();
                      setObservabilityData(data);
                      setObservabilityDialogOpen(true);
                    } catch (error) {
                      console.error('Error loading observability data:', error);
                      alert('Observability report not available for this case');
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Observability & Explanation Report">
                <IconButton
                  color="success"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `/sample-documents/cases/${caseId === 'PA-2024-001' ? 'case-001-john-doe' : caseId === 'PA-2024-002' ? 'case-002-jane-smith' : caseId === 'PA-2024-003' ? 'case-003-mike-johnson' : caseId === 'PA-2024-004' ? 'case-004-sarah-wilson' : caseId === 'PA-2024-005' ? 'case-005-david-brown' : caseId === 'PA-2024-006' ? 'case-006-rebecca-hardin' : 'case-001-john-doe'}/observability_and_explanation.json`;
                    link.download = `observability_and_explanation_${caseId}.json`;
                    link.click();
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Clinical Notes">
                <IconButton
                  onClick={() => {
                    setClinicalNotes(caseData.clinicalNotes.map((n: any) => `[${new Date(n.timestamp).toLocaleString()}] ${n.author}:\n${n.note}`).join('\n\n'));
                    setEditNotesOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share Case">
                <IconButton
                  onClick={() => setShareDialogOpen(true)}
                >
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
            <Tab label="Clinical Summary" icon={<DocumentIcon />} />
            <Tab label="Auth Decision Summary" icon={<DocumentIcon />} />
            <Tab label="Reviewer Notes" icon={<TimelineIcon />} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <SimpleDraggableFlowchart caseId={caseId} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CaseDocuments caseId={caseId} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <ClinicalSummary caseId={caseId} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
              <ClinicalCriteriaEval caseId={caseId} />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Clinical Timeline
          </Typography>
          {caseData.clinicalNotes.map((note: any, index: number) => (
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
      </Card>

      {/* Edit Clinical Notes Dialog */}
      <Dialog open={editNotesOpen} onClose={() => setEditNotesOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Clinical Notes - {caseData.id}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={12}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Enter clinical notes..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditNotesOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setEditNotesOpen(false);
              alert('Clinical notes saved successfully!');
            }}
          >
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share with Reviewers Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Share Case - {caseData.id}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select reviewers to share this case with:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Reviewers</InputLabel>
            <Select
              multiple
              value={selectedReviewers}
              onChange={(e) => setSelectedReviewers(e.target.value as string[])}
              label="Select Reviewers"
            >
              <MenuItem value="Dr. Sarah Wilson - Cardiologist">Dr. Sarah Wilson - Cardiologist</MenuItem>
              <MenuItem value="Dr. Michael Chen - Medical Director">Dr. Michael Chen - Medical Director</MenuItem>
              <MenuItem value="Dr. Emily Rodriguez - Clinical Specialist">Dr. Emily Rodriguez - Clinical Specialist</MenuItem>
              <MenuItem value="Dr. James Thompson - Quality Assurance">Dr. James Thompson - Quality Assurance</MenuItem>
              <MenuItem value="Dr. Lisa Anderson - Internal Medicine">Dr. Lisa Anderson - Internal Medicine</MenuItem>
              <MenuItem value="Dr. Robert Martinez - Cardiothoracic Surgery">Dr. Robert Martinez - Cardiothoracic Surgery</MenuItem>
            </Select>
          </FormControl>
          {selectedReviewers.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Selected: {selectedReviewers.length} reviewer(s)
              </Typography>
              <Box sx={{ mt: 1 }}>
                {selectedReviewers.map((reviewer) => (
                  <Chip
                    key={reviewer}
                    label={reviewer}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                    onDelete={() => setSelectedReviewers(prev => prev.filter(r => r !== reviewer))}
                  />
                ))}
              </Box>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Add a note (optional)"
            placeholder="Add a message to accompany the case sharing..."
            value={shareNote}
            onChange={(e) => setShareNote(e.target.value)}
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={selectedReviewers.length === 0}
            onClick={() => {
              setShareDialogOpen(false);
              const noteText = shareNote ? `\n\nNote: ${shareNote}` : '';
              alert(`Case ${caseData.id} shared with ${selectedReviewers.length} reviewer(s):\n${selectedReviewers.join('\n')}${noteText}`);
              setSelectedReviewers([]);
              setShareNote('');
            }}
          >
            Share Case
          </Button>
        </DialogActions>
      </Dialog>

      {/* EMR Integration Dialog */}
      <Dialog
        open={emrIntegrationOpen}
        onClose={() => setEmrIntegrationOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            EMR Integration - {caseId}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <MedicalRecordRetrival caseId={caseId} />
          <EMRNotificationPanel caseId={caseId} showDetails={true} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmrIntegrationOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Observability & Explanation Dialog */}
      <Dialog
        open={observabilityDialogOpen}
        onClose={() => setObservabilityDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            Observability & Explanation Report - {caseId}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Complete workflow transparency and decision reasoning
          </Typography>
        </DialogTitle>
        <DialogContent>
          {observabilityData && (
            <Box>
              {/* Summary Section */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Patient</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{observabilityData.patientName}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Procedure</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{observabilityData.procedure}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <FormControl fullWidth >
                      <InputLabel id="demo-simple-select-label">Smart Auth recommendation </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        label="Smart Auth recommendation"
                      >
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Denied">Denied</MenuItem>
                        <MenuItem value="Pend">Pend</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="caption" color="text.secondary">Processing Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{observabilityData.processingTimeline.totalDuration}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Workflow Steps Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Workflow Steps</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>Step</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Action</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Details</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Outcome</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Comments</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {observabilityData.workflowSteps.map((step: any) => (
                      <TableRow key={step.step}>
                        <TableCell>{step.step}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{step.action}</TableCell>
                        <TableCell>
                          <Chip
                            label={step.status}
                            color={step.status === 'Completed' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem' }}>{step.details}</TableCell>
                        <TableCell sx={{ fontSize: '0.875rem' }}>{step.outcome}</TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{step.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Key Findings */}
              <Typography variant="h6" sx={{ mb: 2 }}>Key Findings</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Clinical Justification</Typography>
                    <Typography variant="body2" color="text.secondary">{observabilityData.keyFindings.clinicalJustification}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Medical Necessity</Typography>
                    <Typography variant="body2" color="text.secondary">{observabilityData.keyFindings.medicalNecessity}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Policy Compliance</Typography>
                    <Typography variant="body2" color="text.secondary">{observabilityData.keyFindings.policyCompliance}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Cost Efficiency</Typography>
                    <Typography variant="body2" color="text.secondary">{observabilityData.keyFindings.costEfficiency}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Approval Details */}
              <Typography variant="h6" sx={{ mb: 2 }}>Approval Details</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">Authorization Number</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{observabilityData.approvalDetails.authorizationNumber}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">Approved Amount</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>{observabilityData.approvalDetails.approvedAmount}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="caption" color="text.secondary">Valid Until</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{observabilityData.approvalDetails.validUntil}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Approved By</Typography>
                    <Typography variant="body2">{observabilityData.approvalDetails.approvedBy}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">Review Type</Typography>
                    <Typography variant="body2">{observabilityData.approvalDetails.reviewType}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Quality Metrics */}
              <Typography variant="h6" sx={{ mb: 2 }}>Quality Metrics</Typography>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {Object.entries(observabilityData.qualityMetrics).map(([key, value]) => (
                    <Grid size={{ xs: 6, md: 4 }} key={key}>
                      <Typography variant="caption" color="text.secondary">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{String(value)}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => {
              const link = document.createElement('a');
              link.href = `/sample-documents/cases/${caseId === 'PA-2024-001' ? 'case-001-john-doe' : caseId === 'PA-2024-002' ? 'case-002-jane-smith' : caseId === 'PA-2024-003' ? 'case-003-mike-johnson' : caseId === 'PA-2024-004' ? 'case-004-sarah-wilson' : caseId === 'PA-2024-005' ? 'case-005-david-brown' : caseId === 'PA-2024-006' ? 'case-006-rebecca-hardin' : 'case-001-john-doe'}/observability_and_explanation.json`;
              link.download = `observability_and_explanation_${caseId}.json`;
              link.click();
            }}
          >
            Download 
          </Button>
           <Button  variant="contained">
            Save
          </Button>
          <Button onClick={() => setObservabilityDialogOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaseDetailsEnhanced;