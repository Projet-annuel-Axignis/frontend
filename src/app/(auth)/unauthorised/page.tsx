'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { Lock } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/joy';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnauthorisedPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-red-900/10
      to-orange-900/5
      p-4
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

        <Typography level="h1" className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          401
        </Typography>

        <Typography level="h3" className="text-xl mb-2 text-gray-900 dark:text-white">
          {t('error_unauthorised.unauthorised_title')}
        </Typography>

        <Typography className="mb-8 text-gray-600 dark:text-gray-400">
          {t('error_unauthorised.unauthorised_message')}
        </Typography>

        <Box className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
          <Button
            variant="solid"
            color="danger"
            onClick={() => router.back()}
          >
            {t('common.go_back')}
          </Button>

          <Link href="/" passHref>
            <Button
              variant="outlined"
              color="neutral"
            >
              {t('common.home')}
            </Button>
          </Link>
        </Box>
      </Box>
    </div>
  );
} 