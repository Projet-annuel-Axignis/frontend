'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Folder as FolderIcon,
  DashboardRounded as DashboardRoundedIcon,
  Cable as CableIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { EquipmentDomain } from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DomaineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [domain, setDomain] = useState<EquipmentDomain | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const domainId = params.id as string;

  useEffect(() => {
    const loadDomain = async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getDomainById(domainId);
        setDomain(data);
      } catch (err) {
        console.error('Erreur lors du chargement du domaine:', err);
        setError('Erreur lors du chargement du domaine');
      } finally {
        setLoading(false);
      }
    };

    if (domainId) {
      loadDomain();
    }
  }, [domainId]);

  const handleEdit = () => {
    // TODO: Implémenter la modification
    console.log('Modifier le domaine:', domain?.id);
  };

  const handleDelete = async () => {
    if (!domain) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
      try {
        await equipmentService.deleteDomain(domain.id);
        router.push('/dashboard/domaines');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !domain) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Domaine non trouvé'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard/domaines')}
        >
          Retour aux domaines
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard/domaines')}
          >
            Retour
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Modifier">
            <IconButton color="primary" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {domain.name}
        </Typography>
        
        <Chip 
          label={`Numéro de série: ${domain.serialNumber}`}
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
      </Box>

      {/* Informations principales */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FolderIcon color="primary" />
                Informations générales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Nom du domaine"
                    secondary={domain.name}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Numéro de série"
                    secondary={domain.serialNumber}
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondaryTypographyProps={{ fontFamily: 'monospace' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Date de création"
                    secondary={format(new Date(domain.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Dernière modification"
                    secondary={format(new Date(domain.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DashboardRoundedIcon color="primary" />
                Statistiques
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 120px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Familles
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 120px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Types
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 120px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Produits
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 120px', textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Documents
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Sections liées */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Éléments liés
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DashboardRoundedIcon color="primary" />
                  <Box>
                    <Typography variant="h6">Familles d&apos;équipements</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gérer les familles de ce domaine
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CableIcon color="primary" />
                  <Box>
                    <Typography variant="h6">Types d&apos;équipements</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Voir les types de ce domaine
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShoppingCartIcon color="primary" />
                  <Box>
                    <Typography variant="h6">Produits</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Voir les produits de ce domaine
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 