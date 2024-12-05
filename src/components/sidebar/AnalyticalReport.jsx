import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const annualViolationData = [
  { year: '2021', total: 5600, speeding: 2800, redLight: 1400, parking: 1400 },
  { year: '2022', total: 6200, speeding: 3100, redLight: 1550, parking: 1550 },
  { year: '2023', total: 7000, speeding: 3500, redLight: 1750, parking: 1750 }
];

const monthlyRevenueData = [
  { month: 'Jan', revenue: 250000 },
  { month: 'Feb', revenue: 275000 },
  { month: 'Mar', revenue: 300000 },
  { month: 'Apr', revenue: 325000 },
  { month: 'May', revenue: 350000 },
  { month: 'Jun', revenue: 375000 }
];

const zonePerformanceData = [
  { zone: 'Residential', violations: 1200, revenue: 180000 },
  { zone: 'Highway', violations: 2500, revenue: 375000 },
  { zone: 'School', violations: 800, revenue: 120000 },
  { zone: 'Commercial', violations: 1800, revenue: 270000 },
  { zone: 'Industrial', violations: 1500, revenue: 225000 }
];

export const AnalyticalReport = () => {
  const [reportType, setReportType] = useState('annual');
  const [selectedYear, setSelectedYear] = useState('2023');

  const handleGeneratePDF = () => {
    const input = document.getElementById('reportContent');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Traffic_Analysis_Report_${selectedYear}.pdf`);
    });
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Comprehensive Analytical Report
      </Typography>

      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              <MenuItem value="annual">Annual Report</MenuItem>
              <MenuItem value="monthly">Monthly Report</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handleGeneratePDF}
          >
            Generate PDF
          </Button>
        </Grid>
      </Grid>

      <div id="reportContent">
        <Typography variant="h5" gutterBottom>
          Traffic Violation Analysis - {selectedYear}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">Annual Violation Trends</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={annualViolationData.filter(d => d.year === selectedYear)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="speeding" stackId="a" fill="#8884d8" />
                    <Bar dataKey="redLight" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="parking" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">Monthly Revenue Trend</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">Zone Performance Analysis</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Zone</TableCell>
                        <TableCell align="right">Total Violations</TableCell>
                        <TableCell align="right">Total Revenue (₹)</TableCell>
                        <TableCell align="right">Average Fine (₹)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {zonePerformanceData.map((zone) => (
                        <TableRow key={zone.zone}>
                          <TableCell>{zone.zone}</TableCell>
                          <TableCell align="right">{zone.violations}</TableCell>
                          <TableCell align="right">
                            {zone.revenue.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {(zone.revenue / zone.violations).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default AnalyticalReport;