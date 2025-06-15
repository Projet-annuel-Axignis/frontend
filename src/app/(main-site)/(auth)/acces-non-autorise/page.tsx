import ButtonBack from '@/components/commons/ButtonBack';
import { Lock } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Axignis - Sécurité incendie et accessibilité des bâtiments - Page non autorisée",
};

export default function UnauthorisedPage() {
  const t = useTranslations();

  return (
    <div className="
      bg-white dark:bg-gray-900
      min-h-screen
      flex
      items-center
      justify-center
      p-4
      pt-5
    ">
      <Box
        className="
          max-w-lg
          w-full
          text-center
          p-8
          md:p-12
          bg-white
          dark:bg-gray-800
          rounded-xl
          shadow-sm
          border
          border-red-100
          dark:border-red-900/20
        "
      >
        <Box
          className="
            w-20
            h-20
            mx-auto
            mb-6
            rounded-full
            bg-red-100
            dark:bg-red-900/20
            flex
            items-center
            justify-center
          "
        >
          <Lock
            className="
              text-red-600
              dark:text-red-400
              text-4xl
            "
          />
        </Box>

        <Typography variant="h1" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          401
        </Typography>

        <Typography variant="h3" className="text-xl mb-2 text-gray-900 dark:text-white">
          {t('error_pages.error_unauthorised.unauthorised_title')}
        </Typography>

        <Typography className="mb-8 text-gray-600 dark:text-gray-400">
          {t('error_pages.error_unauthorised.unauthorised_message')}
        </Typography>

        <Box className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
          <ButtonBack>
            {t('common.go_back')}
          </ButtonBack>

          <Link href="/" passHref>
            <Button
              variant="outlined"
              color="inherit"
            >
              {t('common.home')}
            </Button>
          </Link>
        </Box>
      </Box>
    </div>
  );
} 