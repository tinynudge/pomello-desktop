import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import winston from 'winston';
import createAppWindows from './createAppWindows';
import createMenu from './createMenu';
import getPomelloConfig from './getPomelloConfig';
import initializeListeners from './helpers/initializeListeners';
import translate from './helpers/translate';
import logger from './logger';

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

app.whenReady().then(async () => {
  const pomelloConfig = getPomelloConfig();
  const isDebugMode = pomelloConfig.get('debug');

  if (isDebugMode) {
    const { response } = await dialog.showMessageBox({
      buttons: [translate('debugModeConfirm'), translate('debugModeCancel')],
      defaultId: 0,
      message: translate('debugModeMessage'),
      title: translate('debugModeHeading'),
      type: 'info',
    });

    if (response === 0) {
      pomelloConfig.delete('debug');
    } else {
      logger.add(
        new winston.transports.File({
          filename: `${app.getPath('userData')}/debug.log`,
          handleExceptions: true,
          level: 'debug',
        })
      );
    }
  }

  initializeListeners();

  createMenu();

  createAppWindows();

  logger.debug('Did start application');
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
    .then(() => {
      const pomelloConfig = getPomelloConfig();
      const releaseChannel = pomelloConfig.get('releaseChannel') ?? 'latest';

      autoUpdater.channel = releaseChannel;

      autoUpdater.logger = logger;

      autoUpdater.setFeedURL(import.meta.env.VITE_AUTO_UPDATE_URL);

      autoUpdater.checkForUpdatesAndNotify();
    })
    .catch(error => console.error('Failed to check for updates:', error));
}
