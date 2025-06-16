import { Storage } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function DonneesPage() {
  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Storage color="primary" />
            <Typography variant="h5" component="h2">
              Gestion des Données
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Ici vous pouvez gérer les données de la plateforme, imports/exports, etc.
          </Typography>
          {/* TODO: Ajouter le contenu de gestion des données */}
        </CardContent>
      </Card>
    </Box>
  );
} 