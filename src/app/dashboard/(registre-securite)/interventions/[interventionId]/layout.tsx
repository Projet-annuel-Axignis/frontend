'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useLoading } from '@/hooks/useLoading';
import interventionService from '@/services/interventionService';
import reportService from '@/services/reportService';
import { Intervention, InterventionStatus } from '@/types/intervention';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
  Alert,
  Badge,
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

  // États pour les compteurs
  const [reportsCount, setReportsCount] = useState<number>(0);

  // Définir le titre personnalisé pour le breadcrumb
  useBreadcrumbTitle('interventions', 'Interventions');
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
      loadIntervention();
      loadCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId]);

  const loadIntervention = async () => {
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

  // Charger les compteurs pour les pastilles
  const loadCounts = async () => {
    try {
      // Charger le nombre de rapports
      const reportsData = await reportService.getReports({
        interventionId: interventionId,
        includeDeleted: false
      });
      setReportsCount(reportsData.total);

    } catch (error) {
      console.error('Erreur lors du chargement des compteurs:', error);
    }
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

  if (loading && !intervention) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (!intervention) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ScheduleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Intervention non trouvée
        </Typography>
        <Typography variant="body2" color="text.secondary">
          L&apos;intervention demandée n&apos;existe pas ou a été supprimée.
        </Typography>
      </Box>
    );
  }

  const isDeleted = Boolean(intervention.deletedAt);

  return (
    <Box>
      {/* Header */}
      <DashBoardHeader
        title={intervention.label}
        icon={<ScheduleIcon />}
      >
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { boxShadow: 2 }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </DashBoardHeader>

      {/* Intervention Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Intervention Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom sx={{
              textDecoration: isDeleted ? 'line-through' : 'none',
              opacity: isDeleted ? 0.6 : 1
            }}>
              {intervention.label}
            </Typography>

            {/* Company */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {intervention.companyName}
              </Typography>
            </Box>

            {/* Employee */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {intervention.employeeName}
              </Typography>
            </Box>

            {/* Type */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Type:</strong> {intervention.type.name}
            </Typography>

            {/* Date prévue */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(intervention.plannedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
          </Box>

          {/* Status & Actions */}
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
          {tabs.map((tab, index) => {
            let badgeContent = 0;
            if (index === 1) badgeContent = reportsCount; // Rapports

            return (
              <Tab
                key={tab.value || 'main'}
                icon={
                  index === 0 ? tab.icon : (
                    <Badge
                      badgeContent={badgeContent}
                      color="info"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.625rem',
                          height: '16px',
                          minWidth: '16px',
                          right: '-10px',
                          top: '2px'
                        }
                      }}
                    >
                      {tab.icon}
                    </Badge>
                  )
                }
                label={tab.label}
                {...a11yProps(index)}
              />
            );
          })}
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
  );
} 