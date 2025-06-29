'use client';

import { getFullAddress } from '@/services/siteService';
import { Site } from '@/types/site';
import {
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React from 'react';

interface SiteCardProps {
  site: Site;
  companyName?: string;
  onView: (site: Site) => void;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  onRestore?: (site: Site) => void;
}

const SiteCard: React.FC<SiteCardProps> = ({
  site,
  companyName,
  onView,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    onView(site);
    handleClose();
  };

  const handleEdit = () => {
    onEdit(site);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(site);
    handleClose();
  };

  const handleRestore = () => {
    if (onRestore) {
      onRestore(site);
    }
    handleClose();
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isDeleted = !!site.deletedAt;

  return (
    <Card
      sx={{
        mb: 2,
        opacity: isDeleted ? 0.6 : 1,
        border: isDeleted ? '1px solid' : 'none',
        borderColor: isDeleted ? 'error.main' : 'transparent',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          {/* Avatar */}
          <Avatar
            sx={{
              bgcolor: isDeleted ? 'error.main' : 'primary.main',
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            {getInitials(site.name)}
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 0.5,
                textDecoration: isDeleted ? 'line-through' : 'none',
              }}
            >
              {site.name}
            </Typography>

            {/* Company */}
            {companyName && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {companyName}
                </Typography>
              </Box>
            )}

            {/* Address */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary', mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary">
                {getFullAddress(site)}
              </Typography>
            </Box>

            {/* Reference */}
            {site.reference && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Réf: {site.reference}
              </Typography>
            )}

            {/* Status */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {isDeleted && (
                <Chip
                  label="Supprimé"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Actions Menu */}
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          Voir détails
        </MenuItem>

        {!isDeleted && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} />
            Modifier
          </MenuItem>
        )}

        {isDeleted && onRestore ? (
          <MenuItem onClick={handleRestore}>
            <RestoreIcon sx={{ mr: 1 }} />
            Restaurer
          </MenuItem>
        ) : (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Supprimer
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default SiteCard; 