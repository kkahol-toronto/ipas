import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Description as DocumentIcon,
  Psychology as AIIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Gavel as DecisionIcon
} from '@mui/icons-material';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import ReactFlowErrorBoundary from '../ReactFlowErrorBoundary';

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

interface InteractiveIPASFlowchartProps {
  caseId: string;
}

// Custom Node Component
const ProcessNode = ({ data }: { data: any }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'running': return '#ff9800';
      case 'error': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <SuccessIcon sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'running': return <PendingIcon sx={{ color: '#ff9800', fontSize: 16 }} />;
      case 'error': return <ErrorIcon sx={{ color: '#f44336', fontSize: 16 }} />;
      default: return <PendingIcon sx={{ color: '#9e9e9e', fontSize: 16 }} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return <StartIcon sx={{ fontSize: 16 }} />;
      case 'process': return <DocumentIcon sx={{ fontSize: 16 }} />;
      case 'decision': return <DecisionIcon sx={{ fontSize: 16 }} />;
      case 'end': return <SuccessIcon sx={{ fontSize: 16 }} />;
      default: return <AIIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        minWidth: 200,
        border: `2px solid ${getStatusColor(data.status)}`,
        borderRadius: 2,
        backgroundColor: 'white',
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
          transform: 'scale(1.02)',
          transition: 'all 0.2s'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {getTypeIcon(data.type)}
        <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
          {data.name}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          {getStatusIcon(data.status)}
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {data.description}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Chip
          label={data.status.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: getStatusColor(data.status),
            color: 'white',
            fontSize: '0.7rem'
          }}
        />
      </Box>
    </Paper>
  );
};

const InteractiveIPASFlowchart: React.FC<InteractiveIPASFlowchartProps> = ({ caseId }) => {
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [stepDetailsOpen, setStepDetailsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle ResizeObserver errors and delayed mounting
  useEffect(() => {
    // Suppress ResizeObserver errors
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && 
          (args[0].includes('ResizeObserver loop completed with undelivered notifications') ||
           args[0].includes('ResizeObserver loop limit exceeded'))) {
        return;
      }
      originalError(...args);
    };

    // Delay mounting to prevent immediate ResizeObserver issues
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 200);

    return () => {
      clearTimeout(timer);
      console.error = originalError;
    };
  }, []);

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

  // Create initial nodes
  const initialNodes: Node[] = processSteps.map(step => ({
    id: step.id,
    type: 'processNode',
    position: step.position,
    data: {
      ...step,
      onClick: () => handleStepClick(step)
    },
    draggable: true
  }));

  // Create initial edges with proper connections
  const initialEdges: Edge[] = [
    // Main flow
    { id: 'start-auth-intake', source: 'start', target: 'auth-intake', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'auth-intake-auth-triage', source: 'auth-intake', target: 'auth-triage', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'auth-triage-member-verification', source: 'auth-triage', target: 'member-verification', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'member-verification-data-enrichment', source: 'member-verification', target: 'data-enrichment', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'data-enrichment-gap-assessment', source: 'data-enrichment', target: 'gap-assessment', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'gap-assessment-decision-prediction', source: 'gap-assessment', target: 'decision-prediction', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // Conditional flows
    { id: 'auth-triage-provider-notification', source: 'auth-triage', target: 'provider-notification', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ff9800' }, label: 'Auth not needed' },
    { id: 'member-verification-provider-notification', source: 'member-verification', target: 'provider-notification', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f44336' }, label: 'Not found' },
    { id: 'data-enrichment-emr-ehr-integration', source: 'data-enrichment', target: 'emr-ehr-integration', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#9c27b0' }, label: 'Doc not found' },
    { id: 'emr-ehr-integration-gap-assessment', source: 'emr-ehr-integration', target: 'gap-assessment', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#9c27b0' }, label: 'Doc found' },
    { id: 'gap-assessment-emr-ehr-integration', source: 'gap-assessment', target: 'emr-ehr-integration', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ff5722' }, label: 'Gaps found' },
    
    // Decision flows
    { id: 'decision-prediction-zyter-trucare', source: 'decision-prediction', target: 'zyter-trucare', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#4caf50' }, label: 'Approved' },
    { id: 'decision-prediction-clinical-summarization', source: 'decision-prediction', target: 'clinical-summarization', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#f44336' }, label: 'Not approved' },
    { id: 'clinical-summarization-clinical-review-planning', source: 'clinical-summarization', target: 'clinical-review-planning', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'clinical-review-planning-clinical-decisioning', source: 'clinical-review-planning', target: 'clinical-decisioning', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'clinical-decisioning-zyter-trucare', source: 'clinical-decisioning', target: 'zyter-trucare', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'provider-notification-zyter-trucare', source: 'provider-notification', target: 'zyter-trucare', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes: NodeTypes = {
    processNode: ProcessNode
  };

  const handleStepClick = (step: ProcessStep) => {
    setSelectedStep(step);
    setStepDetailsOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Interactive IPAS Process Flow - Case #{caseId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="In Progress" color="warning" size="small" />
            <Chip label="4/12 Steps Complete" color="info" size="small" />
          </Box>
        </Box>

        {/* Interactive Flowchart */}
        <Box sx={{ height: 600, border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <ReactFlowErrorBoundary>
            {isMounted ? (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                proOptions={{ hideAttribution: true }}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
              >
                <Controls />
                <MiniMap />
                <Background />
              </ReactFlow>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                backgroundColor: '#f5f5f5'
              }}>
                <Typography variant="h6" color="text.secondary">
                  Loading Interactive Flowchart...
                </Typography>
              </Box>
            )}
          </ReactFlowErrorBoundary>
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
              <AIIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
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
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Chip
                    label={selectedStep.status.toUpperCase()}
                    color={selectedStep.status === 'completed' ? 'success' : 
                           selectedStep.status === 'running' ? 'warning' : 'default'}
                  />
                  <Chip
                    label={selectedStep.type.toUpperCase()}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

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

export default InteractiveIPASFlowchart;
