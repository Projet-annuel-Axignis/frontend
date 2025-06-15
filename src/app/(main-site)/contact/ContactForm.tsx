'use client';

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import * as Yup from 'yup';

const ContactForm = () => {
  const t = useTranslations();
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Détection du mode sombre du système
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('contact.form.firstName.required')),
    lastName: Yup.string().required(t('contact.form.lastName.required')),
    email: Yup.string()
      .email(t('contact.form.email.invalid'))
      .required(t('contact.form.email.required')),
    phone: Yup.string(),
    company: Yup.string().required(t('contact.form.company.required')),
    message: Yup.string().required(t('contact.form.message.required')),
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
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        // Simulation d'envoi - remplacer par votre logique d'envoi
        console.log(values);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai

        setSubmitStatus('success');
        resetForm();
      } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Fonction utilitaire pour ajouter un astérisque aux labels des champs obligatoires
  const requiredLabel = (label: string) => (
    <span>
      {label} <span style={{ color: '#f44336' }}>*</span>
    </span>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            {t('contact.title')}
          </Typography>
        </Box>

        {submitStatus === 'success' && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              '& .MuiAlert-message': {
                fontWeight: 'medium'
              }
            }}
          >
            {t('contact.form.success')}
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              '& .MuiAlert-message': {
                fontWeight: 'medium'
              }
            }}
          >
            {t('contact.form.error')}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          {/* Ligne pour Prénom et Nom */}
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
                label={requiredLabel(t('contact.form.firstName.placeholder'))}
                variant="outlined"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.firstName && formik.touched.firstName)}
                helperText={(formik.errors.firstName && formik.touched.firstName) ? formik.errors.firstName : ''}
              />
            </Box>

            {/* Nom */}
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                type="text"
                label={requiredLabel(t('contact.form.lastName.placeholder'))}
                variant="outlined"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.lastName && formik.touched.lastName)}
                helperText={(formik.errors.lastName && formik.touched.lastName) ? formik.errors.lastName : ''}
              />
            </Box>
          </Box>

          {/* Email */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              type="email"
              label={requiredLabel(t('contact.form.email.placeholder'))}
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.email && formik.touched.email)}
              helperText={(formik.errors.email && formik.touched.email) ? formik.errors.email : ''}
            />
          </Box>

          {/* Téléphone */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              type="tel"
              label={t('contact.form.phone.placeholder')}
              variant="outlined"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.phone && formik.touched.phone)}
              helperText={(formik.errors.phone && formik.touched.phone) ? formik.errors.phone : ''}
            />
          </Box>

          {/* Entreprise */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              id="company"
              name="company"
              type="text"
              label={requiredLabel(t('contact.form.company.placeholder'))}
              variant="outlined"
              value={formik.values.company}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.company && formik.touched.company)}
              helperText={(formik.errors.company && formik.touched.company) ? formik.errors.company : ''}
            />
          </Box>

          {/* Message */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              id="message"
              name="message"
              label={requiredLabel(t('contact.form.message.placeholder'))}
              variant="outlined"
              multiline
              rows={5}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.errors.message && formik.touched.message)}
              helperText={(formik.errors.message && formik.touched.message) ? formik.errors.message : ''}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontWeight: 'medium',
              fontSize: '1rem'
            }}
          >
            {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactForm;
