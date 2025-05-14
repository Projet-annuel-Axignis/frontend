'use client';

import { Box, Breadcrumbs, Card, CardContent, Grid, Link, Tab, tabClasses, TabList, TabPanel, Tabs, Typography, Button } from '@mui/joy';
import React from 'react';
import Image from 'next/image';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ProductDetails({ id }: { id: string }) {
    const [index, setIndex] = React.useState(0);

  return (
    <>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon />}
            sx={{ pl: 0 }}
            >
                <Link
                    underline="none"
                    color="neutral"
                    href="/"
                    aria-label="Home"
                >
                    <HomeRoundedIcon />
                </Link>
                <Link
                    underline="none"
                    color="neutral"
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
            <Typography level="h2" component="h1">
                {id} JOD-1 - LBXJOD110017 - Déclencheur Manuel Incendie Rouge NF
            </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, m: -2, overflowX: 'hidden', my: 2, borderRadius: '8px' }}>
            <Tabs
                aria-label="Pipeline"
                value={index}
                onChange={(event, value) => setIndex(value as number)}
            >
                <TabList
                sx={{
                    pt: 1,
                    justifyContent: 'flex-start',
                    [`&& .${tabClasses.root}`]: {
                    flex: 'initial',
                    bgcolor: 'transparent',
                    '&:hover': {
                        bgcolor: 'transparent',
                    },
                    [`&.${tabClasses.selected}`]: {
                        color: 'primary.plainColor',
                        '&::after': {
                        height: 2,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                        bgcolor: 'primary.500',
                        },
                    },
                    },
                    borderRadius: '0px 0px 0px 0px',
                }}
                >
                <Tab indicatorInset>
                    Informations
                </Tab>
                <Tab indicatorInset>
                    Documents
                </Tab>
                <Tab indicatorInset>
                    Inventaire
                </Tab>
                <Tab indicatorInset>
                    Compatibilités
                </Tab>
                </TabList>
                <Box
                sx={(theme) => ({
                    '--bg': theme.vars.palette.background.surface,
                    background: 'var(--bg)',
                    boxShadow: '0 0 0 100vmax var(--bg)',
                    clipPath: 'inset(0 -100vmax)',
                })}
                >
                <TabPanel value={0}>
                <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    height: '100%'
                }}
                >
                    <Card variant="soft">
                        <CardContent>
                            <Typography level="h4" component='h1' sx={{ mb: 2 }}>Informations générales</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                                {/* Ligne 1 */}
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Référence</Typography>
                                    <Typography level="body-md">JOD-1</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Modèle</Typography>
                                    <Typography level="body-md">LBXJOD110017</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Marque</Typography>
                                    <Typography level="body-md">Legrand</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Type</Typography>
                                    <Typography level="body-md">Déclencheur</Typography>
                                </Box>

                                {/* Ligne 2 */}
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Gamme</Typography>
                                    <Typography level="body-md">Sécurité</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Certification</Typography>
                                    <Typography level="body-md">NF</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Couleur</Typography>
                                    <Typography level="body-md">Rouge</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Statut</Typography>
                                    <Typography level="body-md">Actif</Typography>
                                </Box>

                                {/* Ligne 3 */}
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Date de création</Typography>
                                    <Typography level="body-md">15/01/2023</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Dernière modification</Typography>
                                    <Typography level="body-md">20/03/2023</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Prix unitaire</Typography>
                                    <Typography level="body-md">45,99 €</Typography>
                                </Box>
                                <Box>
                                    <Typography level="body-sm" fontWeight="bold">Stock</Typography>
                                    <Typography level="body-md">128 unités</Typography>
                                </Box>

                                    {/* Ligne 4 */}
                                    <Box>
                                        <Typography level="body-sm" fontWeight="bold">Poids</Typography>
                                        <Typography level="body-md">125g</Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-sm" fontWeight="bold">Dimensions</Typography>
                                        <Typography level="body-md">90 x 90 x 45 mm</Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-sm" fontWeight="bold">Garantie</Typography>
                                        <Typography level="body-md">2 ans</Typography>
                                    </Box>
                                    <Box>
                                        <Typography level="body-sm" fontWeight="bold">Code EAN</Typography>
                                        <Typography level="body-md">3245060298715</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    </TabPanel>
                    <TabPanel value={1}>
                        <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            height: '100%'
                        }}
                        >
                            <Card variant="soft" sx={{ width: '100%', height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography level="h4" component='h1'>Documents</Typography>
                                        <Typography level="body-sm" sx={{ ml: 1 }}>(3)</Typography>
                                    </Box>

                                    {/* Liste des documents */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                                        <Card variant="outlined">
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                                                    <Image
                                                        src="/pdf-icon.png"
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
                                                <Typography level="body-sm" fontWeight="bold" textAlign="center">
                                                    Notice d&apos;utilisation
                                                </Typography>
                                                <Typography level="body-xs" textAlign="center">PDF - 2.4 MB</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                                    <Link level="body-sm" download>Télécharger</Link>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        <Card variant="outlined">
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                                                    <Image
                                                        src="/pdf-icon.png"
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
                                                <Typography level="body-sm" fontWeight="bold" textAlign="center">
                                                    Fiche technique
                                                </Typography>
                                                <Typography level="body-xs" textAlign="center">PDF - 1.2 MB</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                                    <Link level="body-sm" download>Télécharger</Link>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        <Card variant="outlined">
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                                                    <Image
                                                        src="/pdf-icon.png"
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
                                                <Typography level="body-sm" fontWeight="bold" textAlign="center">
                                                    Plan CAD
                                                </Typography>
                                                <Typography level="body-xs" textAlign="center">DWG - 3.7 MB</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                                    <Link level="body-sm" download>Télécharger</Link>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Box>

                                    {/* Zone d'upload */}
                                    <Box sx={{ mt: 3, p: 2, border: '1px dashed', borderColor: 'neutral.outlinedBorder', borderRadius: 'sm', textAlign: 'center' }}>
                                        <Typography level="body-sm">
                                            Déposez des fichiers ici ou cliquez pour télécharger
                                        </Typography>
                                        <Typography level="body-xs" sx={{ mt: 1, color: 'neutral.500' }}>
                                            Formats acceptés: PDF, DOC, DOCX, DWG, JPG, PNG (max 10 MB)
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </TabPanel>
                    <TabPanel value={2}>
                        <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            height: '100%'
                        }}
                        >
                            <Card variant="soft" sx={{ width: '100%', height: '100%' }}>
                                <CardContent>
                                    <Typography level="h4" component='h1' sx={{ mb: 2 }}>Détails d&apos;inventaire</Typography>

                                    {/* Informations de stock */}
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Typography level="title-md">Résumé du stock</Typography>
                                        </Box>
                                        <Grid container spacing={2}>
                                            <Grid xs={12} sm={6} md={3}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography level="body-xs" sx={{ mb: 1, color: 'neutral.500' }}>
                                                            Stock total
                                                        </Typography>
                                                        <Typography level="h3" fontWeight="lg">
                                                            128
                                                        </Typography>
                                                        <Typography level="body-sm" sx={{ color: 'success.600' }}>
                                                            En stock
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid xs={12} sm={6} md={3}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography level="body-xs" sx={{ mb: 1, color: 'neutral.500' }}>
                                                            Réservé
                                                        </Typography>
                                                        <Typography level="h3" fontWeight="lg">
                                                            15
                                                        </Typography>
                                                        <Typography level="body-sm" sx={{ color: 'warning.600' }}>
                                                            Pour commandes
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid xs={12} sm={6} md={3}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography level="body-xs" sx={{ mb: 1, color: 'neutral.500' }}>
                                                            Seuil minimal
                                                        </Typography>
                                                        <Typography level="h3" fontWeight="lg">
                                                            20
                                                        </Typography>
                                                        <Typography level="body-sm">
                                                            Pour réapprovisionnement
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid xs={12} sm={6} md={3}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography level="body-xs" sx={{ mb: 1, color: 'neutral.500' }}>
                                                            Valeur du stock
                                                        </Typography>
                                                        <Typography level="h3" fontWeight="lg">
                                                            5 886,72 €
                                                        </Typography>
                                                        <Typography level="body-sm">
                                                            Au prix unitaire actuel
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Historique des mouvements */}
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography level="title-md">Historique des mouvements</Typography>
                                            <Link level="body-sm" href="#">Voir tout l&apos;historique</Link>
                                        </Box>
                                        <Card variant="outlined">
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid var(--joy-palette-divider)' }}>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Date</Typography>
                                                        </th>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Type</Typography>
                                                        </th>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Quantité</Typography>
                                                        </th>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Document</Typography>
                                                        </th>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Opérateur</Typography>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">25/04/2025</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm" sx={{ color: 'success.600' }}>Entrée</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">+50</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">BL-2025-0421</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Jean Dupont</Typography>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: 'var(--joy-palette-background-level1)' }}>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">18/04/2025</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm" sx={{ color: 'danger.600' }}>Sortie</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">-12</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">CMD-2025-0365</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Marie Martin</Typography>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">05/04/2025</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm" sx={{ color: 'success.600' }}>Entrée</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">+30</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">BL-2025-0387</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Jean Dupont</Typography>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Card>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </TabPanel>
                    <TabPanel value={3}>
                        <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            height: '100%'
                        }}
                        >
                            <Card variant="soft" sx={{ width: '100%', height: '100%' }}>
                                <CardContent>
                                    <Typography level="h4" component='h1' sx={{ mb: 2 }}>Compatibilités</Typography>

                                    {/* Produits compatibles */}
                                    <Box sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography level="title-md">Produits compatibles</Typography>
                                            <Typography level="body-sm">12 produits associés</Typography>
                                        </Box>
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box sx={{ width: 70, height: 70, bgcolor: 'neutral.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'sm', overflow: 'hidden', flexShrink: 0 }}>
                                                            <Image
                                                                src="/images/base-technique/cables.png"
                                                                alt="Produit"
                                                                width={63}
                                                                height={63}
                                                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                                            />                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography level="body-sm" fontWeight="bold">Clé de réarmement DMI</Typography>
                                                            <Typography level="body-xs" sx={{ mb: 1 }}>Réf: CRM-01</Typography>
                                                            <Typography level="body-xs" sx={{ color: 'success.600' }}>En stock</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>

                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box sx={{ width: 70, height: 70, bgcolor: 'neutral.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'sm', overflow: 'hidden', flexShrink: 0 }}>
                                                            <Image
                                                                src="/images/base-technique/cables.png"
                                                                alt="Produit"
                                                                width={63}
                                                                height={63}
                                                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography level="body-sm" fontWeight="bold">Volet de protection</Typography>
                                                            <Typography level="body-xs" sx={{ mb: 1 }}>Réf: VPT-102</Typography>
                                                            <Typography level="body-xs" sx={{ color: 'success.600' }}>En stock</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>

                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box sx={{ width: 70, height: 70, bgcolor: 'neutral.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'sm', overflow: 'hidden', flexShrink: 0 }}>
                                                            <Image
                                                                src="/images/base-technique/cables.png"
                                                                alt="Produit"
                                                                width={63}
                                                                height={63}
                                                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography level="body-sm" fontWeight="bold">Centrale incendie 4 zones</Typography>
                                                            <Typography level="body-xs" sx={{ mb: 1 }}>Réf: CI4Z-450</Typography>
                                                            <Typography level="body-xs" sx={{ color: 'warning.600' }}>Stock faible</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>

                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                                        <Box sx={{ width: 70, height: 70, bgcolor: 'neutral.100', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'sm', overflow: 'hidden', flexShrink: 0 }}>
                                                            <Image
                                                                src="/images/base-technique/cables.png"
                                                                alt="Produit"
                                                                width={63}
                                                                height={63}
                                                                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography level="body-sm" fontWeight="bold">Câble résistant au feu</Typography>
                                                            <Typography level="body-xs" sx={{ mb: 1 }}>Réf: CR2-100</Typography>
                                                            <Typography level="body-xs" sx={{ color: 'success.600' }}>En stock</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                        {/* Bouton pour voir plus */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                            <Button variant="outlined" color="neutral" size="sm">
                                                Voir tous les produits compatibles
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Normes et standards */}
                                    <Box sx={{ mb: 4 }}>
                                        <Typography level="title-md" sx={{ mb: 2 }}>Normes et standards</Typography>
                                        <Grid container spacing={2}>
                                            <Grid xs={12} sm={6}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    bgcolor: 'primary.100',
                                                                    color: 'primary.600',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '50%'
                                                                }}
                                                            >
                                                                <VerifiedIcon />
                                                            </Box>
                                                            <Box>
                                                                <Typography level="title-sm">NF 61-936</Typography>
                                                                <Typography level="body-xs">
                                                                    Norme française pour les systèmes de sécurité incendie.
                                                                    Ce produit est certifié conforme aux exigences de cette norme.
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid xs={12} sm={6}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    bgcolor: 'primary.100',
                                                                    color: 'primary.600',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '50%'
                                                                }}
                                                            >
                                                                <VerifiedIcon />
                                                            </Box>
                                                            <Box>
                                                                <Typography level="title-sm">EN 54-11</Typography>
                                                                <Typography level="body-xs">
                                                                    Norme européenne pour les déclencheurs manuels d&apos;alarme incendie.
                                                                    Ce produit est conforme aux standards européens.
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Systèmes compatibles */}
                                    <Box>
                                        <Typography level="title-md" sx={{ mb: 2 }}>Systèmes compatibles</Typography>
                                        <Card variant="outlined">
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid var(--joy-palette-divider)' }}>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Type de système</Typography>
                                                        </th>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Compatibilité</Typography>
                                                        </th>
                                                        <th style={{ textAlign: 'left', padding: '12px 16px' }}>
                                                            <Typography level="body-xs">Notes</Typography>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Centrales conventionnelles</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <CheckCircleIcon sx={{ color: 'success.600', mr: 1, fontSize: 18 }} />
                                                                <Typography level="body-sm">Totale</Typography>
                                                            </Box>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Compatible avec toutes les centrales conventionnelles du marché</Typography>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ backgroundColor: 'var(--joy-palette-background-level1)' }}>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Centrales adressables</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <InfoIcon sx={{ color: 'warning.600', mr: 1, fontSize: 18 }} />
                                                                <Typography level="body-sm">Partielle</Typography>
                                                            </Box>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Nécessite un module d&apos;interface spécifique (IF-200)</Typography>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Systèmes sans fil</Typography>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <CancelIcon sx={{ color: 'danger.600', mr: 1, fontSize: 18 }} />
                                                                <Typography level="body-sm">Non compatible</Typography>
                                                            </Box>
                                                        </td>
                                                        <td style={{ padding: '12px 16px' }}>
                                                            <Typography level="body-sm">Produit filaire uniquement</Typography>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Card>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </TabPanel>
                    </Box>
                </Tabs>
                </Box>
    </>
  );
}
