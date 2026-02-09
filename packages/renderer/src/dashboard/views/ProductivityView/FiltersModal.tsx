import { useDashboard } from '@/dashboard/context/DashboardContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Modal } from '@/ui/dashboard/Modal';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { Component, createSignal, For, onMount } from 'solid-js';
import { unwrap } from 'solid-js/store';
import styles from './FiltersModal.module.scss';

type FiltersModalProps = {
  onHide(): void;
};

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const FiltersModal: Component<FiltersModalProps> = props => {
  const { getSetting, setSetting } = useDashboard();
  const t = useTranslate();

  const initialDisplayedDays = new Set(unwrap(getSetting('productivityChartDays')));
  const [getDisplayedDays, setDisplayedDays] = createSignal(initialDisplayedDays);

  onMount(() => {
    modalRef.showModal();
  });

  const handleModalConfirm = () => {
    const didUpdate = !!initialDisplayedDays.symmetricDifference(getDisplayedDays()).size;

    if (!didUpdate) {
      return;
    }

    const displayedDays = getDisplayedDays();
    const sortedDisplayedDays = daysOfWeek.filter(day => displayedDays.has(day));

    setSetting('productivityChartDays', sortedDisplayedDays);
  };

  const handleDayToggle = (day: (typeof daysOfWeek)[number]) => {
    setDisplayedDays(previousDisplayedDays => {
      const newSet = new Set(previousDisplayedDays);

      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }

      return newSet;
    });
  };

  let modalRef!: HTMLDialogElement;

  return (
    <Modal
      buttons={[
        {
          children: t('done'),
          onClick: handleModalConfirm,
          variant: 'primary',
        },
        {
          autofocus: true,
          children: t('cancel'),
        },
      ]}
      heading={t('chartFilters')}
      onHide={props.onHide}
      ref={modalRef}
    >
      <ul class={styles.filters}>
        <li>
          <span>
            {t('displayedDays')}
            <sup aria-describedby="displayed-days-footnote">*</sup>
          </span>
          <Button.Group aria-label={t('displayedDays')}>
            <For each={daysOfWeek}>
              {day => (
                <Tooltip text={t(`day.${day}.full`)}>
                  {tooltipTargetRef => (
                    <Button
                      aria-label={t(`day.${day}.full`)}
                      aria-pressed={getDisplayedDays().has(day)}
                      onClick={[handleDayToggle, day]}
                      ref={tooltipTargetRef}
                      variant={getDisplayedDays().has(day) ? 'primary' : 'default'}
                    >
                      {t(`day.${day}`)}
                    </Button>
                  )}
                </Tooltip>
              )}
            </For>
          </Button.Group>
        </li>
      </ul>
      <p class={styles.footnote}>
        <small>
          <sup>*</sup>
          <span id="displayed-days-footnote">{t('displayedDaysFootnote')}</span>
        </small>
      </p>
    </Modal>
  );
};
