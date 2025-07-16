'use client';


import { equipmentService } from '@/services/equipmentService';
import { EquipmentType } from '@/types/equipment';
import { CreateReportDto, Organization, OrganizationType, ReportType } from '@/types/intervention';
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

// Type pour les options de topologie
type TopologyCode = {
  code: string;
  label: string;
  description: string;
};

// Predefined options for typology codes
const TOPOLOGY_CODES: TopologyCode[] = [
  { code: 'ERP', label: 'ERP', description: 'Établissement Recevant du Public' },
  { code: 'IGH', label: 'IGH', description: 'Immeuble de Grande Hauteur' },
  { code: 'BUP', label: 'BUP', description: 'Bâtiment à Utilisation Professionnelle' },
  { code: 'HAB', label: 'HAB', description: 'Bâtiment d\'Habitation' },
];

const organizationTypeLabels: Record<OrganizationType, string> = {
  OA: 'Organisme Agréé',
  TC: 'Tiers Compétent'
};

const organizationTypeColors: Record<OrganizationType, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  OA: 'primary',
  TC: 'secondary'
};

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReportDto) => Promise<void>;
  reportTypes: ReportType[];
  organizations: Organization[];
  interventionId: number;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  onSubmit,
  reportTypes,
  organizations,
  interventionId
}) => {
  const [formData, setFormData] = React.useState<CreateReportDto>({
    label: '',
    typeCode: '',
    organizationId: 0,
    typologyCode: '',
    interventionId: interventionId,
    partIds: [],
    fileIds: [],
    equipmentIds: []
  });

  const [loading, setLoading] = React.useState(false);
  const [equipmentTypes, setEquipmentTypes] = React.useState<EquipmentType[]>([]);

  // Load equipment types when dialog opens
  React.useEffect(() => {
    if (open) {
      loadEquipmentTypes();
    }
  }, [open]);

  const loadEquipmentTypes = async () => {
    try {
      const result = await equipmentService.getTypes();
      setEquipmentTypes(result.results);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'équipements:', error);
    }
  };

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        label: '',
        typeCode: '',
        organizationId: 0,
        typologyCode: '',
        interventionId: interventionId,
        partIds: [],
        fileIds: [],
        equipmentIds: []
      });
    }
  }, [open, interventionId]);

  const handleFieldChange = (field: keyof CreateReportDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.label || !formData.typeCode || !formData.organizationId || !formData.typologyCode) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.label && formData.typeCode && formData.organizationId && formData.typologyCode;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon color="primary" />
          Créer un nouveau rapport
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <TextField
            label="Libellé *"
            value={formData.label}
            onChange={(e) => handleFieldChange('label', e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Entrez le libellé du rapport..."
            disabled={loading}
          />

          <Autocomplete
            multiple
            options={equipmentTypes || []}
            getOptionLabel={(option: EquipmentType) => `${option.title} (${option.family?.name})`}
            value={equipmentTypes?.filter(type => formData.equipmentIds?.includes(Number(type.id))) || []}
            onChange={(_, newValue) => {
              const equipmentIds = newValue.map((type: EquipmentType) => Number(type.id));
              handleFieldChange('equipmentIds', equipmentIds);
            }}
            disabled={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Types d'équipements"
                variant="outlined"
                placeholder="Sélectionner les types d'équipements..."
              />
            )}
            renderValue={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={`${option.title}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))
            }
            renderOption={(props: any, option: EquipmentType) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {option.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.family?.name}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          <Autocomplete<ReportType>
            options={reportTypes || []}
            getOptionLabel={(option: ReportType) => `${option.name} (${option.code})`}
            value={reportTypes?.find(type => type.code === formData.typeCode) || null}
            onChange={(_, newValue: ReportType | null) => handleFieldChange('typeCode', newValue?.code || '')}
            disabled={loading}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Type de rapport *"
                variant="outlined"
                placeholder="Sélectionnez un type..."
              />
            )}
            renderOption={(props: any, option: ReportType) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Code: {option.code} • Périodicité: {option.periodicity}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          <Autocomplete<Organization>
            options={organizations || []}
            getOptionLabel={(option: Organization) => `${option.name} (${organizationTypeLabels[option.type]})`}
            value={organizations?.find(org => org.id === formData.organizationId) || null}
            onChange={(_, newValue: Organization | null) => handleFieldChange('organizationId', newValue?.id || 0)}
            disabled={loading}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Organisation *"
                variant="outlined"
                placeholder="Sélectionnez une organisation..."
              />
            )}
            renderOption={(props: any, option: Organization) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {option.name}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={organizationTypeLabels[option.type]}
                    color={organizationTypeColors[option.type]}
                    variant="outlined"
                  />
                </Box>
              </Box>
            )}
          />

          <Autocomplete<TopologyCode>
            options={TOPOLOGY_CODES || []}
            getOptionLabel={(option: TopologyCode) => `${option.code} - ${option.description}`}
            value={TOPOLOGY_CODES?.find(typo => typo.code === formData.typologyCode) || null}
            onChange={(_, newValue: TopologyCode | null) => handleFieldChange('typologyCode', newValue?.code || '')}
            disabled={loading}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label="Typologie *"
                variant="outlined"
                placeholder="Sélectionnez une typologie..."
              />
            )}
            renderOption={(props: any, option: TopologyCode) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {option.code}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            )}
          />

          <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Information :</strong> Les champs marqués d&apos;un astérisque (*) sont obligatoires.
              Les parties et fichiers pourront être associés après la création du rapport.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!isFormValid || loading}
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          {loading ? 'Création...' : 'Créer le rapport'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog; 