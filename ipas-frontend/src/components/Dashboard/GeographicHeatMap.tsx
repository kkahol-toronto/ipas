import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface LocationData {
  id: string;
  name: string;
  state: string;
  city: string;
  coordinates: [number, number];
  totalCases: number;
  approvedCases: number;
  deniedCases: number;
  approvalRate: number;
  denialRate: number;
  avgProcessingTime: number;
  hospitals: HospitalData[];
}

interface HospitalData {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'medical-center';
  totalCases: number;
  approvalRate: number;
  denialRate: number;
  avgProcessingTime: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const GeographicHeatMap: React.FC = () => {
  const [viewLevel, setViewLevel] = useState<'state' | 'city' | 'hospital'>('state');
  const [selectedMetric, setSelectedMetric] = useState<'approval' | 'denial' | 'volume'>('approval');

  // City-level data
  const cityData: LocationData[] = [
    {
      id: 'LA',
      name: 'Los Angeles',
      state: 'CA',
      city: 'Los Angeles',
      coordinates: [34.0522, -118.2437],
      totalCases: 280,
      approvedCases: 252,
      deniedCases: 11,
      approvalRate: 90.0,
      denialRate: 3.9,
      avgProcessingTime: 2.0,
      hospitals: [
        {
          id: 'UCLA',
          name: 'UCLA Medical Center',
          type: 'hospital',
          totalCases: 120,
          approvalRate: 94.2,
          denialRate: 2.5,
          avgProcessingTime: 1.8,
          riskLevel: 'low'
        },
        {
          id: 'Cedars',
          name: 'Cedars-Sinai Medical Center',
          type: 'hospital',
          totalCases: 95,
          approvalRate: 91.6,
          denialRate: 3.2,
          avgProcessingTime: 2.2,
          riskLevel: 'low'
        }
      ]
    },
    {
      id: 'SF',
      name: 'San Francisco',
      state: 'CA',
      city: 'San Francisco',
      coordinates: [37.7749, -122.4194],
      totalCases: 170,
      approvedCases: 153,
      deniedCases: 7,
      approvalRate: 90.0,
      denialRate: 4.1,
      avgProcessingTime: 2.3,
      hospitals: [
        {
          id: 'Stanford',
          name: 'Stanford Health Care',
          type: 'hospital',
          totalCases: 88,
          approvalRate: 89.8,
          denialRate: 4.5,
          avgProcessingTime: 2.4,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'Houston',
      name: 'Houston',
      state: 'TX',
      city: 'Houston',
      coordinates: [29.7604, -95.3698],
      totalCases: 180,
      approvedCases: 153,
      deniedCases: 14,
      approvalRate: 85.0,
      denialRate: 7.8,
      avgProcessingTime: 2.7,
      hospitals: [
        {
          id: 'MDAnderson',
          name: 'MD Anderson Cancer Center',
          type: 'hospital',
          totalCases: 85,
          approvalRate: 88.2,
          denialRate: 6.1,
          avgProcessingTime: 2.5,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'Dallas',
      name: 'Dallas',
      state: 'TX',
      city: 'Dallas',
      coordinates: [32.7767, -96.7970],
      totalCases: 140,
      approvedCases: 122,
      deniedCases: 11,
      approvalRate: 87.1,
      denialRate: 7.9,
      avgProcessingTime: 2.9,
      hospitals: [
        {
          id: 'Baylor',
          name: 'Baylor Scott & White',
          type: 'hospital',
          totalCases: 72,
          approvalRate: 83.3,
          denialRate: 8.3,
          avgProcessingTime: 3.1,
          riskLevel: 'high'
        }
      ]
    },
    {
      id: 'NYC',
      name: 'New York City',
      state: 'NY',
      city: 'New York',
      coordinates: [40.7128, -74.0060],
      totalCases: 220,
      approvedCases: 198,
      deniedCases: 11,
      approvalRate: 90.0,
      denialRate: 5.0,
      avgProcessingTime: 2.3,
      hospitals: [
        {
          id: 'MountSinai',
          name: 'Mount Sinai Hospital',
          type: 'hospital',
          totalCases: 95,
          approvalRate: 92.6,
          denialRate: 3.2,
          avgProcessingTime: 2.0,
          riskLevel: 'low'
        },
        {
          id: 'NYU',
          name: 'NYU Langone Health',
          type: 'hospital',
          totalCases: 88,
          approvalRate: 89.8,
          denialRate: 4.5,
          avgProcessingTime: 2.4,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'Miami',
      name: 'Miami',
      state: 'FL',
      city: 'Miami',
      coordinates: [25.7617, -80.1918],
      totalCases: 160,
      approvedCases: 136,
      deniedCases: 12,
      approvalRate: 85.0,
      denialRate: 7.5,
      avgProcessingTime: 2.8,
      hospitals: [
        {
          id: 'Jackson',
          name: 'Jackson Health System',
          type: 'hospital',
          totalCases: 58,
          approvalRate: 82.8,
          denialRate: 8.6,
          avgProcessingTime: 3.2,
          riskLevel: 'high'
        }
      ]
    },
    {
      id: 'Jacksonville',
      name: 'Jacksonville',
      state: 'FL',
      city: 'Jacksonville',
      coordinates: [30.3322, -81.6557],
      totalCases: 120,
      approvedCases: 102,
      deniedCases: 10,
      approvalRate: 85.0,
      denialRate: 8.3,
      avgProcessingTime: 2.9,
      hospitals: [
        {
          id: 'MayoFL',
          name: 'Mayo Clinic Florida',
          type: 'hospital',
          totalCases: 65,
          approvalRate: 87.7,
          denialRate: 6.2,
          avgProcessingTime: 2.6,
          riskLevel: 'medium'
        }
      ]
    }
  ];

  // Dummy geographic data
  const stateData: LocationData[] = [
    {
      id: 'CA',
      name: 'California',
      state: 'CA',
      city: '',
      coordinates: [36.7783, -119.4179],
      totalCases: 450,
      approvedCases: 405,
      deniedCases: 18,
      approvalRate: 90.0,
      denialRate: 4.0,
      avgProcessingTime: 2.1,
      hospitals: [
        {
          id: 'UCLA',
          name: 'UCLA Medical Center',
          type: 'hospital',
          totalCases: 120,
          approvalRate: 94.2,
          denialRate: 2.5,
          avgProcessingTime: 1.8,
          riskLevel: 'low'
        },
        {
          id: 'Cedars',
          name: 'Cedars-Sinai Medical Center',
          type: 'hospital',
          totalCases: 95,
          approvalRate: 91.6,
          denialRate: 3.2,
          avgProcessingTime: 2.2,
          riskLevel: 'low'
        },
        {
          id: 'Stanford',
          name: 'Stanford Health Care',
          type: 'hospital',
          totalCases: 88,
          approvalRate: 89.8,
          denialRate: 4.5,
          avgProcessingTime: 2.4,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'TX',
      name: 'Texas',
      state: 'TX',
      city: '',
      coordinates: [31.9686, -99.9018],
      totalCases: 320,
      approvedCases: 275,
      deniedCases: 25,
      approvalRate: 85.9,
      denialRate: 7.8,
      avgProcessingTime: 2.8,
      hospitals: [
        {
          id: 'MDAnderson',
          name: 'MD Anderson Cancer Center',
          type: 'hospital',
          totalCases: 85,
          approvalRate: 88.2,
          denialRate: 6.1,
          avgProcessingTime: 2.5,
          riskLevel: 'medium'
        },
        {
          id: 'Baylor',
          name: 'Baylor Scott & White',
          type: 'hospital',
          totalCases: 72,
          approvalRate: 83.3,
          denialRate: 8.3,
          avgProcessingTime: 3.1,
          riskLevel: 'high'
        }
      ]
    },
    {
      id: 'NY',
      name: 'New York',
      state: 'NY',
      city: '',
      coordinates: [42.1657, -74.9481],
      totalCases: 380,
      approvedCases: 342,
      deniedCases: 19,
      approvalRate: 90.0,
      denialRate: 5.0,
      avgProcessingTime: 2.3,
      hospitals: [
        {
          id: 'MountSinai',
          name: 'Mount Sinai Hospital',
          type: 'hospital',
          totalCases: 95,
          approvalRate: 92.6,
          denialRate: 3.2,
          avgProcessingTime: 2.0,
          riskLevel: 'low'
        },
        {
          id: 'NYU',
          name: 'NYU Langone Health',
          type: 'hospital',
          totalCases: 88,
          approvalRate: 89.8,
          denialRate: 4.5,
          avgProcessingTime: 2.4,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'FL',
      name: 'Florida',
      state: 'FL',
      city: '',
      coordinates: [27.7663, -82.6404],
      totalCases: 280,
      approvedCases: 238,
      deniedCases: 22,
      approvalRate: 85.0,
      denialRate: 7.9,
      avgProcessingTime: 2.9,
      hospitals: [
        {
          id: 'MayoFL',
          name: 'Mayo Clinic Florida',
          type: 'hospital',
          totalCases: 65,
          approvalRate: 87.7,
          denialRate: 6.2,
          avgProcessingTime: 2.6,
          riskLevel: 'medium'
        },
        {
          id: 'Jackson',
          name: 'Jackson Health System',
          type: 'hospital',
          totalCases: 58,
          approvalRate: 82.8,
          denialRate: 8.6,
          avgProcessingTime: 3.2,
          riskLevel: 'high'
        }
      ]
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

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Geographic Performance Analysis
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>View Level</InputLabel>
              <Select
                value={viewLevel}
                label="View Level"
                onChange={(e) => setViewLevel(e.target.value as any)}
              >
                <MenuItem value="state">State Level</MenuItem>
                <MenuItem value="city">City Level</MenuItem>
                <MenuItem value="hospital">Hospital Level</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Metric</InputLabel>
              <Select
                value={selectedMetric}
                label="Metric"
                onChange={(e) => setSelectedMetric(e.target.value as any)}
              >
                <MenuItem value="approval">Approval Rate</MenuItem>
                <MenuItem value="denial">Denial Rate</MenuItem>
                <MenuItem value="volume">Case Volume</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {(viewLevel === 'state' || viewLevel === 'city') && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                <MapContainer
                  center={viewLevel === 'state' ? [39.8283, -98.5795] : [35.0, -95.0]} // Center of USA for states, more focused for cities
                  zoom={viewLevel === 'state' ? 4 : 5}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {(viewLevel === 'state' ? stateData : cityData).map((location) => {
                    const getMarkerColor = () => {
                      if (selectedMetric === 'approval') {
                        return location.approvalRate >= 90 ? '#4caf50' : location.approvalRate >= 80 ? '#ff9800' : '#f44336';
                      } else if (selectedMetric === 'denial') {
                        return location.denialRate <= 5 ? '#4caf50' : location.denialRate <= 7 ? '#ff9800' : '#f44336';
                      } else {
                        return location.totalCases >= 400 ? '#4caf50' : location.totalCases >= 300 ? '#ff9800' : '#f44336';
                      }
                    };

                    const getMarkerSize = () => {
                      if (selectedMetric === 'volume') {
                        return Math.max(8, Math.min(20, location.totalCases / 20));
                      }
                      return 12;
                    };

                    return (
                      <CircleMarker
                        key={location.id}
                        center={location.coordinates}
                        radius={getMarkerSize()}
                        pathOptions={{
                          fillColor: getMarkerColor(),
                          color: '#fff',
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 0.8
                        }}
                      >
                        <Popup>
                          <Box sx={{ p: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {location.name}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Total Cases:</strong> {location.totalCases}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Approval Rate:</strong> {location.approvalRate}%
                            </Typography>
                            <Typography variant="body2">
                              <strong>Denial Rate:</strong> {location.denialRate}%
                            </Typography>
                            <Typography variant="body2">
                              <strong>Avg Processing Time:</strong> {location.avgProcessingTime}h
                            </Typography>
                            <Typography variant="body2">
                              <strong>Hospitals:</strong> {location.hospitals.length}
                            </Typography>
                          </Box>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom>
                {viewLevel === 'state' ? 'State' : 'City'} Performance Summary
              </Typography>
              {(viewLevel === 'state' ? stateData : cityData).map((location) => (
                <Box key={location.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {location.name}
                  </Typography>
                  {viewLevel === 'city' && (
                    <Typography variant="body2" color="text.secondary">
                      {location.state}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Cases: {location.totalCases}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Time: {location.avgProcessingTime}h
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={`${location.approvalRate}%`}
                        sx={{ 
                          backgroundColor: getApprovalRateColor(location.approvalRate),
                          color: 'white',
                          mb: 0.5
                        }}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Approval Rate
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        )}

        {viewLevel === 'hospital' && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Hospital & Clinic Performance
            </Typography>
            
            {/* Hospital Map */}
            <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0', mb: 3 }}>
              <MapContainer
                center={[35.0, -95.0]} // Center of USA
                zoom={5}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {stateData.flatMap(state => 
                  state.hospitals.map(hospital => {
                    // Get hospital coordinates (using city coordinates as approximation)
                    const getHospitalCoordinates = () => {
                      const city = cityData.find(city => 
                        city.hospitals.some(h => h.id === hospital.id)
                      );
                      return city ? city.coordinates : state.coordinates;
                    };

                    const getMarkerColor = () => {
                      if (selectedMetric === 'approval') {
                        return hospital.approvalRate >= 90 ? '#4caf50' : hospital.approvalRate >= 80 ? '#ff9800' : '#f44336';
                      } else if (selectedMetric === 'denial') {
                        return hospital.denialRate <= 5 ? '#4caf50' : hospital.denialRate <= 7 ? '#ff9800' : '#f44336';
                      } else {
                        return hospital.totalCases >= 100 ? '#4caf50' : hospital.totalCases >= 70 ? '#ff9800' : '#f44336';
                      }
                    };

                    const getMarkerSize = () => {
                      if (selectedMetric === 'volume') {
                        return Math.max(6, Math.min(15, hospital.totalCases / 10));
                      }
                      return 10;
                    };

                    return (
                      <CircleMarker
                        key={hospital.id}
                        center={getHospitalCoordinates()}
                        radius={getMarkerSize()}
                        pathOptions={{
                          fillColor: getMarkerColor(),
                          color: '#fff',
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 0.8
                        }}
                      >
                        <Popup>
                          <Box sx={{ p: 1, minWidth: 200 }}>
                            <Typography variant="h6" gutterBottom>
                              {hospital.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)} • {state.name}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">
                                <strong>Cases:</strong> {hospital.totalCases}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Risk:</strong> {hospital.riskLevel.toUpperCase()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Chip
                                label={`${hospital.approvalRate}% Approval`}
                                sx={{ 
                                  backgroundColor: getApprovalRateColor(hospital.approvalRate),
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                                size="small"
                              />
                              <Chip
                                label={`${hospital.denialRate}% Denial`}
                                sx={{ 
                                  backgroundColor: getDenialRateColor(hospital.denialRate),
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              Avg Processing Time: {hospital.avgProcessingTime}h
                            </Typography>
                          </Box>
                        </Popup>
                      </CircleMarker>
                    );
                  })
                )}
              </MapContainer>
            </Box>

            {/* Hospital Performance Table */}
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateData.flatMap(state => 
                    state.hospitals.map(hospital => (
                      <TableRow key={hospital.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {hospital.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              {state.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            {hospital.totalCases}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${hospital.approvalRate}%`}
                            sx={{ 
                              backgroundColor: getApprovalRateColor(hospital.approvalRate),
                              color: 'white'
                            }}
                            size="small"
                          />
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
                            {hospital.avgProcessingTime}h
                          </Typography>
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Key Insights */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Key Geographic Insights
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  Best Performing State: California
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                90% approval rate, 4% denial rate
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  Attention Needed: Texas & Florida
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Denial rates above 7% target
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  High Volume: New York
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                380 cases with 90% approval rate
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GeographicHeatMap;
