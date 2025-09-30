import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  TextFields as TextIcon,
  CloudUpload as UploadIcon,
  Storage as DatabaseIcon,
  Psychology as AIIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationIcon,
  Timeline as TimelineIcon,
  Gavel as DecisionIcon
} from '@mui/icons-material';

interface ProcessStep {
  id: string;
  name: string;
  type: 'start' | 'process' | 'decision' | 'end';
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  subSteps: string[];
  nextSteps: string[];
  conditions?: { [key: string]: string };
  position: { x: number; y: number };
}

interface IPASFlowchartProps {
  caseId: string;
}

const IPASFlowchart: React.FC<IPASFlowchartProps> = ({ caseId }) => {
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [stepDetailsOpen, setStepDetailsOpen] = useState(false);

  // IPAS Process Steps based on the actual workflow
  const processSteps: ProcessStep[] = [
    {
      id: 'start',
      name: 'Start',
      type: 'start',
      status: 'completed',
      description: 'Initiates the prior authorization case processing workflow',
      subSteps: ['Case ID Generation', 'Initial Data Collection'],
      nextSteps: ['auth-intake'],
      position: { x: 50, y: 50 }
    },
    {
      id: 'auth-intake',
      name: 'Auth Intake',
      type: 'process',
      status: 'running',
      description: 'Multi-modal document ingestion and data extraction',
      subSteps: [
        'Email Processing',
        'Mail Processing', 
        'Fax Processing',
        'Call Processing',
        'Portal Processing',
        'EDI/FHIR Processing',
        'Auth ID Creation'
      ],
      nextSteps: ['auth-triage'],
      position: { x: 200, y: 50 }
    },
    {
      id: 'auth-triage',
      name: 'Auth Triage',
      type: 'process',
      status: 'running',
      description: 'Document triage and data extraction',
      subSteps: [
        'Document Triage',
        'Data Extraction',
        'Auth Determination',
        'Provider Gold Card Check'
      ],
      nextSteps: ['member-verification', 'provider-notification'],
      conditions: {
        'auth-not-needed': 'provider-notification',
        'gold-card-available': 'provider-notification'
      },
      position: { x: 350, y: 50 }
    },
    {
      id: 'member-verification',
      name: 'Member Verification',
      type: 'process',
      status: 'running',
      description: 'Member identification and eligibility verification',
      subSteps: [
        'Member Identification',
        'Eligibility Verification'
      ],
      nextSteps: ['data-enrichment', 'provider-notification'],
      conditions: {
        'found': 'data-enrichment',
        'not-found': 'provider-notification'
      },
      position: { x: 200, y: 150 }
    },
    {
      id: 'data-enrichment',
      name: 'Data Enrichment',
      type: 'process',
      status: 'running',
      description: 'Auth input document and enterprise systems integration',
      subSteps: [
        'Auth Input Document Processing',
        'Enterprise Systems Integration'
      ],
      nextSteps: ['gap-assessment', 'emr-ehr-integration'],
      conditions: {
        'doc-found': 'gap-assessment',
        'doc-not-found': 'emr-ehr-integration'
      },
      position: { x: 350, y: 150 }
    },
    {
      id: 'emr-ehr-integration',
      name: 'EMR/EHR Integration',
      type: 'process',
      status: 'pending',
      description: 'Trigger EMR/EHR and retrieve medical records',
      subSteps: [
        'Trigger EMR/EHR',
        'Retrieve Medical Record'
      ],
      nextSteps: ['gap-assessment', 'provider-notification'],
      conditions: {
        'doc-found': 'gap-assessment',
        'doc-not-found': 'provider-notification'
      },
      position: { x: 500, y: 150 }
    },
    {
      id: 'gap-assessment',
      name: 'Gap Assessment',
      type: 'process',
      status: 'pending',
      description: 'Document evaluation and assessment report',
      subSteps: [
        'Document Evaluation',
        'Assessment Report Generation'
      ],
      nextSteps: ['decision-prediction', 'emr-ehr-integration'],
      conditions: {
        'gaps-not-found': 'decision-prediction',
        'gaps-found': 'emr-ehr-integration'
      },
      position: { x: 650, y: 150 }
    },
    {
      id: 'decision-prediction',
      name: 'Decision Prediction',
      type: 'decision',
      status: 'pending',
      description: 'Data attribute assessment and decision prediction',
      subSteps: [
        'Data Attribute Assessment',
        'Decision Prediction'
      ],
      nextSteps: ['clinical-summarization', 'zyter-trucare'],
      conditions: {
        'approved': 'zyter-trucare',
        'not-approved': 'clinical-summarization'
      },
      position: { x: 800, y: 150 }
    },
    {
      id: 'clinical-summarization',
      name: 'Clinical Summarization',
      type: 'process',
      status: 'pending',
      description: 'AI generated summary and decision prediction',
      subSteps: [
        'AI Generated Summary',
        'Decision Prediction'
      ],
      nextSteps: ['clinical-review-planning', 'clinical-decisioning'],
      position: { x: 650, y: 250 }
    },
    {
      id: 'clinical-review-planning',
      name: 'Clinical Review Planning',
      type: 'process',
      status: 'pending',
      description: 'Auth selection, assessment verification, and clinical review strategy',
      subSteps: [
        'Auth Selection',
        'Assessment Verification',
        'Clinical Review Strategy Creation'
      ],
      nextSteps: ['clinical-decisioning'],
      position: { x: 500, y: 250 }
    },
    {
      id: 'clinical-decisioning',
      name: 'Clinical Decisioning',
      type: 'decision',
      status: 'pending',
      description: 'Clinical review strategy execution and clinical decision',
      subSteps: [
        'Clinical Review Strategy Execution',
        'Clinical Decision',
        'Evaluation Report'
      ],
      nextSteps: ['zyter-trucare'],
      position: { x: 350, y: 250 }
    },
    {
      id: 'provider-notification',
      name: 'Provider Notification',
      type: 'process',
      status: 'pending',
      description: 'Letter creation and trigger notification',
      subSteps: [
        'Letter Creation',
        'Trigger Notification'
      ],
      nextSteps: ['zyter-trucare'],
      position: { x: 200, y: 250 }
    },
    {
      id: 'zyter-trucare',
      name: 'Zyter TruCare',
      type: 'end',
      status: 'pending',
      description: 'Final integration and output',
      subSteps: [
        'Final Integration',
        'Output Generation'
      ],
      nextSteps: [],
      position: { x: 50, y: 250 }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <SuccessIcon sx={{ color: '#4caf50' }} />;
      case 'running': return <PendingIcon sx={{ color: '#ff9800' }} />;
      case 'error': return <ErrorIcon sx={{ color: '#f44336' }} />;
      default: return <PendingIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'running': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return <StartIcon />;
      case 'process': return <DocumentIcon />;
      case 'decision': return <DecisionIcon />;
      case 'end': return <SuccessIcon />;
      default: return <AIIcon />;
    }
  };

  const handleStepClick = (step: ProcessStep) => {
    setSelectedStep(step);
    setStepDetailsOpen(true);
  };

  const renderConnector = (fromStep: ProcessStep, toStep: ProcessStep, condition?: string) => {
    const fromX = fromStep.position.x;
    const fromY = fromStep.position.y;
    const toX = toStep.position.x;
    const toY = toStep.position.y;
    
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    return (
      <g key={`${fromStep.id}-${toStep.id}`}>
        <line
          x1={fromX + 100}
          y1={fromY + 25}
          x2={toX}
          y2={toY + 25}
          stroke={getStatusColor(fromStep.status)}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        {condition && (
          <text
            x={midX}
            y={midY - 5}
            fontSize="10"
            fill="#666"
            textAnchor="middle"
          >
            {condition}
          </text>
        )}
      </g>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            IPAS Process Flow - Case #{caseId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="In Progress" color="warning" size="small" />
            <Chip label="4/12 Steps Complete" color="info" size="small" />
          </Box>
        </Box>

        {/* Process Flow Diagram */}
        <Box sx={{ mb: 4, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Process Flow Diagram
          </Typography>
          <Box sx={{ 
            position: 'relative', 
            height: 400, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2,
            backgroundColor: '#fafafa',
            overflow: 'auto'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 400">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#666"
                  />
                </marker>
              </defs>
              
              {/* Render connectors */}
              {processSteps.map(step => 
                step.nextSteps.map(nextStepId => {
                  const nextStep = processSteps.find(s => s.id === nextStepId);
                  if (!nextStep) return null;
                  
                  const condition = step.conditions?.[nextStepId];
                  return renderConnector(step, nextStep, condition);
                })
              )}
              
              {/* Render steps */}
              {processSteps.map(step => (
                <g key={step.id}>
                  <rect
                    x={step.position.x}
                    y={step.position.y}
                    width="200"
                    height="50"
                    rx="5"
                    fill="white"
                    stroke={getStatusColor(step.status)}
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStepClick(step)}
                  />
                  <text
                    x={step.position.x + 10}
                    y={step.position.y + 20}
                    fontSize="12"
                    fontWeight="bold"
                    fill="#333"
                  >
                    {step.name}
                  </text>
                  <text
                    x={step.position.x + 10}
                    y={step.position.y + 35}
                    fontSize="10"
                    fill="#666"
                  >
                    {step.description}
                  </text>
                  <circle
                    cx={step.position.x + 180}
                    cy={step.position.y + 25}
                    r="8"
                    fill={getStatusColor(step.status)}
                  />
                </g>
              ))}
            </svg>
          </Box>
        </Box>

        {/* Process Steps List */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Process Steps
          </Typography>
          <Grid container spacing={2}>
            {processSteps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={step.id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: `2px solid ${getStatusColor(step.status)}`,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s'
                    }
                  }}
                  onClick={() => handleStepClick(step)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getStatusIcon(step.status)}
                    <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {step.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {step.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={step.status.toUpperCase()}
                      size="small"
                      color={step.status === 'completed' ? 'success' : 
                             step.status === 'running' ? 'warning' : 'default'}
                    />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Step Details Dialog */}
        <Dialog
          open={stepDetailsOpen}
          onClose={() => setStepDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedStep && getTypeIcon(selectedStep.type)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedStep?.name}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedStep && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Step Details
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedStep.status.toUpperCase()}
                      color={selectedStep.status === 'completed' ? 'success' : 
                             selectedStep.status === 'running' ? 'warning' : 'default'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Type
                    </Typography>
                    <Typography variant="body2">
                      {selectedStep.type.toUpperCase()}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  {selectedStep.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Sub-Steps
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {selectedStep.subSteps.map((subStep, index) => (
                    <Chip
                      key={index}
                      label={subStep}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                {selectedStep.nextSteps.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Next Steps
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {selectedStep.nextSteps.map((nextStep, index) => (
                        <Chip
                          key={index}
                          label={nextStep}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </>
                )}

                {selectedStep.conditions && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Conditions
                    </Typography>
                    <Box>
                      {Object.entries(selectedStep.conditions).map(([condition, nextStep], index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            <strong>{condition}:</strong> → {nextStep}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStepDetailsOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default IPASFlowchart;
