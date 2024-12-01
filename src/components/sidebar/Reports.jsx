import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Box
} from '@mui/material';
import { 
  AssessmentOutlined as ReportIcon, 
  FileDownloadOutlined as DownloadIcon 
} from '@mui/icons-material';

export const Reports = () => {
  const [reports] = useState([
    {
      id: 1,
      title: 'Monthly Speed Violation Report',
      date: '2024-05-31',
      totalViolations: 245,
      zones: ['Residential', 'Highway', 'School'],
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Quarterly Traffic Safety Analysis',
      date: '2024-06-15',
      totalViolations: 712,
      zones: ['All Zones'],
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'Annual Incident Summary',
      date: '2024-12-31',
      totalViolations: 0,
      zones: ['Citywide'],
      status: 'Pending'
    }
  ]);

  const handleDownloadReport = (report) => {
    // Placeholder for report download functionality
    console.log(`Downloading report: ${report.title}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3 
        }}
      >
        <ReportIcon sx={{ mr: 2 }} color="primary" />
        Reports Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader 
              title="Generated Reports" 
              subheader="List of generated and pending reports"
            />
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Title</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Total Violations</TableCell>
                      <TableCell>Zones Covered</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.title}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.totalViolations}</TableCell>
                        <TableCell>{report.zones.join(', ')}</TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              color: 
                                report.status === 'Completed' ? 'success.main' :
                                report.status === 'In Progress' ? 'warning.main' :
                                'text.secondary'
                            }}
                          >
                            {report.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadReport(report)}
                            disabled={report.status !== 'Completed'}
                          >
                            Download
                          </Button>
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
    </Container>
  );
};

export default Reports;