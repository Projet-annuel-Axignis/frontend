import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // Définition des données des services
  const services = [
    {
      title: "Registre de Sécurité",
      description: "Gestion digitale et automatisée des registres obligatoires avec alertes et suivis intégrés pour une conformité permanente.",
      imageSrc: "/images/services/service-1.jpg",
      link: "#"
    },
    {
      title: "Coordination SSI",
      description: "Accompagnement expert dans toutes les phases : conception, réalisation et réception du Système de Sécurité Incendie.",
      imageSrc: "/images/services/service-2.jpg",
      link: "#"
    },
    {
      title: "Base Technique",
      description: "Centralisation sécurisée des informations techniques, notices d'utilisation et certificats des équipements de sécurité.",
      imageSrc: "/images/services/service-3.jpg",
      link: "#"
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* Hero Section avec image moderne */}
      <section className="
        relative 
        overflow-hidden
        h-[80vh] 
        min-h-[600px] 
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
            src="/images/backgrounds/building-facade.jpg"
            alt="Façade de bâtiment moderne"
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

        {/* Effet de grille */}
        <div className="
          absolute
          inset-0
          bg-[url('/images/pattern.png')]
          opacity-20
          z-20
        "></div>

        {/* Contenu du hero */}
        <div className="
          relative 
          z-30 
          max-w-5xl 
          px-6
          text-center
        ">
          <div className="
            w-32
            h-32
            md:w-52
            md:h-52
            relative
            mx-auto
            mb-8
            animate-float
          ">
            <Image
              src="/images/logo/logo-axignis-nb.png"
              alt="Logo Axignis"
              fill
              className="
                object-contain 
                drop-shadow-2xl 
                brightness-0 
                invert
                filter
              "
            />
          </div>
          <h1 className="
            text-5xl 
            md:text-6xl 
            lg:text-7xl 
            font-bold 
            mb-6
            drop-shadow-lg
            sr-only
          ">
            Axignis
          </h1>
          <p className="
            text-2xl 
            md:text-3xl 
            mb-6
            max-w-2xl 
            mx-auto
            font-light
            drop-shadow-md
          ">
            <span className="text-white/90">Spécialiste en</span> <span className="font-semibold">sécurité incendie</span> <span className="text-white/90">et</span> <span className="font-semibold">accessibilité des bâtiments</span>
          </p>
          <div className="
            w-24
            h-1
            bg-white
            mx-auto
            mb-10
            opacity-70
          "></div>
          <div className="
            flex 
            flex-col 
            sm:flex-row 
            gap-5
            justify-center
          ">
            <a href="#services" className="
              px-8 
              py-4
              bg-amber-500 
              rounded-md 
              font-semibold
              text-gray-900
              hover:bg-amber-400
              hover:translate-y-1
              transition-all 
              duration-300
              shadow-lg
              hover:shadow-amber-500/30
              tracking-wide
            ">
              Nos Services
            </a>
            <a href="#contact" className="
              px-8 
              py-4
              backdrop-blur-md 
              rounded-md 
              border 
              border-white/40
              hover:bg-white/20
              hover:translate-y-1
              transition-all 
              duration-300
              shadow-lg
              tracking-wide
              font-medium
            ">
              Contactez-nous
            </a>
          </div>
        </div>
      </section>

      {/* Section Notre Mission avec design moderne */}
      <section id="mission" className="
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
          <div className="
            flex 
            flex-col 
            md:flex-row 
            gap-8
            md:gap-12 
            items-center
          ">
            <div className="
              w-full
              md:w-1/2
              @container
              order-2
              md:order-1
            ">
              <h2 className="
                text-2xl
                sm:text-3xl 
                @md:text-4xl 
                text-gray-900
                dark:text-white
                mb-4
                md:mb-6
                relative
                before:content-[''] 
                before:block 
                before:w-16 
                before:h-1 
                before:bg-[var(--color-axignis-primary)] 
                before:mb-3
                md:before:mb-4
              ">
                Notre Mission
              </h2>
              <p className="
                text-base
                sm:text-lg 
                text-gray-700 
                dark:text-gray-300
                mb-4
                md:mb-6
              ">
                Axignis accompagne les entreprises et établissements recevant du public (ERP) dans la mise en conformité réglementaire concernant la sécurité incendie et l&apos;accessibilité aux personnes en situation de handicap.
              </p>
              <p className="
                text-base
                sm:text-lg 
                text-gray-700
                dark:text-gray-300
              ">
                Grâce à une expertise reconnue, Axignis propose un accompagnement complet, de la conception à la réception finale des projets.
              </p>
            </div>

            <div className="
              w-full
              md:w-1/2 
              aspect-video 
              relative 
              rounded-xl 
              overflow-hidden 
              shadow-xl
              order-1
              md:order-2
              mb-8
              md:mb-0
            ">
              <Image
                src="/images/mission-new.jpg"
                alt="Notre mission - Réunion d'équipe"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Services avec cartes modernes */}
      <section id="services" className="
        py-24 
        px-6 
        bg-gray-100
        dark:bg-gray-800
      ">
        <div className="
          container 
          mx-auto 
          max-w-6xl
        ">
          <h2 className="
            text-3xl 
            md:text-4xl 
            text-gray-900
            dark:text-white
            mb-16
            text-center
            relative
            after:content-['']
            after:block
            after:w-24
            after:h-1
            after:bg-[var(--color-axignis-primary)]
            after:mx-auto
            after:mt-4
          ">
            Nos Services
          </h2>

          <div className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            lg:grid-cols-3 
            gap-8
          ">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                imageSrc={service.imageSrc}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section à propos du fondateur */}
      <section className="
        py-16
        md:py-24 
        px-4
        md:px-6 
        bg-gray-900
        text-white
      ">
        <div className="
          container 
          mx-auto 
          max-w-4xl
        ">
          <div className="
            flex 
            flex-col 
            md:flex-row 
            items-center 
            gap-8
            md:gap-12
            text-center
            md:text-left
          ">
            <div className="
              w-full
              md:w-2/5
              flex
              justify-center
              mb-8
              md:mb-0
            ">
              <div className="
                relative
                w-48
                h-48
                md:w-64
                md:h-64
                rounded-full
                overflow-hidden
                border-4
                border-[var(--color-axignis-secondary)]
                shadow-lg
                before:content-['']
                before:absolute
                before:inset-0
                before:bg-gradient-to-b
                before:from-transparent
                before:to-black/30
                before:z-10
              ">
                <Image
                  src="/images/loic-rome.jpeg"
                  alt="Loïc Rome"
                  fill
                  sizes="(max-width: 768px) 12rem, 16rem"
                  className="
                    object-cover
                    transform
                    hover:scale-110
                    transition-transform
                    duration-500
                  "
                />
              </div>
            </div>

            <div className="
              w-full
              md:w-3/5
              @container
            ">
              <h2 className="
                text-2xl
                sm:text-3xl 
                @md:text-4xl 
                mb-4
                md:mb-6
                relative
                before:content-[''] 
                before:block
                before:mx-auto
                md:before:mx-0
                before:w-16 
                before:h-1 
                before:bg-[var(--color-axignis-secondary)] 
                before:mb-3
                md:before:mb-4
              ">
                À propos du fondateur
              </h2>
              <p className="
                text-xl 
                font-semibold 
                mb-3
                md:mb-4
                text-[var(--color-axignis-secondary)]
              ">
                Loïc Rome
              </p>
              <p className="
                text-base
                sm:text-lg 
                text-gray-200 
                mb-6
              ">
                Fondateur et expert en sécurité incendie et accessibilité, Loïc Rome accompagne depuis 2017 les entreprises dans leurs démarches réglementaires avec passion et expertise.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  href="https://www.linkedin.com/in/lo%C3%AFc-rome-45ba2062/"
                  target="_blank"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    bg-[var(--color-axignis-secondary)]
                    rounded-md
                    hover:bg-[var(--color-axignis-secondary)]/80
                    hover:translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  Voir le profil LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section contact/CTA */}
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
            Prêt à sécuriser votre établissement?
          </h2>
          <p className="
            text-xl
            mb-10
            opacity-90
          ">
            Contactez-nous dès aujourd&apos;hui pour une consultation gratuite et sans engagement.
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
              Nous contacter
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
              +33 6 12 34 56 78
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
