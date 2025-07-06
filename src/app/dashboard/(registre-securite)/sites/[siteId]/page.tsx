'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useLoading } from '@/hooks/useLoading';
import companyService from '@/services/companyService';
import { getFullAddress, siteService } from '@/services/siteService';
import { Company } from '@/types/company';
import { Site } from '@/types/site';
import {
  Apartment as ApartmentIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  Layers as LayersIcon,
  LocationOn as LocationIcon,
  ViewModule as ViewModuleIcon
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
} from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import BuildingsTab from './components/BuildingsTab';
import FloorsTab from './components/FloorsTab';
import LotsTab from './components/LotsTab';

import PartsTab from './components/PartsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`site-tabpanel-${index}`}
      aria-labelledby={`site-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mapping entre les onglets et les segments d'URL
const TAB_ROUTES = [
  'batiments',
  'etages',
  'parties',
  'lots'
];

// Mapping inverse pour retrouver l'index depuis l'URL
const ROUTE_TO_TAB_INDEX: Record<string, number> = {
  'batiments': 0,
  'etages': 1,
  'parties': 2,
  'lots': 3,
};

const SiteDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: loading, withLoading } = useLoading();

  const siteId = parseInt(params.siteId as string);

  // Data states
  const [site, setSite] = useState<Site | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Définir le titre personnalisé pour le breadcrumb
  useBreadcrumbTitle(String(siteId), site?.name || `Site ${siteId}`);

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

  // Déterminer l'onglet actuel depuis l'URL
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab && ROUTE_TO_TAB_INDEX.hasOwnProperty(currentTab)) {
      setTabValue(ROUTE_TO_TAB_INDEX[currentTab]);
    } else {
      // Si pas d'onglet spécifié ou onglet invalide, aller sur bâtiments et mettre à jour l'URL
      setTabValue(0);
      if (!currentTab) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', TAB_ROUTES[0]);
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  }, [searchParams, router]);

  // Load site data
  useEffect(() => {
    if (siteId) {
      loadSiteData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  const loadSiteData = async () => {
    await withLoading(async () => {
      try {
        // Load site details
        const siteData = await siteService.getSite(siteId);
        setSite(siteData);

        // Load company details
        const companyData = await companyService.getCompanyById(siteData.companyId);
        setCompany(companyData);
      } catch (error) {
        console.error('Error loading site data:', error);
        showNotification('Erreur lors du chargement des données du site', 'error');
      }
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Mettre à jour l'URL avec le nouvel onglet
    const tabRoute = TAB_ROUTES[newValue];
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabRoute);
    router.push(url.pathname + url.search, { scroll: false });
  };

  const handleBack = () => {
    router.push('/dashboard/sites');
  };

  if (loading && !site) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (!site) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Site non trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Le site demandé n&apos;existe pas ou a été supprimé.
        </Typography>
      </Box>
    );
  }

  const isDeleted = !!site.deletedAt;

  return (
    <Box>
      {/* Header */}
      <DashBoardHeader
        title={site.name}
        icon={<BusinessIcon />}
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

      {/* Site Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Site Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom sx={{
              textDecoration: isDeleted ? 'line-through' : 'none',
              opacity: isDeleted ? 0.6 : 1
            }}>
              {site.name}
            </Typography>

            {/* Company */}
            {company && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {company.name}
                </Typography>
              </Box>
            )}

            {/* Address */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary', mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary">
                {getFullAddress(site)}
              </Typography>
            </Box>

            {/* Reference */}
            {site.reference && (
              <Typography variant="body2" color="text.secondary">
                <strong>Référence:</strong> {site.reference}
              </Typography>
            )}
          </Box>

          {/* Status & Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
            {isDeleted && (
              <Chip
                label="Site supprimé"
                color="error"
                variant="outlined"
              />
            )}

            <Typography variant="caption" color="text.secondary">
              Créé le {new Date(site.createdAt).toLocaleDateString('fr-FR')}
            </Typography>

            {site.updatedAt !== site.createdAt && (
              <Typography variant="caption" color="text.secondary">
                Modifié le {new Date(site.updatedAt).toLocaleDateString('fr-FR')}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<ApartmentIcon />}
            label="Bâtiments"
            id="site-tab-0"
            aria-controls="site-tabpanel-0"
          />
          <Tab
            icon={<LayersIcon />}
            label="Étages"
            id="site-tab-1"
            aria-controls="site-tabpanel-1"
          />
          <Tab
            icon={<ViewModuleIcon />}
            label="Parties"
            id="site-tab-2"
            aria-controls="site-tabpanel-2"
          />
          <Tab
            icon={<InventoryIcon />}
            label="Lots"
            id="site-tab-3"
            aria-controls="site-tabpanel-3"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <BuildingsTab
          siteId={siteId}
          onNotification={showNotification}
          disabled={isDeleted}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <FloorsTab
          siteId={siteId}
          onNotification={showNotification}
          disabled={isDeleted}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PartsTab
          siteId={siteId}
          onNotification={showNotification}
          disabled={isDeleted}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <LotsTab
          siteId={siteId}
          onNotification={showNotification}
          disabled={isDeleted}
        />
      </TabPanel>

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
};

export default SiteDetailPage; 