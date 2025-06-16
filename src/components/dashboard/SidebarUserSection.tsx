'use client';

import { useUser } from '@/app/_providers/Providers';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Avatar, Box, IconButton, styled, Typography } from '@mui/material';

const StyledUserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.action.hover,
  transition: 'var(--transition-normal)',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const SidebarUserSection = () => {
  const { user, logout } = useUser();
  return (
    <StyledUserSection>
      <Avatar
        sx={{
          width: 36,
          height: 36,
          border: '2px solid var(--color-axignis-primary)',
        }}
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="body2" fontWeight="600" noWrap>
          {user?.firstName ? `${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1)}` : ''} {user?.lastName ? `${user.lastName.charAt(0).toUpperCase()}${user.lastName.slice(1)}` : ''}
        </Typography>
        <Typography variant="caption" color="textSecondary" noWrap>
          {user?.role?.name || ''}
        </Typography>
      </Box>
      <IconButton
        size="small"
        color="inherit"
        sx={{
          color: 'var(--color-axignis-primary)',
          '&:hover': {
            backgroundColor: 'var(--color-axignis-primary)',
            color: 'white',
          },
        }}
        onClick={logout}
      >
        <LogoutRoundedIcon fontSize="small" />
      </IconButton>
    </StyledUserSection>
  )
}

export default SidebarUserSection