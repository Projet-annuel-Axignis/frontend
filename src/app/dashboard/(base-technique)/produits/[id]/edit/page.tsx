'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  SelectChangeEvent,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  Product, 
  UpdateProductRequest,
  Brand,
  EquipmentType,
  CompatibilityGroup
} from '@/types/equipment';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [compatibilityGroups, setCompatibilityGroups] = useState<CompatibilityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<UpdateProductRequest>({
    name: '',
    serialNumber: '',
    brandId: 0,
    typeId: 0,
    compatibilityGroupIds: []
  });
  
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les données de référence
  const loadReferenceData = async () => {
    try {
      const [brandsResponse, typesResponse, groupsResponse] = await Promise.all([
        equipmentService.getBrands(1, 100),
        equipmentService.getTypes(1, 100),
        equipmentService.getCompatibilityGroups(1, 100)
      ]);
      
      setBrands(brandsResponse[0] || []);
      setEquipmentTypes(typesResponse.results || []);
      
      if (Array.isArray(groupsResponse)) {
        setCompatibilityGroups(groupsResponse);
      } else if (groupsResponse && typeof groupsResponse === 'object' && 'results' in groupsResponse) {
        setCompatibilityGroups((groupsResponse as any).results as CompatibilityGroup[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
    }
  };

  // Charger le produit
  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getProductById(Number(productId));
      const productData = response.data;
      setProduct(productData);
      
      // Remplir le formulaire avec les données du produit
      setFormData({
        name: productData.name,
        serialNumber: productData.serialNumber,
        brandId: productData.brand?.id ? Number(productData.brand.id) : 0,
        typeId: productData.type?.id ? Number(productData.type.id) : 0,
        compatibilityGroupIds: productData.groups?.map((g: any) => g.id) || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement du produit',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadReferenceData();
      loadProduct();
    }
  }, [productId, loadProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await equipmentService.updateProduct(Number(productId), formData);
      setSnackbar({
        open: true,
        message: 'Produit mis à jour avec succès',
        severity: 'success'
      });
      
      // Rediriger vers la liste des produits après un délai
      setTimeout(() => {
        router.push('/dashboard/base-technique/produits');
      }, 1500);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      let errorMessage = 'Erreur lors de la mise à jour';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Un produit avec ce numéro de série existe déjà';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/base-technique/produits');
  };

  const handleGroupIdsChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setFormData({ 
      ...formData, 
      compatibilityGroupIds: typeof value === 'string' 
        ? value.split(',').map(id => Number(id)) 
        : value as number[]
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Produit introuvable
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          <EditIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Modifier le produit
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Modifiez les informations du produit &quot;{product.name}&quot;
        </Typography>
      </Box>

      {/* Formulaire */}
      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  autoFocus
                  label="Nom"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  helperText="Nom du produit (2-100 caractères)"
                  required
                />
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  label="Numéro de série"
                  fullWidth
                  variant="outlined"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  helperText="Numéro de série unique (3-50 caractères)"
                  required
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required>
                  <InputLabel>Marque</InputLabel>
                  <Select
                    value={formData.brandId || ''}
                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                    label="Marque"
                  >
                    {brands.map(brand => (
                      <MenuItem key={brand.id} value={Number(brand.id)}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Sélectionnez la marque du produit</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <FormControl fullWidth required>
                  <InputLabel>Type d&apos;équipement</InputLabel>
                  <Select
                    value={formData.typeId || ''}
                    onChange={(e) => setFormData({ ...formData, typeId: Number(e.target.value) })}
                    label="Type d'équipement"
                  >
                    {equipmentTypes.map(type => (
                      <MenuItem key={type.id} value={Number(type.id)}>
                        {type.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Sélectionnez le type d&apos;équipement</FormHelperText>
                </FormControl>
              </Box>
            </Box>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel>Groupes de compatibilité</InputLabel>
                <Select
                  multiple
                  value={formData.compatibilityGroupIds || []}
                  onChange={handleGroupIdsChange}
                  input={<OutlinedInput label="Groupes de compatibilité" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as number[]).map((value) => {
                        const group = compatibilityGroups.find(g => g.id === value);
                        return (
                          <Chip key={value} label={group?.name || `Groupe ${value}`} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {compatibilityGroups.length === 0 ? (
                    <MenuItem disabled>Aucun groupe disponible</MenuItem>
                  ) : (
                    compatibilityGroups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText>Sélectionnez les groupes de compatibilité (optionnel)</FormHelperText>
              </FormControl>
            </Box>

            {/* Boutons d'action */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={
                  saving ||
                  !formData.name?.trim() || 
                  (formData.name?.length || 0) < 2 || 
                  (formData.name?.length || 0) > 100 ||
                  !formData.serialNumber?.trim() || 
                  (formData.serialNumber?.length || 0) < 3 || 
                  (formData.serialNumber?.length || 0) > 50 ||
                  !formData.brandId ||
                  !formData.typeId
                }
                sx={{
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                  }
                }}
              >
                {saving ? <CircularProgress size={20} /> : 'Enregistrer'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
