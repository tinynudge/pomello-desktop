import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { addWeeks, endOfWeek, format, subWeeks } from 'date-fns';
import { Component, createEffect, createMemo, createSignal, onCleanup, Show } from 'solid-js';
import ArrowIcon from './assets/arrow.svg';
import FilterIcon from './assets/filter.svg';
import { Chart } from './Chart';
import { FiltersModal } from './FiltersModal';
import styles from './HistoryPanel.module.scss';
import { getStoredView, setStoredView } from './storedView';
import { WeeklyProductivity } from './WeeklyProductivityPanels';

type HistoryPanelProps = {
  dateRange: [Date, Date];
  initialDateRange: [Date, Date];
  onDateRangeChange(dateRange: [Date, Date]): void;
  weeklyProductivity: WeeklyProductivity;
};

export const HistoryPanel: Component<HistoryPanelProps> = props => {
  const t = useTranslate();

  const [getView, setView] = createSignal(getStoredView());
  const [getIsFiltersModalOpen, setIsFiltersModalOpen] = createSignal(false);

  const getIsCurrentWeek = createMemo(
    () => props.dateRange[0].getTime() === props.initialDateRange[0].getTime()
  );

  createEffect(() => {
    if (getView() === 'timeline') {
      const updatePanelHeight = () => {
        const { top } = contentRef.getBoundingClientRect();

        const height = window.innerHeight - window.scrollY - Math.ceil(top) - 32;

        contentRef.style.height = `${height}px`;
      };

      updatePanelHeight();

      window.addEventListener('resize', updatePanelHeight);

      onCleanup(() => {
        window.removeEventListener('resize', updatePanelHeight);
      });
    } else {
      contentRef.style.height = '';
    }
  });

  const handlePreviousWeekClick = () => {
    const [currentStartOfWeek] = props.dateRange;
    const newStartOfWeek = subWeeks(currentStartOfWeek, 1);

    props.onDateRangeChange([newStartOfWeek, endOfWeek(newStartOfWeek)]);
  };

  const handleNextWeekClick = () => {
    const [currentStartOfWeek] = props.dateRange;
    const newStartOfWeek = addWeeks(currentStartOfWeek, 1);

    props.onDateRangeChange([newStartOfWeek, endOfWeek(newStartOfWeek)]);
  };

  const handleThisWeekClick = () => {
    props.onDateRangeChange(props.initialDateRange);
  };

  const handleFilterClick = () => {
    setIsFiltersModalOpen(true);
  };

  const handleFiltersModalHide = () => {
    setIsFiltersModalOpen(false);
  };

  const handleViewChange = (view: 'overview' | 'timeline') => {
    setView(view);
    setStoredView(view);
  };

  const getDateRangeHeading = () => {
    const [startDate, endDate] = props.dateRange;

    const isSameMonth = startDate.getMonth() === endDate.getMonth();
    const isSameYear = startDate.getFullYear() === endDate.getFullYear();

    const startDateFormat = isSameYear ? 'MMMM d' : 'MMMM d, yyyy';
    const endDateFormat = isSameMonth ? 'd, yyyy' : 'MMMM d, yyyy';

    const enDash = '\u2013';

    return `${format(startDate, startDateFormat)}${enDash}${format(endDate, endDateFormat)}`;
  };

  let contentRef!: HTMLDivElement;

  return (
    <>
      <Panel
        contentClass={styles.historyPanel}
        contentRef={element => (contentRef = element)}
        heading={t('productivityHistoryLabel')}
        padding="none"
      >
        <header class={styles.header}>
          <div>
            <h3 aria-live="polite">{getDateRangeHeading()}</h3>
            <Button.Group>
              <Tooltip alignment="bottom" text={t('previousWeekLabel')}>
                {tooltipTargetRef => (
                  <Button
                    aria-label={t('previousWeekLabel')}
                    iconOnly
                    onClick={handlePreviousWeekClick}
                    ref={tooltipTargetRef}
                    size="small"
                  >
                    <ArrowIcon height={10} style={{ transform: 'rotate(180deg)' }} />
                  </Button>
                )}
              </Tooltip>
              <Tooltip alignment="bottom" text={t('thisWeekLabel')}>
                {tooltipTargetRef => (
                  <Button
                    aria-label={t('thisWeekLabel')}
                    disabled={getIsCurrentWeek()}
                    iconOnly
                    onClick={handleThisWeekClick}
                    ref={tooltipTargetRef}
                    size="small"
                  >
                    <span class={styles.thisWeekDot} />
                  </Button>
                )}
              </Tooltip>
              <Tooltip alignment="bottom" text={t('nextWeekLabel')}>
                {tooltipTargetRef => (
                  <Button
                    aria-label={t('nextWeekLabel')}
                    disabled={getIsCurrentWeek()}
                    iconOnly
                    onClick={handleNextWeekClick}
                    ref={tooltipTargetRef}
                    size="small"
                  >
                    <ArrowIcon height={10} />
                  </Button>
                )}
              </Tooltip>
            </Button.Group>
          </div>
          <div class={styles.actions}>
            <Tooltip text={t('filters')}>
              {tooltipTargetRef => (
                <Button
                  aria-label={t('filters')}
                  iconOnly
                  onClick={handleFilterClick}
                  ref={tooltipTargetRef}
                >
                  <FilterIcon height={12} />
                </Button>
              )}
            </Tooltip>
            <Button.Group aria-label={t('viewOptions')}>
              <Button
                aria-pressed={getView() === 'overview'}
                onClick={[handleViewChange, 'overview']}
                variant={getView() === 'overview' ? 'primary' : undefined}
              >
                {t('overview')}
              </Button>
              <Button
                aria-pressed={getView() === 'timeline'}
                onClick={[handleViewChange, 'timeline']}
                variant={getView() === 'timeline' ? 'primary' : undefined}
              >
                {t('timeline')}
              </Button>
            </Button.Group>
          </div>
        </header>
        <Chart
          dateRange={props.dateRange}
          view={getView()}
          weeklyProductivity={props.weeklyProductivity}
        />
      </Panel>
      <Show when={getIsFiltersModalOpen()}>
        <FiltersModal onHide={handleFiltersModalHide} />
      </Show>
    </>
  );
};
