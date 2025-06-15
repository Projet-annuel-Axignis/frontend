'use client';

import { useUser } from '@/app/_providers';
import { Email, Key, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
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

  // Détection du mode sombre du système
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: prefersDarkMode
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontWeight: 'bold',
            }}>
              {t('common.login')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {t('auth.login_instructions')}
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
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
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.email && touched.email)}
                    helperText={(errors.email && touched.email) ? errors.email : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Mot de passe"
                    variant="outlined"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.password && touched.password)}
                    helperText={(errors.password && touched.password) ? errors.password : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Key color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box mb={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2}>
                  <Box display="flex" alignItems="center">
                    <Field
                      type="checkbox"
                      name="remember"
                      id="remember"
                      className="h-4 w-4 mr-2"
                    />
                    <Typography variant="body2" component="label" htmlFor="remember">
                      {t('auth.remember_me')}
                    </Typography>
                  </Box>
                  <Link href="/forgot-password" passHref>
                    <Typography
                      variant="body2"
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
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    fontWeight: 'medium',
                    fontSize: '1rem'
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('auth.login_button')
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              {t('auth.no_account')}{' '}
              <Link href="/demande-devis-souscription" passHref>
                <Typography
                  variant="body2"
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
        </Paper>
      </Container>
    </Box>
  );
} 