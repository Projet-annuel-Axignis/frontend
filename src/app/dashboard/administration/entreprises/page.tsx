import { Business } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function EntreprisesPage() {
  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Business color="primary" />
            <Typography variant="h5" component="h2">
              Gestion des Entreprises
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Ici vous pouvez gérer toutes les entreprises partenaires.
          </Typography>
          {/* TODO: Ajouter le contenu de gestion des entreprises */}
        </CardContent>
      </Card>
    </Box>
  );
} 