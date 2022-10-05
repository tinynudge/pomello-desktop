import { app } from 'electron';
import logger from 'electron-log';
import createAppWindows from './createAppWindows';
import createMenu from './createMenu';
import getPomelloConfig from './getPomelloConfig';
import initializeListeners from './helpers/initializeListeners';

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.setName('Pomello');

if (process.platform === 'win32') {
  app.setAppUserModelId(import.meta.env.VITE_APP_ID);
}

app.on('second-instance', createAppWindows);

app.on('window-all-closed', () => app.quit());

app.whenReady().then(() => {
  initializeListeners();

  createMenu();

  createAppWindows();
});

if (import.meta.env.DEV) {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS }) => {
      installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
    });
}

if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => {
      const pomelloConfig = getPomelloConfig();
      const releaseChannel = pomelloConfig.get('releaseChannel') ?? 'latest';

      autoUpdater.channel = releaseChannel;

      autoUpdater.logger = logger;

      autoUpdater.setFeedURL(import.meta.env.VITE_AUTO_UPDATE_URL);

      autoUpdater.checkForUpdatesAndNotify();
    })
    .catch(error => console.error('Failed to check for updates:', error));
}
