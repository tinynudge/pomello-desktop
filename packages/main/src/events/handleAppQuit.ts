import { getSettings } from '@/getSettings';
import { translate } from '@/helpers/translate';
import { app, dialog, Event } from 'electron';

export const handleAppQuit = async (event: Event) => {
  const settings = getSettings();
  const warnBeforeAppQuit = settings.get('warnBeforeAppQuit');

  event.preventDefault();

  if (!warnBeforeAppQuit) {
    app.exit();

    return;
  }

  const { response } = await dialog.showMessageBox({
    buttons: [translate('quitAppConfirm'), translate('quitAppCancel')],
    cancelId: 1,
    defaultId: 0,
    message: translate('quitAppMessage'),
    type: 'question',
  });

  if (response === 0) {
    app.exit();
  }
};
