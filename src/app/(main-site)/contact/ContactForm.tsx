'use client';

import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import * as Yup from 'yup';

const ContactForm = () => {
  const t = useTranslations();

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
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-gray-100 dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-6"
    >
      {/* Ligne pour Prénom et Nom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('contact.form.firstName.placeholder')}</legend>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input w-full ${formik.touched.firstName && formik.errors.firstName
              ? 'border-red-500'
              : 'border-gray-300'
              }`}
          />

          {formik.touched.firstName && formik.errors.firstName && (
            <p className="label text-red-500">{formik.errors.firstName}</p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">{t('contact.form.lastName.placeholder')}</legend>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input w-full ${formik.touched.lastName && formik.errors.lastName
              ? 'border-red-500'
              : 'border-gray-300'
              }`}
          />

          {formik.touched.lastName && formik.errors.lastName && (
            <p className="label text-red-500">{formik.errors.lastName}</p>
          )}
        </fieldset>
      </div>

      {/* Autres champs */}
      {(['email', 'phone', 'company', 'message'] as Array<keyof typeof formik.values>).map((field) => (
        <fieldset key={field} className="fieldset">
          <legend className="fieldset-legend">{t(`contact.form.${field}.placeholder`)}</legend>
          {field !== 'message' ? (
            <input
              id={field}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`input w-full ${formik.touched[field] && formik.errors[field]
                ? 'border-red-500'
                : 'border-gray-300'
                }`}
            />
          ) : (
            <textarea
              id={field}
              name={field}
              rows={5}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`textarea w-full px-3 py-2 ${formik.touched.message && formik.errors.message
                ? 'border-red-500'
                : 'border-gray-300'
                }`}
            />
          )}
          {formik.touched[field] && formik.errors[field] && (
            <p className="label text-red-500">{formik.errors[field]}</p>
          )}

        </fieldset>
      ))}

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="w-full bg-axignis-primary hover:bg-axignis-secondary text-white py-2 px-4 rounded-lg shadow-md transition-all"
      >
        {t('contact.form.submit')}
      </button>
    </form>

  );
};

export default ContactForm;
