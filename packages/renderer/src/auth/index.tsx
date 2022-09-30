import services from '@/services';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
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

  createRoot(container).render(
    <StrictMode>
      <TranslationsProvider commonTranslations={translations}>
        <Auth serviceId={queryParams.get('serviceId') ?? undefined} services={services} />
      </TranslationsProvider>
    </StrictMode>
  );
};

renderAuth();
