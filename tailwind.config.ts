// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'], // Police par défaut
        title: ['var(--font-century-gothic)', 'sans-serif'], // Pour les titres
      },
      colors: {
        axignis: {
          primary: '#0082CA',
          secondary: '#36B8FF',
          dark: '#363636',
          black: '#000000',
          grayDark: '#363636',
          grayMedium: '#6B6B6B',
        },
      },
    },
  },
  plugins: [],
}
export default config
