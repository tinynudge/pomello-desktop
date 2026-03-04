import { usePomelloApi } from '@/shared/context/PomelloApiContext';
import { useTranslate } from '@/shared/context/RuntimeContext';
import { Input } from '@/ui/dashboard/Input';
import { Modal, ModalButtonProps } from '@/ui/dashboard/Modal';
import { Select } from '@/ui/dashboard/Select';
import { TaskNamesById, ValidationMessage } from '@pomello-desktop/domain';
import { useQuery, useQueryClient } from '@tanstack/solid-query';
import { format, subDays } from 'date-fns';
import { Component, createMemo, createSignal, JSX, Match, Switch } from 'solid-js';
import styles from './ExportModal.module.scss';
import { useTaskNameHelpers } from './TaskNameHelpersContext';
import { useExportHelpers } from './useExportHelpers';

type ExportModalProps = {
  ref: HTMLDialogElement;
};

type ProductivityData = {
  content: string;
  defaultPath: string;
  format: 'csv' | 'json';
};

const queryKey = ['exportProductivityData'];

export const ExportModal: Component<ExportModalProps> = props => {
  const pomelloApi = usePomelloApi();
  const queryClient = useQueryClient();

  const { extractServiceIds, getFetchTaskNames } = useTaskNameHelpers();
  const { transformToCsv, transformToJson } = useExportHelpers();
  const t = useTranslate();

  const today = format(new Date(), 'yyyy-MM-dd');
  const oneWeekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

  const [getStartDate, setStartDate] = createSignal(oneWeekAgo);
  const [getEndDate, setEndDate] = createSignal(today);
  const [getFormat, setFormat] = createSignal<'csv' | 'json'>('json');

  const getStartDateValidationMessage = createMemo<ValidationMessage | undefined>(() => {
    const startDate = getStartDate();
    const endDate = getEndDate();

    if (!startDate) {
      return {
        text: t('validDateRequired'),
        type: 'error',
      };
    }

    if (endDate && startDate > endDate) {
      return {
        text: t('invalidDateRange'),
        type: 'error',
      };
    }
  });

  const getEndDateValidationMessage = createMemo<ValidationMessage | undefined>(() => {
    const endDate = getEndDate();

    if (!endDate) {
      return {
        text: t('validDateRequired'),
        type: 'error',
      };
    }

    if (endDate > today) {
      return {
        text: t('endDateInFuture'),
        type: 'error',
      };
    }
  });

  const getHasValidationErrors = createMemo(
    () => !!getStartDateValidationMessage() || !!getEndDateValidationMessage()
  );

  const productivityData = useQuery<ProductivityData | null>(() => ({
    cacheTime: 0,
    enabled: false,
    queryFn: async () => {
      const startDate = getStartDate();
      const endDate = getEndDate();
      const format = getFormat();

      const events = await pomelloApi.fetchEvents({ startDate, endDate });

      if (events.length === 0) {
        return null;
      }

      const serviceIdsByService = extractServiceIds(events);

      const result = await Promise.allSettled(
        serviceIdsByService.entries().map(async ([service, serviceIds]) => {
          const fetchTaskNames = await getFetchTaskNames(service);

          return await fetchTaskNames?.(serviceIds);
        })
      );

      const taskNamesById = result.reduce<TaskNamesById>((taskNames, response) => {
        if (response.status === 'fulfilled' && response.value) {
          return { ...taskNames, ...response.value };
        }
        return taskNames;
      }, {});

      const defaultPath = `pomello-export-${startDate}-${endDate}.${format}`;

      const content =
        format === 'csv'
          ? transformToCsv(events, taskNamesById)
          : transformToJson(events, taskNamesById);

      return { content, defaultPath, format };
    },
    queryKey,
    staleTime: 0,
  }));

  const handleStartDateChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setStartDate(event.currentTarget.value);
  };

  const handleEndDateChange: JSX.EventHandler<HTMLInputElement, InputEvent> = event => {
    setEndDate(event.currentTarget.value);
  };

  const handleFormatChange = (value: 'csv' | 'json') => {
    setFormat(value);
  };

  const handleBackClick = () => {
    resetQuery();
  };

  const handleFileSave = async ({ content, defaultPath, format }: ProductivityData) => {
    const filePath = await window.app.showSaveDialog({
      defaultPath,
      filters: [
        {
          name: format.toUpperCase(),
          extensions: [format],
        },
      ],
    });

    if (filePath) {
      window.app.writeFile({ filePath, content });

      modalRef.close();
    }
  };

  const handleModalHide = () => {
    resetQuery();
  };

  const getPrimaryButton = (): ModalButtonProps => {
    const data = productivityData.data;

    if (productivityData.isSuccess && data) {
      return {
        children: t('exportSave'),
        onClick: () => handleFileSave(data),
        preventClose: true,
        variant: 'primary',
      };
    }

    if (productivityData.isSuccess && !data) {
      return {
        children: t('exportBack'),
        onClick: handleBackClick,
        preventClose: true,
        variant: 'primary',
      };
    }

    return {
      children: productivityData.isFetching ? t('exportingInProgress') : t('export'),
      disabled: productivityData.isFetching || getHasValidationErrors(),
      onClick: () => productivityData.refetch(),
      preventClose: true,
      variant: 'primary',
    };
  };

  const resetQuery = () => queryClient.resetQueries({ queryKey });

  const mergeRefs = (element: HTMLDialogElement) => {
    /* @ts-expect-error Solid uses the callback form when forwarding refs */
    props.ref?.(element);
    modalRef = element;
  };

  let modalRef!: HTMLDialogElement;

  return (
    <Modal
      buttons={[
        ...(!productivityData.isError ? [getPrimaryButton()] : []),
        {
          autofocus: true,
          children: t('cancel'),
        },
      ]}
      heading={t('exportData')}
      onHide={handleModalHide}
      ref={mergeRefs}
    >
      <Switch>
        <Match when={productivityData.isSuccess && !productivityData.data}>
          <p>{t('exportNoEvents')}</p>
          <p>{t('exportChooseDifferentDates')}</p>
        </Match>
        <Match when={productivityData.isSuccess && productivityData.data}>
          <p>{t('exportSuccess')}</p>
        </Match>
        <Match when={productivityData.isError}>
          <p>{t('exportFailed')}</p>
        </Match>
        <Match when={true}>
          <form>
            <ul class={styles.fields}>
              <li>
                <label for="export-start-date">{t('exportStartDateLabel')}</label>
                <Input
                  disabled={productivityData.isFetching}
                  id="export-start-date"
                  max={getEndDate() || today}
                  message={getStartDateValidationMessage()}
                  onInput={handleStartDateChange}
                  type="date"
                  value={getStartDate()}
                />
              </li>
              <li>
                <label for="export-end-date">{t('exportEndDateLabel')}</label>
                <Input
                  disabled={productivityData.isFetching}
                  id="export-end-date"
                  max={today}
                  message={getEndDateValidationMessage()}
                  min={getStartDate()}
                  onInput={handleEndDateChange}
                  type="date"
                  value={getEndDate()}
                />
              </li>
              <li>
                <label for="export-format">{t('exportFormatLabel')}</label>
                <Select
                  disabled={productivityData.isFetching}
                  id="export-format"
                  onChange={handleFormatChange}
                  options={[
                    { id: 'json', label: 'JSON' },
                    { id: 'csv', label: 'CSV' },
                  ]}
                  value={getFormat()}
                />
              </li>
            </ul>
          </form>
        </Match>
      </Switch>
    </Modal>
  );
};
