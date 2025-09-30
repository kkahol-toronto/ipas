import React, { useState, useCallback, useEffect } from 'react';
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
  Button
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
  Schedule as PendingIcon
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
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

interface AgentDetails {
  id: string;
  name: string;
  type: 'intake' | 'processing' | 'analysis' | 'decision' | 'output';
  status: 'pending' | 'running' | 'completed' | 'error';
  input: string[];
  output: string[];
  logicSummary: string;
  processingTime?: number;
  confidence?: number;
}

interface CaseOrchestrationProps {
  caseId: string;
}

const CaseOrchestration: React.FC<CaseOrchestrationProps> = ({ caseId }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDetails | null>(null);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle ResizeObserver errors
  useEffect(() => {
    // Add a small delay to prevent immediate ResizeObserver issues
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    // Suppress ResizeObserver errors
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
        return;
      }
      originalError(...args);
    };

    return () => {
      clearTimeout(timer);
      console.error = originalError;
    };
  }, []);

  // Agent data for the case
  const agents: AgentDetails[] = [
    {
      id: 'start',
      name: 'Start',
      type: 'intake',
      status: 'completed',
      input: ['Case ID', 'User Request'],
      output: ['Initial Case Data'],
      logicSummary: 'Initiates the prior authorization case processing workflow',
      processingTime: 0.1
    },
    {
      id: 'auth-intake',
      name: 'Auth Intake Model',
      type: 'intake',
      status: 'running',
      input: ['PDF Documents', 'PNG Images', 'DOC Files', 'Form Data', 'Patient Imaging', 'EMR Records'],
      output: ['Structured Data', 'Extracted Text', 'Image Analysis', 'Patient Demographics'],
      logicSummary: 'Multi-modal document ingestion and data extraction from various sources including PDFs, images, forms, and EMR systems',
      processingTime: 2.3,
      confidence: 0.94
    },
    {
      id: 'document-parser',
      name: 'Document Parser',
      type: 'processing',
      status: 'completed',
      input: ['Raw Documents', 'PDF Content'],
      output: ['Parsed Text', 'Metadata', 'Document Structure'],
      logicSummary: 'Extracts and structures text content from documents, identifies key sections and metadata',
      processingTime: 1.2,
      confidence: 0.89
    },
    {
      id: 'image-analyzer',
      name: 'Image Analysis Agent',
      type: 'processing',
      status: 'completed',
      input: ['X-Ray Images', 'MRI Scans', 'CT Scans', 'Medical Images'],
      output: ['Image Annotations', 'Findings', 'Diagnostic Codes'],
      logicSummary: 'Analyzes medical images using computer vision to extract diagnostic information and identify relevant findings',
      processingTime: 3.1,
      confidence: 0.91
    },
    {
      id: 'clinical-analyzer',
      name: 'Clinical Analysis Agent',
      type: 'analysis',
      status: 'running',
      input: ['Clinical Data', 'Patient History', 'Diagnosis Codes'],
      output: ['Clinical Assessment', 'Risk Factors', 'Treatment Recommendations'],
      logicSummary: 'Performs clinical analysis of patient data, medical history, and current condition to assess treatment necessity',
      processingTime: 4.2,
      confidence: 0.87
    },
    {
      id: 'coverage-analyzer',
      name: 'Coverage Analysis Agent',
      type: 'analysis',
      status: 'pending',
      input: ['Insurance Policy', 'Coverage Rules', 'Clinical Data'],
      output: ['Coverage Assessment', 'Eligibility Status', 'Policy Compliance'],
      logicSummary: 'Analyzes insurance coverage rules and policy compliance to determine authorization eligibility',
      processingTime: 0,
      confidence: 0
    },
    {
      id: 'decision-engine',
      name: 'Decision Engine',
      type: 'decision',
      status: 'pending',
      input: ['Clinical Analysis', 'Coverage Analysis', 'Policy Rules'],
      output: ['Authorization Decision', 'Confidence Score', 'Reasoning'],
      logicSummary: 'Makes final authorization decision based on clinical necessity, coverage rules, and policy compliance',
      processingTime: 0,
      confidence: 0
    },
    {
      id: 'notification',
      name: 'Notification Agent',
      type: 'output',
      status: 'pending',
      input: ['Decision Result', 'Stakeholder List'],
      output: ['Provider Notification', 'Patient Notification', 'Insurance Notification'],
      logicSummary: 'Sends notifications to relevant stakeholders about the authorization decision and next steps',
      processingTime: 0,
      confidence: 0
    }
  ];

  // Create nodes for the flowchart
  const initialNodes: Node[] = [
    {
      id: 'start',
      type: 'default',
      position: { x: 100, y: 50 },
      data: { 
        label: 'Start',
        agent: agents[0],
        icon: <StartIcon />,
        status: 'completed'
      },
      style: {
        background: '#4caf50',
        color: 'white',
        border: '2px solid #2e7d32',
        borderRadius: '8px',
        width: 120,
        height: 60
      }
    },
    {
      id: 'auth-intake',
      type: 'default',
      position: { x: 100, y: 150 },
      data: { 
        label: 'Auth Intake Model',
        agent: agents[1],
        icon: <UploadIcon />,
        status: 'running'
      },
      style: {
        background: '#ff9800',
        color: 'white',
        border: '2px solid #f57c00',
        borderRadius: '8px',
        width: 150,
        height: 80
      }
    },
    {
      id: 'document-parser',
      type: 'default',
      position: { x: 300, y: 100 },
      data: { 
        label: 'Document Parser',
        agent: agents[2],
        icon: <DocumentIcon />,
        status: 'completed'
      },
      style: {
        background: '#4caf50',
        color: 'white',
        border: '2px solid #2e7d32',
        borderRadius: '8px',
        width: 140,
        height: 70
      }
    },
    {
      id: 'image-analyzer',
      type: 'default',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Image Analysis',
        agent: agents[3],
        icon: <ImageIcon />,
        status: 'completed'
      },
      style: {
        background: '#4caf50',
        color: 'white',
        border: '2px solid #2e7d32',
        borderRadius: '8px',
        width: 140,
        height: 70
      }
    },
    {
      id: 'clinical-analyzer',
      type: 'default',
      position: { x: 500, y: 100 },
      data: { 
        label: 'Clinical Analysis',
        agent: agents[4],
        icon: <AIIcon />,
        status: 'running'
      },
      style: {
        background: '#ff9800',
        color: 'white',
        border: '2px solid #f57c00',
        borderRadius: '8px',
        width: 140,
        height: 70
      }
    },
    {
      id: 'coverage-analyzer',
      type: 'default',
      position: { x: 500, y: 200 },
      data: { 
        label: 'Coverage Analysis',
        agent: agents[5],
        icon: <DatabaseIcon />,
        status: 'pending'
      },
      style: {
        background: '#9e9e9e',
        color: 'white',
        border: '2px solid #757575',
        borderRadius: '8px',
        width: 140,
        height: 70
      }
    },
    {
      id: 'decision-engine',
      type: 'default',
      position: { x: 700, y: 150 },
      data: { 
        label: 'Decision Engine',
        agent: agents[6],
        icon: <SuccessIcon />,
        status: 'pending'
      },
      style: {
        background: '#9e9e9e',
        color: 'white',
        border: '2px solid #757575',
        borderRadius: '8px',
        width: 140,
        height: 70
      }
    },
    {
      id: 'notification',
      type: 'default',
      position: { x: 900, y: 150 },
      data: { 
        label: 'Notification',
        agent: agents[7],
        icon: <TextIcon />,
        status: 'pending'
      },
      style: {
        background: '#9e9e9e',
        color: 'white',
        border: '2px solid #757575',
        borderRadius: '8px',
        width: 140,
        height: 70
      }
    }
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'start', target: 'auth-intake', type: 'smoothstep' },
    { id: 'e2-3', source: 'auth-intake', target: 'document-parser', type: 'smoothstep' },
    { id: 'e2-4', source: 'auth-intake', target: 'image-analyzer', type: 'smoothstep' },
    { id: 'e3-5', source: 'document-parser', target: 'clinical-analyzer', type: 'smoothstep' },
    { id: 'e4-6', source: 'image-analyzer', target: 'coverage-analyzer', type: 'smoothstep' },
    { id: 'e5-7', source: 'clinical-analyzer', target: 'decision-engine', type: 'smoothstep' },
    { id: 'e6-7', source: 'coverage-analyzer', target: 'decision-engine', type: 'smoothstep' },
    { id: 'e7-8', source: 'decision-engine', target: 'notification', type: 'smoothstep' }
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <SuccessIcon sx={{ color: '#4caf50' }} />;
      case 'running': return <PendingIcon sx={{ color: '#ff9800' }} />;
      case 'error': return <ErrorIcon sx={{ color: '#f44336' }} />;
      default: return <PendingIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    const agent = agents.find(a => a.id === node.id);
    if (agent) {
      setSelectedAgent(agent);
      setAgentDetailsOpen(true);
    }
  };

  const CustomNode = ({ data }: { data: any }) => {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s'
          }
        }}
        onClick={(e) => handleNodeClick(e, { id: data.agent.id, data } as Node)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          {data.icon}
          <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 'bold' }}>
            {data.label}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getStatusIcon(data.status)}
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {data.status}
          </Typography>
        </Box>
        {data.agent.processingTime && data.agent.processingTime > 0 && (
          <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
            {data.agent.processingTime}s
          </Typography>
        )}
      </Box>
    );
  };

  const nodeTypes = {
    default: CustomNode
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Case Orchestration - Case #{caseId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="In Progress" color="warning" size="small" />
            <Chip label="4/8 Agents Complete" color="info" size="small" />
          </Box>
        </Box>

        {/* Flowchart */}
        <Box sx={{ height: 500, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
          {isMounted && (
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
            >
              <Controls />
              <MiniMap />
              <Background />
            </ReactFlow>
          )}
        </Box>

        {/* Agent Status Summary */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Agent Status Summary
              </Typography>
              {agents.map((agent) => (
                <Box key={agent.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 2 }}>
                    {getStatusIcon(agent.status)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {agent.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {agent.logicSummary}
                    </Typography>
                  </Box>
                  {agent.processingTime && agent.processingTime > 0 && (
                    <Chip
                      label={`${agent.processingTime}s`}
                      size="small"
                      color="info"
                    />
                  )}
                </Box>
              ))}
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Processing Metrics
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Total Processing Time:</Typography>
                <Typography variant="body2" fontWeight="bold">10.8s</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Agents Completed:</Typography>
                <Typography variant="body2" fontWeight="bold">4/8</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Success Rate:</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">100%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Average Confidence:</Typography>
                <Typography variant="body2" fontWeight="bold">90.3%</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Agent Details Dialog */}
        <Dialog
          open={agentDetailsOpen}
          onClose={() => setAgentDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AIIcon sx={{ mr: 1 }} />
              {selectedAgent?.name}
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedAgent && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Agent Details
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedAgent.status.toUpperCase()}
                      color={selectedAgent.status === 'completed' ? 'success' : 
                             selectedAgent.status === 'running' ? 'warning' : 'default'}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Processing Time
                    </Typography>
                    <Typography variant="body2">
                      {selectedAgent.processingTime ? `${selectedAgent.processingTime}s` : 'Not started'}
                    </Typography>
                  </Grid>
                  {selectedAgent.confidence && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Confidence Score
                      </Typography>
                      <Typography variant="body2">
                        {(selectedAgent.confidence * 100).toFixed(1)}%
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Input Sources
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {selectedAgent.input.map((input, index) => (
                    <Chip
                      key={index}
                      label={input}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Output Generated
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {selectedAgent.output.map((output, index) => (
                    <Chip
                      key={index}
                      label={output}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Logic Summary
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedAgent.logicSummary}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAgentDetailsOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CaseOrchestration;
