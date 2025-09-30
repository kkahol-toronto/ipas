import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Grid,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { PriorAuthRequest } from '../../types';

interface CaseQueueProps {
  cases: PriorAuthRequest[];
  onCaseSelect: (case_: PriorAuthRequest) => void;
}

const CaseQueue: React.FC<CaseQueueProps> = ({ cases, onCaseSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, caseId: string) => {
    setAnchorEl(event.currentTarget);
    // setSelectedCaseId(caseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedCaseId(null);
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon />;
      case 'denied': return <CancelIcon />;
      case 'pending': return <ScheduleIcon />;
      case 'under_review': return <WarningIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = 
      case_.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || case_.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="denied">Denied</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {filteredCases.map((case_) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={case_.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
              onClick={() => onCaseSelect(case_)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>
                      {getStatusIcon(case_.status)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {case_.caseId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {case_.patient.name}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, case_.id);
                    }}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Provider:</strong> Dr. {case_.provider.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Service:</strong> {case_.requestedService.serviceType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Diagnosis:</strong> {case_.requestedService.diagnosisCode}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={case_.status}
                    color={getStatusColor(case_.status)}
                    size="small"
                  />
                  <Chip
                    label={case_.priority}
                    color={getPriorityColor(case_.priority)}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Due: {formatDate(case_.dueDate)}
                  </Typography>
                  {case_.humanReviewRequired && (
                    <Tooltip title="Human review required">
                      <WarningIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                    </Tooltip>
                  )}
                </Box>

                {case_.aiRecommendation && (
                  <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      AI Recommendation: {case_.aiRecommendation.decision} 
                      (Confidence: {(case_.aiRecommendation.confidence * 100).toFixed(0)}%)
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Assign to Me</MenuItem>
        <MenuItem onClick={handleMenuClose}>Add to Watchlist</MenuItem>
        <MenuItem onClick={handleMenuClose}>Export Case</MenuItem>
      </Menu>
    </Box>
  );
};

export default CaseQueue;
