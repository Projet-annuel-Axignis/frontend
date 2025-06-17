'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashBoardHeader from "@/components/dashboard/DashBoardHeader";
import { AdminPanelSettings } from "@mui/icons-material";
import { Box, Paper, Tab, Tabs, useTheme } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = [
  { label: "Utilisateurs", value: "utilisateurs" },
  { label: "Entreprises", value: "entreprises" },
  { label: "Données", value: "donnees" }
];

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  // Détermine l'onglet actuel basé sur l'URL
  useEffect(() => {
    const currentPath = pathname.split('/').pop();
    const tabIndex = tabs.findIndex(tab => tab.value === currentPath);
    if (tabIndex !== -1) {
      setCurrentTab(tabIndex);
    }
  }, [pathname]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    const selectedTab = tabs[newValue];
    router.push(`/dashboard/administration/${selectedTab.value}`);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
      {/* Header */}
      <DashBoardHeader
        title="Administration"
        icon={<AdminPanelSettings />}
      />

      {/* Tabs Container */}
      <Paper
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[3],
        }}
        elevation={0}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="administration tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            background: `linear-gradient(135deg, var(--color-axignis-primary)10, var(--color-axignis-secondary)10)`,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'flex-start',
            },
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'var(--transition-normal)',
              '&:hover': {
                color: 'var(--color-axignis-primary)',
              },
              '&.Mui-selected': {
                color: 'var(--color-axignis-primary)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-axignis-primary)',
              height: 3,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={tab.value} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>

        {/* Contenu de la page */}
        <Box>
          {children}
        </Box>
      </Paper>
    </ProtectedRoute>
  );
} 