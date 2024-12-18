import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Box,
  Chip,
  IconButton,
  TableFooter,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';import PropTypes from 'prop-types';
import _ from 'lodash';

// Utility function to safely convert to number and format
const safeFormat = (value, decimals = 2) => {
  // If value is null, undefined, or not a number, return '0.00'
  const num = Number(value || 0);
  return isNaN(num) ? '0.00' : num.toFixed(decimals);
};

// Flagged Violations Timeline Component
const FlaggedViolationsTimeline = ({ vehicleNumber, violatedDate }) => {
  const [flaggedViolations, setFlaggedViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFlaggedViolations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:5000/fetch-violations-for/${vehicleNumber}/${violatedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFlaggedViolations(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setFlaggedViolations([]);
    }
  };

  useEffect(() => {
    fetchFlaggedViolations();
  }, [vehicleNumber, violatedDate]);

  if (loading) return (
    <TableRow>
      <TableCell colSpan={11}>
        <Box className="flex justify-center items-center p-4">
          <CircularProgress size={24} />
        </Box>
      </TableCell>
    </TableRow>
  );

  if (error) return (
    <TableRow>
      <TableCell colSpan={11}>
        <Alert severity="error">{error}</Alert>
      </TableCell>
    </TableRow>
  );

  if (flaggedViolations.length === 0) return (
    <TableRow>
      <TableCell colSpan={11}>
        <Typography variant="body2" color="textSecondary" align="center">
          No flagged violations found
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <TableRow>
      <TableCell colSpan={11}>
        <div className="p-4 bg-gray-50 rounded-lg">
          <Timeline position="alternate" className="w-full">
            {flaggedViolations.map((violation, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot 
                    color={violation.ticketed ? 'success' : 'error'} 
                    variant="outlined" 
                  />
                  {index < flaggedViolations.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className="p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Typography variant="h6" className="text-sm font-bold">
                        Violation in {_.get(violation, 'violatedZones.zoneName', 'Unknown Zone')}
                      </Typography>
                      <Chip 
                        label={violation.ticketed ? 'Ticketed' : 'Pending'} 
                        color={violation.ticketed ? 'success' : 'warning'}
                        size="small"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Typography variant="body2">
                        <strong>Exceeded Speed:</strong> {safeFormat(violation.exceededSpeed)} km/h
                      </Typography>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {safeFormat(violation.violatedDuration)} min
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ticketed Fare:</strong> ₹{safeFormat(violation.ticketedFare)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Violation Time:</strong> {new Date(violation.violatedTime).toLocaleTimeString()}
                      </Typography>
                    </div>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </TableCell>
    </TableRow>
  );
};

FlaggedViolationsTimeline.propTypes = {
  vehicleNumber: PropTypes.string.isRequired,
  violatedDate: PropTypes.string.isRequired
};

export const TicketingPage = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({});

  // State for ticket conversion modal
  const [convertTicketModal, setConvertTicketModal] = useState({
    open: false,
    ticketId: null,
    currentFare: 0,
    newFare: 0
  });

  const fetchViolations = async (pageNumber, pageSize) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/get-cumulative-violations', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageNumber,
          pageSize
        }
      });

      // Transform the data with robust error handling
      const transformedData = (response.data || []).map((violation) => ({
        ...violation,
        exceededSpeed: safeFormat(_.get(violation, 'exceededSpeed', 0)),
        ticketedFare: safeFormat(_.get(violation, 'ticketedFare', 0)),
        violatedDuration: safeFormat(_.get(violation, 'violatedDuration', 0)),
        vehicleData: violation.vehicleData || {},
        flagged: !!violation.flagged,
        ticketed: !!violation.ticketed
      }));

      setViolations(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setViolations([]);
    }
  };

  useEffect(() => {
    fetchViolations(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Toggle row expansion
  const toggleRowExpansion = (vehicleNumber, violatedDate) => {
    const key = `${vehicleNumber}-${violatedDate}`;
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Open ticket conversion modal
  const openConvertTicketModal = (ticket) => {
    setConvertTicketModal({
      open: true,
      ticketId: ticket.tid,
      currentFare: Number(ticket.ticketedFare),
      newFare: Number(ticket.ticketedFare)
    });
  };

  // Handle ticket conversion
  const handleConvertTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:5000/update-cumulative-ticket/${convertTicketModal.ticketId}/${convertTicketModal.newFare}`, 
        null,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update the local state to reflect the changes
      setViolations(prev => prev.map(violation => 
        violation.tid === convertTicketModal.ticketId 
          ? { 
              ...violation, 
              ticketed: true, 
              ticketedFare: safeFormat(convertTicketModal.newFare) 
            } 
          : violation
      ));

      // Close the modal
      setConvertTicketModal({ open: false, ticketId: null, currentFare: 0, newFare: 0 });
    } catch (err) {
      console.error('Error converting ticket:', err);
      alert(`Failed to convert ticket: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4">
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="mb-6">
        Traffic Violations
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className="font-semibold">Vehicle Number</TableCell>
              <TableCell className="font-semibold">Contact Number</TableCell>
              <TableCell className="font-semibold">Violated Date</TableCell>
              <TableCell className="font-semibold text-right">Exceeded Speed (km/h)</TableCell>
              <TableCell className="font-semibold text-right">Ticketed Fare (₹)</TableCell>
              <TableCell className="font-semibold text-right">Violated Duration (min)</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold">Flagged</TableCell>
              <TableCell className="font-semibold">Ticketed</TableCell>
              <TableCell className="font-semibold">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {violations.map((violation) => {
              const vehicleNumber = _.get(violation, 'vehicleData.vehicleNumber', 'N/A');
              const key = `${vehicleNumber}-${violation.violatedDate}`;
              return (
                <React.Fragment key={violation.tid}>
                  <TableRow hover>
                    {/* Expandable Row Icon */}
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleRowExpansion(vehicleNumber, violation.violatedDate)}
                        disabled={!violation.flagged}
                      >
                        {expandedRows[key] && violation.flagged ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{vehicleNumber}</TableCell>
                    <TableCell>{_.get(violation, 'vehicleData.contactNumber', 'N/A')}</TableCell>
                    <TableCell>
                      {violation.violatedDate 
                        ? new Date(violation.violatedDate).toLocaleDateString() 
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell className="text-right">{violation.exceededSpeed}</TableCell>
                    <TableCell className="text-right">{violation.ticketedFare}</TableCell>
                    <TableCell className="text-right">{violation.violatedDuration}</TableCell>
                    <TableCell>
                      <Chip 
                        label={violation.status || 'Unknown'} 
                        color={violation.status === 'Not Paid' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={violation.flagged ? 'Yes' : 'No'} 
                        color={violation.flagged ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={violation.ticketed ? 'Yes' : 'No'} 
                        color={violation.ticketed ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        disabled={violation.ticketed}
                        onClick={() => openConvertTicketModal(violation)}
                      >
                        Convert Ticket
                      </Button>
                    </TableCell>
                  </TableRow>
                  {violation.flagged && expandedRows[key] && (
                    <FlaggedViolationsTimeline 
                      vehicleNumber={vehicleNumber}
                      violatedDate={violation.violatedDate}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={11}
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* Ticket Conversion Modal */}
      <Dialog
        open={convertTicketModal.open}
        onClose={() => setConvertTicketModal({ open: false, ticketId: null, currentFare: 0, newFare: 0 })}
        aria-labelledby="ticket-conversion-dialog"
      >
        <DialogTitle id="ticket-conversion-dialog">Convert Ticket</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Current Fare"
            type="number"
            fullWidth
            variant="outlined"
            value={convertTicketModal.currentFare}
            disabled
          />
          <TextField
            margin="dense"
            label="New Fare"
            type="number"
            fullWidth
            variant="outlined"
            value={convertTicketModal.newFare}
            onChange={(e) => setConvertTicketModal(prev => ({
              ...prev, 
              newFare: Number(e.target.value)
            }))}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConvertTicketModal({ open: false, ticketId: null, currentFare: 0, newFare: 0 })}
            color="secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConvertTicket} 
            color="primary" 
            variant="contained"
          >
            Convert
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};