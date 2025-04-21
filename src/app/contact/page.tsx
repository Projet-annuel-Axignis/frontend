'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/i18n/useTranslation';
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
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* Hero Section */}
      <section className="
        relative 
        overflow-hidden
        h-[40vh] 
        min-h-[300px] 
        flex 
        items-center 
        justify-center
        text-white
      ">
        {/* Arrière-plan avec image */}
        <div className="
          absolute 
          inset-0 
          bg-gray-600
          z-0
        ">
          <Image
            src="/images/backgrounds/contact.jpg"
            alt="Contact"
            fill
            priority
            className="
              object-cover
              opacity-50
              mix-blend-overlay
            "
          />
        </div>

        {/* Overlay avec dégradé */}
        <div className="
          absolute 
          inset-0 
          bg-gradient-to-r 
          from-[var(--color-axignis-primary)]/70
          to-[var(--color-axignis-secondary)]/70
          mix-blend-multiply
          z-10
        "></div>

        {/* Contenu du hero */}
        <div className="
          relative 
          z-30 
          max-w-5xl 
          px-6
          text-center
        ">
          <h1 className="
            text-4xl 
            md:text-5xl 
            lg:text-6xl 
            font-bold 
            mb-6
            drop-shadow-lg
          ">
            {t('title')}
          </h1>
          <div className="
            w-24
            h-1
            bg-white
            mx-auto
            mb-10
            opacity-70
          "></div>
        </div>
      </section>

      {/* Formulaire de contact */}
      <section className="
        py-16
        md:py-24 
        px-4
        md:px-6
        bg-white
        dark:bg-gray-900
      ">
        <div className="
          container 
          mx-auto 
          max-w-5xl
        ">
          <Card className="
            max-w-2xl 
            mx-auto
            bg-white/80
            dark:bg-gray-800/80
            backdrop-blur-sm
            border-gray-200
            dark:border-gray-700
            shadow-xl
          ">
            <CardHeader>
              <CardTitle className="
                text-2xl
                sm:text-3xl
                text-gray-900
                dark:text-white
                relative
                before:content-[''] 
                before:block 
                before:w-16 
                before:h-1 
                before:bg-[var(--color-axignis-primary)] 
                before:mb-3
              ">
                {t('form.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder={t('form.firstName.placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      className="
                        bg-white/50
                        dark:bg-gray-700/50
                        border-gray-200
                        dark:border-gray-600
                        focus:border-[var(--color-axignis-primary)]
                        dark:focus:border-[var(--color-axignis-primary)]
                      "
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder={t('form.lastName.placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      className="
                        bg-white/50
                        dark:bg-gray-700/50
                        border-gray-200
                        dark:border-gray-600
                        focus:border-[var(--color-axignis-primary)]
                        dark:focus:border-[var(--color-axignis-primary)]
                      "
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('form.email.placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="
                        bg-white/50
                        dark:bg-gray-700/50
                        border-gray-200
                        dark:border-gray-600
                        focus:border-[var(--color-axignis-primary)]
                        dark:focus:border-[var(--color-axignis-primary)]
                      "
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={t('form.phone.placeholder')}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      className="
                        bg-white/50
                        dark:bg-gray-700/50
                        border-gray-200
                        dark:border-gray-600
                        focus:border-[var(--color-axignis-primary)]
                        dark:focus:border-[var(--color-axignis-primary)]
                      "
                    />
                  </div>
                </div>

                <div>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder={t('form.company.placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company}
                    className="
                      bg-white/50
                      dark:bg-gray-700/50
                      border-gray-200
                      dark:border-gray-600
                      focus:border-[var(--color-axignis-primary)]
                      dark:focus:border-[var(--color-axignis-primary)]
                    "
                  />
                  {formik.touched.company && formik.errors.company && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.company}
                    </div>
                  )}
                </div>

                <div>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t('form.message.placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    rows={5}
                    className="
                      bg-white/50
                      dark:bg-gray-700/50
                      border-gray-200
                      dark:border-gray-600
                      focus:border-[var(--color-axignis-primary)]
                      dark:focus:border-[var(--color-axignis-primary)]
                    "
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.message}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="
                    w-full
                    bg-[var(--color-axignis-primary)]
                    hover:bg-[var(--color-axignis-primary)]/90
                    text-white
                    font-semibold
                    py-3
                    px-6
                    rounded-md
                    transition-all
                    duration-300
                    shadow-lg
                    hover:shadow-[var(--color-axignis-primary)]/30
                    tracking-wide
                  "
                  disabled={formik.isSubmitting}
                >
                  {t('form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default ContactForm; 