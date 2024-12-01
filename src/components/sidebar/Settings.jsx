import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Box
} from '@mui/material';
import { 
  Settings as SettingsIcon, 
  Save as SaveIcon 
} from '@mui/icons-material';

export const Settingss = () => {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    speedThreshold: 50,
    emailAlerts: true,
    phoneAlerts: false,
    adminEmail: 'admin@limoni.com'
  });

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // Placeholder for saving settings
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
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
        <SettingsIcon sx={{ mr: 2 }} color="primary" />
        System Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Monitoring Preferences" 
              subheader="Configure system monitoring and alert settings"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notificationsEnabled}
                        onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      />
                    }
                    label="Enable System Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Speed Violation Threshold (km/h)"
                    value={settings.speedThreshold}
                    onChange={(e) => handleSettingChange('speedThreshold', Number(e.target.value))}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Alert Channels" 
              subheader="Select how you want to receive alerts"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailAlerts}
                        onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                      />
                    }
                    label="Email Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.phoneAlerts}
                        onChange={(e) => handleSettingChange('phoneAlerts', e.target.checked)}
                      />
                    }
                    label="Phone Alerts"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Admin Email"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settingss;