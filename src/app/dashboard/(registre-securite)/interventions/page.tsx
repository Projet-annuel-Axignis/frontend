/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useLoading } from '@/hooks/useLoading';
import { hierarchyService } from '@/services/hierarchyService';
import { interventionService } from '@/services/interventionService';
import { Company } from '@/types/company';
import { Intervention, InterventionStatus } from '@/types/intervention';
import { Part, SiteWithBuildings } from '@/types/site';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Typography
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


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

interface NavigationState {
  companyId?: number;
  siteId?: number;
  buildingId?: number;
  partId?: number;
}

interface CompanyWithSites extends Company {
  sites: SiteWithBuildings[];
}

const InterventionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: loading, withLoading } = useLoading();

  useBreadcrumbTitle('interventions', 'Interventions');

  // Navigation state
  const [navigationState, setNavigationState] = useState<NavigationState>({
    companyId: searchParams.get('companyId') ? parseInt(searchParams.get('companyId')!) : undefined,
    siteId: searchParams.get('siteId') ? parseInt(searchParams.get('siteId')!) : undefined,
    buildingId: searchParams.get('buildingId') ? parseInt(searchParams.get('buildingId')!) : undefined,
    partId: searchParams.get('partId') ? parseInt(searchParams.get('partId')!) : undefined,
  });

  // Data states
  const [hierarchy, setHierarchy] = useState<CompanyWithSites[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithSites | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteWithBuildings | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load initial data
  useEffect(() => {
    loadHierarchy();
  }, []);

  // Load interventions when part is selected
  useEffect(() => {
    if (navigationState.partId) {
      loadInterventions();
    }
  }, [navigationState.partId]);

  const loadHierarchy = async () => {
    await withLoading(async () => {
      try {
        const result = await hierarchyService.loadHierarchicalData({
          includeDeleted: false,
        });
        const hierarchyData = hierarchyService.buildCompleteHierarchy(
          result.data,
          result.partFloorsMap,
          result.includeDeleted
        );
        setHierarchy(hierarchyData as CompanyWithSites[]);

        // Set selected entities based on navigation state
        if (navigationState.companyId) {
          const company = hierarchyData.find(c => c.id === navigationState.companyId);
          if (company) {
            setSelectedCompany(company as CompanyWithSites);
            if (navigationState.siteId) {
              const site = company.sites.find(s => s.id === navigationState.siteId);
              if (site) {
                setSelectedSite(site as SiteWithBuildings);
                if (navigationState.buildingId) {
                  const building = site.buildings.find(b => b.id === navigationState.buildingId);
                  if (building && navigationState.partId) {
                    const part = building.parts.find(p => p.id === navigationState.partId);
                    if (part) {
                      setSelectedPart(part);
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading hierarchy:', error);
        showNotification('Erreur lors du chargement de la hiérarchie', 'error');
      }
    });
  };

  const loadInterventions = async () => {
    if (!navigationState.partId) return;

    try {
      // Pour l'instant, on charge toutes les interventions et on filtre côté client
      const result = await interventionService.getInterventions({
        includeDeleted: false,
      });

      // Filtrer les interventions par partie (à adapter selon l'API)
      const filteredInterventions = result.interventions.filter(intervention =>
        intervention.parts?.some(part => part.id === navigationState.partId)
      );

      setInterventions(filteredInterventions);
    } catch (error) {
      console.error('Error loading interventions:', error);
      showNotification('Erreur lors du chargement des interventions', 'error');
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const updateNavigationState = (newState: Partial<NavigationState>) => {
    const updatedState = { ...navigationState, ...newState };
    setNavigationState(updatedState);

    // Update URL params
    const params = new URLSearchParams();
    if (updatedState.companyId) params.set('companyId', updatedState.companyId.toString());
    if (updatedState.siteId) params.set('siteId', updatedState.siteId.toString());
    if (updatedState.buildingId) params.set('buildingId', updatedState.buildingId.toString());
    if (updatedState.partId) params.set('partId', updatedState.partId.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.push(`/dashboard/interventions${newUrl}`);
  };

  const handleCompanySelect = (company: CompanyWithSites) => {
    setSelectedCompany(company);
    setSelectedSite(null);
    setSelectedPart(null);
    updateNavigationState({
      companyId: company.id,
      siteId: undefined,
      buildingId: undefined,
      partId: undefined,
    });
  };

  const handleSiteSelect = (site: SiteWithBuildings) => {
    setSelectedSite(site);
    setSelectedPart(null);
    updateNavigationState({
      siteId: site.id,
      buildingId: undefined,
      partId: undefined,
    });
  };

  const handleBuildingSelect = (buildingId: number) => {
    updateNavigationState({
      buildingId,
      partId: undefined,
    });
  };

  const handlePartSelect = (part: Part) => {
    setSelectedPart(part);
    updateNavigationState({
      partId: part.id,
    });
  };

  const handleBack = () => {
    if (navigationState.partId) {
      // Back to building
      updateNavigationState({ partId: undefined });
      setSelectedPart(null);
    } else if (navigationState.buildingId) {
      // Back to site
      updateNavigationState({ buildingId: undefined });
    } else if (navigationState.siteId) {
      // Back to company
      updateNavigationState({ siteId: undefined });
      setSelectedSite(null);
    } else if (navigationState.companyId) {
      // Back to companies list
      updateNavigationState({ companyId: undefined });
      setSelectedCompany(null);
    }
  };

  const handleCreateIntervention = () => {
    if (!navigationState.partId) return;
    router.push(`/dashboard/interventions/create?partId=${navigationState.partId}`);
  };

  const handleViewIntervention = (intervention: Intervention) => {
    router.push(`/dashboard/interventions/${intervention.id}`);
  };

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];

    if (selectedCompany) {
      breadcrumbs.push(
        <Button
          key="company"
          onClick={() => handleCompanySelect(selectedCompany)}
          startIcon={<BusinessIcon />}
          color="primary"
        >
          {selectedCompany.name}
        </Button>
      );
    }

    if (selectedSite) {
      breadcrumbs.push(
        <Button
          key="site"
          onClick={() => handleSiteSelect(selectedSite)}
          startIcon={<LocationOnIcon />}
          color="primary"
        >
          {selectedSite.name}
        </Button>
      );
    }

    if (navigationState.buildingId && selectedSite) {
      const building = selectedSite.buildings?.find(b => b.id === navigationState.buildingId);
      if (building) {
        breadcrumbs.push(
          <Button
            key="building"
            onClick={() => handleBuildingSelect(building.id)}
            startIcon={<SecurityIcon />}
            color="primary"
          >
            {building.name}
          </Button>
        );
      }
    }

    if (selectedPart) {
      breadcrumbs.push(
        <Typography key="part" variant="body1" color="text.primary">
          {selectedPart.name}
        </Typography>
      );
    }

    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        {breadcrumbs}
      </Breadcrumbs>
    );
  };

  const renderCompaniesList = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sélectionnez une entreprise
        </Typography>
        <List>
          {hierarchy.map((company) => (
            <ListItem key={company.id} disablePadding>
              <ListItemButton onClick={() => handleCompanySelect(company)}>
                <ListItemIcon>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={company.name}
                  secondary={`${company.sites?.length || 0} site(s)`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderSitesList = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sites de {selectedCompany?.name}
        </Typography>
        <List>
          {selectedCompany?.sites?.map((site) => (
            <ListItem key={site.id} disablePadding>
              <ListItemButton onClick={() => handleSiteSelect(site)}>
                <ListItemIcon>
                  <LocationOnIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={site.name}
                  secondary={`${site.streetNumber} ${site.street}, ${site.postalCode} ${site.city}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderBuildingsList = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Bâtiments du site {selectedSite?.name}
        </Typography>
        <List>
          {selectedSite?.buildings?.map((building) => (
            <ListItem key={building.id} disablePadding>
              <ListItemButton onClick={() => handleBuildingSelect(building.id)}>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={building.name}
                  secondary={`${(building as any).parts?.length || 0} partie(s)`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderPartsList = () => {
    if (!selectedSite || !navigationState.buildingId) return null;

    const building = selectedSite.buildings?.find(b => b.id === navigationState.buildingId);
    if (!building) return null;

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Parties du bâtiment {building.name}
          </Typography>
          <List>
            {(building as any).parts?.map((part: any) => (
              <ListItem key={part.id} disablePadding>
                <ListItemButton onClick={() => handlePartSelect(part)}>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={part.name}
                    secondary={`Type: ${part.type || 'Non défini'}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderInterventionsList = () => {
    if (!selectedPart) return null;

    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Interventions de la partie {selectedPart.name}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateIntervention}
            >
              Nouvelle intervention
            </Button>
          </Box>

          {interventions.length === 0 ? (
            <Alert severity="info">
              Aucune intervention trouvée pour cette partie.
            </Alert>
          ) : (
            <List>
              {interventions.map((intervention) => (
                <ListItem key={intervention.id} disablePadding>
                  <ListItemButton onClick={() => handleViewIntervention(intervention)}>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={intervention.label}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {intervention.companyName} - {intervention.employeeName}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              label={statusLabels[intervention.status]}
                              size="small"
                              color={statusColors[intervention.status]}
                            />
                            <Chip
                              label={intervention.type.name}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!navigationState.companyId) {
      return renderCompaniesList();
    }

    if (!navigationState.siteId) {
      return renderSitesList();
    }

    if (!navigationState.buildingId) {
      return renderBuildingsList();
    }

    if (!navigationState.partId) {
      return renderPartsList();
    }

    return renderInterventionsList();
  };

  return (
    <Box>
      <DashBoardHeader
        title="Interventions"
        icon={<BuildIcon />}
      >
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadHierarchy}
          disabled={loading}
        >
          Actualiser
        </Button>
      </DashBoardHeader>

      <Box sx={{ mb: 3 }}>
        {renderBreadcrumbs()}

        {(navigationState.companyId || navigationState.siteId || navigationState.buildingId || navigationState.partId) && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Retour
          </Button>
        )}
      </Box>

      {renderContent()}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InterventionsPage; 