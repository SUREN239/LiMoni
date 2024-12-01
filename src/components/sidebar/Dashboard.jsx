import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Polygon,
  Popup 
} from 'react-leaflet';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import { 
  SpeedRounded as SpeedIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  Sensors as SensorsIcon,
  NotificationsActive as AlertIcon
} from '@mui/icons-material';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Grid, 
  Chip, 
  Box, 
  Divider,
  Button
} from '@mui/material';
import 'leaflet/dist/leaflet.css';

export const Dashboard = () => {
  // Simulated data matching LiMoni's core features
  const [zoneData] = useState([
    {
      id: 'zone1',
      name: 'Residential Area',
      speedLimit: 30,
      currentViolations: 12,
      coordinates: [
        [37.7749, -122.4194],
        [37.7759, -122.4184],
        [37.7769, -122.4174],
        [37.7739, -122.4204]
      ]
    },
    {
      id: 'zone2',
      name: 'Highway Segment',
      speedLimit: 80,
      currentViolations: 5,
      coordinates: [
        [37.7800, -122.4250],
        [37.7810, -122.4240],
        [37.7820, -122.4230],
        [37.7790, -122.4260]
      ]
    }
  ]);

  const speedViolationData = [
    { zone: 'Residential', violations: 45, warnings: 20 },
    { zone: 'Highway', violations: 30, warnings: 15 },
    { zone: 'School', violations: 15, warnings: 10 },
    { zone: 'Commercial', violations: 25, warnings: 12 }
  ];

  const incidentTypes = [
    { name: 'Speed Violations', value: 40 },
    { name: 'Potential Collisions', value: 25 },
    { name: 'Emergency Alerts', value: 20 },
    { name: 'Other Incidents', value: 15 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: '#f4f4f4' }}>
      <Grid container spacing={3}>
        {/* Map Section with Zones */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardHeader 
              avatar={<LocationIcon color="primary" />}
              title="LiMoni Zone Monitoring"
              action={
                <Chip 
                  label="Real-Time Tracking" 
                  color="primary" 
                  variant="outlined" 
                />
              }
            />
            <CardContent sx={{ height: 500, position: 'relative' }}>
              <MapContainer 
                center={[37.7749, -122.4194]} 
                zoom={11} 
                style={{ height: '100%', width: '100%', zIndex: 1 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {zoneData.map((zone) => (
                  <React.Fragment key={zone.id}>
                    <Polygon 
                      positions={zone.coordinates}
                      color="blue"
                      fillColor="rgba(0,0,255,0.2)"
                    >
                      <Popup>
                        <Typography variant="h6">{zone.name}</Typography>
                        <Typography>Speed Limit: {zone.speedLimit} km/h</Typography>
                        <Typography color="error">
                          Current Violations: {zone.currentViolations}
                        </Typography>
                      </Popup>
                    </Polygon>
                  </React.Fragment>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Panel */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Speed Violation Overview */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader 
                  avatar={<SpeedIcon color="warning" />}
                  title="Speed Violation Statistics"
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={incidentTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incidentTypes.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Detailed Violation Breakdown */}
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardHeader 
                  avatar={<WarningIcon color="error" />}
                  title="Violation Trends"
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={speedViolationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="violations" fill="#FF6384" name="Violations" />
                      <Bar dataKey="warnings" fill="#36A2EB" name="Warnings" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Alerts and Notifications */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader 
              avatar={<AlertIcon color="error" />}
              title="Active Alerts and Notifications"
              action={
                <Button variant="contained" color="primary">
                  View All Alerts
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  {
                    id: 1,
                    type: 'Speed Violation',
                    zone: 'Residential Area',
                    details: 'Vehicle exceeding 45 km/h in 30 km/h zone',
                    timestamp: '2024-05-15 14:30:45',
                    severity: 'High'
                  },
                  {
                    id: 2,
                    type: 'Potential Collision',
                    zone: 'Highway Segment',
                    details: 'Rapid deceleration detected',
                    timestamp: '2024-05-15 15:15:22',
                    severity: 'Medium'
                  }
                ].map((alert) => (
                  <Grid item xs={12} md={6} key={alert.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        backgroundColor: 
                          alert.severity === 'High' ? '#ffebee' : 
                          alert.severity === 'Medium' ? '#fff3e0' : '#e8f5e9'
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="h6" color="error">
                              {alert.type}
                            </Typography>
                            <Typography variant="body2">
                              Zone: {alert.zone}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {alert.details}
                            </Typography>
                            <Typography variant="caption">
                              {alert.timestamp}
                            </Typography>
                          </Box>
                          <Chip 
                            label={alert.severity} 
                            color={
                              alert.severity === 'High' ? 'error' : 
                              alert.severity === 'Medium' ? 'warning' : 'success'
                            }
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;