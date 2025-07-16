'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest,
  Brand,
  EquipmentType,
  CompatibilityGroup,
  ProductDocument
} from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ProductsPage() {
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [compatibilityGroups, setCompatibilityGroups] = useState<CompatibilityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterBrandId, setFilterBrandId] = useState<number | null>(null);
  const [filterTypeId, setFilterTypeId] = useState<number | null>(null);
  const [filterCompatibilityGroupId, setFilterCompatibilityGroupId] = useState<number | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  
  // État du formulaire
  const [formData, setFormData] = useState<CreateProductRequest>({
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

  // Nouvel état pour stocker les documents associés à chaque produit
  const [productDocuments, setProductDocuments] = useState<{ [productId: number]: ProductDocument[] }>({});
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false);

  // Fonction pour compter les filtres actifs
  const updateActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filterBrandId) count++;
    if (filterTypeId) count++;
    if (filterCompatibilityGroupId) count++;
    if (debouncedSearchTerm) count++;
    if (showDeleted) count++;
    setActiveFiltersCount(count);
  }, [filterBrandId, filterTypeId, filterCompatibilityGroupId, debouncedSearchTerm, showDeleted]);
  
  // Charger les produits
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("Paramètres loadProducts:", {
        page: page + 1, 
        rowsPerPage, 
        brandId: filterBrandId || undefined,
        typeId: filterTypeId || undefined,
        compatibilityGroupId: filterCompatibilityGroupId || undefined,
        searchTerm: debouncedSearchTerm, 
        showDeleted
      });
      
      const response = await equipmentService.getProducts(
        page + 1, 
        rowsPerPage, 
        filterBrandId || undefined,
        filterTypeId || undefined,
        filterCompatibilityGroupId || undefined,
        debouncedSearchTerm, 
        showDeleted
      );
      
      console.log("Réponse loadProducts:", response);
      console.log("Structure des produits:", response.results?.[0]);
      const productsData = response.results || [];
      setProducts(productsData);
      setTotal(response.totalResults || 0);
      
      // Charger les documents associés aux produits récupérés
      if (productsData.length > 0) {
        await loadProductDocuments(productsData);
      }
      
      // Si on est sur une page qui n'existe plus (après filtrage)
      if (response.totalResults > 0 && response.results.length === 0 && page > 0) {
        setPage(0); // Revenir à la première page
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des produits:', error);
      
      // Message d'erreur plus précis
      let errorMessage = 'Erreur lors du chargement des produits';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'Requête invalide. Vérifiez vos filtres.';
          // Réinitialiser certains filtres qui pourraient causer des problèmes
          if (filterCompatibilityGroupId) setFilterCompatibilityGroupId(null);
        } else if (error.response.status === 404) {
          errorMessage = 'Aucun produit trouvé avec ces critères';
          setProducts([]);
          setTotal(0);
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Charger les marques pour les filtres et le formulaire
  const loadBrands = async () => {
    try {
      const response = await equipmentService.getBrands(1, 100);
      setBrands(response[0] || []);
    } catch (error) {
      console.error('Erreur lors du chargement des marques:', error);
    }
  };

  // Charger les types d'équipements pour les filtres et le formulaire
  const loadEquipmentTypes = async () => {
    try {
      const response = await equipmentService.getTypes(1, 100);
      setEquipmentTypes(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'équipements:', error);
    }
  };

  // Charger les groupes de compatibilité pour le formulaire
  const loadCompatibilityGroups = async () => {
    try {
      const response: any = await equipmentService.getCompatibilityGroups(1, 100);
      console.log('Response groupes de compatibilité:', response);
      
      // Vérifier si la réponse est directement un tableau (format [{ id, name, products }])
      if (Array.isArray(response)) {
        setCompatibilityGroups(response);
      } 
      // Vérifier si la réponse a une structure avec un champ results
      else if (response && typeof response === 'object' && 'results' in response && response.results) {
        setCompatibilityGroups(response.results as CompatibilityGroup[]);
      }
      // Si format inconnu, utiliser un tableau vide
      else {
        console.warn('Format de réponse inattendu pour les groupes de compatibilité');
        setCompatibilityGroups([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des groupes de compatibilité:', error);
      setCompatibilityGroups([]);
    }
  };
  
  // Charger les documents pour chaque produit
  const loadProductDocuments = async (productsArray: Product[]) => {
    try {
      setLoadingDocuments(true);
      const documentsMap: { [productId: number]: ProductDocument[] } = {};
      
      // Pour chaque produit, charger ses documents associés
      await Promise.all(
        productsArray.map(async (product) => {
          try {
            // Récupérer les documents associés au produit
            const response = await equipmentService.getProductDocumentsByProductId(product.id.toString());
            
            // Stocker les documents dans notre map avec l'ID du produit comme clé
            if (response && response.results) {
              // La réponse contient un tableau de documents dans results
              documentsMap[product.id] = response.results || [];
            } else {
              documentsMap[product.id] = [];
            }
          } catch (error: any) {
            console.error(`Erreur lors du chargement des documents pour le produit ${product.id}:`, error);
            // Si c'est une erreur 404, c'est normal (pas de documents pour ce produit)
            if (error.response && error.response.status === 404) {
              documentsMap[product.id] = [];
            } else {
              documentsMap[product.id] = [];
            }
          }
        })
      );
      
      setProductDocuments(documentsMap);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Effet pour le debounce sur la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms de délai
    
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Mise à jour du nombre de filtres actifs
  useEffect(() => {
    updateActiveFiltersCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBrandId, filterTypeId, filterCompatibilityGroupId, debouncedSearchTerm, showDeleted]);

  // Chargement des produits quand les filtres changent
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterBrandId, filterTypeId, filterCompatibilityGroupId, debouncedSearchTerm, showDeleted]);

  // Chargement initial des données de référence
  useEffect(() => {
    loadBrands();
    loadEquipmentTypes();
    loadCompatibilityGroups();
  }, []);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      console.log("handleSubmit - Données du formulaire avant soumission:", formData);
      
      // Assurer que brandId et typeId sont des nombres
      const processedData = {
        ...formData,
        brandId: typeof formData.brandId === 'string' ? parseInt(formData.brandId) : formData.brandId,
        typeId: typeof formData.typeId === 'string' ? parseInt(formData.typeId) : formData.typeId
      };
      
      console.log("Données traitées pour soumission:", processedData);

      if (editingProduct) {
        console.log(`Mise à jour du produit (ID: ${editingProduct.id})`);
        await equipmentService.updateProduct(editingProduct.id, processedData as UpdateProductRequest);
        setSnackbar({
          open: true,
          message: 'Produit mis à jour avec succès',
          severity: 'success'
        });
      } else {
        console.log("Création d'un nouveau produit");
        await equipmentService.createProduct(processedData as CreateProductRequest);
        setSnackbar({
          open: true,
          message: 'Produit créé avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadProducts();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response) {
        console.error("Code d'erreur:", error.response.status);
        console.error("Détails de l'erreur:", error.response.data);
        
        if (error.response.status === 409) {
          errorMessage = 'Un produit avec ce numéro de série existe déjà';
        } else if (error.response.status === 500) {
          errorMessage = 'Erreur serveur. Vérifiez les formats de données et réessayez.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const openDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteProduct(productToDelete);
      setSnackbar({
        open: true,
        message: 'Produit supprimé avec succès',
        severity: 'success'
      });
      loadProducts();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Ce produit est utilisé par d\'autres éléments et ne peut pas être supprimé';
        } else if (error.response.status === 404) {
          errorMessage = 'Produit introuvable';
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
      setLoading(false);
      closeDeleteDialog();
    }
  };

  const handleRestore = async (id: number) => {
    try {
      setLoading(true);
      await equipmentService.restoreProduct(id);
      setSnackbar({
        open: true,
        message: 'Produit restauré avec succès',
        severity: 'success'
      });
      loadProducts();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la restauration';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Produit introuvable';
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
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    setFormData({ 
      name: product.name,
      serialNumber: product.serialNumber,
      brandId: product.brand?.id ? (typeof product.brand.id === 'string' ? parseInt(product.brand.id) : product.brand.id) : 0,
      typeId: product.type?.id ? (typeof product.type.id === 'string' ? parseInt(product.type.id) : product.type.id) : 0,
      compatibilityGroupIds: product.groups?.map(g => g.id) || []
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      serialNumber: '',
      brandId: 0,
      typeId: 0,
      compatibilityGroupIds: []
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      serialNumber: '',
      brandId: 0,
      typeId: 0,
      compatibilityGroupIds: []
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const resetFilters = () => {
    setFilterBrandId(null);
    setFilterTypeId(null);
    setFilterCompatibilityGroupId(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setShowDeleted(false);
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header avec titre et bouton principal */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'flex-start' },
        gap: 2,
        mb: 4 
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Produits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les produits disponibles dans votre catalogue
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
            height: 'fit-content',
            whiteSpace: 'nowrap'
          }}
        >
          Nouveau produit
        </Button>
      </Box>

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {total}
                  </Typography>
                  <Typography variant="body2">
                    Produits au total
                  </Typography>
                </Box>
                <InventoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Barre de filtres avec bouton d'action */}
      <Paper sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        {/* En-tête des filtres avec bouton d'action */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <SearchIcon sx={{ color: 'var(--color-axignis-primary)', fontSize: '1.5rem' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-axignis-primary)' }}>
              Filtres et recherche
            </Typography>
            {activeFiltersCount > 0 && (
              <Chip 
                label={`${activeFiltersCount} filtre${activeFiltersCount > 1 ? 's' : ''} actif${activeFiltersCount > 1 ? 's' : ''}`}
                color="primary" 
                size="small" 
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeFiltersCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={resetFilters}
                startIcon={<RefreshIcon />}
                sx={{ 
                  borderColor: 'var(--color-axignis-primary)',
                  color: 'var(--color-axignis-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-axignis-secondary)',
                    backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.1)'
                  }
                }}
              >
                Réinitialiser tout
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Grille de filtres responsive */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)', 
            xl: 'repeat(5, 1fr)' 
          }, 
          gap: 2
        }}>
          <TextField
            size="small"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1' } }}
          />
          
          <FormControl size="small">
            <InputLabel>Marque</InputLabel>
            <Select
              value={filterBrandId || ''}
              onChange={(e) => setFilterBrandId(e.target.value ? Number(e.target.value) : null)}
              label="Marque"
            >
              <MenuItem value="">Toutes les marques</MenuItem>
              {brands.map(brand => (
                <MenuItem key={brand.id} value={Number(brand.id)}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Type d&apos;équipement</InputLabel>
            <Select
              value={filterTypeId || ''}
              onChange={(e) => setFilterTypeId(e.target.value ? Number(e.target.value) : null)}
              label="Type d'équipement"
            >
              <MenuItem value="">Tous les types</MenuItem>
              {equipmentTypes.map(type => (
                <MenuItem key={type.id} value={Number(type.id)}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small">
            <InputLabel>Groupe de compatibilité</InputLabel>
            <Select
              value={filterCompatibilityGroupId || ''}
              onChange={(e) => setFilterCompatibilityGroupId(e.target.value ? Number(e.target.value) : null)}
              label="Groupe de compatibilité"
            >
              <MenuItem value="">Tous les groupes</MenuItem>
              {compatibilityGroups.map(group => (
                <MenuItem key={group.id} value={Number(group.id)}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              px: 2,
              py: 1,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Inclure supprimés
            </Typography>
            <Switch
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* Résumé des filtres actifs */}
      {activeFiltersCount > 0 && (
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.02)',
          border: '1px solid rgba(var(--color-axignis-primary-rgb), 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
              Filtres appliqués ({activeFiltersCount}):
            </Typography>
            
            {filterBrandId && (
              <Chip 
                size="small" 
                label={`Marque: ${brands.find(b => b.id === filterBrandId.toString())?.name || 'ID ' + filterBrandId}`}
                onDelete={() => setFilterBrandId(null)} 
                color="primary" 
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            )}
            
            {filterTypeId && (
              <Chip 
                size="small" 
                label={`Type: ${equipmentTypes.find(t => t.id === filterTypeId.toString())?.title || 'ID ' + filterTypeId}`} 
                onDelete={() => setFilterTypeId(null)} 
                color="primary"
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            )}
            
            {filterCompatibilityGroupId && (
              <Chip 
                size="small" 
                label={`Groupe: ${compatibilityGroups.find(g => g.id === filterCompatibilityGroupId)?.name || 'ID ' + filterCompatibilityGroupId}`} 
                onDelete={() => setFilterCompatibilityGroupId(null)} 
                color="primary"
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            )}
            
            {debouncedSearchTerm && (
              <Chip 
                size="small" 
                label={`Recherche: "${debouncedSearchTerm}"`} 
                onDelete={() => {setSearchTerm(''); setDebouncedSearchTerm('');}} 
                color="primary"
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            )}
            
            {showDeleted && (
              <Chip 
                size="small" 
                label="Inclut les supprimés" 
                onDelete={() => setShowDeleted(false)} 
                color="error"
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            )}
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Typography variant="body2" sx={{ 
              fontStyle: 'italic', 
              color: 'text.secondary',
              fontWeight: 500,
              px: 2,
              py: 0.5,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              {total} résultat{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Numéro de série</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Marque</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Groupes de compatibilité</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Documents</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date de création</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun produit trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow 
                    key={product.id} 
                    hover
                    sx={{ 
                      opacity: product.deletedAt ? 0.6 : 1,
                      backgroundColor: product.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon sx={{ color: product.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            textDecoration: product.deletedAt ? 'line-through' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {product.name}
                          {product.deletedAt && (
                            <Chip 
                              label="Supprimé" 
                              size="small" 
                              color="error" 
                              variant="outlined" 
                              sx={{ fontSize: '0.7rem', height: 20 }} 
                            />
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.serialNumber} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>
                      {product.brand?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {product.type?.title || '-'}
                    </TableCell>
                    <TableCell>
                      {product.groups && product.groups.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {product.groups.map(group => (
                            <Chip 
                              key={group.id}
                              label={group.name}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Aucun groupe
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {productDocuments[product.id] ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={`${productDocuments[product.id].length} document${productDocuments[product.id].length !== 1 ? 's' : ''}`}
                            size="small"
                            color="info"
                            sx={{ 
                              fontWeight: productDocuments[product.id].length > 0 ? 500 : 400,
                              opacity: productDocuments[product.id].length > 0 ? 1 : 0.7,
                              cursor: 'pointer'
                            }}
                            variant={productDocuments[product.id].length > 0 ? "filled" : "outlined"}
                            icon={productDocuments[product.id].length > 0 ? <InventoryIcon sx={{ fontSize: '1rem' }} /> : undefined}
                            onClick={() => router.push(`/dashboard/base-technique/documents?productId=${product.id}`)}
                            clickable
                          />
                          {productDocuments[product.id].length > 0 && (
                            <Tooltip title={`Ce produit possède ${productDocuments[product.id].length} document${productDocuments[product.id].length !== 1 ? 's' : ''} associé${productDocuments[product.id].length !== 1 ? 's' : ''}`}>
                              <InfoIcon sx={{ color: 'info.main', fontSize: '1rem', ml: 1 }} />
                            </Tooltip>
                          )}
                        </Box>
                      ) : loadingDocuments ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Chip
                          label="Aucun document"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{ opacity: 0.7, cursor: 'pointer' }}
                          onClick={() => router.push(`/dashboard/base-technique/documents?productId=${product.id}`)}
                          clickable
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(product.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {product.deletedAt ? (
                          <Tooltip title="Restaurer">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleRestore(product.id)}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(product)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openDeleteDialog(product.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </Paper>

      {/* Dialog pour créer/modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        </DialogTitle>        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  autoFocus
                  margin="dense"
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
                  margin="dense"
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
                <FormControl fullWidth margin="dense" required>
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
                <FormControl fullWidth margin="dense" required>
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
              <FormControl fullWidth margin="dense">
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={
              !formData.name.trim() || 
              formData.name.length < 2 || 
              formData.name.length > 100 ||
              !formData.serialNumber.trim() || 
              formData.serialNumber.length < 3 || 
              formData.serialNumber.length > 50 ||
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
            {editingProduct ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour confirmer la suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderTop: '4px solid #f44336',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon color="error" /> Confirmation de suppression
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer ce produit ?
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note :</strong> Cette action effectuera une suppression réversible. Le produit pourra être restauré ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={closeDeleteDialog} 
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
              bgcolor: 'error.main',
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>

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
