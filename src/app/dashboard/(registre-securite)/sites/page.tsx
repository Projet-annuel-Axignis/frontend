'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useLoading } from '@/hooks/useLoading';
import companyService from '@/services/companyService';
import { siteService } from '@/services/siteService';
import { Company } from '@/types/company';
import { CreateSiteDto, Site, UpdateSiteDto } from '@/types/site';
import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SiteCard from './components/SiteCard';
import SiteDialog from './components/SiteDialog';
import SiteFilters from './components/SiteFilters';
import SiteTable from './components/SiteTable';

const SitesPage = () => {
  const router = useRouter();
  const { isLoading: loading, withLoading } = useLoading();

  // Data states
  const [sites, setSites] = useState<Site[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyNames, setCompanyNames] = useState<Record<number, string>>({});

  // Filter states
  const [search, setSearch] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await withLoading(async () => {
      try {
        // Load companies first
        const companiesResult = await companyService.getCompanies({
          includeDeleted: false
        });
        setCompanies(companiesResult.companies);

        // Create company names mapping
        const namesMap: Record<number, string> = {};
        companiesResult.companies.forEach((company: Company) => {
          namesMap[company.id] = company.name;
        });
        setCompanyNames(namesMap);

        // Load sites
        await loadSites();
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Erreur lors du chargement des données', 'error');
      }
    });
  };

  const loadSites = async () => {
    try {
      const result = await siteService.getSites({
        companyId: selectedCompany?.id,
        includeDeleted,
        search,
      });
      setSites(result.sites);
    } catch (error) {
      console.error('Error loading sites:', error);
      showNotification('Erreur lors du chargement des sites', 'error');
    }
  };

  // Reload sites when filters change
  useEffect(() => {
    if (companies.length > 0) {
      loadSites();
    }
  }, [selectedCompany, includeDeleted, search, companies.length]);

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateSite = () => {
    setEditingSite(null);
    setDialogOpen(true);
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setDialogOpen(true);
  };

  const handleViewSite = (site: Site) => {
    router.push(`/dashboard/sites/${site.id}`);
  };

  const handleDeleteSite = (site: Site) => {
    setSiteToDelete(site);
    setDeleteDialogOpen(true);
  };

  const handleRestoreSite = async (site: Site) => {
    await withLoading(async () => {
      try {
        await siteService.updateSiteState(site.id);
        await loadSites();
        showNotification('Site restauré avec succès', 'success');
      } catch (error) {
        console.error('Error restoring site:', error);
        showNotification('Erreur lors de la restauration du site', 'error');
      }
    });
  };

  const confirmDeleteSite = async () => {
    if (!siteToDelete) return;

    await withLoading(async () => {
      try {
        await siteService.updateSiteState(siteToDelete.id);
        await loadSites();
        showNotification('Site supprimé avec succès', 'success');
        setDeleteDialogOpen(false);
        setSiteToDelete(null);
      } catch (error) {
        console.error('Error deleting site:', error);
        showNotification('Erreur lors de la suppression du site', 'error');
      }
    });
  };

  const handleSubmitSite = async (data: CreateSiteDto | UpdateSiteDto) => {
    await withLoading(async () => {
      try {
        if (editingSite) {
          // Update existing site
          await siteService.updateSite(editingSite.id, data as UpdateSiteDto);
          showNotification('Site modifié avec succès', 'success');
        } else {
          // Create new site
          await siteService.createSite(data as CreateSiteDto);
          showNotification('Site créé avec succès', 'success');
        }

        await loadSites();
        setDialogOpen(false);
        setEditingSite(null);
      } catch (error) {
        console.error('Error submitting site:', error);
        throw error; // Let the dialog handle the error display
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setIncludeDeleted(false);
    setSelectedCompany(null);
  };

  // Filter sites based on current filters
  const filteredSites = sites.filter(site => {
    if (!includeDeleted && site.deletedAt) return false;
    if (selectedCompany && site.companyId !== selectedCompany.id) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        site.name.toLowerCase().includes(searchLower) ||
        site.street.toLowerCase().includes(searchLower) ||
        site.city.toLowerCase().includes(searchLower) ||
        site.reference?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <DashBoardHeader
        title="Sites"
        icon={<BusinessIcon />}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateSite}
          disabled={loading}
        >
          Nouveau site
        </Button>
      </DashBoardHeader>

      {/* Filters */}
      <SiteFilters
        search={search}
        onSearchChange={setSearch}
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={setIncludeDeleted}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        companies={companies}
        onReset={handleResetFilters}
      />

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} trouvé{filteredSites.length !== 1 ? 's' : ''}
          {selectedCompany && ` pour ${selectedCompany.name}`}
        </Typography>
      </Box>

      {/* Desktop Table View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SiteTable
          sites={filteredSites}
          companyNames={companyNames}
          onView={handleViewSite}
          onEdit={handleEditSite}
          onDelete={handleDeleteSite}
          onRestore={handleRestoreSite}
        />
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            companyName={companyNames[site.companyId]}
            onView={handleViewSite}
            onEdit={handleEditSite}
            onDelete={handleDeleteSite}
            onRestore={handleRestoreSite}
          />
        ))}

        {filteredSites.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BusinessIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucun site trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search || selectedCompany
                ? 'Aucun site ne correspond à vos critères de recherche.'
                : 'Commencez par créer votre premier site.'
              }
            </Typography>
          </Box>
        )}
      </Box>

      {/* Site Dialog */}
      <SiteDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingSite(null);
        }}
        onSubmit={handleSubmitSite}
        site={editingSite}
        companies={companies}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSiteToDelete(null);
        }}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le site &quot;{siteToDelete?.name}&quot; ?
            Cette action peut être annulée en restaurant le site depuis les filtres.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSiteToDelete(null);
            }}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteSite}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SitesPage;