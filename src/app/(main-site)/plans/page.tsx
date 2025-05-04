'use client';

import { CheckCircle } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

export default function PlansPage() {
  // Fonctionnalités communes aux deux plans
  const commonFeatures = [
    "Registre de sécurité numérique",
    "Tableau de bord",
    "Gestion documentaire intégrée",
    "Export facile des données"
  ];

  // Fonctionnalités spécifiques au plan Autonomie
  const autonomyFeatures = [
    "Contrôle total",
    "Gestion autonome",
    "Alertes automatisées",
    "Export des registres",
    "Assistance Axignis limitée"
  ];

  // Fonctionnalités spécifiques au plan Sérénité
  const serenityFeatures = [
    "Gestion déléguée complète",
    "Alertes personnalisées et proactives",
    "Accompagnement dédié",
    "Rapports et synthèses personnalisés",
    "Accès premium au dashboard Axignis"
  ];

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
            Plans Axignis
          </h1>
          <p className="
            text-xl 
            md:text-2xl 
            mb-6
            max-w-3xl 
            mx-auto
            font-light
            drop-shadow-md
          ">
            Choisissez la solution adaptée à vos besoins
          </p>
          <div className="
            w-24
            h-1
            bg-white
            mx-auto
            mb-4
            opacity-70
          "></div>
        </div>
      </section>

      {/* Section Fonctionnalités communes */}
      <section className="
        py-16
        md:py-20 
        px-4
        md:px-6
        bg-white
        dark:bg-gray-900
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
            mb-8
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
            Fonctionnalités principales
          </h2>

          <div className="
            grid 
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
            mt-16
          ">
            {commonFeatures.map((feature, index) => (
              <div key={index} className="
                bg-gray-50
                dark:bg-gray-800
                p-6
                rounded-xl
                shadow-md
                text-center
                hover:shadow-lg
                transition-shadow
                duration-300
                flex
                flex-col
                items-center
                justify-start
              ">
                <div className="
                  w-16
                  h-16
                  rounded-full
                  bg-[var(--color-axignis-primary)]/10
                  flex
                  items-center
                  justify-center
                  mb-4
                ">
                  <CheckCircle
                    className="text-[var(--color-axignis-primary)] w-8 h-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Plans */}
      <section className="
        py-16 
        md:py-24 
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
            mb-4
            text-center
          ">
            Nos Plans
          </h2>

          <p className="
            text-center
            text-gray-700
            dark:text-gray-300
            max-w-3xl
            mx-auto
            mb-16
          ">
            Choisissez entre une gestion autonome ou une prise en charge complète par nos experts
          </p>

          <div className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            gap-8
            lg:gap-16
          ">
            {/* Plan Autonomie */}
            <div className="
              bg-white 
              dark:bg-gray-900 
              rounded-xl 
              shadow-xl 
              overflow-hidden
              hover:shadow-2xl
              transition-shadow
              duration-300
              flex
              flex-col
            ">
              <div className="
                bg-gray-50
                dark:bg-gray-800
                p-8
                relative
              ">
                <div className="
                  w-12 
                  h-12
                  rounded-full
                  bg-gray-400
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-2xl
                  mb-4
                ">
                  🥈
                </div>
                <h3 className="
                  text-2xl 
                  md:text-3xl 
                  font-bold 
                  text-gray-900
                  dark:text-white
                  mb-2
                ">
                  Autonomie
                </h3>
                <p className="
                  text-gray-600
                  dark:text-gray-400
                  mb-6
                ">
                  Pour ceux qui souhaitent gérer eux-mêmes leur sécurité
                </p>
              </div>

              <div className="p-8 flex-grow">
                <ul className="space-y-4">
                  {autonomyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle
                        className="
                          text-[var(--color-axignis-primary)] 
                          mr-3 
                          mt-0.5
                          shrink-0
                        "
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <Link
                  href="/creation-compte?p=autonomie"
                  className="
                    block
                    w-full
                    py-4
                    text-center
                    bg-gray-200
                    dark:bg-gray-700
                    hover:bg-gray-300
                    dark:hover:bg-gray-600
                    text-gray-900
                    dark:text-white
                    font-semibold
                    rounded-md
                    transition-colors
                  "
                >
                  Demander un devis
                </Link>
              </div>
            </div>

            {/* Plan Sérénité */}
            <div className="
              bg-white 
              dark:bg-gray-900 
              rounded-xl 
              shadow-xl 
              overflow-hidden
              hover:shadow-2xl
              transition-shadow
              duration-300
              flex
              flex-col
              relative
            ">
              {/* Badge "Recommandé" */}
              <div className="
                absolute
                top-0
                right-0
                bg-[var(--color-axignis-primary)]
                text-white
                py-1
                px-4
                rounded-bl-lg
                font-medium
                z-10
              ">
                Recommandé
              </div>

              <div className="
                bg-[var(--color-axignis-secondary)]/10
                dark:bg-[var(--color-axignis-secondary)]/20
                p-8
                relative
              ">
                <div className="
                  w-12 
                  h-12
                  rounded-full
                  bg-[var(--color-axignis-primary)]
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-2xl
                  mb-4
                ">
                  🥇
                </div>
                <h3 className="
                  text-2xl 
                  md:text-3xl 
                  font-bold 
                  text-gray-900
                  dark:text-white
                  mb-2
                ">
                  Sérénité
                </h3>
                <p className="
                  text-gray-600
                  dark:text-gray-400
                  mb-6
                ">
                  Délégation complète à nos experts Axignis
                </p>
              </div>

              <div className="p-8 flex-grow">
                <ul className="space-y-4">
                  {serenityFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle
                        className="
                          text-[var(--color-axignis-primary)] 
                          mr-3 
                          mt-0.5
                          shrink-0
                        "
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <Link
                  href="/creation-compte?p=serenite"
                  className="
                    block
                    w-full
                    py-4
                    text-center
                    bg-[var(--color-axignis-primary)]
                    hover:bg-[var(--color-axignis-primary)]/90
                    text-white
                    font-semibold
                    rounded-md
                    transition-colors
                  "
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Tableau comparatif */}
      <section className="
        py-16 
        md:py-24 
        px-6 
        bg-white
        dark:bg-gray-900
      ">
        <div className="
          container 
          mx-auto 
          max-w-4xl
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
            Comparatif détaillé
          </h2>

          <div className="
            overflow-x-auto
            bg-white
            dark:bg-gray-800
            rounded-xl
            shadow-xl
          ">
            <table className="
              w-full
              min-w-full
              border-collapse
            ">
              <thead>
                <tr className="
                  bg-gray-50
                  dark:bg-gray-700
                ">
                  <th className="
                    py-4
                    px-6
                    text-left
                    text-gray-900
                    dark:text-white
                    font-semibold
                    border-b
                    border-gray-200
                    dark:border-gray-600
                  ">
                    Fonctionnalités
                  </th>
                  <th className="
                    py-4
                    px-6
                    text-center
                    text-gray-900
                    dark:text-white
                    font-semibold
                    border-b
                    border-gray-200
                    dark:border-gray-600
                  ">
                    Autonomie
                  </th>
                  <th className="
                    py-4
                    px-6
                    text-center
                    text-gray-900
                    dark:text-white
                    font-semibold
                    border-b
                    border-gray-200
                    dark:border-gray-600
                  ">
                    Sérénité
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Lignes du tableau */}
                <tr>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Accès complet à l&apos;application
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Gestion autonome des interventions
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                    text-gray-700
                    dark:text-gray-300
                    font-medium
                  ">
                    Axignis
                  </td>
                </tr>
                <tr>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Alertes automatisées
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Gestion proactive et délégation intégrale
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                    text-red-500
                  ">
                    ✖
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Support client
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Email
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Téléphone & Email
                  </td>
                </tr>
                <tr>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Interlocuteur dédié Axignis
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                    text-red-500
                  ">
                    ✖
                  </td>
                  <td className="
                    py-4
                    px-6
                    border-b
                    border-gray-200
                    dark:border-gray-600
                    text-center
                  ">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Valeurs ajoutées */}
      <section className="
        py-16 
        md:py-24 
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
            Nos valeurs ajoutées
          </h2>

          <div className="
            grid 
            grid-cols-1
            md:grid-cols-2
            gap-8
            md:gap-12
          ">
            {/* Fiabilité et conformité */}
            <div className="
              flex
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              hover:shadow-lg
              transition-shadow
              duration-300
            ">
              <div className="
                mr-5
                flex-shrink-0
                w-12
                h-12
                rounded-full
                bg-[var(--color-axignis-primary)]/10
                flex
                items-center
                justify-center
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fiabilité et conformité
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Application répondant strictement aux normes réglementaires ERP, IGH, HAB, etc.
                </p>
              </div>
            </div>

            {/* Gain de temps et productivité */}
            <div className="
              flex
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              hover:shadow-lg
              transition-shadow
              duration-300
            ">
              <div className="
                mr-5
                flex-shrink-0
                w-12
                h-12
                rounded-full
                bg-[var(--color-axignis-primary)]/10
                flex
                items-center
                justify-center
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gain de temps et productivité
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Dématérialisation et centralisation des documents techniques.
                </p>
              </div>
            </div>

            {/* Sécurité des données */}
            <div className="
              flex
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              hover:shadow-lg
              transition-shadow
              duration-300
            ">
              <div className="
                mr-5
                flex-shrink-0
                w-12
                h-12
                rounded-full
                bg-[var(--color-axignis-primary)]/10
                flex
                items-center
                justify-center
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Sécurité des données
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Stockage sécurisé avec accès personnalisé par rôles et permissions.
                </p>
              </div>
            </div>

            {/* Expérience utilisateur optimisée */}
            <div className="
              flex
              bg-white
              dark:bg-gray-900
              p-6
              rounded-xl
              shadow-md
              hover:shadow-lg
              transition-shadow
              duration-300
            ">
              <div className="
                mr-5
                flex-shrink-0
                w-12
                h-12
                rounded-full
                bg-[var(--color-axignis-primary)]/10
                flex
                items-center
                justify-center
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Expérience utilisateur optimisée
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Interface accessible, intuitive et responsive adaptée à tous supports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="
        py-16 
        md:py-24 
        px-6 
        bg-gradient-to-r
          from-[var(--color-axignis-primary)]
          to-[var(--color-axignis-secondary)]
          text-white
      ">
        <div className="
          container 
          mx-auto 
          max-w-4xl
          text-center
        ">
          <h2 className="
            text-3xl 
            md:text-4xl 
            font-bold 
            mb-6
          ">
            Prêt à sécuriser votre établissement ?
          </h2>
          <p className="
            text-xl
            text-gray-300
            mb-10
            max-w-2xl
            mx-auto
          ">
            Contactez-nous dès aujourd&apos;hui pour une consultation gratuite et sans engagement.
          </p>
          <div className="
              flex 
              flex-col 
              sm:flex-row 
              gap-5
              justify-center
            ">
            <Link href="/creation-compte?serenite" className="
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
              Demander un devis
            </Link>
            <Link href="/contact" className="
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
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 