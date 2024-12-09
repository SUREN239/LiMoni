import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  Button,
  Box
} from '@mui/material';
import { 
  AssessmentOutlined as ReportIcon, 
  FileDownloadOutlined as DownloadIcon
} from '@mui/icons-material';

export const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleDownloadAllReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/zone-insight-report/export-to-pdf', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Zone_Insights_${new Date().toISOString().slice(0,10)}.pdf`;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  const handleDownloadDateRangeReport = async () => {
    const { startDate, endDate } = dateRange;
    
    try {
      const response = await axios.get(`http://localhost:5000/zone-insight-report/by-date/export-to-pdf/${startDate}/${endDate}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Zone_Insights_${startDate}_to_${endDate}.pdf`;
      link.click();
    } catch (error) {
      console.error('Download failed', error);
    }
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
        Zone Insights Reports
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="All Zone Insights" 
              subheader="Download full zone insights report"
            />
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadAllReport}
                fullWidth
              >
                Download Full Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Date Range Report" 
              subheader="Download zone insights for specific dates"
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <input 
                  type="date" 
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
                  style={{ flexGrow: 1, padding: '10px' }}
                />
                <input 
                  type="date" 
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
                  style={{ flexGrow: 1, padding: '10px' }}
                />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadDateRangeReport}
                disabled={!dateRange.startDate || !dateRange.endDate}
                fullWidth
              >
                Download Date Range Report
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;