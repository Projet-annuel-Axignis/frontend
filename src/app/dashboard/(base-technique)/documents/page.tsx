'use client';

import { useState, useEffect } from 'react';
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
  Grid,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Update as UpdateIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  ProductDocument, 
  UploadProductDocumentRequest, 
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
  let label = status;

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
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [products] = useState<Product[]>([]);
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
  
  // Formulaire d'upload
  const [uploadForm, setUploadForm] = useState<UploadProductDocumentRequest>({
    reference: '',
    serialNumber: '',
    productId: '',
    documentTypeId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    version: 1,
    file: null as unknown as File
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
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getProductDocuments(
        page + 1, 
        rowsPerPage, 
        filterProductId || undefined, 
        filterDocumentTypeId || undefined,
        filterStatus || undefined,
        searchTerm, 
        showDeleted
      );
      setDocuments(response.results || []);
      setTotal(response.totalResults || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des documents',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Chargement des types de documents pour les filtres et le formulaire
  const loadDocumentTypes = async () => {
    try {
      const response = await equipmentService.getDocumentTypes(1, 100);
      setDocumentTypes(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types de documents:', error);
    }
  };

  // Méthode pour charger la liste des produits (à implémenter)
  // Cette fonction serait utilisée pour charger les produits à partir de l'API
  // const loadProducts = async () => {
  //   try {
  //     // À implémenter: appel à l'API pour récupérer les produits
  //     // const response = await productService.getProducts(1, 100);
  //     // setProducts(response.results || []);
  //   } catch (error) {
  //     console.error('Erreur lors du chargement des produits:', error);
  //   }
  // };

  // Appels initiaux
  useEffect(() => {
    loadDocuments();
    loadDocumentTypes();
    // loadProducts(); // À activer quand l'API sera disponible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filterProductId, filterDocumentTypeId, filterStatus, searchTerm, showDeleted]);

  // Gestion du formulaire d'upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadForm({
        ...uploadForm,
        file: event.target.files[0]
      });
    }
  };

  const handleUploadSubmit = async () => {
    try {
      setLoading(true);
      await equipmentService.uploadProductDocument(uploadForm);
      setSnackbar({
        open: true,
        message: 'Document téléversé avec succès',
        severity: 'success'
      });
      handleCloseDialog();
      loadDocuments();
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
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du téléchargement du document',
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
    } catch (error) {
      console.error('Erreur lors de la validation du checksum:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la validation du checksum',
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
      productId: '',
      documentTypeId: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      version: 1,
      file: null as unknown as File
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

  const resetFilters = () => {
    setFilterProductId('');
    setFilterDocumentTypeId('');
    setFilterStatus('');
    setSearchTerm('');
    setPage(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
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
            Documents produits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les documents associés à vos produits (manuels, fiches techniques, certificats...)
          </Typography>
        </Box>

        {/* Statistiques */}
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
                      Documents produits
                    </Typography>
                  </Box>
                  <InsertDriveFileIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Barre d'outils et filtres */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 2, alignItems: {xs: 'stretch', md: 'center'}, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ minWidth: {xs: '100%', md: 220} }}
            />
            
            <FormControl size="small" sx={{ minWidth: {xs: '100%', md: 200} }}>
              <InputLabel>Produit</InputLabel>
              <Select
                value={filterProductId}
                onChange={(e) => setFilterProductId(e.target.value)}
                label="Produit"
              >
                <MenuItem value="">Tous les produits</MenuItem>
                {/* Idéalement, cette liste serait alimentée par une requête API */}
                {products.map(product => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: {xs: '100%', md: 200} }}>
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
            
            <FormControl size="small" sx={{ minWidth: {xs: '100%', md: 150} }}>
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
                py: 0.5,
                minWidth: {xs: '100%', md: 'auto'}
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Inclure les supprimés
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
              onClick={resetFilters}
              startIcon={<RefreshIcon />}
              sx={{ minWidth: {xs: '100%', md: 'auto'} }}
            >
              Réinitialiser les filtres
            </Button>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                },
                minWidth: {xs: '100%', md: 'auto'}
              }}
            >
              Téléverser un document
            </Button>
          </Box>
        </Paper>

        {/* Table */}
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
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun document trouvé
                      </Typography>
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
                        {document.documentType?.name || 'Non spécifié'}
                      </TableCell>
                      <TableCell>
                        {document.product?.name || 'Non spécifié'}
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

        {/* Dialog pour téléverser un document */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Téléverser un nouveau document
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12}>
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
                      onClick={() => setUploadForm({ ...uploadForm, file: null as unknown as File })}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                )}
              </Grid>
            </Grid>
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
              disabled={documentToAction && newStatus === documentToAction.status}
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

        {/* FAB pour mobile */}
        <Fab
          color="primary"
          aria-label="Téléverser un document"
          onClick={handleAdd}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
            display: { xs: 'flex', md: 'none' }
          }}
        >
          <CloudUploadIcon />
        </Fab>
      </Box>
    </LocalizationProvider>
  );
}
