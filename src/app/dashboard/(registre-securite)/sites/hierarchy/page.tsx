'use client';

import {
  Apartment as BuildingIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useToast } from '@/app/_providers/ToastProvider';
import companyService from '@/services/companyService';
import { siteService } from '@/services/siteService';
import { Company } from '@/types/company';
import { Building, BuildingFloor, Lot, Part, PartFloor, Site, SiteWithBuildings } from '@/types/site';
import HierarchyTree from '../components/HierarchyTree';

const HierarchyPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sites, setSites] = useState<SiteWithBuildings[]>([]);

  // Selection states
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<BuildingFloor | PartFloor | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load companies
      const companiesResponse = await companyService.getCompanies();
      setCompanies(companiesResponse.companies);

      // Load sites
      const sitesResponse = await siteService.getSites();
      setSites(sitesResponse.sites);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Selection handlers
  const handleSelectCompany = (company: Company | null) => {
    setSelectedCompany(company);
    setSelectedSite(null);
    setSelectedBuilding(null);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectSite = (site: Site | null) => {
    setSelectedSite(site);
    setSelectedBuilding(null);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectBuilding = (building: Building | null) => {
    setSelectedBuilding(building);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectPart = (part: Part | null) => {
    setSelectedPart(part);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectFloor = (floor: BuildingFloor | PartFloor | null) => {
    setSelectedFloor(floor);
    setSelectedLot(null);
  };

  const handleSelectLot = (lot: Lot | null) => {
    setSelectedLot(lot);
  };

  // Entity management handlers
  const handleAddEntity = (type: string, parent?: any) => {
    switch (type) {
      case 'company':
        router.push('/dashboard/administration/entreprises');
        break;
      case 'site':
        if (parent) {
          router.push(`/dashboard/(registre-securite)/sites?companyId=${parent.id}`);
        } else {
          router.push('/dashboard/(registre-securite)/sites');
        }
        break;
      case 'building':
        if (parent && parent.id) {
          router.push(`/dashboard/(registre-securite)/sites/${parent.id}?tab=buildings`);
        }
        break;
      case 'part':
        if (selectedSite) {
          router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}?tab=parts`);
        }
        break;
      case 'building-floor':
        if (selectedSite) {
          router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}?tab=floors`);
        }
        break;
      case 'lot':
        if (selectedSite) {
          router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}?tab=lots`);
        }
        break;
      default:
        showToast(`Ajout de ${type} - Fonctionnalité en cours de développement`, 'info');
    }
  };

  const handleEditEntity = (type: string, _entity: any) => {
    switch (type) {
      case 'company':
        router.push('/dashboard/administration/entreprises');
        break;
      case 'site':
        router.push('/dashboard/(registre-securite)/sites');
        break;
      case 'building':
        if (selectedSite) {
          router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}?tab=buildings`);
        }
        break;
      default:
        showToast(`Édition de ${type} - Fonctionnalité en cours de développement`, 'info');
    }
  };

  const handleDeleteEntity = (type: string, _entity: any) => {
    showToast(`Suppression de ${type} - Fonctionnalité en cours de développement`, 'info');
  };

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <BusinessIcon fontSize="small" />
      }
    ];

    if (selectedCompany) {
      breadcrumbs.push({
        label: selectedCompany.name,
        href: `/dashboard/administration/entreprises`,
        icon: <BusinessIcon fontSize="small" />
      });
    }

    if (selectedSite) {
      breadcrumbs.push({
        label: selectedSite.name,
        href: `/dashboard/(registre-securite)/sites/${selectedSite.id}`,
        icon: <LocationIcon fontSize="small" />
      });
    }

    if (selectedBuilding) {
      breadcrumbs.push({
        label: selectedBuilding.name,
        href: `/dashboard/(registre-securite)/sites/${selectedSite?.id}?tab=buildings`,
        icon: <BuildingIcon fontSize="small" />
      });
    }

    return breadcrumbs;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon />
          Navigation Hiérarchique
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explorez et gérez la hiérarchie complète : Entreprises → Sites → Bâtiments → Parties & Étages
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      {(selectedCompany || selectedSite || selectedBuilding) && (
        <Card sx={{ p: 2, mb: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            {getBreadcrumbs().map((breadcrumb, index) => (
              <Link
                key={index}
                href={breadcrumb.href}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {breadcrumb.icon}
                {breadcrumb.label}
              </Link>
            ))}
          </Breadcrumbs>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Navigation Tree */}
        <Grid size={{ xs: 12, md: 6 }}>
          <HierarchyTree
            companies={companies}
            sites={sites}
            onSelectCompany={handleSelectCompany}
            onSelectSite={handleSelectSite}
            onSelectBuilding={handleSelectBuilding}
            onSelectPart={handleSelectPart}
            onSelectFloor={handleSelectFloor}
            onSelectLot={handleSelectLot}
            onAddEntity={handleAddEntity}
            onEditEntity={handleEditEntity}
            onDeleteEntity={handleDeleteEntity}
          />
        </Grid>

        {/* Details Panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            {!selectedCompany && !selectedSite && !selectedBuilding && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  color: 'text.secondary',
                }}
              >
                <BusinessIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" align="center">
                  Sélectionnez un élément
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Cliquez sur un élément dans la navigation pour voir ses détails
                </Typography>
              </Box>
            )}

            {selectedLot && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Lot Sélectionné
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Lot : {selectedLot.name}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => showToast('Gestion des lots en cours de développement', 'info')}
                >
                  Gérer ce lot
                </Button>
              </Box>
            )}

            {selectedFloor && !selectedLot && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Étage Sélectionné
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Étage : {selectedFloor.name}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => showToast('Gestion des étages en cours de développement', 'info')}
                >
                  Gérer cet étage
                </Button>
              </Box>
            )}

            {selectedPart && !selectedFloor && !selectedLot && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Partie Sélectionnée
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Partie : {selectedPart.name}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => selectedSite && router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}?tab=parts`)}
                >
                  Gérer cette partie
                </Button>
              </Box>
            )}

            {selectedBuilding && !selectedPart && !selectedFloor && !selectedLot && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BuildingIcon />
                  Bâtiment Sélectionné
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Bâtiment : {selectedBuilding.name}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => selectedSite && router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}?tab=buildings`)}
                >
                  Gérer ce bâtiment
                </Button>
              </Box>
            )}

            {selectedSite && !selectedBuilding && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon />
                  Site Sélectionné
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Site : {selectedSite.name}<br />
                  Adresse : {selectedSite.streetNumber} {selectedSite.street}, {selectedSite.postalCode} {selectedSite.city}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => router.push(`/dashboard/(registre-securite)/sites/${selectedSite.id}`)}
                >
                  Gérer ce site
                </Button>
              </Box>
            )}

            {selectedCompany && !selectedSite && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon />
                  Entreprise Sélectionnée
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Entreprise : {selectedCompany.name}<br />
                  SIRET : {selectedCompany.siret}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => router.push('/dashboard/administration/entreprises')}
                >
                  Gérer cette entreprise
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HierarchyPage; 