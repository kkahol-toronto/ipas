import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { PriorAuthRequest } from '../../types';

interface CaseDetailsProps {
  case_: PriorAuthRequest;
  onClose?: () => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ case_, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'denied': return 'error';
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Case Details: {case_.caseId}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={case_.status}
            color={getStatusColor(case_.status)}
            icon={case_.status === 'approved' ? <CheckIcon /> : case_.status === 'denied' ? <CancelIcon /> : <ScheduleIcon />}
          />
          <Chip
            label={case_.priority}
            color={getPriorityColor(case_.priority)}
          />
          {case_.humanReviewRequired && (
            <Chip
              label="Human Review Required"
              color="warning"
              icon={<WarningIcon />}
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Patient Information
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={case_.patient.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date of Birth"
                    secondary={new Date(case_.patient.dateOfBirth).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Member ID"
                    secondary={case_.patient.memberId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Insurance Plan"
                    secondary={case_.patient.insurancePlan}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Eligibility Status"
                    secondary={
                      <Chip
                        label={case_.patient.eligibilityStatus}
                        color={case_.patient.eligibilityStatus === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Provider Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HospitalIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Provider Information
                </Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Provider Name"
                    secondary={`Dr. ${case_.provider.name}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="NPI"
                    secondary={case_.provider.npi}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Specialty"
                    secondary={case_.provider.specialty}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Network Status"
                    secondary={
                      <Chip
                        label={case_.provider.networkStatus}
                        color={case_.provider.networkStatus === 'in_network' ? 'success' : 'error'}
                        size="small"
                      />
                    }
                  />
                </ListItem>
                {case_.provider.qualityRating && (
                  <ListItem>
                    <ListItemText
                      primary="Quality Rating"
                      secondary={`${case_.provider.qualityRating}/5.0`}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Request */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Service Request
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Service Type"
                        secondary={case_.requestedService.serviceType}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Procedure Code"
                        secondary={case_.requestedService.procedureCode}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Diagnosis Code"
                        secondary={case_.requestedService.diagnosisCode}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Requested Length"
                        secondary={`${case_.requestedService.requestedLength} ${case_.requestedService.unit}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Justification"
                        secondary={case_.requestedService.justification}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Clinical Notes:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {case_.requestedService.clinicalNotes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Clinical Data */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Clinical Data
              </Typography>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Vital Signs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {Object.entries(case_.clinicalData.vitalSigns).map(([key, value]) => (
                      <Grid size={{ xs: 6, md: 3 }} key={key}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {value}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Comorbidities & Allergies</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {case_.clinicalData.comorbidities.map((condition, index) => (
                      <Chip key={index} label={condition} color="info" size="small" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {case_.clinicalData.allergies.map((allergy, index) => (
                      <Chip key={index} label={allergy} color="error" size="small" />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Clinical History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Chief Complaint:</strong> {case_.clinicalData.chiefComplaint}
                  </Typography>
                  <Typography variant="body2">
                    <strong>History of Present Illness:</strong> {case_.clinicalData.historyOfPresentIllness}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Recommendation */}
        {case_.aiRecommendation && (
          <Grid size={12}>
            <Card sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PsychologyIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    AI Recommendation
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Decision:</strong> 
                      <Chip
                        label={case_.aiRecommendation.decision}
                        color={case_.aiRecommendation.decision === 'approve' ? 'success' : 'error'}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Confidence:</strong> {(case_.aiRecommendation.confidence * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <strong>Rationale:</strong> {case_.aiRecommendation.rationale}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Criteria Checks:
                    </Typography>
                    {case_.aiRecommendation.criteria.map((criterion, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={criterion.status}
                          color={criterion.status === 'met' ? 'success' : 'error'}
                          size="small"
                          sx={{ mr: 1, minWidth: 80 }}
                        />
                        <Typography variant="body2">
                          {criterion.criterion}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Decision History */}
        {case_.decision && (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Decision History
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`Decision: ${case_.decision.decision.toUpperCase()}`}
                      secondary={`Approved by: ${case_.decision.approvedBy} on ${formatDate(case_.decision.decisionDate)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Rationale"
                      secondary={case_.decision.rationale}
                    />
                  </ListItem>
                  {case_.decision.validUntil && (
                    <ListItem>
                      <ListItemText
                        primary="Valid Until"
                        secondary={formatDate(case_.decision.validUntil)}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Documents */}
        {case_.documents && case_.documents.length > 0 && (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Documents ({case_.documents.length})
                </Typography>
                <List>
                  {case_.documents.map((document) => (
                    <ListItem key={document.id}>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={document.name}
                        secondary={`Uploaded: ${formatDate(document.uploadedDate)}`}
                      />
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CaseDetails;
