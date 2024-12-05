import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  IconButton, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon, 
  LocationOn as LocationIcon 
} from '@mui/icons-material';

// Mock data for speed breaker predictions
const speedbreakerPredictions = [
  {
    id: 1,
    location: 'Highway A - Near Residential Intersection',
    riskScore: 8.5,
    recommendations: [
      'Install speed breaker 50m before intersection',
      'Reduce speed limit from 100 to 80 km/h',
      'Add clear signage for speed reduction'
    ],
    accidents: 12,
    yearlyRiskFactor: 'High'
  },
  {
    id: 2,
    location: 'School Zone - Main Road',
    riskScore: 7.8,
    recommendations: [
      'Implement raised speed breaker',
      'Add pedestrian crossing with speed bump',
      'Install warning lights during school hours'
    ],
    accidents: 8,
    yearlyRiskFactor: 'Medium'
  },
  {
    id: 3,
    location: 'Commercial District - Sharp Curve',
    riskScore: 6.5,
    recommendations: [
      'Add chevron speed breaker',
      'Improve road markings',
      'Install reflective road studs'
    ],
    accidents: 5,
    yearlyRiskFactor: 'Low'
  }
];

export const SpeedBreakerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handlePredictionSelect = (prediction) => {
    setSelectedPrediction(prediction);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <Box 
        sx={{
          position: 'fixed', 
          bottom: 20, 
          left: 20, 
          zIndex: 1300
        }}
      >
        <IconButton 
          color="primary" 
          onClick={toggleChatbot}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            width: 60,
            height: 60
          }}
        >
          <ChatIcon />
        </IconButton>
      </Box>

      {/* Chatbot Sidebar */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleChatbot}
        sx={{
          '& .MuiDrawer-paper': {
            width: 400,
            padding: 2,
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}
        >
          <Typography variant="h5">
            AI Speed Breaker Predictor
          </Typography>
          <IconButton onClick={toggleChatbot}>
            <CloseIcon />
          </IconButton>
        </Box>

        {!selectedPrediction ? (
          <List>
            {speedbreakerPredictions.map((prediction) => (
              <ListItem 
                key={prediction.id}
                button 
                onClick={() => handlePredictionSelect(prediction)}
                sx={{ 
                  mb: 1, 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary={prediction.location}
                  secondary={`Risk Score: ${prediction.riskScore} | Accidents: ${prediction.accidents}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Prediction: {selectedPrediction.location}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Risk Assessment
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography>Risk Score:</Typography>
                <Typography color={
                  selectedPrediction.riskScore > 7 ? 'error' : 
                  selectedPrediction.riskScore > 5 ? 'warning.main' : 
                  'success.main'
                }>
                  {selectedPrediction.riskScore}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography>Yearly Risk Factor:</Typography>
                <Typography color={
                  selectedPrediction.yearlyRiskFactor === 'High' ? 'error' : 
                  selectedPrediction.yearlyRiskFactor === 'Medium' ? 'warning.main' : 
                  'success.main'
                }>
                  {selectedPrediction.yearlyRiskFactor}
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Recommendations
              </Typography>
              <List dense>
                {selectedPrediction.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`• ${rec}`} />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => setSelectedPrediction(null)}
                >
                  Back to List
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                >
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Drawer>
    </>
  );
};

export default SpeedBreakerChatbot;