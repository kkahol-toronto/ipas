import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ApprovalData {
  period: string;
  approved: number;
  partiallyApproved: number;
  denied: number;
  total: number;
}

const ApprovalStatusChart: React.FC = () => {
  const [duration, setDuration] = useState('week');

  // Dummy data for different time periods
  const dataByDuration: Record<string, ApprovalData[]> = {
    today: [
      {
        period: 'Today',
        approved: 8,
        partiallyApproved: 3,
        denied: 1,
        total: 12
      }
    ],
    week: [
      {
        period: 'Mon',
        approved: 12,
        partiallyApproved: 4,
        denied: 1,
        total: 17
      },
      {
        period: 'Tue',
        approved: 15,
        partiallyApproved: 3,
        denied: 1,
        total: 19
      },
      {
        period: 'Wed',
        approved: 18,
        partiallyApproved: 2,
        denied: 1,
        total: 21
      },
      {
        period: 'Thu',
        approved: 14,
        partiallyApproved: 5,
        denied: 1,
        total: 20
      },
      {
        period: 'Fri',
        approved: 16,
        partiallyApproved: 3,
        denied: 1,
        total: 20
      }
    ],
    month: [
      {
        period: 'Week 1',
        approved: 65,
        partiallyApproved: 18,
        denied: 4,
        total: 87
      },
      {
        period: 'Week 2',
        approved: 72,
        partiallyApproved: 15,
        denied: 3,
        total: 90
      },
      {
        period: 'Week 3',
        approved: 68,
        partiallyApproved: 20,
        denied: 2,
        total: 90
      },
      {
        period: 'Week 4',
        approved: 75,
        partiallyApproved: 12,
        denied: 3,
        total: 90
      }
    ]
  };

  const currentData = dataByDuration[duration];
  const totalApproved = currentData.reduce((sum, item) => sum + item.approved, 0);
  const totalPartially = currentData.reduce((sum, item) => sum + item.partiallyApproved, 0);
  const totalDenied = currentData.reduce((sum, item) => sum + item.denied, 0);
  const grandTotal = totalApproved + totalPartially + totalDenied;

  const pieData = [
    { name: 'Approved', value: totalApproved, color: '#4caf50' },
    { name: 'Partially Approved', value: totalPartially, color: '#ff9800' },
    { name: 'Denied', value: totalDenied, color: '#f44336' }
  ];

  const denialRate = ((totalDenied / grandTotal) * 100).toFixed(1);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Case Approval Status
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Duration</InputLabel>
            <Select
              value={duration}
              label="Duration"
              onChange={(e) => setDuration(e.target.value)}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="approved" stackId="a" fill="#4caf50" name="Approved" />
                  <Bar dataKey="partiallyApproved" stackId="a" fill="#ff9800" name="Partially Approved" />
                  <Bar dataKey="denied" stackId="a" fill="#f44336" name="Denied" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Key Metrics:</strong> Total Cases: {grandTotal} | 
            Denial Rate: {denialRate}% 
            {parseFloat(denialRate) < 7 ? 
              <span style={{ color: '#4caf50', marginLeft: '8px' }}>✓ Target Met</span> : 
              <span style={{ color: '#f44336', marginLeft: '8px' }}>⚠ Above Target</span>
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApprovalStatusChart;
