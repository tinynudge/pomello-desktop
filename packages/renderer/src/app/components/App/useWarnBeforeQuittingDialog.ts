import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { onCleanup, onMount } from 'solid-js';

export const useWarnBeforeQuittingDialog = () => {
  const settings = useSettings();
  const t = useTranslate();

  onMount(() => {
    const handleWindowClose = async (event: BeforeUnloadEvent) => {
      if (!settings.warnBeforeAppQuit) {
        return;
      }

      event.preventDefault();

      const { response } = await window.app.showMessageBox({
        type: 'question',
        message: t('quitAppMessage'),
        buttons: [t('quitAppConfirm'), t('quitAppCancel')],
        defaultId: 0,
        cancelId: 1,
      });

      if (response === 0) {
        window.app.quitApp();
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);

    onCleanup(() => {
      window.removeEventListener('beforeunload', handleWindowClose);
    });
  });
};
