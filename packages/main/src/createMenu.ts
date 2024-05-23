import { Menu, MenuItemConstructorOptions, shell } from 'electron';
import { translate } from './helpers/translate';

export const createMenu = (): void => {
  const template: MenuItemConstructorOptions[] = [
    { role: 'editMenu' },
    {
      label: translate('systemMenuView'),
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
    {
      label: translate('systemMenuHelp'),
      submenu: [
        {
          label: translate('systemMenuHelpPage'),
          click: () => shell.openExternal(`${import.meta.env.VITE_APP_URL}/help/`),
        },
        {
          label: translate('systemMenuWebsite'),
          click: () => shell.openExternal(`${import.meta.env.VITE_APP_URL}`),
        },
      ],
    },
  ];

  if (process.platform === 'darwin') {
    template.unshift({ role: 'appMenu' });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
