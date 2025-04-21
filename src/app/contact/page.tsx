'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { Box, Button, Card, CardContent, CardHeader, Container, Grid, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Image from 'next/image';
import * as Yup from 'yup';

const ContactForm = () => {
  const { t } = useTranslation('contact');

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('form.firstName.required')),
    lastName: Yup.string().required(t('form.lastName.required')),
    email: Yup.string()
      .email(t('form.email.invalid'))
      .required(t('form.email.required')),
    phone: Yup.string(),
    company: Yup.string().required(t('form.company.required')),
    message: Yup.string().required(t('form.message.required')),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // TODO: Implémenter l'envoi du formulaire
      console.log(values);
    },
  });

  return (
    <Box component="main" sx={{ minHeight: '100vh' }} className='bg-white dark:bg-gray-900'>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '50vh',
          minHeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {/* Arrière-plan avec image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'grey.600',
            zIndex: 0,
          }}
        >
          <Image
            src="/images/backgrounds/contact.jpg"
            alt="Contact"
            fill
            priority
            style={{
              objectFit: 'cover',
              opacity: 0.4,
            }}
          />
        </Box>

        {/* Overlay avec dégradé */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
            zIndex: 10,
          }}
        />

        {/* Contenu du hero */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 30,
            maxWidth: '5xl',
            px: 6,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            className='text-4xl 
              md:text-5xl 
              lg:text-6xl 
              font-bold 
              mb-6
              drop-shadow-lg'

          >
            {t('title')}
          </Typography>
        </Box>
      </Box>

      {/* Formulaire de contact */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 8, md: 12 } }}
      >
        <Card
          sx={{
            maxWidth: 800,
            mx: 'auto',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}

        >
          <CardHeader
            title={
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  color: 'primary.main',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    width: 64,
                    height: 4,
                    bgcolor: 'primary.main',
                    mb: 2,
                    borderRadius: 2,
                  },
                }}
              >
                {t('form.title')}
              </Typography>
            }
          />
          <CardContent>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > *': { mb: 3 } }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label={t('form.firstName.placeholder')}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label={t('form.lastName.placeholder')}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    label={t('form.email.placeholder')}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    type="tel"
                    label={t('form.phone.placeholder')}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}></Grid>
                <TextField
                  fullWidth
                  id="company"
                  name="company"
                  label={t('form.company.placeholder')}
                  value={formik.values.company}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.company && Boolean(formik.errors.company)}
                  helperText={formik.touched.company && formik.errors.company}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label={t('form.message.placeholder')}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                  multiline
                  rows={5}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={formik.isSubmitting}
                  sx={{ mt: 2 }}
                >
                  {t('form.submit')}
                </Button>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box >
  );
};

export default ContactForm; 