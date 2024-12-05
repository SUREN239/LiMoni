import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const emergencyVehiclesData = [
  { id: 1, vehicleNo: 'MH01EV1234', type: 'Ambulance', status: 'High Risk', location: 'Highway A', timestamp: '2024-05-22 14:30' },
  { id: 2, vehicleNo: 'DL09EV5678', type: 'Fire Truck', status: 'Moderate Risk', location: 'City Center', timestamp: '2024-05-22 15:15' },
  { id: 3, vehicleNo: 'KA10EV9012', type: 'Police Vehicle', status: 'Low Risk', location: 'Suburb Road', timestamp: '2024-05-22 16:00' },
  { id: 4, vehicleNo: 'TN11EV3456', type: 'Ambulance', status: 'Critical', location: 'Hospital Zone', timestamp: '2024-05-22 16:45' },
  { id: 5, vehicleNo: 'AP12EV7890', type: 'Fire Truck', status: 'High Risk', location: 'Industrial Area', timestamp: '2024-05-22 17:30' }
];

const riskStatusData = [
  { name: 'High Risk', value: 2 },
  { name: 'Moderate Risk', value: 1 },
  { name: 'Low Risk', value: 1 },
  { name: 'Critical', value: 1 }
];

export const AccidentFlaggedVehicles = () => {
  const [vehicles] = useState(emergencyVehiclesData);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Critical': return 'error';
      case 'High Risk': return 'warning';
      case 'Moderate Risk': return 'info';
      case 'Low Risk': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Emergency Vehicle Risk Tracking
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Risk Status Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskStatusData}
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

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Emergency Vehicle Tracking</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle Number</TableCell>
                      <TableCell>Vehicle Type</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.vehicleNo}</TableCell>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>{vehicle.location}</TableCell>
                        <TableCell>
                          <Chip 
                            label={vehicle.status} 
                            color={getStatusColor(vehicle.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{vehicle.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccidentFlaggedVehicles;