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
  Chip
} from '@mui/material';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const TicketingPage = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

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

      // Transform the data 
      const transformedData = response.data.map((violation) => ({
        ...violation,
        exceededSpeed: Number(violation?.exceededSpeed ?? 0).toFixed(2),
        ticketedFare: Number(violation?.ticketedFare ?? 0).toFixed(2),
        violatedDuration: Number(violation?.violatedDuration ?? 0).toFixed(2)
      }));

      setViolations(transformedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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
            {violations.map((violation) => (
              <TableRow key={violation.tid} hover>
                <TableCell>{violation.vehicleData?.vehicleNumber || 'N/A'}</TableCell>
                <TableCell>{violation.vehicleData?.contactNumber || 'N/A'}</TableCell>
                <TableCell>{violation.violatedDate ? new Date(violation.violatedDate).toLocaleDateString() : 'N/A'}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

// PropTypes for type checking
TicketingPage.propTypes = {
  violations: PropTypes.arrayOf(
    PropTypes.shape({
      tid: PropTypes.number.isRequired,
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