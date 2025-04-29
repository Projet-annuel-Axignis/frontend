'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { useUser } from '@/lib/contexts/UserContext';
import { Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Form, Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import * as Yup from 'yup';

// Schéma de validation
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Prénom requis'),
  lastName: Yup.string()
    .required('Nom requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    )
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requise'),
});

export default function RegisterPage() {
  const { register, isLoading, error } = useUser();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Détection du mode sombre du système
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Création d'un thème qui respecte la préférence du système
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#F59E0B', // amber-500
      },
      secondary: {
        main: '#D97706', // amber-600
      },
      warning: {
        main: '#F59E0B', // amber-500
        dark: '#D97706', // amber-600
      },
      background: {
        default: prefersDarkMode ? '#1F2937' : '#F9FAFB',
        paper: prefersDarkMode ? '#111827' : '#FFFFFF',
      },
      text: {
        primary: prefersDarkMode ? '#F9FAFB' : '#111827',
        secondary: prefersDarkMode ? '#D1D5DB' : '#6B7280',
      },
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden'
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
        <Container maxWidth="md" sx={{
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
              background: theme.palette.background.paper,
              boxShadow: prefersDarkMode
                ? '0 4px 20px rgba(0,0,0,0.5)'
                : '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('auth.register')}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {t('auth.register_instructions')}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values) => {
                await register(
                  values.firstName,
                  values.lastName,
                  values.email,
                  values.password
                );
              }}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      mb: 3
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        type="text"
                        label={t('auth.first_name')}
                        variant="outlined"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.firstName && touched.firstName)}
                        helperText={(errors.firstName && touched.firstName) ? errors.firstName : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        type="text"
                        label={t('auth.last_name')}
                        variant="outlined"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.lastName && touched.lastName)}
                        helperText={(errors.lastName && touched.lastName) ? errors.lastName : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </Box>

                  <Box mb={3}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      type="email"
                      label={t('auth.email')}
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
                      label={t('auth.password')}
                      variant="outlined"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.password && touched.password)}
                      helperText={(errors.password && touched.password) ? errors.password : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
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

                  <Box mb={4}>
                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      label={t('auth.confirm_password')}
                      variant="outlined"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                      helperText={(errors.confirmPassword && touched.confirmPassword) ? errors.confirmPassword : ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleToggleConfirmPasswordVisibility}
                              edge="end"
                              aria-label="toggle password visibility"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
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
                      t('auth.register_button')
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                {t('auth.already_have_account')}{' '}
                <Link href="/login" passHref>
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
                    {t('auth.login_here')}
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
} 