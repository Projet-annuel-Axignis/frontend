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
  useTheme
} from '@mui/material';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SiteProvider } from './_providers/SiteProvider';

const tabs = [
  { label: "Bâtiments", value: "batiments", icon: <ApartmentIcon /> },
  { label: "Étages", value: "etages", icon: <LayersIcon /> },
  { label: "Parties", value: "parties", icon: <ViewModuleIcon /> },
  { label: "Lots", value: "lots", icon: <InventoryIcon /> }
];

function a11yProps(index: number) {
  return {
    id: `site-tab-${index}`,
    'aria-controls': `site-tabpanel-${index}`,
  };
}

export default function SiteDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { isLoading: loading, withLoading } = useLoading();

  const siteId = parseInt(params.siteId as string);

  // Data states
  const [site, setSite] = useState<Site | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [currentTab, setCurrentTab] = useState(0);

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

  // Détermine l'onglet actuel basé sur l'URL
  useEffect(() => {
    const currentPath = pathname.split('/').pop();
    const tabIndex = tabs.findIndex(tab => tab.value === currentPath);
    if (tabIndex !== -1) {
      setCurrentTab(tabIndex);
    }
  }, [pathname]);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    const selectedTab = tabs[newValue];
    router.push(`/dashboard/sites/${siteId}/${selectedTab.value}`);
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
    <SiteProvider
      site={site}
      company={company}
      showNotification={showNotification}
    >
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
            aria-label="site tabs"
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
                fontWeight: 600,
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
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>

          {/* Contenu de la page */}
          <Box sx={{ py: 3 }}>
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
    </SiteProvider>
  );
} 