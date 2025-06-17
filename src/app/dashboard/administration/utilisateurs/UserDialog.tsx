'use client';

import { User, UserRoleType, UserUpdateDto } from '@/types/auth';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface UserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: UserUpdateDto) => Promise<void>;
  loading?: boolean;
}

export default function UserDialog({ open, user, onClose, onSave, loading = false }: UserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleType: UserRoleType.COMPANY_MEMBER,
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        confirmPassword: '',
        roleType: user.role.type,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleType: UserRoleType.COMPANY_MEMBER,
      });
    }
    setError('');
  }, [user, open]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setError('');

      // Validation basique
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setError('Tous les champs obligatoires doivent être remplis');
        return;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Format d\'email invalide');
        return;
      }

      // Validation mot de passe pour création
      if (!user) {
        if (!formData.password || !formData.confirmPassword) {
          setError('Le mot de passe et sa confirmation sont obligatoires');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }
        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
      }

      const userData: UserUpdateDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.roleType,
      };

      // Ajouter les mots de passe seulement pour la création
      if (!user) {
        userData.password = formData.password;
        userData.confirmPassword = formData.confirmPassword;
      }

      await onSave(userData);

      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const getRoleLabel = (roleType: UserRoleType) => {
    switch (roleType) {
      case UserRoleType.ADMINISTRATOR:
        return 'Administrateur';
      case UserRoleType.COMPANY_ADMINISTRATOR:
        return 'Administrateur Entreprise';
      case UserRoleType.COMPANY_MANAGER:
        return 'Manager Entreprise';
      case UserRoleType.COMPANY_MEMBER:
        return 'Membre Entreprise';
      case UserRoleType.VISITOR:
        return 'Visiteur';
      default:
        return roleType;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[8],
          }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }} component="div">
        <Typography variant="h5" component="h2" fontWeight="600">
          {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </Typography>
        {user && (
          <Typography variant="body2" color="textSecondary">
            ID: {user.id}
          </Typography>
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Informations personnelles */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Informations personnelles
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Prénom"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nom"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
              disabled={loading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              disabled={loading}
            />
          </Grid>

          {/* Mots de passe (seulement pour création) */}
          {!user && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Confirmer le mot de passe"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
            </>
          )}

          {/* Paramètres du compte */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
              Paramètres du compte
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={formData.roleType}
                label="Rôle"
                onChange={(e) => handleChange('roleType', e.target.value)}
              >
                {Object.values(UserRoleType).map((roleType) => (
                  <MenuItem key={roleType} value={roleType}>
                    {getRoleLabel(roleType)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Informations système (lecture seule) */}
          {user && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Informations système
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Date de création"
                  value={new Date(user.createdAt).toLocaleString('fr-FR')}
                  disabled
                  variant="filled"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Dernière modification"
                  value={new Date(user.updatedAt).toLocaleString('fr-FR')}
                  disabled
                  variant="filled"
                />
              </Grid>

              {user.deletedAt && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Date de suppression"
                    value={new Date(user.deletedAt).toLocaleString('fr-FR')}
                    disabled
                    variant="filled"
                    color="error"
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 