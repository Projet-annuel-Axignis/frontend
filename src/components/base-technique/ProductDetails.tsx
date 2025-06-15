'use client';

import theme from '@/theme/theme';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Breadcrumbs, Button, Card, CardContent, CssBaseline, Grid, Link, Paper, Tab, Tabs, ThemeProvider, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ProductDetails({ id }: { id: string }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="inherit"
            href="/"
            aria-label="Home"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeRoundedIcon />
          </Link>
          <Link
            underline="none"
            color="inherit"
            href="/base-technique"
            aria-label="Home"
          >
            <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
              Produits
            </Typography>
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            {id}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h2" component="h1">
          {id} JOD-1 - LBXJOD110017 - Déclencheur Manuel Incendie Rouge NF
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, m: -2, overflowX: 'hidden', my: 2, borderRadius: '8px' }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="product details tabs"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTabs-flexContainer': {
                justifyContent: 'flex-start',
              },
            }}
          >
            <Tab label="Informations" {...a11yProps(0)} />
            <Tab label="Documents" {...a11yProps(1)} />
            <Tab label="Inventaire" {...a11yProps(2)} />
            <Tab label="Compatibilités" {...a11yProps(3)} />
          </Tabs>

          <CustomTabPanel value={value} index={0}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%'
              }}
            >
              <Paper variant="outlined">
                <CardContent>
                  <Typography variant="h4" component='h1' sx={{ mb: 2 }}>Informations générales</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    {/* Ligne 1 */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Référence</Typography>
                      <Typography variant="body1">JOD-1</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Modèle</Typography>
                      <Typography variant="body1">LBXJOD110017</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Marque</Typography>
                      <Typography variant="body1">Legrand</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Type</Typography>
                      <Typography variant="body1">Déclencheur</Typography>
                    </Box>

                    {/* Ligne 2 */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Gamme</Typography>
                      <Typography variant="body1">Sécurité</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Certification</Typography>
                      <Typography variant="body1">NF</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Couleur</Typography>
                      <Typography variant="body1">Rouge</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Statut</Typography>
                      <Typography variant="body1">Actif</Typography>
                    </Box>

                    {/* Ligne 3 */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Date de création</Typography>
                      <Typography variant="body1">15/01/2023</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Dernière modification</Typography>
                      <Typography variant="body1">20/03/2023</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Prix unitaire</Typography>
                      <Typography variant="body1">45,99 €</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Stock</Typography>
                      <Typography variant="body1">128 unités</Typography>
                    </Box>

                    {/* Ligne 4 */}
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Poids</Typography>
                      <Typography variant="body1">125g</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Dimensions</Typography>
                      <Typography variant="body1">90 x 90 x 45 mm</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Garantie</Typography>
                      <Typography variant="body1">2 ans</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">Code EAN</Typography>
                      <Typography variant="body1">3245060298715</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Paper>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%'
              }}
            >
              <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component='h1'>Documents</Typography>
                    <Typography variant="body2" sx={{ ml: 1 }}>(3)</Typography>
                  </Box>

                  {/* Liste des documents */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                    <Paper variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                          <Image
                            src="/images/base-technique/pdf.png"
                            alt="PDF"
                            width={48}
                            height={48}
                            style={{ width: 48, height: 48 }}
                            onError={(e) => {
                              // Fallback si l'image ne charge pas
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="red" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>';
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" textAlign="center">
                          Notice d&apos;utilisation
                        </Typography>
                        <Typography variant="caption" textAlign="center">PDF - 2.4 MB</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          <Link variant="body2" download>Télécharger</Link>
                        </Box>
                      </CardContent>
                    </Paper>

                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                          <Image
                            src="/images/base-technique/pdf.png"
                            alt="PDF"
                            width={48}
                            height={48}
                            style={{ width: 48, height: 48 }}
                            onError={(e) => {
                              // Fallback si l'image ne charge pas
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="red" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>';
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" textAlign="center">
                          Fiche technique
                        </Typography>
                        <Typography variant="caption" textAlign="center">PDF - 1.2 MB</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          <Link variant="body2" download>Télécharger</Link>
                        </Box>
                      </CardContent>
                    </Card>

                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                          <Image
                            src="/images/base-technique/pdf.png"
                            alt="PDF"
                            width={48}
                            height={48}
                            style={{ width: 48, height: 48 }}
                            onError={(e) => {
                              // Fallback si l'image ne charge pas
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="red" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>';
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight="bold" textAlign="center">
                          Plan CAD
                        </Typography>
                        <Typography variant="caption" textAlign="center">DWG - 3.7 MB</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          <Link variant="body2" download>Télécharger</Link>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Zone d'upload */}
                  <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant="body2">
                      Déposez des fichiers ici ou cliquez pour télécharger
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                      Formats acceptés: PDF, DOC, DOCX, DWG, JPG, PNG (max 10 MB)
                    </Typography>
                  </Box>
                </CardContent>
              </Paper>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%'
              }}
            >
              <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
                <CardContent>
                  <Typography variant="h4" component='h1' sx={{ mb: 2 }}>Détails d&apos;inventaire</Typography>

                  {/* Informations de stock */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5">Résumé du stock</Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid
                        size={{ xs: 12, sm: 6, md: 3 }}
                      >
                        <Paper variant="outlined">
                          <CardContent>
                            <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                              Stock total
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                              128
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'success.main' }}>
                              En stock
                            </Typography>
                          </CardContent>
                        </Paper>
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 6, md: 3 }}
                      >
                        <Paper variant="outlined">
                          <CardContent>
                            <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                              Réservé
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                              15
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'warning.main' }}>
                              Pour commandes
                            </Typography>
                          </CardContent>
                        </Paper>
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 6, md: 3 }}
                      >
                        <Paper variant="outlined">
                          <CardContent>
                            <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                              Seuil minimal
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                              20
                            </Typography>
                            <Typography variant="body2">
                              Pour réapprovisionnement
                            </Typography>
                          </CardContent>
                        </Paper>
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 6, md: 3 }}
                      >
                        <Paper variant="outlined">
                          <CardContent>
                            <Typography variant="caption" sx={{ mb: 1, color: 'text.secondary' }}>
                              Valeur du stock
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                              5 886,72 €
                            </Typography>
                            <Typography variant="body2">
                              Au prix unitaire actuel
                            </Typography>
                          </CardContent>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Historique des mouvements */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5">Historique des mouvements</Typography>
                      <Link variant="body2" href="#">Voir tout l&apos;historique</Link>
                    </Box>
                    <Paper variant="outlined">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--mui-palette-divider)' }}>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Date</Typography>
                            </th>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Type</Typography>
                            </th>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Quantité</Typography>
                            </th>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Document</Typography>
                            </th>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Opérateur</Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">25/04/2025</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2" sx={{ color: 'success.main' }}>Entrée</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">+50</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">BL-2025-0421</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Jean Dupont</Typography>
                            </td>
                          </tr>
                          <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">18/04/2025</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2" sx={{ color: 'error.main' }}>Sortie</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">-12</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">CMD-2025-0365</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Marie Martin</Typography>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">05/04/2025</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2" sx={{ color: 'success.main' }}>Entrée</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">+30</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">BL-2025-0387</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Jean Dupont</Typography>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Paper>
                  </Box>
                </CardContent>
              </Paper>
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%'
              }}
            >
              <Paper variant="outlined" sx={{ width: '100%', height: '100%' }}>
                <CardContent>
                  <Typography variant="h4" component='h1' sx={{ mb: 2 }}>Compatibilités</Typography>

                  {/* Produits compatibles */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h5">Produits compatibles</Typography>
                      <Typography variant="body2">12 produits associés</Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                      <Paper variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ width: 70, height: 70, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                              <Image
                                src="/images/base-technique/cables.png"
                                alt="Produit"
                                width={63}
                                height={63}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                              />                                                        </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight="bold">Clé de réarmement DMI</Typography>
                              <Typography variant="caption" sx={{ mb: 1 }}>Réf: CRM-01</Typography>
                              <Typography variant="caption" sx={{ color: 'success.main' }}>En stock</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Paper>

                      <Paper variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ width: 70, height: 70, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                              <Image
                                src="/images/base-technique/cables.png"
                                alt="Produit"
                                width={63}
                                height={63}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                              />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight="bold">Volet de protection</Typography>
                              <Typography variant="caption" sx={{ mb: 1 }}>Réf: VPT-102</Typography>
                              <Typography variant="caption" sx={{ color: 'success.main' }}>En stock</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Paper>

                      <Paper variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ width: 70, height: 70, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                              <Image
                                src="/images/base-technique/cables.png"
                                alt="Produit"
                                width={63}
                                height={63}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                              />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight="bold">Centrale incendie 4 zones</Typography>
                              <Typography variant="caption" sx={{ mb: 1 }}>Réf: CI4Z-450</Typography>
                              <Typography variant="caption" sx={{ color: 'warning.main' }}>Stock faible</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Paper>

                      <Paper variant="outlined">
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ width: 70, height: 70, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
                              <Image
                                src="/images/base-technique/cables.png"
                                alt="Produit"
                                width={63}
                                height={63}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                              />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" fontWeight="bold">Câble résistant au feu</Typography>
                              <Typography variant="caption" sx={{ mb: 1 }}>Réf: CR2-100</Typography>
                              <Typography variant="caption" sx={{ color: 'success.main' }}>En stock</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Paper>
                    </Box>
                    {/* Bouton pour voir plus */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button variant="outlined" size="small">
                        Voir tous les produits compatibles
                      </Button>
                    </Box>
                  </Box>

                  {/* Normes et standards */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Normes et standards</Typography>
                    <Grid container spacing={2}>
                      <Grid
                        size={{ xs: 12, sm: 6 }}
                      >
                        <Paper variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: 'primary.light',
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '50%'
                                }}
                              >
                                <VerifiedIcon />
                              </Box>
                              <Box>
                                <Typography variant="subtitle1">NF 61-936</Typography>
                                <Typography variant="caption">
                                  Norme française pour les systèmes de sécurité incendie.
                                  Ce produit est certifié conforme aux exigences de cette norme.
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Paper>
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 6 }}
                      >
                        <Paper variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: 'primary.light',
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '50%'
                                }}
                              >
                                <VerifiedIcon />
                              </Box>
                              <Box>
                                <Typography variant="subtitle1">EN 54-11</Typography>
                                <Typography variant="caption">
                                  Norme européenne pour les déclencheurs manuels d&apos;alarme incendie.
                                  Ce produit est conforme aux standards européens.
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Systèmes compatibles */}
                  <Box>
                    <Typography variant="h5" sx={{ mb: 2 }}>Systèmes compatibles</Typography>
                    <Paper variant="outlined">
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--mui-palette-divider)' }}>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Type de système</Typography>
                            </th>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Compatibilité</Typography>
                            </th>
                            <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                              <Typography variant="caption">Notes</Typography>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Centrales conventionnelles</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 18 }} />
                                <Typography variant="body2">Totale</Typography>
                              </Box>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Compatible avec toutes les centrales conventionnelles du marché</Typography>
                            </td>
                          </tr>
                          <tr style={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Centrales adressables</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ color: 'warning.main', mr: 1, fontSize: 18 }} />
                                <Typography variant="body2">Partielle</Typography>
                              </Box>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Nécessite un module d&apos;interface spécifique (IF-200)</Typography>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Systèmes sans fil</Typography>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CancelIcon sx={{ color: 'error.main', mr: 1, fontSize: 18 }} />
                                <Typography variant="body2">Non compatible</Typography>
                              </Box>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Typography variant="body2">Produit filaire uniquement</Typography>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Paper>
                  </Box>
                </CardContent>
              </Paper>
            </Box>
          </CustomTabPanel>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
