import services from '@/services';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import assertNonNullish from '@/shared/helpers/assertNonNullish';
import createLogger from '@/__bootstrap__/createLogger';
import setTheme from '@/__bootstrap__/setTheme';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Auth from './Auth';

const renderAuth = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [themeCss, translations] = await Promise.all([
    window.app.getThemeCss(),
    window.app.getTranslations(),
  ]);

  setTheme(themeCss);

  const queryParams = new URLSearchParams(window.location.search);
  const authParm = queryParams.get('auth');

  assertNonNullish(authParm, 'Unable to get "auth" param from URL');

  createRoot(container).render(
    <StrictMode>
      <TranslationsProvider commonTranslations={translations}>
        <Auth authWindow={JSON.parse(authParm)} logger={createLogger()} services={services} />
      </TranslationsProvider>
    </StrictMode>
  );
};

renderAuth();
