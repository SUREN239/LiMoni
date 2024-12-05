import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const fineRevenueData = [
  { month: 'Jan', revenue: 25000 },
  { month: 'Feb', revenue: 30000 },
  { month: 'Mar', revenue: 28000 },
  { month: 'Apr', revenue: 35000 },
  { month: 'May', revenue: 40000 }
];

const violationTypeData = [
  { name: 'Speeding', value: 400 },
  { name: 'Red Light', value: 200 },
  { name: 'No Helmet', value: 150 },
  { name: 'Wrong Lane', value: 100 },
  { name: 'Parking Violation', value: 50 }
];

const ticketData = [
  { id: 1, vehicleNo: 'MH01AB1234', offense: 'Speeding', fine: 500, date: '2024-01-15' },
  { id: 2, vehicleNo: 'DL09CD5678', offense: 'Red Light', fine: 1000, date: '2024-02-20' },
  { id: 3, vehicleNo: 'KA10EF9012', offense: 'No Helmet', fine: 250, date: '2024-03-10' },
  { id: 4, vehicleNo: 'TN11GH3456', offense: 'Wrong Lane', fine: 750, date: '2024-04-05' },
  { id: 5, vehicleNo: 'AP12IJ7890', offense: 'Parking Violation', fine: 300, date: '2024-05-22' }
];

export const TicketingPage = () => {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Ticketing & Fine Generation Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Monthly Fine Revenue</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fineRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6">Violation Types</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={violationTypeData}
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
              <Typography variant="h6">Detailed Ticket Information</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle Number</TableCell>
                      <TableCell>Offense</TableCell>
                      <TableCell>Fine Amount</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticketData.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.vehicleNo}</TableCell>
                        <TableCell>{ticket.offense}</TableCell>
                        <TableCell>₹{ticket.fine}</TableCell>
                        <TableCell>{ticket.date}</TableCell>
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

export default TicketingPage;