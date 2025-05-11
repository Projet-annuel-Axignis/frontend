import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CtaDevis() {
  const t = useTranslations('plans');

  return (
    <section className="py-16 md:py-24 px-6 bg-gradient-to-r from-[var(--color-axignis-primary)] to-[var(--color-axignis-secondary)] text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('cta.title')}
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link href="/demande-devis-souscription?serenite" className="px-8 py-4 bg-amber-500 rounded-md font-semibold text-gray-900 hover:bg-amber-400 hover:translate-y-1 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 tracking-wide">
            {t('cta.request_quote')}
          </Link>
          <Link href="/contact" className="px-8 py-4 backdrop-blur-md rounded-md border border-white/40 hover:bg-white/20 hover:translate-y-1 transition-all duration-300 shadow-lg tracking-wide font-medium">
            {t('cta.contact_us')}
          </Link>
        </div>
      </div>
    </section>
  )
}
