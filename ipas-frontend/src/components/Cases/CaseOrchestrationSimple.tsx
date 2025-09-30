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
  LinearProgress
} from '@mui/material';
import {
  Psychology as AIIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';

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

interface CaseOrchestrationSimpleProps {
  caseId: string;
}

const CaseOrchestrationSimple: React.FC<CaseOrchestrationSimpleProps> = ({ caseId }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDetails | null>(null);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);

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

  const handleAgentClick = (agent: AgentDetails) => {
    setSelectedAgent(agent);
    setAgentDetailsOpen(true);
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

        {/* Simple Agent Flow */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            AI Agent Workflow
          </Typography>
          <Grid container spacing={2}>
            {agents.map((agent, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={agent.id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: `2px solid ${getStatusColor(agent.status)}`,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s'
                    }
                  }}
                  onClick={() => handleAgentClick(agent)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getStatusIcon(agent.status)}
                    <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {agent.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {agent.logicSummary}
                  </Typography>
                  {agent.processingTime && agent.processingTime > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Processing Time: {agent.processingTime}s
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={agent.status === 'completed' ? 100 : agent.status === 'running' ? 75 : 0}
                        sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
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

export default CaseOrchestrationSimple;
