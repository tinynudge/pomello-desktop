import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Modal } from '@/ui/dashboard/Modal';
import { Select } from '@/ui/dashboard/Select';
import { Component, For, onMount } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { BoardOrList, TrelloConfigStore, TrelloPreferences } from '../domain';
import styles from './PreferencesModal.module.scss';
import { preferences } from './TrelloConfigureView';

type PreferencesModalProps = {
  boardOrList: BoardOrList;
  onHide(): void;
};

export const PreferencesModal: Component<PreferencesModalProps> = props => {
  const t = useTranslate();
  const { getServiceConfigValue, setServiceConfigValue } = useConfigureService<TrelloConfigStore>();

  onMount(() => {
    modal.showModal();
  });

  const handleConfirm = () => {
    const formData = new FormData(form);
    const updatedPreferencesMap = new Map<keyof TrelloPreferences, boolean>();

    for (const [key, value] of formData.entries()) {
      if (value === 'default') {
        continue;
      }

      updatedPreferencesMap.set(key as keyof TrelloPreferences, value === 'enabled');
    }

    const preferences = unwrap(getServiceConfigValue('preferences'));
    const { item, type } = props.boardOrList;
    const categoryKey = type === 'board' ? 'boards' : 'lists';

    const updatedPreferences = {
      ...preferences,
      [categoryKey]: {
        ...preferences?.[categoryKey],
        [item.id]: Object.fromEntries(updatedPreferencesMap),
      },
    };

    // If no preferences were set, remove the empty object to avoid clutter
    if (updatedPreferences?.[categoryKey] && updatedPreferencesMap.size === 0) {
      delete updatedPreferences[categoryKey][item.id];
    }

    // If after removal the category is empty, remove it as well
    if (
      updatedPreferences?.[categoryKey] &&
      Object.keys(updatedPreferences[categoryKey]).length === 0
    ) {
      delete updatedPreferences[categoryKey];
    }

    setServiceConfigValue('preferences', updatedPreferences);
  };

  const getHeading = () => {
    const itemName = props.boardOrList.item.name;

    return props.boardOrList.type === 'board'
      ? t('service:boardPreferencesHeading', { boardName: itemName })
      : t('service:listPreferencesHeading', { listName: itemName });
  };

  const getValue = (preference: keyof TrelloPreferences) => {
    const { item, type } = props.boardOrList;
    const preferences = getServiceConfigValue('preferences');

    const boardOrListPreferences = type === 'board' ? preferences?.boards : preferences?.lists;
    const value = boardOrListPreferences?.[item.id]?.[preference];

    if (value === undefined) {
      return 'default';
    }

    return value ? 'enabled' : 'disabled';
  };

  let modal!: HTMLDialogElement;
  let form!: HTMLFormElement;

  return (
    <Modal
      buttons={[
        {
          children: t('service:done'),
          onClick: handleConfirm,
          variant: 'primary',
        },
        {
          autofocus: true,
          children: t('service:cancel'),
        },
      ]}
      heading={getHeading()}
      onHide={() => props.onHide()}
      ref={modal}
    >
      <form ref={form}>
        <ul class={styles.preferences}>
          <For each={preferences}>
            {({ preference }) => (
              <li>
                <label for={`modal-preference-${preference}`}>
                  {t(`service:preference.${preference}`)}
                </label>
                <Select
                  id={`modal-preference-${preference}`}
                  name={preference}
                  options={[
                    { label: t('service:preference.default'), id: 'default' },
                    { label: t('service:preference.enabled'), id: 'enabled' },
                    { label: t('service:preference.disabled'), id: 'disabled' },
                  ]}
                  value={getValue(preference)}
                />
              </li>
            )}
          </For>
        </ul>
      </form>
    </Modal>
  );
};
