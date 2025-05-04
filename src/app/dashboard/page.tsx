'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useTranslation } from '@/i18n/useTranslation';
import { useUser } from '@/lib/contexts/UserContext';
import { AccountCircle, ExitToApp, Person } from '@mui/icons-material';
import { Avatar, Box, Button, Card, Divider, Grid, Sheet, Stack, Typography } from '@mui/joy';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/connexion');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Sheet
          className="
            max-w-7xl 
            mx-auto 
            p-6 
            md:p-10 
            rounded-xl 
            shadow-sm
          "
        >
          <Box className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Box>
              <Typography level="h2" className="mb-2">
                {t('dashboard.welcome')}, {user?.firstName} {user?.lastName}
              </Typography>
              <Typography color="neutral" className="text-gray-600">
                {t('dashboard.welcome_message')}
              </Typography>
            </Box>
            <Button
              variant="soft"
              color="danger"
              startDecorator={<ExitToApp />}
              onClick={handleLogout}
            >
              {t('dashboard.logout')}
            </Button>
          </Box>

          <Divider className="mb-8" />

          <Grid container spacing={4}>
            <Grid xs={12} md={4}>
              <Card className="p-6 h-full">
                <Stack spacing={3} className="h-full">
                  <Box className="flex justify-center mb-4">
                    <Avatar
                      size="lg"
                      className="h-24 w-24 text-3xl"
                    >
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </Avatar>
                  </Box>

                  <Box className="text-center">
                    <Typography level="h4">
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography color="neutral">
                      {user?.email}
                    </Typography>
                  </Box>

                  <Box className="mt-2">
                    <Stack className="gap-2 text-sm">
                      <Box className="flex justify-between">
                        <Typography className="font-semibold">{t('dashboard.user_id')}</Typography>
                        <Typography>{user?.id}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography className="font-semibold">{t('dashboard.role')}</Typography>
                        <Typography>{user?.role}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography className="font-semibold">{t('dashboard.email_verified')}</Typography>
                        <Typography>{user?.isEmailVerified ? t('common.yes') : t('common.no')}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography className="font-semibold">{t('dashboard.joined')}</Typography>
                        <Typography>{new Date(user?.createdAt || '').toLocaleDateString()}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box className="mt-auto pt-4">
                    <Button
                      fullWidth
                      variant="outlined"
                      color="neutral"
                      startDecorator={<Person />}
                      onClick={() => router.push('/profile')}
                    >
                      {t('dashboard.edit_profile')}
                    </Button>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} md={8}>
              <Card className="p-6 h-full">
                <Typography level="h3" className="mb-4">
                  {t('dashboard.activity')}
                </Typography>

                <Box className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <AccountCircle className="text-gray-400 text-6xl mb-4 mx-auto" />
                  <Typography level="h4" className="mb-2">
                    {t('dashboard.no_activity')}
                  </Typography>
                  <Typography className="text-gray-600 mb-4">
                    {t('dashboard.activity_empty_message')}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Sheet>
      </div>
    </ProtectedRoute>
  );
} 