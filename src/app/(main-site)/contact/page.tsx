import CtaDevis from '@/components/CtaDevis';
import HeroHeader from '@/components/commons/HeroHeader';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ContactForm from './ContactForm';
export const metadata: Metadata = {
  title: "Axignis - Contact",
};

export default function ContactPage() {
  const tContact = useTranslations('contact');
  const tHome = useTranslations('homepage');

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* Hero Section */}
      <HeroHeader
        title={tContact('title')}
        description={tContact('form.title')}
        image="/images/backgrounds/contact.jpg"
        imageAlt="Contact"
      />
      <section className="container mx-auto px-4 md:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-10">

          <ContactForm />
          <div className="hidden md:flex relative rounded-xl overflow-hidden items-center justify-end">
            <div className="w-full h-96 relative">
              <Image
                src="/images/contact.jpg"
                alt={tHome('mission.image_alt')}
                fill
                sizes="100%"
                priority
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaDevis />
    </main>

  )
}
