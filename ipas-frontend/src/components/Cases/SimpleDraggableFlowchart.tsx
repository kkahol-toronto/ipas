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
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  ButtonGroup
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Description as DocumentIcon,
  Psychology as AIIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Gavel as DecisionIcon,
  Download as DownloadIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Remove as RemoveIcon
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [showMessage, setShowMessage] = useState<string>('');
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<'approve' | 'partial' | 'decline' | null>(null);
  const [justification, setJustification] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Get initial process steps based on case ID
  const getInitialProcessSteps = useCallback((): ProcessStep[] => {
    // Case PA-2024-002: Complex review workflow (non-gold, high amount)
    if (caseId === 'PA-2024-002') {
      return [
        {
          id: 'start',
          name: 'Start',
          type: 'start',
          status: 'pending',
          description: 'Initiates the prior authorization case processing workflow',
          subSteps: ['Case ID Generation', 'Initial Data Collection'],
          nextSteps: ['auth-intake'],
          position: { x: 50, y: 50 }
        },
        {
          id: 'auth-intake',
          name: 'Auth Intake',
          type: 'process',
          status: 'pending',
          description: 'Multi-modal document ingestion and data extraction',
          subSteps: ['Email', 'Mail', 'Fax', 'Call', 'Portal', 'EDI/FHIR', 'Auth ID'],
          nextSteps: ['auth-triage'],
          position: { x: 300, y: 50 }
        },
        {
          id: 'auth-triage',
          name: 'Auth Triage',
          type: 'process',
          status: 'pending',
          description: 'Data validation, guideline matching, and approval determination',
          subSteps: ['Data Completeness', 'Guidelines', 'Insurance', 'Priority', 'Decision'],
          nextSteps: ['member-verification'],
          position: { x: 550, y: 50 }
        },
        {
          id: 'member-verification',
          name: 'Member Verification',
          type: 'process',
          status: 'pending',
          description: 'Verify member eligibility and coverage details',
          subSteps: ['Eligibility Check', 'Coverage Verification', 'Benefits Analysis'],
          nextSteps: ['data-enrichment'],
          position: { x: 800, y: 50 }
        },
        {
          id: 'data-enrichment',
          name: 'Data Enrichment',
          type: 'process',
          status: 'pending',
          description: 'Enrich case data with additional clinical information',
          subSteps: ['Medical History', 'Lab Results', 'External Records'],
          nextSteps: ['gap-assessment'],
          position: { x: 1050, y: 50 }
        },
        {
          id: 'gap-assessment',
          name: 'Gap Assessment',
          type: 'process',
          status: 'pending',
          description: 'Identify and assess data gaps',
          subSteps: ['Gap Identification', 'Gap Analysis', 'Gap Resolution'],
          nextSteps: ['data-prediction'],
          position: { x: 1300, y: 50 }
        },
        {
          id: 'data-prediction',
          name: 'Data Prediction',
          type: 'process',
          status: 'pending',
          description: 'ML-based prediction and risk assessment',
          subSteps: ['Risk Scoring', 'Outcome Prediction', 'Confidence Analysis'],
          nextSteps: ['clinical-summarization'],
          position: { x: 50, y: 250 }
        },
        {
          id: 'clinical-summarization',
          name: 'Clinical Summarization',
          type: 'process',
          status: 'pending',
          description: 'Generate comprehensive clinical summary',
          subSteps: ['Data Synthesis', 'Summary Generation', 'Key Findings'],
          nextSteps: ['clinical-review-planning'],
          position: { x: 300, y: 250 }
        },
        {
          id: 'clinical-review-planning',
          name: 'Clinical Review Planning',
          type: 'process',
          status: 'pending',
          description: 'Plan clinical review strategy',
          subSteps: ['Reviewer Assignment', 'Review Criteria', 'Timeline Planning'],
          nextSteps: ['clinical-decisioning'],
          position: { x: 550, y: 250 }
        },
        {
          id: 'clinical-decisioning',
          name: 'Clinical Decisioning',
          type: 'decision',
          status: 'pending',
          description: 'Final clinical decision on authorization',
          subSteps: ['Medical Necessity Review', 'Clinical Guidelines', 'Final Decision'],
          nextSteps: ['provider-notification'],
          position: { x: 800, y: 250 }
        },
        {
          id: 'provider-notification',
          name: 'Provider Notification',
          type: 'process',
          status: 'pending',
          description: 'Generate letter and notify provider',
          subSteps: ['Letter Creation', 'Letter Generation', 'Notification'],
          nextSteps: [],
          position: { x: 800, y: 450 }
        }
      ];
    }
    
    // Case PA-2024-003: Partial approval workflow (coverage limit)
    if (caseId === 'PA-2024-003') {
      return [
        {
          id: 'start',
          name: 'Start',
          type: 'start',
          status: 'pending',
          description: 'Initiates the prior authorization case processing workflow',
          subSteps: ['Case ID Generation', 'Initial Data Collection'],
          nextSteps: ['auth-intake'],
          position: { x: 50, y: 50 }
        },
        {
          id: 'auth-intake',
          name: 'Auth Intake',
          type: 'process',
          status: 'pending',
          description: 'Multi-modal document ingestion and data extraction',
          subSteps: ['Email', 'Mail', 'Fax', 'Call', 'Portal', 'EDI/FHIR', 'Auth ID'],
          nextSteps: ['auth-triage'],
          position: { x: 300, y: 50 }
        },
        {
          id: 'auth-triage',
          name: 'Auth Triage',
          type: 'process',
          status: 'pending',
          description: 'Data validation, guideline matching, and approval determination',
          subSteps: ['Data Completeness', 'Guidelines', 'Insurance', 'Priority', 'Decision'],
          nextSteps: ['member-verification'],
          position: { x: 550, y: 50 }
        },
        {
          id: 'member-verification',
          name: 'Member Verification',
          type: 'process',
          status: 'pending',
          description: 'Verify member eligibility and coverage details',
          subSteps: ['Eligibility Check', 'Coverage Verification', 'Benefits Analysis'],
          nextSteps: ['data-enrichment'],
          position: { x: 800, y: 50 }
        },
        {
          id: 'data-enrichment',
          name: 'Data Enrichment',
          type: 'process',
          status: 'pending',
          description: 'Enrich case data with additional clinical information',
          subSteps: ['Medical History', 'Lab Results', 'External Records'],
          nextSteps: ['gap-assessment'],
          position: { x: 1050, y: 50 }
        },
        {
          id: 'gap-assessment',
          name: 'Gap Assessment',
          type: 'process',
          status: 'pending',
          description: 'Identify and assess data gaps',
          subSteps: ['Gap Identification', 'Gap Analysis', 'Gap Resolution'],
          nextSteps: ['data-prediction'],
          position: { x: 1300, y: 50 }
        },
        {
          id: 'data-prediction',
          name: 'Data Prediction',
          type: 'process',
          status: 'pending',
          description: 'ML-based prediction and risk assessment',
          subSteps: ['Risk Scoring', 'Outcome Prediction', 'Confidence Analysis'],
          nextSteps: ['clinical-summarization'],
          position: { x: 50, y: 250 }
        },
        {
          id: 'clinical-summarization',
          name: 'Clinical Summarization',
          type: 'process',
          status: 'pending',
          description: 'Generate comprehensive clinical summary',
          subSteps: ['Data Synthesis', 'Summary Generation', 'Key Findings'],
          nextSteps: ['clinical-review-planning'],
          position: { x: 300, y: 250 }
        },
        {
          id: 'clinical-review-planning',
          name: 'Clinical Review Planning',
          type: 'process',
          status: 'pending',
          description: 'Plan clinical review strategy',
          subSteps: ['Reviewer Assignment', 'Review Criteria', 'Timeline Planning'],
          nextSteps: ['clinical-decisioning'],
          position: { x: 550, y: 250 }
        },
        {
          id: 'clinical-decisioning',
          name: 'Clinical Decisioning',
          type: 'decision',
          status: 'pending',
          description: 'Final clinical decision on authorization',
          subSteps: ['Medical Necessity Review', 'Clinical Guidelines', 'Final Decision'],
          nextSteps: ['provider-notification'],
          position: { x: 800, y: 250 }
        },
        {
          id: 'provider-notification',
          name: 'Provider Notification',
          type: 'process',
          status: 'pending',
          description: 'Generate letter and notify provider',
          subSteps: ['Letter Creation', 'Letter Generation', 'Notification'],
          nextSteps: [],
          position: { x: 800, y: 450 }
        }
      ];
    }
    
    // Case PA-2024-001: Simple automated approval workflow (gold status)
    return [
    {
      id: 'start',
      name: 'Start',
      type: 'start',
      status: 'pending',
      description: 'Initiates the prior authorization case processing workflow',
      subSteps: ['Case ID Generation', 'Initial Data Collection'],
      nextSteps: ['auth-intake'],
      position: { x: 50, y: 100 }
    },
    {
      id: 'auth-intake',
      name: 'Auth Intake',
      type: 'process',
      status: 'pending',
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
      position: { x: 300, y: 100 }
    },
    {
      id: 'auth-triage',
      name: 'Auth Triage',
      type: 'process',
      status: 'pending',
      description: 'Data validation, guideline matching, and approval determination',
      subSteps: [
        'Data Completeness Check',
        'Guideline Matching',
        'Insurance Status Check',
        'Priority Assignment',
        'Approval Decision'
      ],
      nextSteps: ['provider-notification'],
      position: { x: 550, y: 100 }
    },
    {
      id: 'provider-notification',
      name: 'Provider Notification',
      type: 'process',
      status: 'pending',
      description: 'Generate approval letter and notify provider',
      subSteps: [
        'Letter Creation',
        'Letter Generation',
        'Provider Notification',
        'Notification Sent'
      ],
      nextSteps: [],
      position: { x: 800, y: 100 }
    }
    ];
  }, [caseId]);

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(() => {
    const steps = getInitialProcessSteps();
    console.log('Initial process steps for case', caseId, ':', steps.map(s => ({ id: s.id, position: s.position })));
    return steps;
  });

  // Load session state from localStorage on component mount
  useEffect(() => {
    const loadSessionState = () => {
      const sessionKey = `ipas_orchestration_${caseId}`;
      const savedSession = localStorage.getItem(sessionKey);
      
      console.log('Loading orchestration session:', { sessionKey, savedSession });
      
      // Force clear old sessions for PA-2024-002 to ensure new layout loads
      if (caseId === 'PA-2024-002' && savedSession) {
        console.log('Clearing old PA-2024-002 session to load new 11-stage layout');
        localStorage.removeItem(sessionKey);
        setSessionLoaded(true);
        return;
      }
      
      if (savedSession) {
        try {
          const parsedSession = JSON.parse(savedSession);
          const savedSteps = parsedSession.processSteps || [];
          const savedAnimationStep = parsedSession.animationStep || 0;
          const savedMessage = parsedSession.showMessage || '';
          
          console.log('Loaded session state:', { savedSteps, savedAnimationStep, savedMessage });
          
          // Validate that saved steps match the current case workflow
          const expectedSteps = getInitialProcessSteps();
          const hasAllSteps = savedSteps.length === expectedSteps.length && 
                             expectedSteps.every(expected => 
                               savedSteps.some((s: ProcessStep) => s.id === expected.id)
                             );
          
          if (hasAllSteps) {
            setProcessSteps(savedSteps);
            
            if (savedAnimationStep > 0) {
              setAnimationStep(savedAnimationStep);
              setShowMessage(savedMessage);
            }
          } else {
            console.warn('Saved session has outdated step configuration, clearing session');
            localStorage.removeItem(sessionKey);
          }
        } catch (error) {
          console.error('Error loading session state:', error);
        }
      }
      
      setSessionLoaded(true);
    };

    loadSessionState();
  }, [caseId]);

  // Save session state to localStorage whenever it changes
  useEffect(() => {
    if (!sessionLoaded) return;
    
    const sessionKey = `ipas_orchestration_${caseId}`;
    const sessionState = {
      processSteps,
      animationStep,
      showMessage,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(sessionKey, JSON.stringify(sessionState));
    console.log('Saving orchestration session:', sessionState);
  }, [caseId, processSteps, animationStep, showMessage, sessionLoaded]);

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
    if (step.id === 'start') {
      if (step.status === 'pending') {
        // Start the animation sequence
        startAnimationSequence();
      } else if (step.status === 'completed') {
        // Show option to restart or continue
        setSelectedStep(step);
        setStepDetailsOpen(true);
      }
    } else if (step.id === 'auth-intake') {
      if (step.status === 'pending') {
        // Check if we can start Auth Intake (Start must be completed)
        const startStep = processSteps.find(s => s.id === 'start');
        if (startStep?.status === 'completed') {
          startAuthIntakeProcess();
        } else {
          setShowMessage('Please complete the Start step first');
        }
      } else if (step.status === 'running') {
        // Show current progress
        setSelectedStep(step);
        setStepDetailsOpen(true);
      } else if (step.status === 'completed') {
        // Show completion details
        setSelectedStep(step);
        setStepDetailsOpen(true);
      }
    } else if (step.id === 'auth-triage') {
      if (step.status === 'pending') {
        // Check if we can start Auth Triage (Auth Intake must be completed)
        const authIntakeStep = processSteps.find(s => s.id === 'auth-intake');
        if (authIntakeStep?.status === 'completed') {
          startAuthTriageProcess();
        } else {
          setShowMessage('Please complete the Auth Intake step first');
        }
      } else if (step.status === 'running') {
        // Show current progress
        setSelectedStep(step);
        setStepDetailsOpen(true);
      } else if (step.status === 'completed') {
        // Show completion details
        setSelectedStep(step);
        setStepDetailsOpen(true);
      }
    } else if (step.id === 'provider-notification') {
      if (step.status === 'pending') {
        // Check if we can start Provider Notification (Auth Triage must be completed)
        const authTriageStep = processSteps.find(s => s.id === 'auth-triage');
        if (authTriageStep?.status === 'completed') {
          startProviderNotificationProcess();
        } else {
          setShowMessage('Please complete the Auth Triage step first');
        }
      } else if (step.status === 'running') {
        // Show current progress
        setSelectedStep(step);
        setStepDetailsOpen(true);
      } else if (step.status === 'completed') {
        // Show completion details with download link
        setSelectedStep(step);
        setStepDetailsOpen(true);
      }
    } else {
      setSelectedStep(step);
      setStepDetailsOpen(true);
    }
  };

  const startAnimationSequence = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    setShowMessage('');

    // Step 1: Show case number
    setTimeout(() => {
      setShowMessage(`Case #${caseId} Generated`);
      setAnimationStep(1);
    }, 500);

    // Step 2: Show initial data collection
    setTimeout(() => {
      setShowMessage('Initial Data Collection...');
      setAnimationStep(2);
    }, 2000);

    // Step 3: Show clinical guidelines message
    setTimeout(() => {
      setShowMessage('Clinical Guidelines Ingested ✓');
      setAnimationStep(3);
    }, 3500);

    // Step 4: Animate connector and transition to Auth Intake
    setTimeout(() => {
      setShowMessage('Connecting to Auth Intake...');
      setAnimationStep(4);
      
      // Update Auth Intake status to running
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'auth-intake' 
            ? { ...step, status: 'running' }
            : step
        )
      );
    }, 5000);

    // Step 5: Complete Start step and enable Auth Intake
    setTimeout(() => {
      setShowMessage('Start process completed ✓');
      setAnimationStep(5);
      
      // Mark Start as completed
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'start' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Automatically proceed to Auth Intake after a short delay
      setTimeout(() => {
        setShowMessage('Proceeding to Auth Intake...');
        setAnimationStep(6);
        
        // Update Auth Intake to running status
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'auth-intake' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        
        // Start the Auth Intake process
        startAuthIntakeProcess();
      }, 2000);
    }, 7000);
  };

  const startAuthIntakeProcess = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    setShowMessage('');

    // Update Auth Intake status to running
    setProcessSteps(prev => 
      prev.map(step => 
        step.id === 'auth-intake' 
          ? { ...step, status: 'running' }
          : step
      )
    );

    // Step 1: Show Auth Intake start
    setTimeout(() => {
      setShowMessage('Auth Intake Process Starting...');
      setAnimationStep(1);
    }, 500);

    // Step 2: Check document extraction status
    setTimeout(() => {
      checkDocumentExtractionStatus();
    }, 2000);
  };

  const checkDocumentExtractionStatus = () => {
    // Check localStorage for extraction status
    const storageKey = `ipas_extractions_${caseId}`;
    const savedState = localStorage.getItem(storageKey);
    
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const extractedDocs = parsedState.extractedDocuments || [];
        const totalDocuments = 5; // Based on our case structure
        
        if (extractedDocs.length === 0) {
          // No documents extracted - start extraction
          setShowMessage('Starting Document Extraction...');
          setAnimationStep(5);
          triggerDocumentExtraction();
        } else if (extractedDocs.length < totalDocuments) {
          // Partial extraction - continue
          setShowMessage(`Found ${extractedDocs.length}/${totalDocuments} extracted documents`);
          setAnimationStep(5);
          
          setTimeout(() => {
            setShowMessage('Continuing document extraction...');
            setAnimationStep(6);
            triggerDocumentExtraction();
          }, 2000);
        } else {
          // All documents extracted - show data
          setShowMessage('All documents already extracted ✓');
          setAnimationStep(5);
          showAuthIntakeData();
        }
      } catch (error) {
        console.error('Error checking extraction status:', error);
        setShowMessage('Error checking extraction status');
        setAnimationStep(5);
        showAuthIntakeData();
      }
    } else {
      // No extraction data - start extraction
      setShowMessage('No extraction data found - starting extraction...');
      setAnimationStep(5);
      triggerDocumentExtraction();
    }
  };

  const triggerDocumentExtraction = () => {
    // Simulate extraction process
    setTimeout(() => {
      setShowMessage('Extracting data from documents...');
      setAnimationStep(6);
    }, 2000);
    
    setTimeout(() => {
      setShowMessage('Document extraction in progress...');
      setAnimationStep(7);
    }, 4000);
    
    setTimeout(() => {
      setShowMessage('Documents extracted successfully ✓');
      setAnimationStep(8);
      
      // Simulate saving extraction data to localStorage
      const storageKey = `ipas_extractions_${caseId}`;
      const extractionData = {
        extractedDocuments: ['1', '2', '3', '4', '5'], // All document IDs
        extractionTimestamps: {
          '1': new Date().toISOString(),
          '2': new Date().toISOString(),
          '3': new Date().toISOString(),
          '4': new Date().toISOString(),
          '5': new Date().toISOString()
        },
        // Add extracted data fields for Case 001 to ensure success
        extractedData: {
          email: 'john.doe@email.com',
          mail: '123 Main St, Anytown, USA',
          fax: '+1-555-123-4567',
          phone: '+1-555-987-6543',
          edi_fhir: 'FHIR-R4-Resource',
          auth_id: 'AUTH-2024-001'
        }
      };
      localStorage.setItem(storageKey, JSON.stringify(extractionData));
      
      showAuthIntakeData();
    }, 6000);
  };

  const showAuthIntakeData = () => {
    // Check for specific data fields in extracted documents
    const checkAuthIntakeData = () => {
      const requiredFields = [
        { name: 'Email', field: 'email' },
        { name: 'Mail', field: 'mail' },
        { name: 'Fax', field: 'fax' },
        { name: 'Phone Number', field: 'phone' },
        { name: 'EDI/FHIR', field: 'edi_fhir' },
        { name: 'Auth ID', field: 'auth_id' }
      ];

      let foundFields = 0;
      let currentStep = 9;

      // Check each field in extracted documents
      requiredFields.forEach((field, index) => {
        setTimeout(() => {
          // Check if field exists in extracted data
          const isFound = checkFieldInExtractedData(field.field);
          
          if (isFound) {
            foundFields++;
            setShowMessage(`✓ ${field.name} found`);
            setAnimationStep(currentStep + index);
          } else {
            setShowMessage(`✗ ${field.name} not found`);
            setAnimationStep(currentStep + index);
          }
        }, (index + 1) * 1000);
      });

      // Show completion after all checks
      setTimeout(() => {
        if (foundFields === requiredFields.length) {
          setShowMessage('🎉 Auth Intake Agent work completed with success!');
          setAnimationStep(15);
          
          // Update Auth Intake status to completed
          setProcessSteps(prev => 
            prev.map(step => 
              step.id === 'auth-intake' 
                ? { ...step, status: 'completed' }
                : step
            )
          );
          
          // Automatically proceed to Auth Triage after a short delay
          setTimeout(() => {
            setShowMessage('Proceeding to Auth Triage...');
            setAnimationStep(16);
            
            // Update Auth Triage to running status
            setProcessSteps(prev => 
              prev.map(step => 
                step.id === 'auth-triage' 
                  ? { ...step, status: 'running' }
                  : step
              )
            );
            
            // Keep animation active for 2 more seconds while transitioning
            setTimeout(() => {
              // Start the Auth Triage process
              startAuthTriageProcess();
            }, 2000);
          }, 2000);
        } else {
          setShowMessage(`⚠️ Auth Intake partially completed (${foundFields}/${requiredFields.length} fields found)`);
          setAnimationStep(15);
        }
        
        setIsAnimating(false);
      }, (requiredFields.length + 1) * 1000);
    };

    // Start checking data
    setTimeout(() => {
      setShowMessage('Checking extracted data for required fields...');
      setAnimationStep(9);
    }, 1000);

    setTimeout(() => {
      checkAuthIntakeData();
    }, 2000);
  };

  const checkFieldInExtractedData = (fieldName: string): boolean => {
    // Check localStorage for extracted documents
    const storageKey = `ipas_extractions_${caseId}`;
    const savedState = localStorage.getItem(storageKey);
    
    if (!savedState) return false;
    
    try {
      const parsedState = JSON.parse(savedState);
      const extractedData = parsedState.extractedData || {};
      
      // Check if the specific field exists in extracted data
      if (extractedData[fieldName]) {
        return true;
      }
      
      // For Case 001, ensure all fields are found for demo purposes
      if (caseId === 'PA-2024-001' || caseId === '001') {
        return true;
      }
      
      // For other cases, use realistic success rates
      const fieldSuccessRates: { [key: string]: number } = {
        'email': 0.9,      // 90% success rate
        'mail': 0.85,      // 85% success rate  
        'fax': 0.7,        // 70% success rate
        'phone': 0.95,     // 95% success rate
        'edi_fhir': 0.6,   // 60% success rate
        'auth_id': 0.8     // 80% success rate
      };
      
      const successRate = fieldSuccessRates[fieldName] || 0.5;
      return Math.random() < successRate;
    } catch (error) {
      console.error('Error checking extracted data:', error);
      return false;
    }
  };

  const startAuthTriageProcess = () => {
    setIsAnimating(true);
    setAnimationStep(17); // Keep step > 16 to maintain connector animation
    setShowMessage('');

    // Step 1: Data Completeness Check
    setTimeout(() => {
      setShowMessage('Checking data completeness...');
      setAnimationStep(18);
    }, 1000);

    setTimeout(() => {
      setShowMessage('✓ All required data fields present');
      setAnimationStep(19);
    }, 2000);

    // Step 2: Guideline Matching
    setTimeout(() => {
      setShowMessage('Matching against clinical guidelines...');
      setAnimationStep(20);
    }, 3000);

    setTimeout(() => {
      setShowMessage('✓ Guidelines matched successfully');
      setAnimationStep(21);
    }, 4000);

    // Step 3: Insurance Status Check
    setTimeout(() => {
      setShowMessage('Checking insurance status...');
      setAnimationStep(22);
    }, 5000);

    setTimeout(() => {
      if (caseId === 'PA-2024-001') {
        setShowMessage('✓ Gold status detected - Premium coverage');
      } else if (caseId === 'PA-2024-002') {
        setShowMessage('✓ Standard coverage - No gold status');
      } else {
        setShowMessage('✓ Insurance status verified');
      }
      setAnimationStep(23);
    }, 6000);

    // Step 4: Priority Assignment
    setTimeout(() => {
      setShowMessage('Assigning priority level...');
      setAnimationStep(24);
    }, 7000);

    setTimeout(() => {
      if (caseId === 'PA-2024-002') {
        setShowMessage('✓ High priority assigned (Amount > $5,000)');
      } else {
        setShowMessage('✓ High priority assigned');
      }
      setAnimationStep(25);
    }, 8000);

    // Step 5: Approval Decision
    setTimeout(() => {
      setShowMessage('Determining approval status...');
      setAnimationStep(26);
    }, 9000);

    setTimeout(() => {
      // Case-specific decision
      if (caseId === 'PA-2024-001') {
        setShowMessage('🎉 AUTOMATED APPROVAL - Case approved!');
      } else if (caseId === 'PA-2024-002') {
        setShowMessage('⚠️ Requires Additional Review - High amount, standard coverage');
      } else {
        setShowMessage('✓ Auth Triage completed');
      }
      setAnimationStep(27);
      
      // Update Auth Triage status to completed
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'auth-triage' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Route to next stage based on case
      setTimeout(() => {
        if (caseId === 'PA-2024-001') {
          // Case-001: Direct to Provider Notification
          setShowMessage('Proceeding to Provider Notification...');
          setAnimationStep(28);
          setProcessSteps(prev => 
            prev.map(step => 
              step.id === 'provider-notification' 
                ? { ...step, status: 'running' }
                : step
            )
          );
          setTimeout(() => {
            startProviderNotificationProcess();
          }, 2000);
        } else if (caseId === 'PA-2024-002') {
          // Case-002: Proceed to Member Verification
          setShowMessage('Proceeding to Member Verification...');
          setAnimationStep(28);
          setProcessSteps(prev => 
            prev.map(step => 
              step.id === 'member-verification' 
                ? { ...step, status: 'running' }
                : step
            )
          );
          setTimeout(() => {
            startMemberVerificationProcess();
          }, 2000);
        }
      }, 2000);
    }, 10000);
  };

  const startProviderNotificationProcess = () => {
    setIsAnimating(true);
    setAnimationStep(29); // Keep step > 28 to maintain connector animation
    setShowMessage('');

    // Step 1: Letter Creation
    setTimeout(() => {
      setShowMessage('Creating approval letter...');
      setAnimationStep(30);
    }, 1000);

    setTimeout(() => {
      setShowMessage('✓ Letter template loaded');
      setAnimationStep(31);
    }, 2000);

    // Step 2: Letter Generation
    setTimeout(() => {
      setShowMessage('Generating PDF document...');
      setAnimationStep(32);
    }, 3000);

    setTimeout(() => {
      setShowMessage('✓ Approval letter generated');
      setAnimationStep(33);
    }, 4000);

    // Step 3: Provider Notification
    setTimeout(() => {
      setShowMessage('Sending notification to provider...');
      setAnimationStep(34);
    }, 5000);

    setTimeout(() => {
      setShowMessage('✓ Notification sent successfully');
      setAnimationStep(35);
    }, 6000);

    // Step 4: Complete
    setTimeout(() => {
      setShowMessage('🎉 Provider Notification Complete - Letter available for download!');
      setAnimationStep(36);
      
      // Update Provider Notification status to completed
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'provider-notification' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Mark letter as generated in localStorage for dashboard notification
      if (caseId === 'PA-2024-001') {
        localStorage.setItem('ipas_letter_generated_PA-2024-001', new Date().toISOString());
      }
      
      setIsAnimating(false);
    }, 7000);
  };

  const startMemberVerificationProcess = () => {
    setIsAnimating(true);
    setAnimationStep(29);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('Verifying member eligibility...');
      setAnimationStep(30);
    }, 1000);

    setTimeout(() => {
      setShowMessage('✓ Member ID verified: INS987654321');
      setAnimationStep(31);
    }, 2000);

    setTimeout(() => {
      setShowMessage('Checking coverage details...');
      setAnimationStep(32);
    }, 3000);

    setTimeout(() => {
      if (caseId === 'PA-2024-003') {
        setShowMessage('⚠️ Coverage limit: $4,000 for knee arthroscopy (Requested: $8,000)');
      } else {
        setShowMessage('✓ Coverage verified - Active benefits');
      }
      setAnimationStep(33);
    }, 4000);

    setTimeout(() => {
      setShowMessage('✓ Member Verification complete');
      setAnimationStep(34);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'member-verification' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Proceed to Data Enrichment
      setTimeout(() => {
        setShowMessage('Proceeding to Data Enrichment...');
        setAnimationStep(35);
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'data-enrichment' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        setTimeout(() => {
          startDataEnrichmentProcess();
        }, 2000);
      }, 2000);
    }, 5000);
  };

  const startDataEnrichmentProcess = () => {
    setIsAnimating(true);
    setAnimationStep(36);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('⚡ Flashing clinical data...');
      setAnimationStep(37);
    }, 1000);

    setTimeout(() => {
      setShowMessage('📊 Stress test results found');
      setAnimationStep(38);
    }, 2000);

    setTimeout(() => {
      setShowMessage('✓ Clinical data loaded');
      setAnimationStep(39);
    }, 3000);

    setTimeout(() => {
      setShowMessage('Checking clinical guidelines...');
      setAnimationStep(40);
    }, 4000);

    setTimeout(() => {
      if (caseId === 'PA-2024-003') {
        setShowMessage('✓ Meets clinical guidelines for knee arthroscopy');
      } else {
        setShowMessage('✓ Meets clinical guidelines for cardiac catheterization');
      }
      setAnimationStep(41);
    }, 5000);

    setTimeout(() => {
      setShowMessage('Analyzing similar patient cases...');
      setAnimationStep(42);
    }, 6000);

    setTimeout(() => {
      setShowMessage('✓ 87% of similar patients were approved');
      setAnimationStep(43);
    }, 7000);

    setTimeout(() => {
      setShowMessage('✓ Data Enrichment complete');
      setAnimationStep(44);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'data-enrichment' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Proceed to Gap Assessment
      setTimeout(() => {
        setShowMessage('Proceeding to Gap Assessment...');
        setAnimationStep(45);
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'gap-assessment' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        setTimeout(() => {
          startGapAssessmentProcess();
        }, 2000);
      }, 2000);
    }, 8000);
  };

  const startGapAssessmentProcess = () => {
    setIsAnimating(true);
    setAnimationStep(46);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('Scanning for data gaps...');
      setAnimationStep(47);
    }, 1000);

    setTimeout(() => {
      setShowMessage('Analyzing documentation completeness...');
      setAnimationStep(48);
    }, 2000);

    setTimeout(() => {
      setShowMessage('✓ No gaps found in documentation');
      setAnimationStep(49);
    }, 3000);

    setTimeout(() => {
      setShowMessage('✓ Gap Assessment complete');
      setAnimationStep(50);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'gap-assessment' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Proceed to Data Prediction
      setTimeout(() => {
        setShowMessage('Proceeding to Data Prediction...');
        setAnimationStep(51);
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'data-prediction' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        setTimeout(() => {
          startDataPredictionProcess();
        }, 2000);
      }, 2000);
    }, 4000);
  };

  const startDataPredictionProcess = () => {
    setIsAnimating(true);
    setAnimationStep(52);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('Assembling clinical notes...');
      setAnimationStep(53);
    }, 1000);

    setTimeout(() => {
      setShowMessage('Running ML prediction model...');
      setAnimationStep(54);
    }, 2000);

    setTimeout(() => {
      setShowMessage('✓ Prediction: Case can be APPROVED');
      setAnimationStep(55);
    }, 3000);

    setTimeout(() => {
      setShowMessage('💬 Opening chat for case review...');
      setAnimationStep(56);
      // Open chat dialog
      setChatOpen(true);
      if (caseId === 'PA-2024-003') {
        setChatMessages([
          {
            role: 'assistant',
            content: `I've analyzed Case PA-2024-003 (Robert Davis - Knee Arthroscopy). The procedure is medically necessary and meets clinical guidelines. However, the insurance policy has a coverage limit of $4,000 for this condition, while the requested amount is $8,000. My recommendation is PARTIAL APPROVAL for $4,000. Do you have any questions?`
          }
        ]);
      } else {
        setChatMessages([
          {
            role: 'assistant',
            content: `I've analyzed Case PA-2024-002 (Mary Johnson - Cardiac Catheterization). Based on clinical guidelines, similar patient outcomes (87% approval rate), and medical necessity, my prediction is that this case can be APPROVED. Do you have any questions about the case?`
          }
        ]);
      }
    }, 4000);

    setTimeout(() => {
      setShowMessage('✓ Data Prediction complete');
      setAnimationStep(57);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'data-prediction' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Proceed to Clinical Summarization
      setTimeout(() => {
        setShowMessage('Proceeding to Clinical Summarization...');
        setAnimationStep(58);
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'clinical-summarization' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        setTimeout(() => {
          startClinicalSummarizationProcess();
        }, 2000);
      }, 2000);
    }, 5000);
  };

  const startClinicalSummarizationProcess = () => {
    setIsAnimating(true);
    setAnimationStep(59);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('Synthesizing clinical data...');
      setAnimationStep(60);
    }, 1000);

    setTimeout(() => {
      setShowMessage('Generating comprehensive summary...');
      setAnimationStep(61);
    }, 2000);

    setTimeout(() => {
      setShowMessage('✓ Clinical summary generated');
      setAnimationStep(62);
    }, 3000);

    setTimeout(() => {
      setShowMessage('✓ Clinical Summarization complete');
      setAnimationStep(63);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'clinical-summarization' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Proceed to Clinical Review Planning
      setTimeout(() => {
        setShowMessage('Proceeding to Clinical Review Planning...');
        setAnimationStep(64);
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'clinical-review-planning' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        setTimeout(() => {
          startClinicalReviewPlanningProcess();
        }, 2000);
      }, 2000);
    }, 4000);
  };

  const startClinicalReviewPlanningProcess = () => {
    setIsAnimating(true);
    setAnimationStep(65);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('Creating review plan...');
      setAnimationStep(66);
    }, 1000);

    setTimeout(() => {
      setShowMessage('✓ Review criteria established');
      setAnimationStep(67);
    }, 2000);

    setTimeout(() => {
      setShowMessage('✓ Timeline planned');
      setAnimationStep(68);
    }, 3000);

    setTimeout(() => {
      setShowMessage('✓ Clinical Review Planning complete');
      setAnimationStep(69);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'clinical-review-planning' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Proceed to Clinical Decisioning
      setTimeout(() => {
        setShowMessage('Proceeding to Clinical Decisioning...');
        setAnimationStep(70);
        setProcessSteps(prev => 
          prev.map(step => 
            step.id === 'clinical-decisioning' 
              ? { ...step, status: 'running' }
              : step
          )
        );
        setTimeout(() => {
          startClinicalDecisioningProcess();
        }, 2000);
      }, 2000);
    }, 4000);
  };

  const startClinicalDecisioningProcess = () => {
    setIsAnimating(true);
    setAnimationStep(71);
    setShowMessage('');

    setTimeout(() => {
      setShowMessage('Reviewing medical necessity...');
      setAnimationStep(72);
    }, 1000);

    setTimeout(() => {
      setShowMessage('Applying clinical guidelines...');
      setAnimationStep(73);
    }, 2000);

    setTimeout(() => {
      setShowMessage('🏥 Convening Clinical Panel Review...');
      setAnimationStep(74);
    }, 3000);

    // Reviewer 1: Cardiologist
    setTimeout(() => {
      setShowMessage('👨‍⚕️ Cardiologist: Reviewing cardiac catheterization necessity...');
      setAnimationStep(75);
    }, 4000);

    setTimeout(() => {
      setShowMessage('✓ Cardiologist recommends: APPROVE');
      setAnimationStep(76);
    }, 5500);

    // Reviewer 2: Medical Director
    setTimeout(() => {
      setShowMessage('👩‍⚕️ Medical Director: Reviewing cost-benefit analysis...');
      setAnimationStep(77);
    }, 6500);

    setTimeout(() => {
      setShowMessage('✓ Medical Director recommends: APPROVE');
      setAnimationStep(78);
    }, 8000);

    // Reviewer 3: Clinical Specialist
    setTimeout(() => {
      setShowMessage('👨‍⚕️ Clinical Specialist: Reviewing patient history and risk factors...');
      setAnimationStep(79);
    }, 9000);

    setTimeout(() => {
      setShowMessage('✓ Clinical Specialist recommends: APPROVE');
      setAnimationStep(80);
    }, 10500);

    // Reviewer 4: Quality Assurance
    setTimeout(() => {
      setShowMessage('👩‍⚕️ Quality Assurance: Reviewing compliance and guidelines...');
      setAnimationStep(81);
    }, 11500);

    setTimeout(() => {
      setShowMessage('✓ Quality Assurance recommends: APPROVE');
      setAnimationStep(82);
    }, 13000);

    // Panel consensus
    setTimeout(() => {
      setShowMessage('🎯 Panel Consensus: All 4 reviewers agree - APPROVE');
      setAnimationStep(83);
    }, 14000);

    setTimeout(() => {
      if (caseId === 'PA-2024-003') {
        setShowMessage('✓ Final Recommendation: PARTIAL APPROVAL ($4,000 of $8,000)');
      } else {
        setShowMessage('✓ Final Recommendation: APPROVE');
      }
      setAnimationStep(84);
    }, 15500);

    setTimeout(() => {
      setShowMessage('⏸️ Awaiting decision confirmation...');
      setAnimationStep(85);
      
      setProcessSteps(prev => 
        prev.map(step => 
          step.id === 'clinical-decisioning' 
            ? { ...step, status: 'completed' }
            : step
        )
      );
      
      // Show decision dialog
      setIsAnimating(false);
      setDecisionDialogOpen(true);
    }, 16500);
  };

  const clearSession = () => {
    const sessionKey = `ipas_orchestration_${caseId}`;
    localStorage.removeItem(sessionKey);
    
    // Reset to initial state based on case
    setProcessSteps(getInitialProcessSteps());
    setAnimationStep(0);
    setShowMessage('');
    setIsAnimating(false);
    setStepDetailsOpen(false);
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
    
    // Special case: Gap Assessment to Data Prediction (right to top)
    if (fromStep.id === 'gap-assessment' && toStep.id === 'data-prediction') {
      // Connect from right edge to top center
      fromX = 1500; // Gap Assessment right edge (1300 + 200)
      fromY = 135;  // Gap Assessment middle (50 + 85)
      toX = 150;    // Data Prediction top center (50 + 100)
      toY = 245;    // Data Prediction TOP edge - 5px above (position.y - 5)
      console.log('Gap Assessment to Data Prediction connector:', { 
        from: `(${fromX}, ${fromY})`, 
        to: `(${toX}, ${toY})`,
        fromDesc: 'Gap Assessment right edge',
        toDesc: 'Data Prediction TOP center'
      });
    } 
    // Special case: Clinical Decisioning to Provider Notification (bottom to top)
    else if (fromStep.id === 'clinical-decisioning' && toStep.id === 'provider-notification') {
      fromX = fromStep.position.x + 100; // Center of Clinical Decisioning
      fromY = fromStep.position.y + 170; // Bottom edge (assuming ~170px height)
      toX = toStep.position.x + 100; // Center top of Provider Notification
      toY = toStep.position.y; // Top edge
    } else if (dx > 0) {
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
    
    // Special handling for Gap Assessment to Data Prediction (right, down, left)
    if (fromStep.id === 'gap-assessment' && toStep.id === 'data-prediction') {
      // Go right 50px, down to target row, then left to target
      const rightExtend = fromX + 50;
      pathData = `M ${fromX} ${fromY} L ${rightExtend} ${fromY} L ${rightExtend} ${toY} L ${toX} ${toY}`;
      console.log('Gap Assessment to Data Prediction path:', pathData);
      console.log('This should arrive at TOP center of Data Prediction');
    }
    // Special handling for Clinical Decisioning to Provider Notification (straight down)
    else if (fromStep.id === 'clinical-decisioning' && toStep.id === 'provider-notification') {
      // Straight vertical line from bottom to top
      pathData = `M ${fromX} ${fromY} L ${toX} ${toY}`;
    } else if (Math.abs(dx) > Math.abs(dy)) {
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
             
             // Check if this connector should be animated (mutually exclusive)
             const shouldAnimateStartToIntake = isAnimating && animationStep >= 4 && animationStep < 16 && fromStep.id === 'start' && toStep.id === 'auth-intake';
             const shouldAnimateIntakeToTriage = isAnimating && animationStep >= 16 && animationStep < 28 && fromStep.id === 'auth-intake' && toStep.id === 'auth-triage';
             const shouldAnimateTriageToNotification = isAnimating && animationStep >= 28 && fromStep.id === 'auth-triage' && toStep.id === 'provider-notification';
             const shouldAnimate = shouldAnimateStartToIntake || shouldAnimateIntakeToTriage || shouldAnimateTriageToNotification;
             
             // Use downward arrowhead for Gap Assessment to Data Prediction
             const markerType = (fromStep.id === 'gap-assessment' && toStep.id === 'data-prediction') 
               ? 'url(#arrowhead-down)' 
               : 'url(#arrowhead)';
             
             return (
               <g key={`${fromStep.id}-${toStep.id}`}>
                 <path
                   d={pathData}
                   stroke={getStatusColor(fromStep.status)}
                   strokeWidth={shouldAnimate ? "4" : "2"}
                   fill="none"
                   markerEnd={markerType}
                   style={{ 
                     filter: condition ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none',
                     cursor: 'pointer',
                     transition: 'stroke-width 0.2s ease, stroke 0.2s ease',
                     strokeDasharray: shouldAnimate ? '10,5' : 'none',
                     animation: shouldAnimate ? 'dash 1s linear infinite' : 'none'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.strokeWidth = '3';
                     e.currentTarget.style.stroke = '#9c27b0'; // Violet color
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.strokeWidth = shouldAnimate ? '4' : '2';
                     e.currentTarget.style.stroke = getStatusColor(fromStep.status);
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
            IPAS Flow - Case #{caseId}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={isAnimating ? "In Progress" : "Ready"} 
              color={isAnimating ? "warning" : "success"} 
              size="small" 
            />
            <Chip 
              label={`${processSteps.filter(s => s.status === 'completed').length}/${processSteps.length} Steps Complete`} 
              color="info" 
              size="small" 
            />
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => {
                clearSession();
                window.location.reload();
              }}
            >
              Reset Workflow
            </Button>
          </Box>
        </Box>

        {/* Animation Message Display */}
        {showMessage && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: animationStep >= 3 ? '#e8f5e8' : '#fff3cd',
            border: `2px solid ${animationStep >= 3 ? '#4caf50' : '#ff9800'}`,
            borderRadius: 2,
            textAlign: 'center',
            animation: 'pulse 0.5s ease-in-out'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: animationStep >= 3 ? '#2e7d32' : '#e65100',
                fontWeight: 'bold',
                animation: animationStep >= 4 ? 'flash 0.5s ease-in-out infinite alternate' : 'none'
              }}
            >
              {showMessage}
            </Typography>
          </Box>
        )}

        {/* Simple Draggable Flowchart */}
        <Box
          ref={containerRef}
          sx={{ 
            height: 700, 
            width: '100%',
            border: '1px solid #e0e0e0', 
            borderRadius: 2,
            position: 'relative',
            overflow: 'auto',
            overflowX: 'auto',
            overflowY: 'auto',
            backgroundColor: '#fafafa'
          }}
        >
          <svg width="2000" height="700" style={{ position: 'absolute', top: 0, left: 0, minWidth: '2000px' }}>
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
              <marker
                id="arrowhead-down"
                markerWidth="7"
                markerHeight="10"
                refX="3.5"
                refY="0"
                orient="360"
              >
                <polygon
                  points="0 0, 3.5 10, 7 0"
                  fill="#666"
                />
              </marker>
              <style>
                {`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: -15;
                    }
                  }
                  @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                  }
                  @keyframes flash {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                  }
                `}
              </style>
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
                  boxShadow: step.id === 'start' && step.status === 'completed' ? 6 : 4,
                  transform: step.id === 'start' && step.status === 'completed' ? 'scale(1.05)' : 'scale(1.02)',
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
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                  {step.id === 'start' && step.status === 'completed' && (
                    <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      Click to Start
                    </Typography>
                  )}
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
              {step.id === 'provider-notification' && step.status === 'completed' && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<DownloadIcon />}
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = `/sample-documents/approval-letters/${caseId}-approval-letter.pdf`;
                      link.download = `${caseId}-approval-letter.pdf`;
                      link.click();
                    }}
                  >
                    Download Letter
                  </Button>
                </Box>
              )}
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

                {/* Session Management Options */}
                <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Session Management
                  </Typography>
                  
                  {selectedStep.id === 'start' && selectedStep.status === 'completed' && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        This step is completed. You can restart the entire workflow or continue with the next step.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          onClick={() => {
                            setStepDetailsOpen(false);
                            startAnimationSequence();
                          }}
                        >
                          Restart Workflow
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          size="small"
                          onClick={() => {
                            setStepDetailsOpen(false);
                            startAuthIntakeProcess();
                          }}
                        >
                          Continue to Auth Intake
                        </Button>
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={() => {
                        clearSession();
                        setStepDetailsOpen(false);
                      }}
                    >
                      Clear Session
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="info" 
                      size="small"
                      onClick={() => {
                        console.log('Current session state:', {
                          processSteps,
                          animationStep,
                          showMessage
                        });
                      }}
                    >
                      Debug Session
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStepDetailsOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Chat Dialog for Data Prediction */}
        <Dialog
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChatIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Case Discussion - PA-2024-002
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <List sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
              {chatMessages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                      maxWidth: '80%'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask a question about the case..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    const userMessage = chatInput.trim();
                    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
                    setChatInput('');
                    
                    // Simulate AI response
                    setTimeout(() => {
                      const responses: {[key: string]: string} = {
                        'default': 'Based on the clinical data and similar patient outcomes, the case shows strong medical necessity. The 87% approval rate for similar cases supports an approval decision.',
                        'risk': 'The risk assessment indicates a favorable outcome. Patient has stable vitals and meets all clinical criteria for the procedure.',
                        'cost': 'The $15,000 amount is within normal range for cardiac catheterization. Similar approved cases averaged $14,500.',
                        'guidelines': 'The case meets all clinical guidelines for cardiac catheterization as per the American College of Cardiology standards.',
                      };
                      
                      let response = responses.default;
                      if (userMessage.toLowerCase().includes('risk')) response = responses.risk;
                      if (userMessage.toLowerCase().includes('cost') || userMessage.toLowerCase().includes('amount')) response = responses.cost;
                      if (userMessage.toLowerCase().includes('guideline')) response = responses.guidelines;
                      
                      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
                    }, 1000);
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => {
                  if (chatInput.trim()) {
                    const userMessage = chatInput.trim();
                    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
                    setChatInput('');
                    
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { 
                        role: 'assistant', 
                        content: 'Based on the clinical data and similar patient outcomes, the case shows strong medical necessity.'
                      }]);
                    }, 1000);
                  }
                }}
              >
                Send
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChatOpen(false)} variant="outlined">
              Close Chat
            </Button>
            <Button 
              onClick={() => {
                setChatOpen(false);
                // Continue to next stage
                setTimeout(() => {
                  setShowMessage('✓ Data Prediction complete');
                  setProcessSteps(prev => 
                    prev.map(step => 
                      step.id === 'data-prediction' 
                        ? { ...step, status: 'completed' }
                        : step
                    )
                  );
                  
                  setTimeout(() => {
                    setShowMessage('Proceeding to Clinical Summarization...');
                    setProcessSteps(prev => 
                      prev.map(step => 
                        step.id === 'clinical-summarization' 
                          ? { ...step, status: 'running' }
                          : step
                      )
                    );
                    setTimeout(() => {
                      startClinicalSummarizationProcess();
                    }, 2000);
                  }, 2000);
                }, 500);
              }} 
              variant="contained"
              color="primary"
            >
              Continue to Next Stage
            </Button>
          </DialogActions>
        </Dialog>

        {/* Decision Dialog for Clinical Decisioning */}
        <Dialog
          open={decisionDialogOpen}
          onClose={() => setDecisionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Clinical Decision Required
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Recommendation: <strong>{caseId === 'PA-2024-003' ? 'PARTIAL APPROVAL ($4,000 of $8,000)' : 'APPROVE'}</strong>
            </Typography>
            {caseId === 'PA-2024-003' && (
              <Typography variant="body2" color="warning.main" sx={{ mb: 2, p: 1, bgcolor: '#fff3cd', borderRadius: 1 }}>
                ⚠️ Insurance coverage limit: $4,000 maximum for knee arthroscopy procedures
              </Typography>
            )}
            <Typography variant="body2" sx={{ mb: 2 }}>
              Select your decision:
            </Typography>
            <ButtonGroup fullWidth sx={{ mb: 3 }}>
              <Button
                variant={selectedDecision === 'approve' ? 'contained' : 'outlined'}
                color="success"
                startIcon={<ThumbUpIcon />}
                onClick={() => setSelectedDecision('approve')}
              >
                Approve
              </Button>
              <Button
                variant={selectedDecision === 'partial' ? 'contained' : 'outlined'}
                color="warning"
                startIcon={<RemoveIcon />}
                onClick={() => setSelectedDecision('partial')}
              >
                Partial
              </Button>
              <Button
                variant={selectedDecision === 'decline' ? 'contained' : 'outlined'}
                color="error"
                startIcon={<ThumbDownIcon />}
                onClick={() => setSelectedDecision('decline')}
              >
                Decline
              </Button>
            </ButtonGroup>
            {selectedDecision && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Justification (required)"
                placeholder="Enter your justification for this decision..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setDecisionDialogOpen(false);
              setSelectedDecision(null);
              setJustification('');
            }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedDecision || !justification.trim()}
              onClick={() => {
                setDecisionDialogOpen(false);
                setShowMessage(`✓ Decision: ${selectedDecision?.toUpperCase()}`);
                
                // Proceed to Provider Notification
                setTimeout(() => {
                  setShowMessage('Proceeding to Provider Notification...');
                  setProcessSteps(prev => 
                    prev.map(step => 
                      step.id === 'provider-notification' 
                        ? { ...step, status: 'running' }
                        : step
                    )
                  );
                  setTimeout(() => {
                    startProviderNotificationProcess();
                  }, 2000);
                }, 2000);
                
                setSelectedDecision(null);
                setJustification('');
              }}
            >
              Confirm Decision
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SimpleDraggableFlowchart;
