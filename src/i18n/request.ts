import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = 'fr';
  const namespace = 'common';

  return {
    locale,
    messages: (await import(`../../public/locales/${locale}/${namespace}.json`)).default
  };
});