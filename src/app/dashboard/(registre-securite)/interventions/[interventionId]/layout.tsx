'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useLoading } from '@/hooks/useLoading';
import interventionService from '@/services/interventionService';
import { Intervention, InterventionStatus } from '@/types/intervention';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Attachment as AttachmentIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const tabs = [
  { label: "Informations", value: "", icon: <InfoIcon /> },
  { label: "Rapports", value: "reports", icon: <AssignmentIcon /> },
  { label: "Observations", value: "observations", icon: <VisibilityIcon /> },
  { label: "Fichiers", value: "files", icon: <AttachmentIcon /> }
];

const statusColors: Record<InterventionStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PLANNED: 'info',
  IN_PROGRESS: 'warning',
  TERMINATED: 'success'
};

const statusLabels: Record<InterventionStatus, string> = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  TERMINATED: 'Terminée'
};

function a11yProps(index: number) {
  return {
    id: `intervention-tab-${index}`,
    'aria-controls': `intervention-tabpanel-${index}`,
  };
}

export default function InterventionDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { isLoading: loading, withLoading } = useLoading();

  const interventionId = parseInt(params.interventionId as string);

  // Data states
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

  // Définir le titre personnalisé pour le breadcrumb
  useBreadcrumbTitle(String(interventionId), intervention?.label || `Intervention ${interventionId}`);

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Détermine l'onglet actuel basé sur l'URL
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Si le dernier segment est l'ID de l'intervention, on est sur la page principale
    if (lastSegment === params.interventionId) {
      setCurrentTab(0);
    } else {
      const tabIndex = tabs.findIndex(tab => tab.value === lastSegment);
      if (tabIndex !== -1) {
        setCurrentTab(tabIndex);
      }
    }
  }, [pathname, params.interventionId]);

  // Load intervention data
  useEffect(() => {
    if (interventionId) {
      loadInterventionData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId]);

  const loadInterventionData = async () => {
    await withLoading(async () => {
      try {
        const data = await interventionService.getIntervention(interventionId);
        setIntervention(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l&apos;intervention:', error);
        showNotification('Erreur lors du chargement de l&apos;intervention', 'error');
      }
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedTab = tabs[newValue];
    const basePath = `/dashboard/interventions/${interventionId}`;
    const newPath = selectedTab.value ? `${basePath}/${selectedTab.value}` : basePath;
    router.push(newPath);
  };

  const handleBack = () => {
    router.push('/dashboard/interventions');
  };

  if (loading) {
    return (
      <Box>
        <DashBoardHeader title="Chargement..." />
        <Box sx={{ p: 3 }}>
          <Typography>Chargement de l&apos;intervention...</Typography>
        </Box>
      </Box>
    );
  }

  if (!intervention) {
    return (
      <Box>
        <DashBoardHeader title="Erreur" />
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Intervention non trouvée
          </Typography>
        </Box>
      </Box>
    );
  }

  const isDeleted = Boolean(intervention.deletedAt);

  return (
    <Box>
      <DashBoardHeader title={intervention.label} />

      <Box sx={{ p: 3 }}>
        {/* Header avec informations de l'intervention */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            background: isDeleted
              ? `linear-gradient(135deg, ${theme.palette.error.light}15, ${theme.palette.error.main}10)`
              : `linear-gradient(135deg, var(--color-axignis-primary)10, var(--color-axignis-secondary)10)`
          }}
          elevation={0}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            {/* Bouton retour */}
            <IconButton
              onClick={handleBack}
              sx={{
                mr: 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  opacity: 0.1,
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            {/* Titre principal */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {intervention.label}
              </Typography>

              {/* Informations principales */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Entreprise:</strong> {intervention.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Employé:</strong> {intervention.employeeName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Type:</strong> {intervention.type.name}
                </Typography>
              </Box>

              {/* Date prévue */}
              <Typography variant="body2" color="text.secondary">
                <strong>Date prévue:</strong> {format(new Date(intervention.plannedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>

            {/* Statut & Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                label={statusLabels[intervention.status]}
                color={statusColors[intervention.status]}
                variant="filled"
              />

              {isDeleted && (
                <Chip
                  label="Intervention supprimée"
                  color="error"
                  variant="outlined"
                />
              )}

              <Typography variant="caption" color="text.secondary">
                Créée le {format(new Date(intervention.createdAt), 'dd/MM/yyyy', { locale: fr })}
              </Typography>

              {intervention.updatedAt !== intervention.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Modifiée le {format(new Date(intervention.updatedAt), 'dd/MM/yyyy', { locale: fr })}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Tabs Container */}
        <Paper
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[3],
            mb: 3
          }}
          elevation={0}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="intervention tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              background: `linear-gradient(135deg, var(--color-axignis-primary)10, var(--color-axignis-secondary)10)`,
              '& .MuiTabs-flexContainer': {
                justifyContent: 'flex-start',
              },
              '& .MuiTab-root': {
                fontWeight: '300',
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'var(--transition-normal)',
                '&:hover': {
                  color: 'var(--color-axignis-primary)',
                },
                '&.Mui-selected': {
                  color: 'var(--color-axignis-primary)',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-axignis-primary)',
                height: 3,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.value || 'main'}
                icon={tab.icon}
                label={tab.label}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>

          {/* Contenu de la page */}
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        </Paper>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
} 