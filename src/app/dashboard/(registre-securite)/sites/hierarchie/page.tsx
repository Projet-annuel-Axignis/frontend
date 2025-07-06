/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  AccountTree as AccountTreeIcon,
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
  CardContent,
  FormControlLabel,
  Grid,
  Link,
  Switch,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useToast } from '@/app/_providers/ToastProvider';
import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { Company } from '@/types/company';
import { Building, BuildingFloor, Lot, Part, PartFloor, Site } from '@/types/site';
import HierarchyTree from './components/HierarchyTree';

const HierarchyPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  // Par défaut, n'afficher que les éléments non supprimés
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Définir le titre personnalisé pour le breadcrumb
  useBreadcrumbTitle("hierarchie", "Navigation Hiérarchique");

  // Selection states - filtrer les éléments supprimés
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<BuildingFloor | PartFloor | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

  // Fonction helper pour vérifier si un élément est supprimé
  const isDeleted = (entity: any) => {
    return entity && entity.deletedAt !== null && entity.deletedAt !== undefined;
  };

  // Selection handlers avec filtrage des éléments supprimés
  const handleSelectCompany = (company: Company | null) => {
    // Ne sélectionner que si l'entreprise n'est pas supprimée ou si on inclut les supprimés
    if (company && isDeleted(company) && !includeDeleted) {
      return;
    }
    setSelectedCompany(company);
    setSelectedSite(null);
    setSelectedBuilding(null);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectSite = (site: Site | null) => {
    // Ne sélectionner que si le site n'est pas supprimé ou si on inclut les supprimés
    if (site && isDeleted(site) && !includeDeleted) {
      return;
    }
    setSelectedSite(site);
    setSelectedBuilding(null);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectBuilding = (building: Building | null) => {
    // Ne sélectionner que si le bâtiment n'est pas supprimé ou si on inclut les supprimés
    if (building && isDeleted(building) && !includeDeleted) {
      return;
    }
    setSelectedBuilding(building);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectPart = (part: Part | null) => {
    // Ne sélectionner que si la partie n'est pas supprimée ou si on inclut les supprimés
    if (part && isDeleted(part) && !includeDeleted) {
      return;
    }
    setSelectedPart(part);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectFloor = (floor: BuildingFloor | PartFloor | null) => {
    // Ne sélectionner que si l'étage n'est pas supprimé ou si on inclut les supprimés
    if (floor && isDeleted(floor) && !includeDeleted) {
      return;
    }
    setSelectedFloor(floor);
    setSelectedLot(null);
  };

  const handleSelectLot = (lot: Lot | null) => {
    // Ne sélectionner que si le lot n'est pas supprimé ou si on inclut les supprimés
    if (lot && isDeleted(lot) && !includeDeleted) {
      return;
    }
    setSelectedLot(lot);
  };

  // Gestionnaire pour le changement du switch "Inclure les supprimés"
  const handleIncludeDeletedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIncludeDeleted = event.target.checked;
    setIncludeDeleted(newIncludeDeleted);

    // Si on désactive l'inclusion des supprimés, vérifier les sélections actuelles
    if (!newIncludeDeleted) {
      if (selectedLot && isDeleted(selectedLot)) {
        setSelectedLot(null);
      }
      if (selectedFloor && isDeleted(selectedFloor)) {
        setSelectedFloor(null);
      }
      if (selectedPart && isDeleted(selectedPart)) {
        setSelectedPart(null);
      }
      if (selectedBuilding && isDeleted(selectedBuilding)) {
        setSelectedBuilding(null);
      }
      if (selectedSite && isDeleted(selectedSite)) {
        setSelectedSite(null);
      }
      if (selectedCompany && isDeleted(selectedCompany)) {
        setSelectedCompany(null);
      }
    }
  };

  // Entity management handlers
  const handleAddEntity = (type: string, parent?: any) => {
    switch (type) {
      case 'company':
        router.push('/dashboard/administration/entreprises');
        break;
      case 'site':
        if (parent) {
          router.push(`/dashboard/sites?companyId=${parent.id}`);
        } else {
          router.push('/dashboard/sites');
        }
        break;
      case 'building':
        if (parent && parent.id) {
          router.push(`/dashboard/sites/${parent.id}?tab=batiments`);
        }
        break;
      case 'part':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}?tab=parties`);
        }
        break;
      case 'building-floor':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}?tab=etages`);
        }
        break;
      case 'lot':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}?tab=lots`);
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
        router.push('/dashboard/sites');
        break;
      case 'building':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}?tab=buildings`);
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
        href: `/dashboard/sites/${selectedSite.id}`,
        icon: <LocationIcon fontSize="small" />
      });
    }

    if (selectedBuilding) {
      breadcrumbs.push({
        label: selectedBuilding.name,
        href: `/dashboard/sites/${selectedSite?.id}?tab=buildings`,
        icon: <BuildingIcon fontSize="small" />
      });
    }

    return breadcrumbs;
  };

  return (
    <Box>
      {/* Header */}
      <DashBoardHeader
        title="Navigation Hiérarchique"
        icon={<AccountTreeIcon />}
      >
      </DashBoardHeader>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                Navigation Hiérarchique
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={includeDeleted}
                    onChange={handleIncludeDeletedChange}
                    color="secondary"
                  />
                }
                label="Inclure les éléments supprimés"
              />
            </Box>

            <Typography component="div" variant="body1" color="text.secondary">
              Explorez et gérez la hiérarchie complète : Entreprises → Sites → Bâtiments → Parties & Étages
              {!includeDeleted && (
                <Typography component="p" variant="body2" color="warning.main" sx={{ mt: 1 }}>
                  ⚠️ Seuls les éléments actifs (non supprimés) sont affichés
                </Typography>
              )}
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
            <Grid size={{ xs: 12, xl: 7 }}>
              <HierarchyTree
                onSelectCompany={handleSelectCompany}
                onSelectSite={handleSelectSite}
                onSelectBuilding={handleSelectBuilding}
                onSelectPart={handleSelectPart}
                onSelectFloor={handleSelectFloor}
                onSelectLot={handleSelectLot}
                onAddEntity={handleAddEntity}
                onEditEntity={handleEditEntity}
                onDeleteEntity={handleDeleteEntity}
                includeDeleted={includeDeleted}
              />
            </Grid>

            {/* Details Panel */}
            <Grid size={{ xs: 12, xl: 5 }}>
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
                      {isDeleted(selectedLot) && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          (Supprimé)
                        </Typography>
                      )}
                    </Typography>
                    <Alert severity={isDeleted(selectedLot) ? "warning" : "info"} sx={{ mb: 2 }}>
                      Lot : {selectedLot.name}
                      {isDeleted(selectedLot) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cet élément a été supprimé le {new Date(selectedLot.deletedAt!).toLocaleDateString('fr-FR')}
                        </Typography>
                      )}
                    </Alert>
                    <Button
                      variant="contained"
                      disabled={isDeleted(selectedLot)}
                      onClick={() => showToast('Gestion des lots en cours de développement', 'info')}
                      sx={{
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
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
                      {isDeleted(selectedFloor) && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          (Supprimé)
                        </Typography>
                      )}
                    </Typography>
                    <Alert severity={isDeleted(selectedFloor) ? "warning" : "info"} sx={{ mb: 2 }}>
                      Étage : {selectedFloor.name}
                      {isDeleted(selectedFloor) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cet élément a été supprimé le {new Date(selectedFloor.deletedAt!).toLocaleDateString('fr-FR')}
                        </Typography>
                      )}
                    </Alert>
                    <Button
                      variant="contained"
                      disabled={isDeleted(selectedFloor)}
                      onClick={() => showToast('Gestion des étages en cours de développement', 'info')}
                      sx={{
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
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
                      {isDeleted(selectedPart) && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          (Supprimé)
                        </Typography>
                      )}
                    </Typography>
                    <Alert severity={isDeleted(selectedPart) ? "warning" : "info"} sx={{ mb: 2 }}>
                      Partie : {selectedPart.name}
                      <br />
                      Type : {selectedPart.type === "PRIVATE" ? "Privée" : "Commune"}
                      <br />
                      ICPE ? : {selectedPart.isIcpe ? "Oui" : "Non"}
                      <br />
                      Type d&apos;ERP : {selectedPart.erpTypes ? selectedPart.erpTypes.map((erpType: string) => erpType).join(', ') : "Non défini"}

                      {isDeleted(selectedPart) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cet élément a été supprimé le {new Date(selectedPart.deletedAt!).toLocaleDateString('fr-FR')}
                        </Typography>
                      )}
                    </Alert>
                    <Button
                      variant="contained"
                      disabled={isDeleted(selectedPart)}
                      onClick={() => selectedSite && router.push(`/dashboard/sites/${selectedSite.id}?tab=parties`)}
                      sx={{
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
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
                      {isDeleted(selectedBuilding) && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          (Supprimé)
                        </Typography>
                      )}
                    </Typography>
                    <Alert severity={isDeleted(selectedBuilding) ? "warning" : "info"} sx={{ mb: 2 }}>
                      Bâtiment : {selectedBuilding.name}
                      {isDeleted(selectedBuilding) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cet élément a été supprimé le {new Date(selectedBuilding.deletedAt!).toLocaleDateString('fr-FR')}
                        </Typography>
                      )}
                    </Alert>
                    <Button
                      variant="contained"
                      disabled={isDeleted(selectedBuilding)}
                      onClick={() => selectedSite && router.push(`/dashboard/sites/${selectedSite.id}?tab=buildings`)}
                      sx={{
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
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
                      {isDeleted(selectedSite) && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          (Supprimé)
                        </Typography>
                      )}
                    </Typography>
                    <Alert severity={isDeleted(selectedSite) ? "warning" : "info"} sx={{ mb: 2 }}>
                      Site : {selectedSite.name}<br />
                      Adresse : {selectedSite.streetNumber} {selectedSite.street}, {selectedSite.postalCode} {selectedSite.city}
                      {isDeleted(selectedSite) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cet élément a été supprimé le {new Date(selectedSite.deletedAt!).toLocaleDateString('fr-FR')}
                        </Typography>
                      )}
                    </Alert>
                    <Button
                      variant="contained"
                      disabled={isDeleted(selectedSite)}
                      onClick={() => router.push(`/dashboard/sites/${selectedSite.id}`)}
                      sx={{
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
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
                      {isDeleted(selectedCompany) && (
                        <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                          (Supprimé)
                        </Typography>
                      )}
                    </Typography>
                    <Alert severity={isDeleted(selectedCompany) ? "warning" : "info"} sx={{ mb: 2 }}>
                      Entreprise : {selectedCompany.name}<br />
                      SIRET : {selectedCompany.siretNumber}
                      {isDeleted(selectedCompany) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Cet élément a été supprimé le {new Date(selectedCompany.deletedAt!).toLocaleDateString('fr-FR')}
                        </Typography>
                      )}
                    </Alert>
                    <Button
                      variant="contained"
                      disabled={isDeleted(selectedCompany)}
                      onClick={() => router.push('/dashboard/administration/entreprises')}
                      sx={{
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
                    >
                      Gérer cette entreprise
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HierarchyPage; 