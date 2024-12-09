import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';

export const ZoneInsights = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [flaggedData, setFlaggedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlaggedData = async () => {
      if (activeTab === 2) {
        try {
          setIsLoading(true);
          const response = await axios.get('http://localhost:5000/get-all');
          setFlaggedData(response.data);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch flagged data');
          setFlaggedData([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFlaggedData();
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFlaggedData = flaggedData.filter(item => 
    item.vehicleData.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.violatedZones.zoneName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Flagged Violation Insights
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Zone Real-Time" />
          <Tab label="Zone Speed Mapping" />
          <Tab label="Flagged Violations" />
        </Tabs>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Search Vehicle/Zone"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      {activeTab === 2 && (
        <>
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle Number</TableCell>
                    <TableCell>Zone Name</TableCell>
                    <TableCell>Zone Type</TableCell>
                    <TableCell>Exceeded Speed</TableCell>
                    <TableCell>Threshold Speed</TableCell>
                    <TableCell>Violated Duration</TableCell>
                    <TableCell>Violated Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fare</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFlaggedData.map((item) => (
                    <TableRow key={item.flaggedID}>
                      <TableCell>{item.vehicleData.vehicleNumber}</TableCell>
                      <TableCell>{item.violatedZones.zoneName}</TableCell>
                      <TableCell>{item.violatedZones.zoneType}</TableCell>
                      <TableCell>{item.exceededSpeed} km/h</TableCell>
                      <TableCell>{item.violatedZones.zoneThresholdSpeed} km/h</TableCell>
                      <TableCell>{item.violatedDuration} mins</TableCell>
                      <TableCell>{item.violatedDate}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.ticketed ? 'Ticketed' : 'Pending'} 
                          color={item.ticketed ? 'error' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>${item.ticketedFare.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Container>
  );
};