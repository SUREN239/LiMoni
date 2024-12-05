// src/components/sidebar/MailAndSQSPage.jsx
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
  TextField, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';

export const MailAndSQSPage = () => {
  const [zones, setZones] = useState([
    { id: 1, name: 'Residential Zone A', currentSpeedLimit: 30, proposedSpeedLimit: 30 },
    { id: 2, name: 'Highway Zone B', currentSpeedLimit: 100, proposedSpeedLimit: 100 },
    { id: 3, name: 'School Zone C', currentSpeedLimit: 20, proposedSpeedLimit: 20 },
    { id: 4, name: 'Commercial Zone D', currentSpeedLimit: 50, proposedSpeedLimit: 50 },
    { id: 5, name: 'Industrial Zone E', currentSpeedLimit: 40, proposedSpeedLimit: 40 }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleSpeedLimitChange = (zoneId, value) => {
    setZones(zones.map(zone => 
      zone.id === zoneId 
        ? { ...zone, proposedSpeedLimit: Number(value) } 
        : zone
    ));
  };

  const handleOpenDialog = (zone) => {
    setSelectedZone(zone);
    setOpenDialog(true);
  };

  const handleConfirmChange = () => {
    setZones(zones.map(zone => 
      zone.id === selectedZone.id 
        ? { ...zone, currentSpeedLimit: zone.proposedSpeedLimit } 
        : zone
    ));
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Zone Speed Limit Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Zone Name</TableCell>
              <TableCell align="center">Current Speed Limit (km/h)</TableCell>
              <TableCell align="center">Proposed Speed Limit (km/h)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell>{zone.name}</TableCell>
                <TableCell align="center">{zone.currentSpeedLimit}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={zone.proposedSpeedLimit}
                    onChange={(e) => handleSpeedLimitChange(zone.id, e.target.value)}
                    variant="standard"
                    inputProps={{ min: 10, max: 120 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    color="primary"
                    disabled={zone.currentSpeedLimit === zone.proposedSpeedLimit}
                    onClick={() => handleOpenDialog(zone)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Speed Limit Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change the speed limit for {selectedZone?.name} 
            from {selectedZone?.currentSpeedLimit} to {selectedZone?.proposedSpeedLimit} km/h?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmChange} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Ensure default export as well
export default MailAndSQSPage;