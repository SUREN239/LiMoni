import React, { useState, useMemo } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent,
  IconButton, Typography, Grid, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CollisionFailureViewer = ({ data, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState('');
  const [filterZone, setFilterZone] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter(item => item.eventType !== 'normal')
      .filter(item => 
        (searchTerm === '' || 
         item.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.eventDetails.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(item => filterEventType === '' || item.eventType === filterEventType)
      .filter(item => filterZone === '' || item.zone === filterZone)
      .filter(item => !startDate || new Date(item.timestamp) >= startDate)
      .filter(item => !endDate || new Date(item.timestamp) <= endDate)
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchTerm, filterEventType, filterZone, startDate, endDate, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Vehicle ID', 'Event Type', 'Event Details', 'Zone', 'Timestamp'],
      ...filteredAndSortedData.map(item => [
        item.vehicleId,
        item.eventType,
        item.eventDetails,
        item.zone,
        item.timestamp
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'collision_failure_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={true} fullScreen>
        <DialogTitle>
          <Typography variant="h4">Collision and Vehicle Failure Data</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            ✖️
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🔍</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Event Types</MenuItem>
                <MenuItem value="accident">Accident</MenuItem>
                <MenuItem value="vehicleFailure">Vehicle Failure</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <Select
                fullWidth
                value={filterZone}
                onChange={(e) => setFilterZone(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Zones</MenuItem>
                {Array.from(new Set(data.map(item => item.zone))).map(zone => (
                  <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={handleExport}
                fullWidth
                startIcon={<span style={{ fontSize: '1.2rem' }}>📥</span>}
              >
                Export CSV
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell onClick={() => handleSort('vehicleId')}>Vehicle ID</StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('eventType')}>Event Type</StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('eventDetails')}>Event Details</StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('zone')}>Zone</StyledTableCell>
                  <StyledTableCell onClick={() => handleSort('timestamp')}>Timestamp</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.vehicleId}</TableCell>
                    <TableCell>{item.eventType}</TableCell>
                    <TableCell>{item.eventDetails}</TableCell>
                    <TableCell>{item.zone}</TableCell>
                    <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default CollisionFailureViewer;