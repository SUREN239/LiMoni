// src/components/Analytics.jsx
import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Container 
} from '@mui/material';

// Sample static data
const speedViolationData = [
  { name: 'Jan', violations: 400 },
  { name: 'Feb', violations: 300 },
  { name: 'Mar', violations: 200 },
  { name: 'Apr', violations: 278 },
  { name: 'May', violations: 189 },
  { name: 'Jun', violations: 239 }
];

const zoneSpeedData = [
  { name: 'Residential', value: 400 },
  { name: 'Highway', value: 300 },
  { name: 'School Zone', value: 300 },
  { name: 'Commercial', value: 200 },
  { name: 'Industrial', value: 278 }
];

export const Analytics = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Speed Violations
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={speedViolationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="violations" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Speed Violations by Zone Type
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={zoneSpeedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Speed Trend Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={speedViolationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="violations" 
                    stroke="#82ca9d" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};