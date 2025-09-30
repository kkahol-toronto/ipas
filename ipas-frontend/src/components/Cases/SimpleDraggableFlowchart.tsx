import React, { useState, useRef, useEffect, useCallback } from 'react';
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

interface SimpleDraggableFlowchartProps {
  caseId: string;
}

const SimpleDraggableFlowchart: React.FC<SimpleDraggableFlowchartProps> = ({ caseId }) => {
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [stepDetailsOpen, setStepDetailsOpen] = useState(false);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Simplified Process Steps - Only Start and Auth Intake
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
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
      nextSteps: [],
      position: { x: 300, y: 50 }
    }
  ]);

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

  const handleMouseDown = (e: React.MouseEvent, stepId: string) => {
    e.preventDefault();
    setDraggedStep(stepId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedStep || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    setProcessSteps(prev => 
      prev.map(step => 
        step.id === draggedStep 
          ? { ...step, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : step
      )
    );
  }, [draggedStep, dragOffset]);

  const handleMouseUp = () => {
    setDraggedStep(null);
  };

  useEffect(() => {
    if (draggedStep) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedStep, dragOffset, handleMouseMove]);

  const handleStepClick = (step: ProcessStep) => {
    setSelectedStep(step);
    setStepDetailsOpen(true);
  };

  const renderConnector = (fromStep: ProcessStep, toStep: ProcessStep, condition?: string) => {
    // Calculate edge points based on relative positions
    const fromLeft = fromStep.position.x;
    const fromRight = fromStep.position.x + 200; // 200px width
    const fromCenterX = fromStep.position.x + 100;
    const fromCenterY = fromStep.position.y + 25;
    
    const toLeft = toStep.position.x;
    const toRight = toStep.position.x + 200;
    const toCenterX = toStep.position.x + 100;
    const toCenterY = toStep.position.y + 25;
    
    // Determine which edges to connect
    let fromX: number, fromY: number, toX: number, toY: number;
    
    const dx = toCenterX - fromCenterX;
    const dy = toCenterY - fromCenterY;
    
    if (dx > 0) {
      // Target is to the right of source - connect right side to left side
      fromX = fromRight; // Right edge of source
      toX = toLeft;      // Left edge of target
      fromY = fromStep.position.y + 85; // 85px from top of block
      toY = toStep.position.y + 85;     // 85px from top of block
    } else {
      // Target is to the left of source - connect left side to right side
      fromX = fromLeft;  // Left edge of source
      toX = toRight;     // Right edge of target
      fromY = fromStep.position.y + 85; // 85px from top of block
      toY = toStep.position.y + 85;     // 85px from top of block
    }
    
    // Calculate right-angle path
    let pathData: string;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection: go right/left first, then up/down
      const midX = fromX + (toX - fromX) / 2;
      pathData = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
    } else {
      // Vertical connection: go up/down first, then right/left
      const midY = fromY + (toY - fromY) / 2;
      pathData = `M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}`;
    }
    
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    return (
      <g key={`${fromStep.id}-${toStep.id}`}>
        <path
          d={pathData}
          stroke={getStatusColor(fromStep.status)}
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          style={{ 
            filter: condition ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none',
            cursor: 'pointer',
            transition: 'stroke-width 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.strokeWidth = '3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.strokeWidth = '2';
          }}
        />
        {condition && (
          <text
            x={midX}
            y={midY - 8}
            fontSize="10"
            fill="#666"
            textAnchor="middle"
            style={{ 
              fontWeight: 'bold',
              filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.8))'
            }}
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
            Simplified IPAS Flow - Case #{caseId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="In Progress" color="warning" size="small" />
            <Chip label="1/2 Steps Complete" color="info" size="small" />
          </Box>
        </Box>

        {/* Simple Draggable Flowchart */}
        <Box 
          ref={containerRef}
          sx={{ 
            height: 600, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#fafafa'
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
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
          </svg>

          {/* Render draggable nodes */}
          {processSteps.map(step => (
            <Paper
              key={step.id}
              sx={{
                position: 'absolute',
                left: step.position.x,
                top: step.position.y,
                width: 200,
                p: 2,
                cursor: draggedStep === step.id ? 'grabbing' : 'grab',
                border: `2px solid ${getStatusColor(step.status)}`,
                borderRadius: 2,
                backgroundColor: 'white',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'scale(1.02)',
                  transition: 'all 0.2s'
                },
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleMouseDown(e, step.id)}
              onClick={() => handleStepClick(step)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getTypeIcon(step.type)}
                <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
                  {step.name}
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  {getStatusIcon(step.status)}
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {step.description}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={step.status.toUpperCase()}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(step.status),
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
            </Paper>
          ))}
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

export default SimpleDraggableFlowchart;
