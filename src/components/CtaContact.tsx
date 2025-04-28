import { useTranslation } from '@/i18n/useTranslation';

const CtaContact = () => {
  const { t } = useTranslation('common');
  return (

    <section id="contact" className="
          py-24
          px-6
          bg-gradient-to-r
          from-[var(--color-axignis-primary)]
          to-[var(--color-axignis-secondary)]
          text-white
        ">
      <div className="
            container
            mx-auto
            max-w-3xl
            text-center
          ">
        <h2 className="
              text-3xl
              md:text-4xl
              mb-6
            ">
          {t('homepage.contact.title')}
        </h2>
        <p className="
              text-xl
              mb-10
              opacity-90
            ">
          {t('homepage.contact.subtitle')}
        </p>
        <div className="
              flex
              flex-col
              sm:flex-row
              gap-4
              justify-center
            ">
          <a href="mailto:contact@axignis.fr" className="
                px-8
                py-4
                bg-white
                text-[var(--color-axignis-primary)]
                font-bold
                rounded-md
                hover:bg-opacity-90
                hover:translate-y-1
                transition-all
                duration-300
                shadow-md
              ">
            {t('homepage.contact.contact_button')}
          </a>
          <a href="tel:+33612345678" className="
                px-8
                py-4
                bg-transparent
                border-2
                border-white
                rounded-md
                font-bold
                hover:bg-white/10
                hover:translate-y-1
                transition-all
                duration-300
              ">
            {t('homepage.contact.phone')}
          </a>
        </div>
      </div>
    </section>

  )
}

export default CtaContact