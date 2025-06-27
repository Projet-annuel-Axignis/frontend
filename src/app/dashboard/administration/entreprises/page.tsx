'use client';

import { useToast } from '@/app/_providers/ToastProvider';
import Loading from '@/components/ui/Loading';
import Pagination from '@/components/ui/Pagination';
import { useLoading } from '@/hooks/useLoading';
import companyService from '@/services/companyService';
import { Company } from '@/types/company';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import CompanyCard from './CompanyCard';
import CompanyDialog from './CompanyDialog';
import CompanyFiltersComponent from './CompanyFilters';
import CompanyTable from './CompanyTable';

interface CompanyUpdateData {
  name?: string;
  siretNumber?: string;
  planId?: number;
}

interface CompanyFilters {
  search: string;
  includeDeleted: boolean;
}

export default function EntreprisesPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    includeDeleted: false,
  });
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const { isLoading, withLoading } = useLoading();
  const { showToast } = useToast();

  // Fonction de filtrage côté client (comme pour les utilisateurs)
  const filterCompanies = (companies: Company[], filters: CompanyFilters): Company[] => {
    return companies.filter(company => {
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!company.name.toLowerCase().includes(searchLower) &&
          !company.siretNumber.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtre par état (supprimé ou non)
      if (!filters.includeDeleted && company.deletedAt) {
        return false;
      }

      return true;
    });
  };

  // Chargement des entreprises (une seule fois, sans filtres dans l'URL)
  const loadCompanies = useCallback(async () => {
    try {
      setError('');
      // Charger TOUTES les entreprises (y compris supprimées) une seule fois
      const response = await withLoading(() => companyService.getCompanies({
        includeDeleted: true,
        limit: 1000 // Récupérer toutes les entreprises
      }));

      setAllCompanies(response.companies || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des entreprises';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setAllCompanies([]);
    }
  }, [withLoading, showToast]);

  // Chargement initial
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Gestion des filtres (comme pour les utilisateurs)
  const handleFiltersChange = (newFilters: CompanyFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset à la première page lors du changement de filtres
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Appliquer les filtres et la pagination (comme pour les utilisateurs)
  const filteredCompanies = filterCompanies(allCompanies, filters);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion de l'édition
  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setDialogOpen(true);
  };

  const handleSave = async (companyData: CompanyUpdateData) => {
    try {
      if (selectedCompany) {
        // Mise à jour
        await companyService.updateCompany(selectedCompany.id, companyData);
        showToast('Entreprise mise à jour avec succès', 'success');
      } else {
        // Création
        await companyService.createCompany(companyData as any);
        showToast('Entreprise créée avec succès', 'success');
      }

      await loadCompanies(); // Recharger la liste
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde';
      throw new Error(errorMessage);
    }
  };

  // Gestion de la suppression/restauration
  const handleDelete = async (company: Company) => {
    try {
      const result = await companyService.toggleCompanyState(company.id);

      // Afficher le message retourné par l'API
      if (result.message === 'Company archived') {
        showToast('Entreprise supprimée avec succès', 'success');
      } else if (result.message === 'Company restored') {
        showToast('Entreprise restaurée avec succès', 'success');
      } else {
        showToast(result.message, 'success');
      }

      await loadCompanies(); // Recharger la liste
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'opération';
      showToast(errorMessage, 'error');
    }
  };

  if (isLoading && allCompanies.length === 0) {
    return (
      <Loading
        message="Chargement des entreprises..."
        variant="page"
        size="medium"
      />
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <BusinessIcon color="primary" sx={{ fontSize: '2rem' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" fontWeight="600">
                Gestion des Entreprises
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredCompanies.length} entreprise{filteredCompanies.length > 1 ? 's' : ''} trouvée{filteredCompanies.length > 1 ? 's' : ''}
                {filteredCompanies.length !== allCompanies.length && ` sur ${allCompanies.length} au total`}
              </Typography>
            </Box>

            {/* Boutons - Version Desktop */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadCompanies}
                disabled={isLoading}
                size="small"
              >
                Actualiser
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                sx={{
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                  },
                }}
              >
                Nouvelle entreprise
              </Button>
            </Box>

            {/* Boutons - Version Mobile (icônes seulement) */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
              <Button
                variant="outlined"
                onClick={loadCompanies}
                disabled={isLoading}
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                <RefreshIcon fontSize="small" />
              </Button>
              <Button
                variant="contained"
                onClick={handleCreate}
                size="small"
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filtres */}
          <CompanyFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Table des entreprises - Vue Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <CompanyTable
              companies={paginatedCompanies}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={isLoading}
            />
          </Box>

          {/* Vue Mobile - Cards */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {paginatedCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Box>

          {/* Pagination */}
          {filteredCompanies.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCompanies.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}

          {/* Loading overlay pour les actions */}
          {isLoading && allCompanies.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Loading
                message="Chargement..."
                variant="component"
                size="small"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour création/édition */}
      <CompanyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        company={selectedCompany}
        onSave={handleSave}
      />
    </Box>
  );
} 