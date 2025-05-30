'use client';

import { useUser } from '@/app/_providers';
import { Plans } from '@/types/plans';
import { Email, Info as InfoIcon, Lock, Person, Phone, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Typography
} from '@mui/joy';
import { Form, Formik } from 'formik';
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
    .matches(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide')
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
        bgcolor: 'neutral.600',
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
        <Card
          variant="outlined"
          sx={{
            width: '100%'
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography level="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('auth.register')}
              </Typography>
              <Typography level="body-md" color="neutral">
                {t('auth.register_instructions', {
                  plan: plan === Plans.SELF_MANAGED ? t('plans.self_managed') : t('plans.admin_managed')
                })}
              </Typography>
            </Box>

            {error && (
              <Alert
                color="danger"
                variant="soft"
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
                      <FormControl>
                        <FormLabel>{requiredLabel(t('auth.first_name'))}</FormLabel>
                        <Input
                          size="lg"
                          fullWidth
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(errors.firstName && touched.firstName)}
                          startDecorator={<Person />}
                          sx={{
                            '&:hover': {
                              borderColor: 'primary.400'
                            }
                          }}
                        />
                        {errors.firstName && touched.firstName && (
                          <Typography level="body-sm" color="danger">
                            {errors.firstName}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>

                    {/* Nom */}
                    <Box sx={{ flex: 1 }}>
                      <FormControl>
                        <FormLabel>{requiredLabel(t('auth.last_name'))}</FormLabel>
                        <Input
                          size="lg"
                          fullWidth
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(errors.lastName && touched.lastName)}
                          startDecorator={<Person />}
                          sx={{
                            '&:hover': {
                              borderColor: 'primary.400'
                            }
                          }}
                        />
                        {errors.lastName && touched.lastName && (
                          <Typography level="body-sm" color="danger">
                            {errors.lastName}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Box>

                  {/* Entreprise */}
                  <Box mb={3}>
                    <FormControl>
                      <FormLabel>{requiredLabel(t('auth.company_name'))}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="company"
                        name="company"
                        type="text"
                        value={values.company}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.company && touched.company)}
                        startDecorator={<Person />}
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.company && touched.company && (
                        <Typography level="body-sm" color="danger">
                          {errors.company}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Siret */}
                  <Box mb={3}>
                    <FormControl>
                      <FormLabel>{requiredLabel(t('auth.siret_number'))}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="siretNumber"
                        name="siretNumber"
                        type="text"
                        value={values.siretNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.siretNumber && touched.siretNumber)}
                        startDecorator={<Person />}
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.siretNumber && touched.siretNumber && (
                        <Typography level="body-sm" color="danger">
                          {errors.siretNumber}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Plan */}
                  <Box mb={3}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography level="title-md">
                        {requiredLabel(t('auth.plan'))}
                      </Typography>
                      <IconButton
                        variant="plain"
                        color="neutral"
                        size="sm"
                        title={t('auth.plan_tooltip')}
                      >
                        <InfoIcon />
                      </IconButton>
                      <Link href="/plans" target="_blank" passHref>
                        <Typography
                          level="body-sm"
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
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        position: 'relative'
                      }}
                    >
                      <Button
                        variant={values.plan === Plans.SELF_MANAGED ? 'solid' : 'outlined'}
                        color="primary"
                        onClick={() => {
                          setFieldValue('plan', Plans.SELF_MANAGED);
                          setPlan(Plans.SELF_MANAGED);
                        }}
                        sx={{ flex: 1 }}
                      >
                        <Box>
                          <Typography level="title-md" sx={{ textAlign: 'center', mb: 1 }}>
                            {t('plans.self_managed')}
                          </Typography>
                          <Typography level="body-sm" color="neutral" sx={{ textAlign: 'center' }}>
                            {t('plans.self_managed_description')}
                          </Typography>
                        </Box>
                      </Button>
                      <Box sx={{ position: 'relative', flex: 1 }}>
                        <Button
                          variant={values.plan === Plans.ADMIN_MANAGED ? 'solid' : 'outlined'}
                          color="primary"
                          onClick={() => {
                            setFieldValue('plan', Plans.ADMIN_MANAGED);
                            setPlan(Plans.ADMIN_MANAGED);
                          }}
                          sx={{ width: '100%' }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                              <Typography level="title-md" sx={{ textAlign: 'center', mb: 1 }}>
                                {t('plans.admin_managed')}
                              </Typography>
                            </Box>
                            <Typography level="body-sm" color="neutral" sx={{ textAlign: 'center' }}>
                              {t('plans.admin_managed_description')}
                            </Typography>
                          </Box>
                        </Button>
                        <Chip
                          size="sm"
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
                        >
                          {t('plans.recommended')}
                        </Chip>
                      </Box>
                    </Box>
                    {errors.plan && touched.plan && (
                      <Typography level="body-sm" color="danger">
                        {errors.plan}
                      </Typography>
                    )}
                  </Box>

                  {/* Commentaire */}
                  <Box mb={3}>
                    <FormControl>
                      <FormLabel>{t('auth.comment')}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="comment"
                        name="comment"
                        type="text"
                        value={values.comment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.comment && touched.comment)}
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.comment && touched.comment && (
                        <Typography level="body-sm" color="danger">
                          {errors.comment}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Email */}
                  <Box mb={3}>
                    <FormControl>
                      <FormLabel>{requiredLabel(t('auth.email'))}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.email && touched.email)}
                        startDecorator={<Email />}
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.email && touched.email && (
                        <Typography level="body-sm" color="danger">
                          {errors.email}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Numéro de téléphone */}
                  <Box mb={3}>
                    <FormControl>
                      <FormLabel>{requiredLabel(t('auth.phone'))}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={values.phone}
                        onChange={(e) => {
                          // Formatage du numéro de téléphone
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.startsWith('0')) {
                            value = '+33' + value.substring(1);
                          } else if (!value.startsWith('+')) {
                            value = '+' + value;
                          }
                          handleChange({ target: { name: 'phone', value } });
                        }}
                        onBlur={handleBlur}
                        error={Boolean(errors.phone && touched.phone)}
                        startDecorator={<Phone />}
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.phone && touched.phone && (
                        <Typography level="body-sm" color="danger">
                          {errors.phone}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Mot de passe */}
                  <Box mb={3}>
                    <FormControl>
                      <FormLabel>{requiredLabel(t('auth.password'))}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.password && touched.password)}
                        startDecorator={<Lock />}
                        endDecorator={
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            variant="plain"
                            color="neutral"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        }
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.password && touched.password && (
                        <Typography level="body-sm" color="danger">
                          {errors.password}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Confirmation du mot de passe */}
                  <Box mb={4}>
                    <FormControl>
                      <FormLabel>{requiredLabel(t('auth.confirm_password'))}</FormLabel>
                      <Input
                        size="lg"
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                        startDecorator={<Lock />}
                        endDecorator={
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            variant="plain"
                            color="neutral"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        }
                        sx={{
                          '&:hover': {
                            borderColor: 'primary.400'
                          }
                        }}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <Typography level="body-sm" color="danger">
                          {errors.confirmPassword}
                        </Typography>
                      )}
                    </FormControl>
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
                      fontSize: '1rem',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(55, 127, 189, 0.2)'
                      }
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size="sm" color="neutral" />
                    ) : (
                      t('auth.register_button')
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <Box mt={4} textAlign="center">
              <Typography level="body-sm" color="neutral">
                {t('auth.already_have_account')}{' '}
                <Link href="/connexion" passHref>
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
                    {t('auth.login_here')}
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 