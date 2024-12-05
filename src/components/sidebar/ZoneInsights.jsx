// src/components/ZoneInsights.jsx
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box 
} from '@mui/material';

// Sample data for demonstration
const zoneRealTimeData = [
  { id: 1, zone: 'Residential A', currentSpeed: 45, speedLimit: 50, vehicles: 23, status: 'Normal' },
  { id: 2, zone: 'Highway B', currentSpeed: 110, speedLimit: 100, vehicles: 45, status: 'Violation' },
  // Add more data points
];

const zoneSpeedMappingData = [
  { id: 1, zone: 'School Zone', dayTimeLimit: 30, nightTimeLimit: 20, emergencyRoute: 'No', lastUpdated: '2024-01-15' },
  { id: 2, zone: 'Commercial District', dayTimeLimit: 60, nightTimeLimit: 50, emergencyRoute: 'Yes', lastUpdated: '2024-02-20' },
  // Add more data points
];

export const ZoneInsights = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRealTimeData = zoneRealTimeData.filter(row => 
    row.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSpeedMappingData = zoneSpeedMappingData.filter(row => 
    row.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Zone Insights
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Zone Real-Time" />
          <Tab label="Zone Speed Mapping" />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Search Zones"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Zone</TableCell>
                <TableCell>Current Speed</TableCell>
                <TableCell>Speed Limit</TableCell>
                <TableCell>Active Vehicles</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRealTimeData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.zone}</TableCell>
                  <TableCell>{row.currentSpeed} km/h</TableCell>
                  <TableCell>{row.speedLimit} km/h</TableCell>
                  <TableCell>{row.vehicles}</TableCell>
                  <TableCell 
                    sx={{ 
                      color: row.status === 'Violation' ? 'red' : 'green',
                      fontWeight: 'bold'
                    }}
                  >
                    {row.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Zone</TableCell>
                <TableCell>Day Time Limit</TableCell>
                <TableCell>Night Time Limit</TableCell>
                <TableCell>Emergency Route</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSpeedMappingData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.zone}</TableCell>
                  <TableCell>{row.dayTimeLimit} km/h</TableCell>
                  <TableCell>{row.nightTimeLimit} km/h</TableCell>
                  <TableCell>{row.emergencyRoute}</TableCell>
                  <TableCell>{row.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};