'use client';

import {
  Assignment as AssignmentIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  Group as GroupIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationOnIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  Container,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  gradient: string;
}

const DashboardPage = () => {
  const router = useRouter();

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Registre de Sécurité',
      description: 'Gestion des interventions, rapports, sites et observations',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      href: '/dashboard/(registre-securite)/sites',
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2, #42a5f5)'
    },
    {
      title: 'Base Technique',
      description: 'Gestion des équipements, produits, documents et compatibilités',
      icon: <EngineeringIcon sx={{ fontSize: 40 }} />,
      href: '/dashboard/(base-technique)/domaines',
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #388e3c, #66bb6a)'
    },
    {
      title: 'Administration',
      description: 'Gestion des utilisateurs, entreprises et données système',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      href: '/dashboard/administration',
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00, #ff9800)'
    }
  ];

  const handleCardClick = (href: string) => {
    router.push(href);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Tableau de Bord
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Bienvenue dans votre espace de gestion. Sélectionnez une section pour commencer.
        </Typography>
      </Box>

      {/* Main Navigation Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {dashboardCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(card.href)}
                sx={{
                  height: '100%',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: '50%',
                    background: card.gradient,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80
                  }}
                >
                  {card.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {card.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {card.description}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                  Accéder →
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Access Section */}
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Accès Rapide
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CardActionArea
              onClick={() => router.push('/dashboard/(registre-securite)/interventions')}
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BuildIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    Interventions
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gérer les interventions
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CardActionArea
              onClick={() => router.push('/dashboard/(registre-securite)/sites')}
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    Sites
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gérer les sites
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CardActionArea
              onClick={() => router.push('/dashboard/(base-technique)/produits')}
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InventoryIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    Produits
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gérer les produits
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CardActionArea
              onClick={() => router.push('/dashboard/administration/utilisateurs')}
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <GroupIcon color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    Utilisateurs
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gérer les utilisateurs
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DashboardPage;