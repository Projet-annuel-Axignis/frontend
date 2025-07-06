/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  AccountTree as AccountTreeIcon,
  Apartment as BuildingIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  Layers as LayersIcon,
  LocationOn as LocationIcon,
  NavigateNext as NavigateNextIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  Switch,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { useToast } from '@/app/_providers/ToastProvider';
import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { Company } from '@/types/company';
import { Building, BuildingFloor, Lot, Part, PartFloor, Site } from '@/types/site';
import HierarchyTree from './HierarchyTree';

const HierarchyPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  // Par défaut, n'afficher que les éléments non supprimés
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Définir le titre personnalisé pour le breadcrumb
  useBreadcrumbTitle("hierarchie", "Navigation Hiérarchique");

  // Selection states - maintenir la hiérarchie complète
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

  // Fonction helper pour déterminer le type d'étage
  const isPartFloor = (floor: BuildingFloor | PartFloor): floor is PartFloor => {
    return 'publicCount' in floor;
  };

  // Selection handlers avec maintien de la hiérarchie
  const handleSelectCompany = (company: Company | null) => {
    if (company && isDeleted(company) && !includeDeleted) {
      return;
    }
    setSelectedCompany(company);
    // Réinitialiser tous les niveaux inférieurs
    setSelectedSite(null);
    setSelectedBuilding(null);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectSite = (site: Site | null) => {
    if (site && isDeleted(site) && !includeDeleted) {
      return;
    }
    // Maintenir la sélection de l'entreprise si elle existe
    if (site?.company) {
      setSelectedCompany(site.company);
    }
    setSelectedSite(site);
    // Réinitialiser les niveaux inférieurs
    setSelectedBuilding(null);
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectBuilding = (building: Building | null) => {
    if (building && isDeleted(building) && !includeDeleted) {
      return;
    }
    // Maintenir la sélection du site si elle existe
    if (building?.site) {
      setSelectedSite(building.site);
      if (building.site.company) {
        setSelectedCompany(building.site.company);
      }
    }
    setSelectedBuilding(building);
    // Réinitialiser les niveaux inférieurs
    setSelectedPart(null);
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectPart = (part: Part | null) => {
    if (part && isDeleted(part) && !includeDeleted) {
      return;
    }
    // Maintenir la sélection du bâtiment si elle existe
    if (part?.building) {
      setSelectedBuilding(part.building);
      if (part.building.site) {
        setSelectedSite(part.building.site);
        if (part.building.site.company) {
          setSelectedCompany(part.building.site.company);
        }
      }
    }
    setSelectedPart(part);
    // Réinitialiser les niveaux inférieurs
    setSelectedFloor(null);
    setSelectedLot(null);
  };

  const handleSelectFloor = (floor: BuildingFloor | PartFloor | null) => {
    if (floor && isDeleted(floor) && !includeDeleted) {
      return;
    }

    if (floor) {
      // Maintenir la hiérarchie selon le type d'étage
      if (isPartFloor(floor)) {
        // C'est un étage de partie
        const building = floor.buildingFloor.building;
        setSelectedBuilding(building);
        if (building.site) {
          setSelectedSite(building.site);
          if (building.site.company) {
            setSelectedCompany(building.site.company);
          }
        }
      } else {
        // C'est un étage de bâtiment
        const building = floor.building;
        setSelectedBuilding(building);
        if (building.site) {
          setSelectedSite(building.site);
          if (building.site.company) {
            setSelectedCompany(building.site.company);
          }
        }
      }
    }

    setSelectedFloor(floor);
    // Réinitialiser les niveaux inférieurs
    setSelectedLot(null);
  };

  const handleSelectLot = (lot: Lot | null) => {
    if (lot && isDeleted(lot) && !includeDeleted) {
      return;
    }

    if (lot) {
      // Maintenir la hiérarchie complète
      const building = lot.building;
      setSelectedBuilding(building);
      if (building.site) {
        setSelectedSite(building.site);
        if (building.site.company) {
          setSelectedCompany(building.site.company);
        }
      }
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
          router.push(`/dashboard/sites/${parent.id}/batiments`);
        }
        break;
      case 'part':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}/parties`);
        }
        break;
      case 'building-floor':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}/etages`);
        }
        break;
      case 'lot':
        if (selectedSite) {
          router.push(`/dashboard/sites/${selectedSite.id}/lots`);
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
          router.push(`/dashboard/sites/${selectedSite.id}/batiments`);
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
        href: `/dashboard/sites/${selectedSite?.id}/batiments`,
        icon: <BuildingIcon fontSize="small" />
      });
    }

    return breadcrumbs;
  };

  // Fonction pour obtenir l'élément actuellement sélectionné (priorité au plus spécifique)
  const getCurrentSelection = () => {
    if (selectedLot) return { type: 'lot', data: selectedLot };
    if (selectedFloor) return { type: 'floor', data: selectedFloor };
    if (selectedPart) return { type: 'part', data: selectedPart };
    if (selectedBuilding) return { type: 'building', data: selectedBuilding };
    if (selectedSite) return { type: 'site', data: selectedSite };
    if (selectedCompany) return { type: 'company', data: selectedCompany };
    return null;
  };

  const currentSelection = getCurrentSelection();

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
                {!currentSelection ? (
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
                ) : (
                  <Box>
                    {/* Lot Details */}
                    {currentSelection.type === 'lot' && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InventoryIcon />
                          Lot Sélectionné
                          {isDeleted(currentSelection.data) && (
                            <Chip label="Supprimé" color="warning" size="small" />
                          )}
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Informations du Lot
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Nom :</strong> {(currentSelection.data as Lot).name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Bâtiment :</strong> {(currentSelection.data as Lot).building.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Étage :</strong> {(currentSelection.data as Lot).buildingFloor.name}
                          </Typography>
                          {(currentSelection.data as Lot).partFloor && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Étage de partie :</strong> {(currentSelection.data as Lot).partFloor.name}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Créé le :</strong> {new Date((currentSelection.data as Lot).createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Modifié le :</strong> {new Date((currentSelection.data as Lot).updatedAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          {isDeleted(currentSelection.data) && (
                            <Typography variant="body2" color="error">
                              <strong>Supprimé le :</strong> {new Date((currentSelection.data as Lot).deletedAt!).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Paper>

                        <Button
                          variant="contained"
                          disabled={isDeleted(currentSelection.data)}
                          onClick={() => selectedSite && router.push(`/dashboard/sites/${selectedSite.id}/lots?edit=${(currentSelection.data as Lot).id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                            '&:hover': {
                              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                            },
                          }}
                        >
                          Modifier ce lot
                        </Button>
                      </Box>
                    )}

                    {/* Floor Details */}
                    {currentSelection.type === 'floor' && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LayersIcon />
                          {isPartFloor(currentSelection.data as BuildingFloor | PartFloor) ? 'Étage de Partie' : 'Étage de Bâtiment'}
                          {isDeleted(currentSelection.data) && (
                            <Chip label="Supprimé" color="warning" size="small" />
                          )}
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Informations de l&apos;Étage
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Nom :</strong> {(currentSelection.data as BuildingFloor | PartFloor).name}
                          </Typography>

                          {isPartFloor(currentSelection.data as BuildingFloor | PartFloor) ? (
                            <>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Étage de bâtiment :</strong> {(currentSelection.data as PartFloor).buildingFloor.name}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Bâtiment :</strong> {(currentSelection.data as PartFloor).buildingFloor.building.name}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Niveau :</strong> {(currentSelection.data as PartFloor).levelNumber}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Données d&apos;occupation
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Public :</strong> {(currentSelection.data as PartFloor).publicCount} personnes
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Personnel :</strong> {(currentSelection.data as PartFloor).staffCount} personnes
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Surfaces
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Surface d&apos;exploitation :</strong> {(currentSelection.data as PartFloor).exploitationSurface} m²
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Surface GLA :</strong> {(currentSelection.data as PartFloor).glaSurface} m²
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Surface d&apos;accès public :</strong> {(currentSelection.data as PartFloor).publicAccessSurface} m²
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Bâtiment :</strong> {(currentSelection.data as BuildingFloor).building.name}
                            </Typography>
                          )}

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Créé le :</strong> {new Date(currentSelection.data.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Modifié le :</strong> {new Date(currentSelection.data.updatedAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          {isDeleted(currentSelection.data) && (
                            <Typography variant="body2" color="error">
                              <strong>Supprimé le :</strong> {new Date(currentSelection.data.deletedAt!).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Paper>

                        <Button
                          variant="contained"
                          disabled={isDeleted(currentSelection.data)}
                          onClick={() => selectedSite && router.push(`/dashboard/sites/${selectedSite.id}/etages?edit=${(currentSelection.data as BuildingFloor | PartFloor).id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                            '&:hover': {
                              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                            },
                          }}
                        >
                          Modifier cet étage
                        </Button>
                      </Box>
                    )}

                    {/* Part Details */}
                    {currentSelection.type === 'part' && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewModuleIcon />
                          Partie Sélectionnée
                          {isDeleted(currentSelection.data) && (
                            <Chip label="Supprimé" color="warning" size="small" />
                          )}
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Informations de la Partie
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Nom :</strong> {(currentSelection.data as Part).name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Type :</strong> {(currentSelection.data as Part).type === "PRIVATE" ? "Privée" : "Commune"}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>ICPE :</strong> {(currentSelection.data as Part).isIcpe ? "Oui" : "Non"}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Bâtiment :</strong> {(currentSelection.data as Part).building?.name || "Non défini"}
                          </Typography>

                          {(currentSelection.data as Part).habFamily && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Famille d&apos;habitation :</strong> {(currentSelection.data as Part).habFamily!.description}
                            </Typography>
                          )}

                          {(currentSelection.data as Part).erpTypes && (currentSelection.data as Part).erpTypes!.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Types ERP :</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(currentSelection.data as Part).erpTypes!.map((erpType, index) => (
                                  <Chip
                                    key={index}
                                    label={`${erpType.code} - ${erpType.description}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {(currentSelection.data as Part).partFloors && (currentSelection.data as Part).partFloors!.length > 0 && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Nombre d&apos;étages :</strong> {(currentSelection.data as Part).partFloors!.length}
                            </Typography>
                          )}

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Créé le :</strong> {new Date(currentSelection.data.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Modifié le :</strong> {new Date(currentSelection.data.updatedAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          {isDeleted(currentSelection.data) && (
                            <Typography variant="body2" color="error">
                              <strong>Supprimé le :</strong> {new Date(currentSelection.data.deletedAt!).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Paper>

                        <Button
                          variant="contained"
                          disabled={isDeleted(currentSelection.data)}
                          onClick={() => selectedSite && router.push(`/dashboard/sites/${selectedSite.id}/parties?edit=${(currentSelection.data as Part).id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                            '&:hover': {
                              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                            },
                          }}
                        >
                          Modifier cette partie
                        </Button>
                      </Box>
                    )}

                    {/* Building Details */}
                    {currentSelection.type === 'building' && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BuildingIcon />
                          Bâtiment Sélectionné
                          {isDeleted(currentSelection.data) && (
                            <Chip label="Supprimé" color="warning" size="small" />
                          )}
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Informations du Bâtiment
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Nom :</strong> {(currentSelection.data as Building).name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Site :</strong> {(currentSelection.data as Building).site?.name || "Non défini"}
                          </Typography>

                          {(currentSelection.data as Building).typologies && (currentSelection.data as Building).typologies.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Typologies :</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(currentSelection.data as Building).typologies.map((typo, index) => (
                                  <Chip
                                    key={index}
                                    label={`${typo.code} - ${typo.description}`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {(currentSelection.data as Building).ighClasses && (currentSelection.data as Building).ighClasses.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Classes IGH :</strong>
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(currentSelection.data as Building).ighClasses.map((ighClass, index) => (
                                  <Chip
                                    key={index}
                                    label={`${ighClass.code} - ${ighClass.description}`}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                          {(currentSelection.data as Building).erpCategory && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Catégorie ERP :</strong> {(currentSelection.data as Building).erpCategory!.category} - {(currentSelection.data as Building).erpCategory!.description} ({(currentSelection.data as Building).erpCategory!.group})
                            </Typography>
                          )}

                          {(currentSelection.data as Building).users && (currentSelection.data as Building).users!.length > 0 && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Utilisateurs autorisés :</strong> {(currentSelection.data as Building).users!.length}
                            </Typography>
                          )}

                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Créé le :</strong> {new Date(currentSelection.data.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Modifié le :</strong> {new Date(currentSelection.data.updatedAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          {isDeleted(currentSelection.data) && (
                            <Typography variant="body2" color="error">
                              <strong>Supprimé le :</strong> {new Date(currentSelection.data.deletedAt!).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Paper>

                        <Button
                          variant="contained"
                          disabled={isDeleted(currentSelection.data)}
                          onClick={() => selectedSite && router.push(`/dashboard/sites/${selectedSite.id}/batiments?edit=${(currentSelection.data as Building).id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                            '&:hover': {
                              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                            },
                          }}
                        >
                          Modifier ce bâtiment
                        </Button>
                      </Box>
                    )}

                    {/* Site Details */}
                    {currentSelection.type === 'site' && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon />
                          Site Sélectionné
                          {isDeleted(currentSelection.data) && (
                            <Chip label="Supprimé" color="warning" size="small" />
                          )}
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Informations du Site
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Nom :</strong> {(currentSelection.data as Site).name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Adresse :</strong> {(currentSelection.data as Site).streetNumber} {(currentSelection.data as Site).street}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Ville :</strong> {(currentSelection.data as Site).postalCode} {(currentSelection.data as Site).city}
                          </Typography>
                          {(currentSelection.data as Site).reference && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              <strong>Référence :</strong> {(currentSelection.data as Site).reference}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Entreprise :</strong> {(currentSelection.data as Site).company?.name || "Non définie"}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Créé le :</strong> {new Date(currentSelection.data.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Modifié le :</strong> {new Date(currentSelection.data.updatedAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          {isDeleted(currentSelection.data) && (
                            <Typography variant="body2" color="error">
                              <strong>Supprimé le :</strong> {new Date(currentSelection.data.deletedAt!).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Paper>

                        <Button
                          variant="contained"
                          disabled={isDeleted(currentSelection.data)}
                          onClick={() => router.push(`/dashboard/sites/${currentSelection.data.id}`)}
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

                    {/* Company Details */}
                    {currentSelection.type === 'company' && (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon />
                          Entreprise Sélectionnée
                          {isDeleted(currentSelection.data) && (
                            <Chip label="Supprimé" color="warning" size="small" />
                          )}
                        </Typography>

                        <Paper sx={{ p: 2, mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            Informations de l&apos;Entreprise
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Nom :</strong> {(currentSelection.data as Company).name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>SIRET :</strong> {(currentSelection.data as Company).siretNumber}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Créé le :</strong> {new Date(currentSelection.data.createdAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            <strong>Modifié le :</strong> {new Date(currentSelection.data.updatedAt).toLocaleDateString('fr-FR')}
                          </Typography>
                          {isDeleted(currentSelection.data) && (
                            <Typography variant="body2" color="error">
                              <strong>Supprimé le :</strong> {new Date(currentSelection.data.deletedAt!).toLocaleDateString('fr-FR')}
                            </Typography>
                          )}
                        </Paper>

                        <Button
                          variant="contained"
                          disabled={isDeleted(currentSelection.data)}
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