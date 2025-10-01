import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface Case {
  id: string;
  patientName: string;
  provider: string;
  procedure: string;
  status: 'pending' | 'approved' | 'partially-approved' | 'denied';
  submittedDate: string;
  priority: 'low' | 'medium' | 'high';
  amount: number;
}

interface RecentCasesTableProps {
  onCaseClick?: (caseId: string) => void;
}

const RecentCasesTable: React.FC<RecentCasesTableProps> = ({ onCaseClick }) => {
  const [caseStatuses, setCaseStatuses] = React.useState<{[key: string]: Case['status']}>({});

  // Check localStorage for case completion status
  React.useEffect(() => {
    const checkCaseStatus = () => {
      const statuses: {[key: string]: Case['status']} = {};
      
      // Check if letters were generated (indicates completion)
      if (localStorage.getItem('ipas_letter_generated_PA-2024-001')) {
        statuses['PA-2024-001'] = 'approved';
      }
      if (localStorage.getItem('ipas_letter_generated_PA-2024-002')) {
        statuses['PA-2024-002'] = 'approved';
      }
      
      setCaseStatuses(statuses);
    };

    checkCaseStatus();
    
    // Poll for changes every 2 seconds
    const interval = setInterval(checkCaseStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Dummy data for recent cases
  const cases: Case[] = [
    {
      id: 'PA-2024-001',
      patientName: 'John Smith',
      provider: 'Dr. Sarah Johnson',
      procedure: 'MRI Brain with Contrast',
      status: 'approved',
      submittedDate: '2024-01-15',
      priority: 'high',
      amount: 2500
    },
    {
      id: 'PA-2024-002',
      patientName: 'Mary Johnson',
      provider: 'Dr. Michael Chen',
      procedure: 'Cardiac Catheterization',
      status: 'pending',
      submittedDate: '2024-01-14',
      priority: 'high',
      amount: 15000
    },
    {
      id: 'PA-2024-003',
      patientName: 'Robert Davis',
      provider: 'Dr. Emily Rodriguez',
      procedure: 'Knee Arthroscopy',
      status: 'partially-approved',
      submittedDate: '2024-01-13',
      priority: 'medium',
      amount: 8000
    },
    {
      id: 'PA-2024-004',
      patientName: 'Lisa Wilson',
      provider: 'Dr. James Thompson',
      procedure: 'Colonoscopy',
      status: 'denied',
      submittedDate: '2024-01-12',
      priority: 'low',
      amount: 1200
    },
    {
      id: 'PA-2024-005',
      patientName: 'David Brown',
      provider: 'Dr. Sarah Johnson',
      procedure: 'CT Chest with Contrast',
      status: 'approved',
      submittedDate: '2024-01-11',
      priority: 'medium',
      amount: 1800
    },
    {
      id: 'PA-2024-006',
      patientName: 'Jennifer Taylor',
      provider: 'Dr. Michael Chen',
      procedure: 'Echocardiogram',
      status: 'pending',
      submittedDate: '2024-01-10',
      priority: 'medium',
      amount: 900
    }
  ];

  const getStatusChip = (status: Case['status']) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'warning', icon: <ScheduleIcon /> },
      approved: { label: 'Approved', color: 'success', icon: <CheckCircleIcon /> },
      'partially-approved': { label: 'Partially Approved', color: 'info', icon: <CheckCircleIcon /> },
      denied: { label: 'Denied', color: 'error', icon: <CancelIcon /> }
    };

    const config = statusConfig[status];
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color as any}
        size="small"
        variant="outlined"
      />
    );
  };

  const getPriorityColor = (priority: Case['priority']) => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336'
    };
    return colors[priority];
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Recent Cases
        </Typography>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Case ID</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Procedure</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Letter</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((caseItem) => {
                // Use dynamic status if available, otherwise use default
                const currentStatus = caseStatuses[caseItem.id] || caseItem.status;
                const caseWithStatus = { ...caseItem, status: currentStatus };
                
                return (
                <TableRow key={caseItem.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {caseItem.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{caseItem.patientName}</TableCell>
                  <TableCell>{caseItem.provider}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {caseItem.procedure}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(currentStatus)}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(caseItem.priority),
                        mr: 1
                      }}
                    />
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {caseItem.priority}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ${caseItem.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(caseItem.submittedDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {currentStatus === 'approved' ? (
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => {
                          // Download the approval letter PDF
                          const link = document.createElement('a');
                          link.href = `/sample-documents/approval-letters/${caseItem.id}-approval-letter.pdf`;
                          link.download = `${caseItem.id}-approval-letter.pdf`;
                          link.click();
                        }}
                        title="Download Approval Letter"
                      >
                        <DownloadIcon />
                      </IconButton>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DescriptionIcon sx={{ color: '#ccc', fontSize: 20 }} />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => onCaseClick?.(caseItem.id)}
                        title="View Case Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="secondary"
                        onClick={() => onCaseClick?.(caseItem.id)}
                        title="Edit Case"
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentCasesTable;
