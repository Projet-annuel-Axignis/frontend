'use client';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
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
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {id} JOD-1 - LBXJOD110017
          </Typography>
          <Chip
            label="Actif"
            color="success"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 400 }}>
          Déclencheur Manuel Incendie Rouge NF
        </Typography>
      </Box>

      {/* Tabs Container */}
      <Paper
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[3],
        }}
        elevation={0}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="product details tabs"
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
          <Tab label="Informations" {...a11yProps(0)} />
          <Tab label="Documents" {...a11yProps(1)} />
          <Tab label="Inventaire" {...a11yProps(2)} />
          <Tab label="Compatibilités" {...a11yProps(3)} />
        </Tabs>

        {/* Tab Panel 1: Informations */}
        <CustomTabPanel value={value} index={0}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: 'var(--color-axignis-dark)',
                }}
              >
                Informations générales
              </Typography>
              <Grid container spacing={3}>
                {[
                  { label: 'Référence', value: 'JOD-1' },
                  { label: 'Modèle', value: 'LBXJOD110017' },
                  { label: 'Marque', value: 'Legrand' },
                  { label: 'Type', value: 'Déclencheur' },
                  { label: 'Gamme', value: 'Sécurité' },
                  { label: 'Certification', value: 'NF' },
                  { label: 'Couleur', value: 'Rouge' },
                  { label: 'Statut', value: 'Actif' },
                  { label: 'Date de création', value: '15/01/2023' },
                  { label: 'Dernière modification', value: '20/03/2023' },
                  { label: 'Prix unitaire', value: '45,99 €' },
                  { label: 'Stock', value: '128 unités' },
                  { label: 'Poids', value: '125g' },
                  { label: 'Dimensions', value: '90 x 90 x 45 mm' },
                  { label: 'Garantie', value: '2 ans' },
                  { label: 'Code EAN', value: '3245060298715' },
                ].map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: theme.palette.action.hover,
                        transition: 'var(--transition-normal)',
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: 'var(--color-axignis-primary)',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          mt: 0.5,
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </CustomTabPanel>

        {/* Tab Panel 2: Documents */}
        <CustomTabPanel value={value} index={1}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'var(--color-axignis-dark)',
                  }}
                >
                  Documents
                </Typography>
                <Chip
                  label="3"
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  { name: 'Notice d\'utilisation', type: 'PDF', size: '2.4 MB' },
                  { name: 'Fiche technique', type: 'PDF', size: '1.2 MB' },
                  { name: 'Plan CAD', type: 'DWG', size: '3.7 MB' },
                ].map((doc, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card
                      variant="outlined"
                      sx={{
                        transition: 'var(--transition-normal)',
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>
                          <Image
                            src="/images/base-technique/pdf.png"
                            alt={doc.type}
                            width={48}
                            height={48}
                            style={{ width: 48, height: 48 }}
                          />
                        </Box>
                        <Typography variant="body1" fontWeight="600" sx={{ mb: 1 }}>
                          {doc.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                          {doc.type} - {doc.size}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<DownloadIcon />}
                          sx={{
                            background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                            '&:hover': {
                              background: `linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))`,
                            },
                          }}
                        >
                          Télécharger
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Zone d'upload */}
              <Paper
                variant="outlined"
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  borderColor: 'var(--color-axignis-primary)',
                  backgroundColor: theme.palette.action.hover,
                  transition: 'var(--transition-normal)',
                  '&:hover': {
                    backgroundColor: theme.palette.action.selected,
                    borderColor: 'var(--color-axignis-secondary)',
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, color: 'var(--color-axignis-primary)' }}>
                  Déposez des fichiers ici ou cliquez pour télécharger
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Formats acceptés: PDF, DOC, DOCX, DWG, JPG, PNG (max 10 MB)
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </CustomTabPanel>

        {/* Tab Panel 3: Inventaire */}
        <CustomTabPanel value={value} index={2}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <InventoryIcon sx={{ mr: 2, color: 'var(--color-axignis-primary)' }} />
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: 'var(--color-axignis-dark)',
                  }}
                >
                  Détails d&apos;inventaire
                </Typography>
              </Box>

              {/* Résumé du stock */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Résumé du stock
                </Typography>
                <Grid container spacing={3}>
                  {[
                    { title: 'Stock total', value: '128', subtitle: 'En stock', color: 'success' },
                    { title: 'Réservé', value: '15', subtitle: 'Pour commandes', color: 'warning' },
                    { title: 'Seuil minimal', value: '20', subtitle: 'Pour réapprovisionnement', color: 'info' },
                    { title: 'Valeur du stock', value: '5 886,72 €', subtitle: 'Au prix unitaire actuel', color: 'primary' },
                  ].map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                      <Card
                        variant="outlined"
                        sx={{
                          textAlign: 'center',
                          transition: 'var(--transition-normal)',
                          '&:hover': {
                            boxShadow: theme.shadows[3],
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                            {item.title}
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: `${item.color}.main`,
                              mb: 1,
                            }}
                          >
                            {item.value}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {item.subtitle}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Historique des mouvements */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Historique des mouvements
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: 'var(--color-axignis-primary)',
                      color: 'var(--color-axignis-primary)',
                      '&:hover': {
                        borderColor: 'var(--color-axignis-secondary)',
                        backgroundColor: 'var(--color-axignis-primary)',
                        color: 'white',
                      },
                    }}
                  >
                    Voir tout l&apos;historique
                  </Button>
                </Box>
                <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                  {/* Table content remains the same but with improved styling */}
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: theme.palette.action.hover }}>
                          {['Date', 'Type', 'Quantité', 'Document', 'Opérateur'].map((header) => (
                            <th key={header} style={{ textAlign: 'left', padding: '16px' }}>
                              <Typography variant="subtitle2" fontWeight="600">
                                {header}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: '25/04/2025', type: 'Entrée', quantity: '+50', doc: 'BL-2025-0421', operator: 'Jean Dupont', typeColor: 'success' },
                          { date: '18/04/2025', type: 'Sortie', quantity: '-12', doc: 'CMD-2025-0365', operator: 'Marie Martin', typeColor: 'error' },
                          { date: '05/04/2025', type: 'Entrée', quantity: '+30', doc: 'BL-2025-0387', operator: 'Jean Dupont', typeColor: 'success' },
                        ].map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              backgroundColor: index % 2 === 1 ? theme.palette.action.hover : 'transparent',
                            }}
                          >
                            <td style={{ padding: '16px' }}>
                              <Typography variant="body2">{row.date}</Typography>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Chip
                                label={row.type}
                                size="small"
                                color={row.typeColor as any}
                                variant="outlined"
                              />
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Typography variant="body2" fontWeight="600">{row.quantity}</Typography>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Typography variant="body2">{row.doc}</Typography>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Typography variant="body2">{row.operator}</Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </CustomTabPanel>

        {/* Tab Panel 4: Compatibilités */}
        <CustomTabPanel value={value} index={3}>
          <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: 'var(--color-axignis-dark)',
                }}
              >
                Compatibilités
              </Typography>

              {/* Produits compatibles */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Produits compatibles
                  </Typography>
                  <Chip label="12 produits associés" color="primary" variant="outlined" />
                </Box>
                <Grid container spacing={2}>
                  {[
                    { name: 'Clé de réarmement DMI', ref: 'CRM-01', status: 'En stock', statusColor: 'success' },
                    { name: 'Volet de protection', ref: 'VPT-102', status: 'En stock', statusColor: 'success' },
                    { name: 'Centrale incendie 4 zones', ref: 'CI4Z-450', status: 'Stock faible', statusColor: 'warning' },
                    { name: 'Câble résistant au feu', ref: 'CR2-100', status: 'En stock', statusColor: 'success' },
                  ].map((product, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 6 }} key={index}>
                      <Card
                        variant="outlined"
                        sx={{
                          transition: 'var(--transition-normal)',
                          '&:hover': {
                            boxShadow: theme.shadows[3],
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                bgcolor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                flexShrink: 0,
                              }}
                            >
                              <Image
                                src="/images/base-technique/cables.png"
                                alt="Produit"
                                width={50}
                                height={50}
                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                              />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                                Réf: {product.ref}
                              </Typography>
                              <Chip
                                label={product.status}
                                size="small"
                                color={product.statusColor as any}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: 'var(--color-axignis-primary)',
                      color: 'var(--color-axignis-primary)',
                      '&:hover': {
                        borderColor: 'var(--color-axignis-secondary)',
                        backgroundColor: 'var(--color-axignis-primary)',
                        color: 'white',
                      },
                    }}
                  >
                    Voir tous les produits compatibles
                  </Button>
                </Box>
              </Box>

              {/* Normes et standards */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Normes et standards
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { norm: 'NF 61-936', description: 'Norme française pour les systèmes de sécurité incendie. Ce produit est certifié conforme aux exigences de cette norme.' },
                    { norm: 'EN 54-11', description: 'Norme européenne pour les déclencheurs manuels d\'alarme incendie. Ce produit est conforme aux standards européens.' },
                  ].map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'var(--color-axignis-primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                flexShrink: 0,
                              }}
                            >
                              <VerifiedIcon />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 1 }}>
                                {item.norm}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {item.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Systèmes compatibles */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Systèmes compatibles
                </Typography>
                <Paper variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: theme.palette.action.hover }}>
                          {['Type de système', 'Compatibilité', 'Notes'].map((header) => (
                            <th key={header} style={{ textAlign: 'left', padding: '16px' }}>
                              <Typography variant="subtitle2" fontWeight="600">
                                {header}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            system: 'Centrales conventionnelles',
                            compatibility: 'Totale',
                            icon: CheckCircleIcon,
                            color: 'success',
                            notes: 'Compatible avec toutes les centrales conventionnelles du marché'
                          },
                          {
                            system: 'Centrales adressables',
                            compatibility: 'Partielle',
                            icon: InfoIcon,
                            color: 'warning',
                            notes: 'Nécessite un module d\'interface spécifique (IF-200)'
                          },
                          {
                            system: 'Systèmes sans fil',
                            compatibility: 'Non compatible',
                            icon: CancelIcon,
                            color: 'error',
                            notes: 'Produit filaire uniquement'
                          },
                        ].map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              backgroundColor: index % 2 === 1 ? theme.palette.action.hover : 'transparent',
                            }}
                          >
                            <td style={{ padding: '16px' }}>
                              <Typography variant="body2" fontWeight="500">{row.system}</Typography>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <row.icon sx={{ color: `${row.color}.main`, mr: 1, fontSize: 18 }} />
                                <Typography variant="body2">{row.compatibility}</Typography>
                              </Box>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <Typography variant="body2" color="textSecondary">{row.notes}</Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </CustomTabPanel>
      </Paper>
    </>
  );
}
