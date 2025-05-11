'use client';

import { useUser } from '@/app/_providers';
import { Email, Key, Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, FormControl, IconButton, Input, Typography } from '@mui/joy';

import { Field, Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import * as Yup from 'yup';

// Schéma de validation
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
});

export default function LoginForm() {
  const { login, isLoading, error } = useUser();
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      paddingTop: '40px'
    }}>
      {/* Image de fond */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'grey.600',
        zIndex: 0
      }}>
        <Image
          src="/images/backgrounds/building-facade.jpg"
          alt="Façade de bâtiment moderne"
          fill
          priority
          style={{
            objectFit: 'cover',
            opacity: 0.5,
            mixBlendMode: 'overlay'
          }}
        />
      </Box>
      {/* Contenu du formulaire */}
      <Container maxWidth="sm" sx={{
        py: 8,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography level="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('common.login')}
          </Typography>
          <Typography level="body-sm" color="primary">
            {t('auth.login_instructions')}
          </Typography>
        </Box>

        {error && (
          <Alert
            color='danger'
            sx={{
              mb: 3,
              '& .MuiAlert-message': {
                fontWeight: 'medium'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            await login(values.email, values.password);
          }}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
              <Box mb={3}>
                <FormControl id="email">
                  <Input
                    fullWidth
                    name="email"
                    type="email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.email && touched.email)}
                    startDecorator={<Email color='action' />}
                  />
                </FormControl>
              </Box>

              <Box mb={3}>
                <FormControl id="password">
                  <Input
                    fullWidth
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.password && touched.password)}
                    startDecorator={<Key />}
                    endDecorator={<IconButton
                      onClick={handleTogglePasswordVisibility}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>}
                  />

                </FormControl>
              </Box>

              <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Field
                    type="checkbox"
                    name="remember"
                    id="remember"
                    className="h-4 w-4 mr-2"
                  />
                  <Typography component="label" htmlFor="remember">
                    {t('auth.remember_me')}
                  </Typography>
                </Box>
                <Link href="/forgot-password" passHref>
                  <Typography
                    component="span"
                    color="primary"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {t('auth.forgot_password')}
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="solid"
                color="primary"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontWeight: 'medium',
                  fontSize: '1rem'
                }}
              >
                {isLoading ? (
                  <CircularProgress size="sm" color="neutral" />
                ) : (
                  t('auth.login_button')
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <Box mt={4} textAlign="center">
          <Typography level="body-sm" color="neutral">
            {t('auth.no_account')}{' '}
            <Link href="/demande-devis-souscription" passHref>
              <Typography
                level="body-sm"
                component="span"
                color="primary"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 'medium',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {t('auth.create_account')}
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 