import { Box, Skeleton, Paper } from '@mui/material';

export default function DomainesLoading() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} />
      </Box>

      {/* Statistiques Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="rectangular" width={280} height={120} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Barre d'outils Skeleton */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="rectangular" width={250} height={40} sx={{ borderRadius: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Paper>

      {/* Table Skeleton */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 1 }} />
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" height={72} sx={{ mb: 1 }} />
          ))}
        </Box>
      </Paper>
    </Box>
  );
} 