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
  TableFooter
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Utility function to safely convert to number and format
const safeFormat = (value, decimals = 2) => {
  // If value is null, undefined, or not a number, return '0.00'
  const num = Number(value || 0);
  return isNaN(num) ? '0.00' : num.toFixed(decimals);
};

// Detailed Violations Row Component
const DetailedViolationsRow = ({ vehicleNumber, violatedDate }) => {
  const [detailedViolations, setDetailedViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetailedViolations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:5000/fetch-violations-for/${vehicleNumber}/${violatedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDetailedViolations(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setDetailedViolations([]);
    }
  };

  useEffect(() => {
    fetchDetailedViolations();
  }, [vehicleNumber, violatedDate]);

  if (loading) return (
    <TableRow>
      <TableCell colSpan={9}>
        <Box display="flex" justifyContent="center">
          <CircularProgress size={24} />
        </Box>
      </TableCell>
    </TableRow>
  );

  if (error) return (
    <TableRow>
      <TableCell colSpan={9}>
        <Alert severity="error">{error}</Alert>
      </TableCell>
    </TableRow>
  );

  if (detailedViolations.length === 0) return (
    <TableRow>
      <TableCell colSpan={9}>
        <Typography variant="body2" color="textSecondary" align="center">
          No detailed violations found
        </Typography>
      </TableCell>
    </TableRow>
  );

  return (
    <TableRow>
      <TableCell colSpan={10}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Violated Zone</TableCell>
              <TableCell>Exceeded Speed (km/h)</TableCell>
              <TableCell>Violated Duration (min)</TableCell>
              <TableCell>Ticketed Fare (₹)</TableCell>
              <TableCell>Ticketed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detailedViolations.map((violation, index) => (
              <TableRow key={index}>
                <TableCell>{_.get(violation, 'violatedZones.zoneName', 'N/A')}</TableCell>
                <TableCell>{safeFormat(violation.exceededSpeed)}</TableCell>
                <TableCell>{safeFormat(violation.violatedDuration)}</TableCell>
                <TableCell>{safeFormat(violation.ticketedFare)}</TableCell>
                <TableCell>
                  <Chip 
                    label={violation.ticketed ? 'Yes' : 'No'} 
                    color={violation.ticketed ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};

DetailedViolationsRow.propTypes = {
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
                        {expandedRows[key] && violation.flagged ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
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
                  </TableRow>
                  {violation.flagged && expandedRows[key] && (
                    <DetailedViolationsRow 
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
                colSpan={10}
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
    </Container>
  );
};

// PropTypes for type checking with more robust definitions
TicketingPage.propTypes = {
  violations: PropTypes.arrayOf(
    PropTypes.shape({
      tid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      violatedDate: PropTypes.string,
      exceededSpeed: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      flagged: PropTypes.bool,
      ticketed: PropTypes.bool,
      ticketedFare: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      violatedDuration: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      status: PropTypes.string,
      vehicleData: PropTypes.shape({
        vehicleNumber: PropTypes.string,
        contactNumber: PropTypes.string
      })
    })
  )
};

export default TicketingPage;