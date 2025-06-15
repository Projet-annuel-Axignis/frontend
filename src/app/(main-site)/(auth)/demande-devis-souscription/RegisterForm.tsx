'use client';

import { useUser } from '@/app/_providers/Providers';
import { Plans } from '@/types/plans';
import { Email, Info as InfoIcon, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Form, Formik } from 'formik';
import { MuiTelInput } from 'mui-tel-input';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

// Schéma de validation
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Prénom requis'),
  lastName: Yup.string()
    .required('Nom requis'),
  company: Yup.string()
    .required('Entreprise requise'),
  siretNumber: Yup.string()
    .length(14, 'Le numéro de SIRET doit contenir 14 chiffres')
    .required('Siret requis'),
  plan: Yup.string()
    .required('Plan requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  comment: Yup.string(),
  phone: Yup.string()
    .matches(/^\+?[\d\s]{10,20}$/, 'Numéro de téléphone invalide')
    .required('Numéro de téléphone requis'),
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[0-9!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un chiffre ou un caractère spécial')
    .required('Mot de passe requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre')
    .required('Confirmation du mot de passe requise'),
});

// Fonction utilitaire pour ajouter un astérisque aux labels des champs obligatoires
const requiredLabel = (label: string) => (
  <span>
    {label} <span style={{ color: '#f44336' }}>*</span>
  </span>
);

interface RegisterFormProps {
  initialPlan: Plans;
}

export default function RegisterForm({ initialPlan }: RegisterFormProps) {
  const { register, isLoading, error } = useUser();
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [plan, setPlan] = useState<Plans>(initialPlan);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sParam = searchParams.get('p');
    if (sParam) {
      // Nettoyage de l'URL en retirant les paramètres
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  // Détection du mode sombre du système
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              {t('auth.register_instructions', {
                plan: plan === Plans.SELF_MANAGED ? t('plans.self_managed') : t('plans.admin_managed')
              })}
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
            initialValues={{
              firstName: '',
              lastName: '',
              company: '',
              siretNumber: '',
              plan: plan,
              email: '',
              phone: '',
              comment: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={async (values) => {
              await register(
                {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  companyName: values.company,
                  email: values.email,
                  phoneNumber: values.phone,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
                  siretNumber: values.siretNumber,
                  planType: plan,
                  comment: values.comment
                }
              );
            }}
          >
            {({ errors, touched, handleChange, handleBlur, values, setFieldValue }) => (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 3
                  }}
                >
                  {/* Prénom */}
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      type="text"
                      label={requiredLabel(t('auth.first_name'))}
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

                  {/* Nom */}
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      type="text"
                      label={requiredLabel(t('auth.last_name'))}
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

                {/* Entreprise */}
                <Box mb={3}>
                  <TextField
                    fullWidth
                    id="company"
                    name="company"
                    type="text"
                    label={requiredLabel(t('auth.company_name'))}
                    variant="outlined"
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.company && touched.company)}
                    helperText={(errors.company && touched.company) ? errors.company : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Siret */}
                <Box mb={3}>
                  <TextField
                    fullWidth
                    id="siretNumber"
                    name="siretNumber"
                    type="text"
                    label={requiredLabel(t('auth.siret_number'))}
                    variant="outlined"
                    value={values.siretNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.siretNumber && touched.siretNumber)}
                    helperText={(errors.siretNumber && touched.siretNumber) ? errors.siretNumber : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Plan */}
                <Box mb={3}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1">
                      {requiredLabel(t('auth.plan'))}
                    </Typography>
                    <Tooltip title={t('auth.plan_tooltip')} arrow placement="top">
                      <InfoIcon color="action" fontSize="small" />
                    </Tooltip>
                    <Link href="/plans" target="_blank" passHref>
                      <Typography
                        variant="body2"
                        component="span"
                        color="primary"
                        sx={{
                          cursor: 'pointer',
                          ml: 'auto',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {t('auth.view_plans')}
                      </Typography>
                    </Link>
                  </Box>
                  <ToggleButtonGroup
                    value={values.plan}
                    exclusive
                    onChange={(_, newValue) => {
                      if (newValue !== null) {
                        setFieldValue('plan', newValue);
                        setPlan(newValue);
                      }
                    }}
                    fullWidth
                    sx={{
                      '& .MuiToggleButton-root': {
                        flex: 1,
                        py: 1.5,
                        position: 'relative',
                        '&.Mui-selected': {
                          backgroundColor: prefersDarkMode ? 'primary.main' : 'primary.light',
                          color: prefersDarkMode ? 'primary.contrastText' : 'primary.dark',
                          '&:hover': {
                            backgroundColor: prefersDarkMode ? 'primary.dark' : 'primary.light',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value={Plans.SELF_MANAGED}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom align="center">
                          {t('plans.self_managed')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" align="center">
                          {t('plans.self_managed_description')}
                        </Typography>
                      </Box>
                    </ToggleButton>
                    <Box sx={{ position: 'relative', flex: 1 }}>
                      <ToggleButton value={Plans.ADMIN_MANAGED} sx={{ width: '100%' }}>
                        <Box sx={{ width: '100%' }}>
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" align="center">
                              {t('plans.admin_managed')}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary" align="center">
                            {t('plans.admin_managed_description')}
                          </Typography>
                        </Box>
                      </ToggleButton>
                      <Chip
                        label={t('plans.recommended')}
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          height: 24,
                          zIndex: 2,
                          boxShadow: 2,
                          '& .MuiChip-label': {
                            px: 1.5,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          },
                        }}
                      />
                    </Box>
                  </ToggleButtonGroup>
                  {errors.plan && touched.plan && (
                    <Typography color="error" variant="caption">
                      {errors.plan}
                    </Typography>
                  )}
                </Box>

                {/* Commentaire */}
                <Box mb={3}>
                  <TextField
                    fullWidth
                    id="comment"
                    name="comment"
                    type="text"
                    label={t('auth.comment')}
                    variant="outlined"
                    value={values.comment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.comment && touched.comment)}
                    helperText={(errors.comment && touched.comment) ? errors.comment : ''}
                    multiline
                    rows={4}
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    label={requiredLabel(t('auth.email'))}
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

                {/* Numéro de téléphone */}
                <Box mb={3}>
                  <MuiTelInput
                    fullWidth
                    id="phone"
                    name="phone"
                    defaultCountry="FR"
                    label={requiredLabel(t('auth.phone'))}
                    value={values.phone}
                    variant="outlined"
                    onChange={(value) => handleChange({ target: { name: 'phone', value } })}
                    onBlur={handleBlur}
                    error={Boolean(errors.phone && touched.phone)}
                    helperText={(errors.phone && touched.phone) ? errors.phone : ''}
                  />
                </Box>

                <Box mb={3}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label={requiredLabel(t('auth.password'))}
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
                    label={requiredLabel(t('auth.confirm_password'))}
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
              <Link href="/connexion" passHref>
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
  );
} 