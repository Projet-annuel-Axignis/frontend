import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="
      bg-gray-900
      py-16
      px-6
      text-white
    ">
      <div className="
        container
        mx-auto
        max-w-6xl
      ">
        <div className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-10
        ">
          {/* Logo & description */}
          <div className="
            col-span-1
            md:col-span-2
          ">
            <div className="w-32 h-32 mb-4 relative">
              <Image
                src="/images/logo/logo-axignis.png"
                alt="Logo Axignis"
                fill
                className="object-contain"
              />
            </div>
            <p className="
              text-gray-300
              mb-6
            ">
              Spécialiste en sécurité incendie et accessibilité des bâtiments. Notre expertise au service de votre sécurité.
            </p>
            <div className="
              flex
              gap-4
            ">
              <a href="#" className="
                text-white
                hover:text-[var(--color-axignis-secondary)]
                transition-colors
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" />
                </svg>
              </a>
              <a href="#" className="
                text-white
                hover:text-[var(--color-axignis-secondary)]
                transition-colors
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" className="
                text-white
                hover:text-[var(--color-axignis-secondary)]
                transition-colors
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="
              text-lg
              font-semibold
              mb-4
              text-[var(--color-axignis-secondary)]
            ">
              Liens Rapides
            </h3>
            <ul className="
              space-y-2
            ">
              <li>
                <a href="#mission" className="
                  text-gray-300
                  hover:text-white
                  transition-colors
                ">
                  Notre Mission
                </a>
              </li>
              <li>
                <a href="#services" className="
                  text-gray-300
                  hover:text-white
                  transition-colors
                ">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="
                  text-gray-300
                  hover:text-white
                  transition-colors
                ">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="
                  text-gray-300
                  hover:text-white
                  transition-colors
                ">
                  Mentions Légales
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="
              text-lg
              font-semibold
              mb-4
              text-[var(--color-axignis-secondary)]
            ">
              Contact
            </h3>
            <ul className="
              space-y-2
            ">
              <li className="
                flex
                items-start
                gap-2
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-[var(--color-axignis-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">
                  123 Avenue de la République<br />
                  75011 Paris, France
                </span>
              </li>
              <li className="
                flex
                items-center
                gap-2
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-axignis-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-300">+33 6 12 34 56 78</span>
              </li>
              <li className="
                flex
                items-center
                gap-2
              ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-axignis-secondary)]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-300">contact@axignis.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="
          mt-12
          pt-8
          border-t
          border-gray-700
          text-center
          text-gray-400
        ">
          <p>&copy; {new Date().getFullYear()} Axignis. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 