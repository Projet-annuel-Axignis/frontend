import { People } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function UtilisateursPage() {
  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <People color="primary" />
            <Typography variant="h5" component="h2">
              Gestion des Utilisateurs
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Ici vous pouvez gérer tous les utilisateurs de la plateforme.
          </Typography>
          {/* TODO: Ajouter le contenu de gestion des utilisateurs */}
        </CardContent>
      </Card>
    </Box>
  );
} 