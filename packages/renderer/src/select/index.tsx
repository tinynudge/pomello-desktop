import Select from '@/select/Select';
import services from '@/services';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const renderSelect = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const settings = await window.app.getSettings();

  createRoot(container).render(
    <StrictMode>
      <Select services={services} settings={settings} />
    </StrictMode>
  );
};

renderSelect();
