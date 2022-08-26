import Select from '@/select/Select';
import services from '@/services';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const renderSelect = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [settings, themeCss, translations, serviceId] = await Promise.all([
    window.app.getSettings(),
    window.app.getThemeCss(),
    window.app.getTranslations(),
    window.app.getActiveServiceId(),
  ]);

  document.body.style.cssText = themeCss;
  window.app.onThemeCssChange(newThemeCss => {
    document.body.style.cssText = newThemeCss;
  });

  createRoot(container).render(
    <StrictMode>
      <TranslationsProvider commonTranslations={translations}>
        <Select initialServiceId={serviceId} services={services} settings={settings} />
      </TranslationsProvider>
    </StrictMode>
  );
};

renderSelect();
