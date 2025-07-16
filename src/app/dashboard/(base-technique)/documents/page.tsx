'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Fab,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Update as UpdateIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Verified as VerifiedIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  ProductDocument, 
  UpdateProductDocumentStatusRequest,
  DocumentType,
  Product
} from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Utilitaire pour formater les tailles de fichiers
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Composant pour afficher un indicateur de statut
function StatusChip({ status }: { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }) {
  let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
  let label: string = status;

  switch (status) {
    case 'DRAFT':
      color = 'info';
      label = 'Brouillon';
      break;
    case 'PUBLISHED':
      color = 'success';
      label = 'Publié';
      break;
    case 'ARCHIVED':
      color = 'secondary';
      label = 'Archivé';
      break;
  }

  return (
    <Chip 
      color={color}
      label={label}
      size="small"
    />
  );
}

export default function ProductDocumentsPage() {
  const searchParams = useSearchParams();
  
  // Type pour le formulaire d'upload simplifié
  type UploadForm = {
    reference: string;
    serialNumber: string;
    productId: string;
    documentTypeId: string;
    issueDate: string;
    expiryDate?: string;
    version: number;
    file: File | null;
  };
  
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [checkDocumentOpen, setCheckDocumentOpen] = useState(false);
  const [documentToAction, setDocumentToAction] = useState<ProductDocument | null>(null);
  const [filterProductId, setFilterProductId] = useState<string>('');
  const [filterDocumentTypeId, setFilterDocumentTypeId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Initialisation du filtre produit depuis les paramètres URL
  useEffect(() => {
    const productIdFromUrl = searchParams.get('productId');
    if (productIdFromUrl) {
      setFilterProductId(productIdFromUrl);
      // Initialiser aussi le formulaire d'upload avec ce productId
      setUploadForm(prev => ({
        ...prev,
        productId: productIdFromUrl
      }));
    }
  }, [searchParams]);
  
  // Formulaire d'upload
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    reference: '',
    serialNumber: '',
    productId: '',
    documentTypeId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    version: 1,
    file: null
  });
  
  // État pour valider le checksum
  const [checksumValue, setChecksumValue] = useState('');
  const [checksumResult, setChecksumResult] = useState<boolean | null>(null);
  
  // État pour le changement de statut
  const [newStatus, setNewStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  
  // Snackbar pour les notifications
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Chargement initial des documents et des listes déroulantes
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Vérifier si un produit est sélectionné
      if (filterProductId) {
        try {
          // Si un produit est sélectionné, utiliser la route par produit
          const response = await equipmentService.getProductDocumentsByProductId(
            filterProductId,
            page + 1,
            rowsPerPage,
            true // Force refresh pour s'assurer d'avoir les données les plus récentes
          );
          
          console.log(`Documents pour le produit ${filterProductId} - Format brut:`, response);
          
          // Vérifier si nous avons des documents
          const hasDocuments = response && response.results && response.results.length > 0;
          
          console.log(`Analyse de la réponse pour le produit ${filterProductId}:`, {
            responseType: typeof response,
            hasResults: !!response.results,
            totalResults: response.totalResults,
            resultsCount: response.results?.length || 0,
            firstDoc: hasDocuments ? {
              id: response.results[0].id,
              fileName: response.results[0].fileName,
              hasProducts: !!response.results[0].products,
              productsLength: response.results[0].products?.length || 0,
              productName: response.results[0].products?.[0]?.name || response.results[0].product?.name || 'Non spécifié',
              hasType: !!response.results[0].type,
              typeName: response.results[0].type?.name || response.results[0].documentType?.name || 'Non spécifié'
            } : 'Aucun document disponible'
          });
          
          // Filtrage côté client pour les autres critères (temporaire jusqu'à mise à jour API)
          let filteredDocs = response.results || [];
          
          if (filterDocumentTypeId) {
            filteredDocs = filteredDocs.filter(doc => doc.documentTypeId === filterDocumentTypeId);
          }
          
          if (filterStatus) {
            filteredDocs = filteredDocs.filter(doc => doc.status === filterStatus);
          }
          
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredDocs = filteredDocs.filter(doc => 
              doc.fileName?.toLowerCase().includes(searchLower) ||
              doc.reference?.toLowerCase().includes(searchLower) ||
              doc.serialNumber?.toLowerCase().includes(searchLower)
            );
          }
          
          if (!showDeleted) {
            filteredDocs = filteredDocs.filter(doc => !doc.deletedAt);
          }
          
          console.log("Documents prêts pour l'affichage:", filteredDocs.map(doc => ({
            id: doc.id,
            fileName: doc.fileName,
            status: doc.status,
            typeName: doc.documentType?.name || doc.type?.name || 'Inconnu',
            productName: doc.product?.name || (doc.products && doc.products.length > 0 ? doc.products[0].name : 'Inconnu'),
            hasProductId: !!doc.productId,
            hasDocumentTypeId: !!doc.documentTypeId,
            hasProducts: Array.isArray(doc.products) && doc.products.length > 0,
            hasType: !!doc.type
          })));
          
          setDocuments(filteredDocs);
          setTotal(response.totalResults || 0);
        } catch (error: any) {
          console.log('Réponse API pour getProductDocumentsByProductId:', error);
          
          // Gérer spécifiquement l'erreur 404 (pas de documents trouvés pour ce produit)
          if (error.response && error.response.status === 404) {
            // C'est normal s'il n'y a pas de documents, on affiche juste une liste vide
            setDocuments([]);
            setTotal(0);
            
            // Informer l'utilisateur de manière plus visible
            console.log("Aucun document trouvé pour ce produit");
            
            // Afficher un message non intrusif pour encourager l'upload de documents
            if (!snackbar.open) {
              setSnackbar({
                open: true,
                message: 'Aucun document trouvé pour ce produit. Vous pouvez en ajouter un.',
                severity: 'info'
              });
            }
          } else {
            // Pour les autres erreurs, on les traite comme de véritables erreurs
            throw error;
          }
        }
      } else {
        // Si aucun produit n'est sélectionné, afficher un message ou demander à l'utilisateur de sélectionner
        setDocuments([]);
        setTotal(0);
        
        // Indiquer à l'utilisateur qu'il doit sélectionner un produit
        if (!snackbar.open) {
          setSnackbar({
            open: true,
            message: 'Veuillez sélectionner un produit pour afficher ses documents',
            severity: 'info'
          });
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des documents:', error);
      
      // Message d'erreur personnalisé selon le type d'erreur
      let errorMessage = 'Erreur lors du chargement des documents';
      
      if (error.response) {
        // Erreurs de l'API avec des réponses
        if (error.response.status === 403) {
          errorMessage = "Vous n'avez pas les droits d'accès à ces documents";
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
  }, [filterProductId, page, rowsPerPage, filterDocumentTypeId, filterStatus, searchTerm, showDeleted, snackbar.open]);

  // Chargement des types de documents pour les filtres et le formulaire
  const loadDocumentTypes = async () => {
    try {
      const response = await equipmentService.getDocumentTypes(1, 100);
      console.log("Réponse loadDocumentTypes:", response);
      
      // La réponse est un tableau [results, totalResults, totalPages]
      if (Array.isArray(response)) {
        const [results] = response;
        setDocumentTypes(Array.isArray(results) ? results : []);
      } else {
        console.error('Format de réponse API inattendu:', response);
        setDocumentTypes([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des types de documents:', error);
    }
  };

  // Méthode pour charger la liste des produits
  const loadProducts = async () => {
    try {
      const response = await equipmentService.getProducts(1, 100);
      console.log("Réponse loadProducts:", response);
      
      if (response && response.results) {
        setProducts(response.results);
      } else {
        console.error('Format de réponse API inattendu pour les produits:', response);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  // Appels initiaux
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);
  
  // Chargement des listes de référence (types de documents et produits)
  useEffect(() => {
    loadDocumentTypes();
    loadProducts();
  }, []);

  // Gestion du formulaire d'upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Générer une référence et un numéro de série par défaut basés sur le nom du fichier
      // pour aider l'utilisateur à remplir le formulaire plus rapidement
      const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
      const defaultRef = fileNameWithoutExtension.toUpperCase().replace(/[^A-Z0-9]/g, "-").substring(0, 20);
      const timestamp = new Date().getTime().toString().slice(-6);
      
      setUploadForm({
        ...uploadForm,
        file: selectedFile,
        reference: uploadForm.reference || `DOC-${defaultRef}`,
        serialNumber: uploadForm.serialNumber || `DOC-${defaultRef}-${timestamp}`
      });
    }
  };

  const handleUploadSubmit = async () => {
    try {
      setLoading(true);
      
      // Vérification que le fichier est présent
      if (!uploadForm.file) {
        throw new Error('Aucun fichier sélectionné');
      }
      
      // Trouver le produit sélectionné
      const selectedProduct = products.find(p => p.id.toString() === uploadForm.productId.toString());
      if (!selectedProduct) {
        throw new Error('Produit introuvable');
      }
      
      // Trouver le type de document sélectionné
      const selectedDocumentType = documentTypes.find(t => t.id.toString() === uploadForm.documentTypeId.toString());
      if (!selectedDocumentType) {
        throw new Error('Type de document introuvable');
      }
      
      // Préparation des données au format attendu par le backend
      const formattedUploadForm = {
        reference: uploadForm.reference,
        serialNumber: uploadForm.serialNumber,
        products: [selectedProduct],
        type: selectedDocumentType,
        issueDate: uploadForm.issueDate,
        expiryDate: uploadForm.expiryDate,
        version: uploadForm.version,
        file: uploadForm.file
      };
      
      const response = await equipmentService.uploadProductDocument(formattedUploadForm);
      
      // Afficher un message de succès avec plus de détails
      setSnackbar({
        open: true,
        message: `Document "${response.data?.fileName || 'sans nom'}" téléversé avec succès`,
        severity: 'success'
      });
      
      // Fermer la boîte de dialogue
      handleCloseDialog();
      
      // Mettre à jour la sélection du produit pour afficher le nouveau document
      if (uploadForm.productId && uploadForm.productId !== filterProductId) {
        console.log("Mise à jour du produit sélectionné après upload:", uploadForm.productId);
        // Mettre à jour le filtre de produit pour afficher le document qui vient d'être ajouté
        setFilterProductId(uploadForm.productId);
      }
      
      // Attendre un court instant pour permettre à l'API de traiter l'upload avant de recharger
      setTimeout(() => {
        // Utiliser la fonction de rechargement forcé pour s'assurer d'avoir les données les plus récentes
        forceReloadDocuments();
      }, 800);
    } catch (error: any) {
      console.error('Erreur lors du téléversement:', error);
      let errorMessage = 'Erreur lors du téléversement du document';
      
      if (error.response) {
        console.error("Code d'erreur:", error.response.status);
        console.error("Détails de l'erreur:", error.response.data);
        
        if (error.response.status === 409) {
          errorMessage = 'Un document avec ce numéro de série existe déjà';
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

  // Fonction pour forcer le rechargement des documents après upload
  const forceReloadDocuments = async () => {
    console.log("Rechargement forcé des documents...");
    // Réinitialiser le cache pour s'assurer d'obtenir les données les plus récentes
    try {
      setLoading(true);
      if (filterProductId) {
        // Forcer une nouvelle requête pour le produit sélectionné
        const response = await equipmentService.getProductDocumentsByProductId(
          filterProductId,
          page + 1,
          rowsPerPage,
          true // Ajoutez un paramètre à la méthode pour forcer le non-cache
        );
        
        console.log("État des documents après upload:", {
          hasResults: !!response.results,
          count: response.results?.length || 0,
          totalResults: response.totalResults || 0
        });
        
        if (response.results) {
          console.log("Premier document rechargé:", response.results[0] ? {
            id: response.results[0].id,
            fileName: response.results[0].fileName || "N/A",
            type: response.results[0].type?.name || response.results[0].documentType?.name || "N/A",
            product: response.results[0].products?.[0]?.name || response.results[0].product?.name || "N/A"
          } : "Aucun document");
        }
        
        setDocuments(response.results || []);
        setTotal(response.totalResults || 0);
        
        if (response.results && response.results.length > 0) {
          setSnackbar({
            open: true,
            message: `${response.results.length} document(s) disponible(s) pour ce produit`,
            severity: 'success'
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du rechargement forcé:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion du changement de statut
  const handleStatusDialogOpen = (document: ProductDocument) => {
    setDocumentToAction(document);
    setNewStatus(document.status);
    setStatusDialogOpen(true);
  };

  const handleStatusSubmit = async () => {
    if (!documentToAction) return;
    
    try {
      setLoading(true);
      await equipmentService.updateProductDocumentStatus(
        documentToAction.id, 
        { status: newStatus } as UpdateProductDocumentStatusRequest
      );
      setSnackbar({
        open: true,
        message: 'Statut mis à jour avec succès',
        severity: 'success'
      });
      setStatusDialogOpen(false);
      loadDocuments();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      let errorMessage = 'Erreur lors de la mise à jour du statut';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDocumentToAction(null);
    }
  };

  // Gestion du téléchargement d'un document
  const handleDownload = async (id: string, fileName: string) => {
    try {
      setLoading(true);
      const blob = await equipmentService.downloadProductDocument(id);
      
      // Création d'un URL pour le blob et déclenchement du téléchargement
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyage
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSnackbar({
        open: true,
        message: 'Téléchargement démarré',
        severity: 'info'
      });
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      
      // Message d'erreur personnalisé selon le type d'erreur
      let errorMessage = 'Erreur lors du téléchargement du document';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Document introuvable ou supprimé";
        } else if (error.response.status === 403) {
          errorMessage = "Vous n'avez pas les droits pour télécharger ce document";
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

  // Gestion de la vérification du checksum
  const handleCheckDialogOpen = (document: ProductDocument) => {
    setDocumentToAction(document);
    setChecksumValue('');
    setChecksumResult(null);
    setCheckDocumentOpen(true);
  };

  const handleValidateChecksum = async () => {
    if (!documentToAction || !checksumValue.trim()) return;
    
    try {
      setLoading(true);
      const response = await equipmentService.validateProductDocumentChecksum(
        documentToAction.id,
        checksumValue.trim()
      );
      
      setChecksumResult(response.data.valid);
      
      setSnackbar({
        open: true,
        message: response.data.valid
          ? 'Le checksum est valide, le document est authentique'
          : 'Le checksum est invalide, le document pourrait avoir été altéré',
        severity: response.data.valid ? 'success' : 'error'
      });
    } catch (error: any) {
      console.error('Erreur lors de la validation du checksum:', error);
      
      // Message d'erreur personnalisé selon le type d'erreur
      let errorMessage = 'Erreur lors de la validation du checksum';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Le document n'existe plus ou a été supprimé";
          // Forcer le rechargement des documents pour mettre à jour la liste
          loadDocuments();
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      setChecksumResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la suppression
  const openDeleteDialog = (document: ProductDocument) => {
    setDocumentToAction(document);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToAction) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteProductDocument(documentToAction.id);
      setSnackbar({
        open: true,
        message: 'Document supprimé avec succès',
        severity: 'success'
      });
      loadDocuments();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setDocumentToAction(null);
    }
  };

  // Restauration d'un document supprimé
  const handleRestore = async (id: string) => {
    try {
      setLoading(true);
      await equipmentService.restoreProductDocument(id);
      setSnackbar({
        open: true,
        message: 'Document restauré avec succès',
        severity: 'success'
      });
      loadDocuments();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      let errorMessage = 'Erreur lors de la restauration';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
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

  // Fonctions utilitaires pour la gestion des dialogues et de la pagination
  const handleAdd = () => {
    setUploadForm({
      reference: '',
      serialNumber: '',
      productId: filterProductId || '', // Utiliser le produit sélectionné dans le filtre
      documentTypeId: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      version: 1,
      file: null
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
    setDocumentToAction(null);
  };

  const handleCloseCheckDialog = () => {
    setCheckDocumentOpen(false);
    setDocumentToAction(null);
    setChecksumValue('');
    setChecksumResult(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDocumentToAction(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonctions de débug supprimées pour éviter les warnings

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box sx={{ p: 3 }}>      {/* Header avec sélecteur de produit principal */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Documents produits
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Gérez les documents associés à vos produits (manuels, fiches techniques, certificats...)
        </Typography>
        
        {/* Sélecteur de produit principal */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          background: 'linear-gradient(135deg, rgba(var(--color-axignis-primary-rgb), 0.05), rgba(var(--color-axignis-secondary-rgb), 0.05))',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <InventoryIcon sx={{ color: 'var(--color-axignis-primary)', fontSize: '1.5rem' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-axignis-primary)' }}>
              Sélectionner un produit
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Autocomplete
              options={products}
              loading={loading}
              value={products.find(p => p.id.toString() === filterProductId) || null}
              onChange={(event, newValue) => {
                setFilterProductId(newValue ? newValue.id.toString() : '');
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterOptions={(options, { inputValue }) => {
                if (!inputValue) return options;
                
                const searchTerm = inputValue.toLowerCase();
                return options.filter(option => 
                  option.name.toLowerCase().includes(searchTerm) ||
                  option.serialNumber.toLowerCase().includes(searchTerm) ||
                  (option.brand?.name && option.brand.name.toLowerCase().includes(searchTerm))
                );
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <InventoryIcon sx={{ fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.serialNumber} • {option.brand?.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choisir le produit à consulter"
                  placeholder="Rechercher par nom, série ou marque..."
                  helperText={
                    filterProductId 
                      ? `Documents du produit: ${products.find(p => p.id.toString() === filterProductId)?.name}`
                      : "Tapez pour rechercher ou sélectionner un produit dans la liste"
                  }
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon sx={{ color: 'var(--color-axignis-primary)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'var(--color-axignis-primary)',
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--color-axignis-secondary)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--color-axignis-primary)',
                      }
                    }
                  }}
                />
              )}
              sx={{ minWidth: 400, maxWidth: { xs: '100%', md: 500 } }}
              size="medium"
              noOptionsText="Aucun produit trouvé pour cette recherche"
              clearText="Effacer"
              openText="Ouvrir la liste"
              closeText="Fermer la liste"
              loadingText="Chargement des produits..."
            />
            
            {filterProductId && (
              <Button
                variant="outlined"
                size="medium"
                onClick={() => setFilterProductId('')}
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
                Changer de produit
              </Button>
            )}
          </Box>
        </Paper>
      </Box>      {/* Statistiques conditionnelles */}
      {filterProductId && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
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
                      Document{total !== 1 ? 's' : ''} pour ce produit
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5 }}>
                      {products.find(p => p.id.toString() === filterProductId)?.name}
                    </Typography>
                  </Box>
                  <InsertDriveFileIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          {/* Bouton d'action principal */}
          <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<CloudUploadIcon />}
              onClick={handleAdd}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                }
              }}
            >
              Ajouter un document
            </Button>
          </Box>
        </Box>
      )}      {/* Filtres secondaires - uniquement visible si un produit est sélectionné */}
      {filterProductId && (
        <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Filtres avancés
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Rechercher dans les documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: 280, flex: { xs: '1 1 100%', sm: '1 1 280px' } }}
            />
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Type de document</InputLabel>
              <Select
                value={filterDocumentTypeId}
                onChange={(e) => setFilterDocumentTypeId(e.target.value)}
                label="Type de document"
              >
                <MenuItem value="">Tous les types</MenuItem>
                {documentTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Statut"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="DRAFT">Brouillon</MenuItem>
                <MenuItem value="PUBLISHED">Publié</MenuItem>
                <MenuItem value="ARCHIVED">Archivé</MenuItem>
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
                py: 0.5
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Inclure supprimés
              </Typography>
              <Switch
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                size="small"
              />
            </Box>
            
            <Button
              variant="outlined"
              size="small"
              onClick={loadDocuments}
              disabled={loading}
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
              Actualiser
            </Button>
          </Box>
        </Paper>
      )}

      {/* Contenu principal */}
      {!filterProductId ? (
        /* État par défaut - Aucun produit sélectionné */
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <InsertDriveFileIcon sx={{ 
              fontSize: '4rem', 
              color: 'text.secondary', 
              mb: 2,
              opacity: 0.5 
            }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              Gestion des documents produits
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              Organisez et gérez tous les documents associés à vos produits : manuels d&apos;utilisation, 
              fiches techniques, certificats de conformité, et bien plus encore.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
              👆 Utilisez le sélecteur de produit ci-dessus pour commencer
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              mt: 4
            }}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <CloudUploadIcon sx={{ color: 'var(--color-axignis-primary)', mb: 1 }} />
                <Typography variant="subtitle2" gutterBottom>Téléversement facile</Typography>
                <Typography variant="caption" color="text.secondary">
                  Ajoutez vos documents en quelques clics
                </Typography>
              </Box>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <VerifiedIcon sx={{ color: 'var(--color-axignis-primary)', mb: 1 }} />
                <Typography variant="subtitle2" gutterBottom>Vérification d&apos;intégrité</Typography>
                <Typography variant="caption" color="text.secondary">
                  Contrôlez l&apos;authenticité de vos fichiers
                </Typography>
              </Box>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <UpdateIcon sx={{ color: 'var(--color-axignis-primary)', mb: 1 }} />
                <Typography variant="subtitle2" gutterBottom>Gestion des versions</Typography>
                <Typography variant="caption" color="text.secondary">
                  Suivez l&apos;évolution de vos documents
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      ) : (
        /* Table des documents */
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Document</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Produit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date d&apos;émission</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Taille</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <InsertDriveFileIcon sx={{ 
                          fontSize: '3rem', 
                          color: 'text.secondary',
                          opacity: 0.5 
                        }} />
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Aucun document pour ce produit
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Commencez par ajouter votre premier document pour ce produit
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          onClick={handleAdd}
                          size="large"
                          sx={{
                            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                            '&:hover': {
                              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                            },
                            px: 4,
                            py: 1.5
                          }}
                        >
                          Ajouter le premier document
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((document) => (
                    <TableRow 
                      key={document.id} 
                      hover
                      sx={{ 
                        opacity: document.deletedAt ? 0.6 : 1,
                        backgroundColor: document.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsertDriveFileIcon sx={{ color: document.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                            <Typography 
                              variant="body1" 
                              fontWeight={500}
                              sx={{ 
                                textDecoration: document.deletedAt ? 'line-through' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              {document.fileName}
                              {document.deletedAt && (
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
                          <Box>
                            <Chip 
                              label={`Réf: ${document.reference}`} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontFamily: 'monospace', mr: 1 }}
                            />
                            <Chip 
                              label={`v${document.version}`} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                              sx={{ fontSize: '0.7rem', height: 20 }} 
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {document.documentType?.name || document.type?.name || 'Non spécifié'}
                      </TableCell>
                      <TableCell>
                        {document.product?.name || (document.products && document.products.length > 0 ? document.products[0].name : 'Non spécifié')}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={document.status} />
                      </TableCell>
                      <TableCell>
                        {format(new Date(document.issueDate), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {formatFileSize(document.size)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {document.deletedAt ? (
                            <Tooltip title="Restaurer">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleRestore(document.id)}
                              >
                                <RefreshIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <>
                              <Tooltip title="Télécharger">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleDownload(document.id, document.fileName)}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Modifier le statut">
                                <IconButton 
                                  size="small" 
                                  color="info"
                                  onClick={() => handleStatusDialogOpen(document)}
                                >
                                  <UpdateIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Vérifier l'intégrité">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleCheckDialogOpen(document)}
                                >
                                  <VerifiedIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => openDeleteDialog(document)}
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
      )}

        {/* Dialog pour téléverser un document */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Téléverser un nouveau document
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Référence"
                  fullWidth
                  variant="outlined"
                  value={uploadForm.reference}
                  onChange={(e) => setUploadForm({ ...uploadForm, reference: e.target.value })}
                  helperText="Référence unique du document (3-50 caractères)"
                  required
                />
                <TextField
                  margin="dense"
                  label="Numéro de série"
                  fullWidth
                  variant="outlined"
                  value={uploadForm.serialNumber}
                  onChange={(e) => setUploadForm({ ...uploadForm, serialNumber: e.target.value })}
                  helperText="Numéro de série unique (3-50 caractères)"
                  required
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Produit</InputLabel>
                  <Select
                    value={uploadForm.productId}
                    onChange={(e) => setUploadForm({ ...uploadForm, productId: e.target.value })}
                    label="Produit"
                    required
                  >
                    {products.map(product => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Produit associé au document</FormHelperText>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Type de document</InputLabel>
                  <Select
                    value={uploadForm.documentTypeId}
                    onChange={(e) => setUploadForm({ ...uploadForm, documentTypeId: e.target.value })}
                    label="Type de document"
                    required
                  >
                    {documentTypes.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Type de document</FormHelperText>
                </FormControl>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <DatePicker
                  label="Date d'émission"
                  value={new Date(uploadForm.issueDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setUploadForm({
                        ...uploadForm,
                        issueDate: format(newValue, 'yyyy-MM-dd')
                      });
                    }
                  }}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      margin: 'dense',
                      required: true
                    } 
                  }}
                />
                <DatePicker
                  label="Date d'expiration (optionnel)"
                  value={uploadForm.expiryDate ? new Date(uploadForm.expiryDate) : null}
                  onChange={(newValue) => {
                    if (newValue) {
                      setUploadForm({
                        ...uploadForm,
                        expiryDate: format(newValue, 'yyyy-MM-dd')
                      });
                    } else {
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { expiryDate, ...rest } = uploadForm;
                      setUploadForm(rest);
                    }
                  }}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      margin: 'dense'
                    } 
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  margin="dense"
                  label="Version"
                  fullWidth
                  variant="outlined"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm({ 
                    ...uploadForm, 
                    version: parseInt(e.target.value) || 1
                  })}
                  required
                />
              </Box>
              
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Sélectionner un fichier
                  <input
                    type="file"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>
                {uploadForm.file && (
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 2,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InsertDriveFileIcon color="primary" />
                      <Typography variant="body2">
                        {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => setUploadForm({ ...uploadForm, file: null })}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button 
              onClick={handleUploadSubmit} 
              variant="contained"
              disabled={
                !uploadForm.reference.trim() ||
                uploadForm.reference.length < 3 ||
                uploadForm.reference.length > 50 ||
                !uploadForm.serialNumber.trim() ||
                uploadForm.serialNumber.length < 3 ||
                uploadForm.serialNumber.length > 50 ||
                !uploadForm.productId ||
                !uploadForm.documentTypeId ||
                !uploadForm.file
              }
              startIcon={<CloudUploadIcon />}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                }
              }}
            >
              Téléverser
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour changer le statut */}
        <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog} maxWidth="xs" fullWidth>
          <DialogTitle>
            Changer le statut du document
          </DialogTitle>
          <DialogContent>
            {documentToAction && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Document : {documentToAction.fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Statut actuel : <StatusChip status={documentToAction.status} />
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Nouveau statut</InputLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}
                    label="Nouveau statut"
                  >
                    <MenuItem value="DRAFT">Brouillon</MenuItem>
                    <MenuItem value="PUBLISHED">Publié</MenuItem>
                    <MenuItem value="ARCHIVED">Archivé</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStatusDialog}>Annuler</Button>
            <Button 
              onClick={handleStatusSubmit} 
              variant="contained"
              color="primary"
              disabled={!documentToAction || newStatus === documentToAction.status}
            >
              Mettre à jour le statut
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour vérifier le checksum */}
        <Dialog open={checkDocumentOpen} onClose={handleCloseCheckDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Vérifier l&apos;intégrité du document
          </DialogTitle>
          <DialogContent>
            {documentToAction && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Document : {documentToAction.fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cette vérification permet de s&apos;assurer que le fichier n&apos;a pas été altéré depuis son téléversement.
                </Typography>
                
                <TextField
                  margin="normal"
                  label="Checksum à vérifier"
                  fullWidth
                  variant="outlined"
                  value={checksumValue}
                  onChange={(e) => setChecksumValue(e.target.value)}
                  helperText="Entrez le checksum à vérifier (SHA-256)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                {checksumResult !== null && (
                  <Alert 
                    severity={checksumResult ? "success" : "error"} 
                    sx={{ mt: 2 }}
                    icon={checksumResult ? <CheckCircleIcon /> : <CancelIcon />}
                  >
                    {checksumResult 
                      ? "Le checksum est valide, le document est authentique." 
                      : "Le checksum est invalide, le document pourrait avoir été altéré."}
                  </Alert>
                )}
                
                <Box sx={{ mt: 2, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Checksum original :</strong> 
                    <Box component="span" sx={{ fontFamily: 'monospace', ml: 1 }}>
                      {documentToAction.checksum}
                    </Box>
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCheckDialog}>Fermer</Button>
            <Button 
              onClick={handleValidateChecksum} 
              variant="contained"
              color="primary"
              startIcon={<VerifiedIcon />}
              disabled={!checksumValue.trim()}
            >
              Vérifier
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour confirmer la suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
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
            {documentToAction && (
              <>
                <Typography variant="body1">
                  Êtes-vous sûr de vouloir supprimer ce document ?
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  {documentToAction.fileName}
                </Typography>
              </>
            )}
            <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note :</strong> Cette action effectuera une suppression réversible. Le document pourra être restauré ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
            <Button 
              onClick={handleCloseDeleteDialog} 
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

        {/* FAB pour mobile - uniquement visible si un produit est sélectionné */}
        {filterProductId && (
          <Fab
            color="primary"
            aria-label="Ajouter un document"
            onClick={handleAdd}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              display: { xs: 'flex', md: 'none' },
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              }
            }}
          >
            <CloudUploadIcon />
          </Fab>
        )}
      </Box>
    </LocalizationProvider>
  );
}
