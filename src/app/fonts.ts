import localFont from 'next/font/local';

export const centuryGothic = localFont({
  src: [
    { path: '../../public/fonts/centurygothic.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/centurygothic_bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-century-gothic',
});
