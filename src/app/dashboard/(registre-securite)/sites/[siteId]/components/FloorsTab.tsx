'use client';

import { Layers as LayersIcon } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';
import React from 'react';

interface FloorsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

const FloorsTab: React.FC<FloorsTabProps> = ({ siteId, disabled = false }) => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <LayersIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Gestion des étages
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Cette fonctionnalité sera implémentée prochainement.
        <br />
        Site ID: {siteId} | Disabled: {disabled.toString()}
      </Typography>
    </Paper>
  );
};

export default FloorsTab; 