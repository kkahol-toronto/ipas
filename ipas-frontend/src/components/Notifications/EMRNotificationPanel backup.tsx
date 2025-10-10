import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Send as SendIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import { emrNotificationService, EMRNotification, EMRIntegrationStatus } from '../../services/emrNotificationService';

interface EPICNotificationPanelProps {
  caseId: string;
  showDetails?: boolean;
}

const EPICNotificationPanel: React.FC<EPICNotificationPanelProps> = ({ caseId, showDetails = false }) => {
  const [notifications, setNotifications] = useState<EMRNotification[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<EMRIntegrationStatus | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadIntegrationStatus();
  }, [caseId]);

  const loadNotifications = () => {
    const caseNotifications = emrNotificationService.getCaseNotifications(caseId);
    setNotifications(caseNotifications);
  };

  const loadIntegrationStatus = () => {
    const status = emrNotificationService.getIntegrationStatus(caseId);
    setIntegrationStatus(status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'received':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'pending':
      default:
        return <PendingIcon sx={{ color: '#ff9800' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'received':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const simulateEPICFlow = async () => {
    setLoading(true);
    try {
      // Step 1: Send to EPIC
      await emrNotificationService.sendToEMR(
        caseId,
        'Sarah Johnson',
        `AUTH-${caseId}`,
        'CPT-12345'
      );

      // Step 2: Hospital receives notification (after 3 seconds)
      await emrNotificationService.simulateHospitalNotification(
        caseId,
        'UCLA Medical Center',
        3000
      );

      // Step 3: Order placement (after additional 2 seconds)
      await emrNotificationService.simulateOrderPlacement(
        caseId,
        'UCLA Medical Center',
        2000
      );

      // Reload data
      loadNotifications();
      loadIntegrationStatus();
    } catch (error) {
      console.error('Error simulating EMRflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProviderNotification = () => {
    if (!integrationStatus?.providerNotification) return null;

    const { sent, timestamp, status } = integrationStatus.providerNotification;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SendIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6">Provider Notification</Typography>
            <Chip
              label={status}
              color={getStatusColor(status) as any}
              size="small"
              sx={{ ml: 'auto' }}
            />
          </Box>
          
          {sent ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Sent to EMR</AlertTitle>
              Authorization data transmitted to EMR medical records system.
              {timestamp && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Sent: {new Date(timestamp).toLocaleString()}
                </Typography>
              )}
            </Alert>
          ) : (
            <Alert severity="info">
              <AlertTitle>Ready to Send</AlertTitle>
              Authorization will be sent to EMR upon case completion.
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderHospitalNotification = () => {
    if (!integrationStatus?.hospitalNotification) return null;

    const { received, orderPlaced, timestamp, orderId, status } = integrationStatus.hospitalNotification;

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HospitalIcon sx={{ mr: 1, color: '#4caf50' }} />
            <Typography variant="h6">Hospital Notification</Typography>
            <Chip
              label={status}
              color={getStatusColor(status) as any}
              size="small"
              sx={{ ml: 'auto' }}
            />
          </Box>

          {orderPlaced ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Order Placed Successfully</AlertTitle>
              Authorization received and order placed in hospital system.
              {orderId && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Order ID: <strong>{orderId}</strong>
                </Typography>
              )}
              {timestamp && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Completed: {new Date(timestamp).toLocaleString()}
                </Typography>
              )}
            </Alert>
          ) : received ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Authorization Received</AlertTitle>
              Hospital has received the authorization notification from EPIC.
              {timestamp && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Received: {new Date(timestamp).toLocaleString()}
                </Typography>
              )}
            </Alert>
          ) : (
            <Alert severity="warning">
              <AlertTitle>Pending Hospital Notification</AlertTitle>
              Waiting for hospital to receive authorization notification.
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderNotificationDetails = () => (
    <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ComputerIcon sx={{ mr: 1 }} />
          EMRIntegration Details
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <Chip
                      label={notification.type.replace('_', ' ').toUpperCase()}
                      size="small"
                      color={getStatusColor(notification.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(notification.status)}
                      <Typography sx={{ ml: 1 }}>{notification.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>
                    {new Date(notification.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {notification.details.orderId && (
                      <Typography variant="caption">
                        Order: {notification.details.orderId}
                      </Typography>
                    )}
                    {notification.details.EMRPatientId && (
                      <Typography variant="caption" display="block">
                        EMRID: {notification.details.EMRPatientId}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailsOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {renderProviderNotification()}
      {renderHospitalNotification()}

      {showDetails && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">EMR Integration Status</Typography>
              <Box sx={{ ml: 'auto' }}>
                <Tooltip title="View Details">
                  <IconButton onClick={() => setDetailsOpen(true)} size="small">
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <IconButton onClick={() => { loadNotifications(); loadIntegrationStatus(); }} size="small">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(notification.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.timestamp).toLocaleString()}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            {notifications.length === 0 && (
              <Alert severity="info">
                No EMRnotifications yet. Complete the case to trigger EMRintegration.
              </Alert>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={simulateEPICFlow}
                disabled={loading}
                startIcon={<SendIcon />}
              >
                {loading ? 'Processing...' : 'Simulate EMRFlow'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {renderNotificationDetails()}
    </Box>
  );
};

export default EPICNotificationPanel;
