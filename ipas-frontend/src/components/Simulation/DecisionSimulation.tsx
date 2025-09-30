import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Alert,
  Grid
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { SimulationResult, DecisionNode } from '../../types';

interface DecisionSimulationProps {
  caseId: string;
  onClose?: () => void;
}

const DecisionSimulation: React.FC<DecisionSimulationProps> = ({ caseId, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Mock simulation data
  const mockSimulationResult: SimulationResult = {
    id: 'sim_001',
    scenario: 'Standard Pneumonia Hospitalization Request',
    decisionPath: [
      {
        id: '1',
        name: 'Eligibility Check',
        type: 'criteria_check',
        status: 'passed',
        details: 'Patient is active member with inpatient coverage',
        children: [
          {
            id: '1.1',
            name: 'Member Status',
            type: 'data_retrieval',
            status: 'passed',
            details: 'Active member since 2020',
            children: []
          },
          {
            id: '1.2',
            name: 'Coverage Verification',
            type: 'criteria_check',
            status: 'passed',
            details: 'Inpatient services covered under plan',
            children: []
          }
        ]
      },
      {
        id: '2',
        name: 'Clinical Criteria Assessment',
        type: 'analysis',
        status: 'passed',
        details: 'Patient meets criteria for inpatient care',
        children: [
          {
            id: '2.1',
            name: 'Oxygen Saturation Check',
            type: 'criteria_check',
            status: 'passed',
            details: 'O2 sat 85% < 90% threshold',
            children: []
          },
          {
            id: '2.2',
            name: 'Severity Assessment',
            type: 'analysis',
            status: 'passed',
            details: 'Severe pneumonia with complications',
            children: []
          }
        ]
      },
      {
        id: '3',
        name: 'Medical Necessity Review',
        type: 'criteria_check',
        status: 'passed',
        details: 'Inpatient care medically necessary',
        children: [
          {
            id: '3.1',
            name: 'Guideline Compliance',
            type: 'criteria_check',
            status: 'passed',
            details: 'Meets MCG Pneumonia Guidelines',
            children: []
          },
          {
            id: '3.2',
            name: 'Alternative Care Assessment',
            type: 'analysis',
            status: 'passed',
            details: 'Outpatient care not appropriate',
            children: []
          }
        ]
      },
      {
        id: '4',
        name: 'Risk Assessment',
        type: 'analysis',
        status: 'passed',
        details: 'Low risk for adverse outcomes',
        children: [
          {
            id: '4.1',
            name: 'Fraud Detection',
            type: 'criteria_check',
            status: 'passed',
            details: 'No red flags detected',
            children: []
          },
          {
            id: '4.2',
            name: 'Provider Verification',
            type: 'criteria_check',
            status: 'passed',
            details: 'Provider in-network and credentialed',
            children: []
          }
        ]
      },
      {
        id: '5',
        name: 'Final Decision',
        type: 'decision',
        status: 'passed',
        details: 'APPROVE - 3 days initial authorization',
        children: []
      }
    ],
    confidence: 0.95,
    outcome: 'APPROVED',
    alternatives: [
      'Approve for 2 days with extension review',
      'Approve for 5 days with monitoring',
      'Request additional clinical information'
    ],
    visualizations: [
      {
        type: 'flowchart',
        data: {},
        title: 'Decision Flow Diagram'
      },
      {
        type: 'timeline',
        data: {},
        title: 'Processing Timeline'
      }
    ]
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    // Simulate step-by-step processing
    for (let step = 0; step < mockSimulationResult.decisionPath.length; step++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(step + 1);
    }
    
    setSimulationResult(mockSimulationResult);
    setIsRunning(false);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'failed': return <CancelIcon sx={{ color: 'error.main' }} />;
      case 'pending': return <InfoIcon sx={{ color: 'info.main' }} />;
      default: return <WarningIcon sx={{ color: 'warning.main' }} />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'info';
      default: return 'warning';
    }
  };

  const renderDecisionNode = (node: DecisionNode, level: number = 0) => (
    <Box key={node.id} sx={{ ml: level * 2 }}>
      <Paper sx={{ p: 2, mb: 1, backgroundColor: level === 0 ? 'primary.light' : 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getStepIcon(node.status)}
          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
            {node.name}
          </Typography>
          <Chip
            label={node.status}
            color={getStepColor(node.status)}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {node.details}
        </Typography>
        {node.children && node.children.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {node.children.map(child => renderDecisionNode(child, level + 1))}
          </Box>
        )}
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          AI Decision Simulation
        </Typography>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PsychologyIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Simulation Controls
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="body1">
                Run a detailed simulation of the AI decision process for case {caseId}. 
                This will show you step-by-step how the AI analyzes the case and reaches its recommendation.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                variant="contained"
                onClick={runSimulation}
                disabled={isRunning}
                startIcon={<AssessmentIcon />}
                fullWidth
              >
                {isRunning ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isRunning && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Simulation in Progress...
            </Typography>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Step {currentStep} of {mockSimulationResult.decisionPath.length}: Processing decision criteria...
            </Typography>
          </CardContent>
        </Card>
      )}

      {simulationResult && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Simulation Results
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {simulationResult.outcome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Final Decision
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {(simulationResult.confidence * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confidence Level
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      {simulationResult.decisionPath.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Decision Steps
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Scenario:</strong> {simulationResult.scenario}
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Decision Process Flow
              </Typography>
              {simulationResult.decisionPath.map(node => renderDecisionNode(node))}
            </CardContent>
          </Card>

          {simulationResult.alternatives.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Alternative Approaches
                </Typography>
                <List>
                  {simulationResult.alternatives.map((alternative, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <VisibilityIcon />
                      </ListItemIcon>
                      <ListItemText primary={alternative} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DecisionSimulation;
