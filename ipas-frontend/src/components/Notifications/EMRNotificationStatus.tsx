import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Computer as ComputerIcon,
  Send as SendIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { emrNotificationService, EMRIntegrationStatus } from '../../services/emrNotificationService';

interface EMRNotificationStatusProps {
  caseId: string;
}

const EMRNotificationStatus: React.FC<EMRNotificationStatusProps> = ({ caseId }) => {
  const [integrationStatus, setIntegrationStatus] = useState<EMRIntegrationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIntegrationStatus();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(loadIntegrationStatus, 2000);
    return () => clearInterval(interval);
  }, [caseId]);

  const loadIntegrationStatus = () => {
    const status = emrNotificationService.getIntegrationStatus(caseId);
    setIntegrationStatus(status);
  };

  const getProviderStatus = () => {
    if (!integrationStatus?.providerNotification) return null;
    
    const { sent, status } = integrationStatus.providerNotification;
    
    if (sent) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Sent to EPIC"
          color="success"
          size="small"
          sx={{ fontSize: '0.7rem', height: '24px' }}
        />
      );
    }
    
    return (
      <Chip
        icon={<PendingIcon />}
        label="Sending to EPIC..."
        color="warning"
        size="small"
        sx={{ fontSize: '0.7rem', height: '24px' }}
      />
    );
  };

  const getHospitalStatus = () => {
    if (!integrationStatus?.hospitalNotification) return null;
    
    const { received, orderPlaced, status } = integrationStatus.hospitalNotification;
    
    if (orderPlaced) {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Order Placed"
          color="success"
          size="small"
          sx={{ fontSize: '0.7rem', height: '24px' }}
        />
      );
    }
    
    if (received) {
      return (
        <Chip
          icon={<HospitalIcon />}
          label="Hospital Notified"
          color="info"
          size="small"
          sx={{ fontSize: '0.7rem', height: '24px' }}
        />
      );
    }
    
    return (
      <Chip
        icon={<PendingIcon />}
        label="Waiting for Hospital"
        color="warning"
        size="small"
        sx={{ fontSize: '0.7rem', height: '24px' }}
      />
    );
  };

  const simulateEMRFlow = async () => {
    setLoading(true);
    try {
      await emrNotificationService.sendToEPIC(
        caseId,
        'Dr. Sarah Johnson',
        `AUTH-${caseId}`,
        'CPT-12345'
      );
      
      setTimeout(() => {
        emrNotificationService.simulateHospitalNotification(
          caseId,
          'UCLA Medical Center',
          0
        );
      }, 2000);
      
      setTimeout(() => {
        emrNotificationService.simulateOrderPlacement(
          caseId,
          'UCLA Medical Center',
          0
        );
      }, 4000);
    } catch (error) {
      console.error('Error simulating EMR flow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!integrationStatus) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <ComputerIcon sx={{ fontSize: '1rem', color: '#666' }} />
        <Typography variant="caption" color="text.secondary">
          EMR Integration Ready
        </Typography>
        <Tooltip title="Simulate EMR Flow">
          <IconButton size="small" onClick={simulateEMRFlow} disabled={loading}>
            <SendIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      {loading && <LinearProgress sx={{ mb: 1, height: 2 }} />}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SendIcon sx={{ fontSize: '0.8rem', color: '#666' }} />
          {getProviderStatus()}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HospitalIcon sx={{ fontSize: '0.8rem', color: '#666' }} />
          {getHospitalStatus()}
        </Box>
      </Box>
    </Box>
  );
};

export default EMRNotificationStatus;
