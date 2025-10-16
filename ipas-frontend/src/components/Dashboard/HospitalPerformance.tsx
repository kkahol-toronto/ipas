import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Business as ClinicIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

interface HospitalPerformanceData {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'medical-center';
  location: string;
  state: string;
  totalCases: number;
  approvedCases: number;
  deniedCases: number;
  pendingCases: number;
  approvalRate: number;
  denialRate: number;
  avgProcessingTime: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  specialties: string[];
  lastUpdated: string;
}

const HospitalPerformance: React.FC = () => {
  const [sortBy, setSortBy] = useState<'approval' | 'denial' | 'volume' | 'time'>('approval');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // Dummy hospital performance data
  const hospitalData: HospitalPerformanceData[] = [
    {
      id: 'UCLA',
      name: 'UCLA Medical Center',
      type: 'hospital',
      location: 'Los Angeles, CA',
      state: 'CA',
      totalCases: 120,
      approvedCases: 113,
      deniedCases: 3,
      pendingCases: 4,
      approvalRate: 94.2,
      denialRate: 2.5,
      avgProcessingTime: 1.8,
      riskLevel: 'low',
      trend: 'up',
      trendPercentage: 5.2,
      specialties: ['Cardiology', 'Oncology', 'Neurology'],
      lastUpdated: '2024-01-15'
    },
    {
      id: 'Cedars',
      name: 'Cedars-Sinai Medical Center',
      type: 'hospital',
      location: 'Los Angeles, CA',
      state: 'CA',
      totalCases: 95,
      approvedCases: 87,
      deniedCases: 3,
      pendingCases: 5,
      approvalRate: 91.6,
      denialRate: 3.2,
      avgProcessingTime: 2.2,
      riskLevel: 'low',
      trend: 'stable',
      trendPercentage: 0.1,
      specialties: ['Orthopedics', 'Cardiology'],
      lastUpdated: '2024-01-14'
    },
    {
      id: 'MDAnderson',
      name: 'MD Anderson Cancer Center',
      type: 'hospital',
      location: 'Houston, TX',
      state: 'TX',
      totalCases: 85,
      approvedCases: 75,
      deniedCases: 5,
      pendingCases: 5,
      approvalRate: 88.2,
      denialRate: 6.1,
      avgProcessingTime: 2.5,
      riskLevel: 'medium',
      trend: 'down',
      trendPercentage: -2.3,
      specialties: ['Oncology', 'Radiation Therapy'],
      lastUpdated: '2024-01-13'
    },
    {
      id: 'Baylor',
      name: 'Baylor Scott & White',
      type: 'hospital',
      location: 'Dallas, TX',
      state: 'TX',
      totalCases: 72,
      approvedCases: 60,
      deniedCases: 6,
      pendingCases: 6,
      approvalRate: 83.3,
      denialRate: 8.3,
      avgProcessingTime: 3.1,
      riskLevel: 'high',
      trend: 'down',
      trendPercentage: -4.1,
      specialties: ['General Surgery', 'Emergency Medicine'],
      lastUpdated: '2024-01-12'
    },
    {
      id: 'MountSinai',
      name: 'Mount Sinai Hospital',
      type: 'hospital',
      location: 'New York, NY',
      state: 'NY',
      totalCases: 95,
      approvedCases: 88,
      deniedCases: 3,
      pendingCases: 4,
      approvalRate: 92.6,
      denialRate: 3.2,
      avgProcessingTime: 2.0,
      riskLevel: 'low',
      trend: 'up',
      trendPercentage: 3.7,
      specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
      lastUpdated: '2024-01-15'
    },
    {
      id: 'MayoFL',
      name: 'Mayo Clinic Florida',
      type: 'hospital',
      location: 'Jacksonville, FL',
      state: 'FL',
      totalCases: 65,
      approvedCases: 57,
      deniedCases: 4,
      pendingCases: 4,
      approvalRate: 87.7,
      denialRate: 6.2,
      avgProcessingTime: 2.6,
      riskLevel: 'medium',
      trend: 'up',
      trendPercentage: 1.2,
      specialties: ['Internal Medicine', 'Cardiology'],
      lastUpdated: '2024-01-14'
    },
    {
      id: 'Jackson',
      name: 'Jackson Health System',
      type: 'hospital',
      location: 'Miami, FL',
      state: 'FL',
      totalCases: 58,
      approvedCases: 48,
      deniedCases: 5,
      pendingCases: 5,
      approvalRate: 82.8,
      denialRate: 8.6,
      avgProcessingTime: 3.2,
      riskLevel: 'high',
      trend: 'down',
      trendPercentage: -5.8,
      specialties: ['Emergency Medicine', 'Trauma'],
      lastUpdated: '2024-01-13'
    }
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getApprovalRateColor = (rate: number) => {
    if (rate >= 90) return '#4caf50';
    if (rate >= 80) return '#ff9800';
    return '#f44336';
  };

  const getDenialRateColor = (rate: number) => {
    if (rate <= 5) return '#4caf50';
    if (rate <= 7) return '#ff9800';
    return '#f44336';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'down': return <TrendingDownIcon sx={{ color: '#f44336', fontSize: 16 }} />;
      default: return <CheckCircleIcon sx={{ color: '#9e9e9e', fontSize: 16 }} />;
    }
  };

  const filteredData = hospitalData.filter(hospital => 
    filterRisk === 'all' || hospital.riskLevel === filterRisk
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'approval': return b.approvalRate - a.approvalRate;
      case 'denial': return b.denialRate - a.denialRate;
      case 'volume': return b.totalCases - a.totalCases;
      case 'time': return a.avgProcessingTime - b.avgProcessingTime;
      default: return 0;
    }
  });

  const highRiskHospitals = hospitalData.filter(h => h.riskLevel === 'high');
  const totalCases = hospitalData.reduce((sum, h) => sum + h.totalCases, 0);
  const avgApprovalRate = hospitalData.reduce((sum, h) => sum + h.approvalRate, 0) / hospitalData.length;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Hospital & Clinic Performance
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="approval">Approval Rate</MenuItem>
                <MenuItem value="denial">Denial Rate</MenuItem>
                <MenuItem value="volume">Case Volume</MenuItem>
                <MenuItem value="time">Processing Time</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={filterRisk}
                label="Risk Level"
                onChange={(e) => setFilterRisk(e.target.value as any)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="low">Low Risk</MenuItem>
                <MenuItem value="medium">Medium Risk</MenuItem>
                <MenuItem value="high">High Risk</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {hospitalData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Hospitals
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {totalCases.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Cases
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {avgApprovalRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Approval Rate
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="error">
                {highRiskHospitals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High Risk Facilities
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Performance Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hospital/Clinic</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Cases</TableCell>
                <TableCell align="right">Approval Rate</TableCell>
                <TableCell align="right">Denial Rate</TableCell>
                <TableCell align="right">Avg Time</TableCell>
                <TableCell align="center">Risk Level</TableCell>
                <TableCell align="center">Trend</TableCell>
                <TableCell>Specialties</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((hospital) => (
                <TableRow key={hospital.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2, backgroundColor: getRiskColor(hospital.riskLevel) }}>
                        {hospital.type === 'hospital' ? <HospitalIcon /> : <ClinicIcon />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {hospital.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {hospital.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {hospital.state}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="bold">
                      {hospital.totalCases}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {hospital.pendingCases} pending
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Chip
                        label={`${hospital.approvalRate}%`}
                        sx={{ 
                          backgroundColor: getApprovalRateColor(hospital.approvalRate),
                          color: 'white',
                          mr: 1
                        }}
                        size="small"
                      />
                      {getTrendIcon(hospital.trend)}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${hospital.denialRate}%`}
                      sx={{ 
                        backgroundColor: getDenialRateColor(hospital.denialRate),
                        color: 'white'
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {hospital.avgProcessingTime}m
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(hospital.avgProcessingTime / 4) * 100}
                      sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={hospital.riskLevel.toUpperCase()}
                      sx={{ 
                        backgroundColor: getRiskColor(hospital.riskLevel),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getTrendIcon(hospital.trend)}
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {hospital.trendPercentage > 0 ? '+' : ''}{hospital.trendPercentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {hospital.specialties.slice(0, 2).map((specialty, index) => (
                        <Chip
                          key={index}
                          label={specialty}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {hospital.specialties.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{hospital.specialties.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Risk Analysis */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Risk Analysis & Recommendations
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon sx={{ color: '#f44336', mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  High Risk Facilities: {highRiskHospitals.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {highRiskHospitals.map(h => h.name).join(', ')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  Target Met: {hospitalData.filter(h => h.denialRate <= 7).length} facilities
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Denial rate ≤ 7% target
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  Improvement Needed: {hospitalData.filter(h => h.denialRate > 7).length} facilities
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Focus on denial rate reduction
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HospitalPerformance;
