import { getSettings } from '@/getSettings';
import { translate } from '@/helpers/translate';
import { app, dialog, Event } from 'electron';

export const handleAppBeforeQuit = async (event: Event) => {
  const settings = getSettings();
  const warnBeforeAppQuit = settings.get('warnBeforeAppQuit');

  if (!warnBeforeAppQuit) {
    return;
  }

  event.preventDefault();

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
