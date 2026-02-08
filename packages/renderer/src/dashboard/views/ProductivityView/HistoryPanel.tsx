import { useTranslate } from '@/shared/context/RuntimeContext';
import { Button } from '@/ui/dashboard/Button';
import { Panel } from '@/ui/dashboard/Panel';
import { Tooltip } from '@/ui/dashboard/Tooltip';
import { addWeeks, endOfWeek, format, subWeeks } from 'date-fns';
import { Accessor, Component, createMemo } from 'solid-js';
import ArrowIcon from './assets/arrow.svg';
import FilterIcon from './assets/filter.svg';
import styles from './HistoryPanel.module.scss';

type HistoryPanelProps = {
  getDateRange: Accessor<[Date, Date]>;
  initialDateRange: [Date, Date];
  onDateRangeChange(dateRange: [Date, Date]): void;
};

export const HistoryPanel: Component<HistoryPanelProps> = props => {
  const t = useTranslate();

  const getIsCurrentWeek = createMemo(
    () => props.getDateRange()[0].getTime() === props.initialDateRange[0].getTime()
  );

  const handlePreviousWeekClick = () => {
    const [currentStartOfWeek] = props.getDateRange();
    const newStartOfWeek = subWeeks(currentStartOfWeek, 1);

    props.onDateRangeChange([newStartOfWeek, endOfWeek(newStartOfWeek)]);
  };

  const handleNextWeekClick = () => {
    const [currentStartOfWeek] = props.getDateRange();
    const newStartOfWeek = addWeeks(currentStartOfWeek, 1);

    props.onDateRangeChange([newStartOfWeek, endOfWeek(newStartOfWeek)]);
  };

  const handleThisWeekClick = () => {
    props.onDateRangeChange(props.initialDateRange);
  };

  const getDateRangeHeading = () => {
    const [startDate, endDate] = props.getDateRange();

    const isSameMonth = startDate.getMonth() === endDate.getMonth();
    const isSameYear = startDate.getFullYear() === endDate.getFullYear();

    const startDateFormat = isSameYear ? 'MMMM d' : 'MMMM d, yyyy';
    const endDateFormat = isSameMonth ? 'd, yyyy' : 'MMMM d, yyyy';

    const enDash = '\u2013';

    return `${format(startDate, startDateFormat)}${enDash}${format(endDate, endDateFormat)}`;
  };

  return (
    <Panel heading={t('productivityHistoryLabel')} padding="none">
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
          <Tooltip text={t('filter')}>
            {tooltipTargetRef => (
              <Button aria-label={t('filter')} iconOnly ref={tooltipTargetRef}>
                <FilterIcon height={12} />
              </Button>
            )}
          </Tooltip>
          <Button.Group aria-label={t('viewOptions')}>
            <Button variant="primary">{t('overview')}</Button>
            <Button>{t('timeline')}</Button>
          </Button.Group>
        </div>
      </header>
    </Panel>
  );
};
