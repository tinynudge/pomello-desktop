import { useTranslate } from '@/shared/context/RuntimeContext';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';
import { Component, For, Show } from 'solid-js';
import styles from './ChartTooltip.module.scss';

export type Tooltip = {
  title: string;
  stats?: TooltipStat[][];
};

export type TooltipWithPosition = Tooltip & {
  position: {
    alignment: 'left' | 'right';
    x: number;
    y: number;
  };
};

export type TooltipStat = DurationStat | NumberStat | TextStat | TimeStat;

type ChartTooltipProps = {
  tooltip: TooltipWithPosition;
  ref?: HTMLDivElement;
};

type DurationStat = {
  labelKey: string;
  type: 'duration';
  value: number;
};

type NumberStat = {
  labelKey: string;
  type: 'number';
  value: number;
};

type TextStat = {
  labelKey: string;
  type: 'text';
  valueKey: string;
};

type TimeStat = {
  labelKey: string;
  type: 'time';
  value: Date;
};

export const tooltipMaxWidth = 300;

export const ChartTooltip: Component<ChartTooltipProps> = props => {
  const t = useTranslate();

  const getAlignment = () => {
    return props.tooltip.position.alignment === 'left'
      ? { left: `${props.tooltip.position.x}px` }
      : { right: `${props.tooltip.position.x}px` };
  };

  const getValue = (stat: TooltipStat) => {
    if (stat.type === 'duration') {
      const hours = Math.floor(stat.value / 3600);
      const minutes = Math.round((stat.value % 3600) / 60);

      return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
    }

    if (stat.type === 'number') {
      return Math.round(stat.value * 100) / 100;
    }

    if (stat.type === 'time') {
      return format(stat.value, 'h:mm aaa');
    }

    return t(stat.valueKey);
  };

  return (
    <div
      class={styles.chartTooltip}
      ref={props.ref}
      role="tooltip"
      style={{
        ...getAlignment(),
        'max-width': `${tooltipMaxWidth}px`,
        top: `${props.tooltip.position.y}px`,
      }}
    >
      <h4>{props.tooltip.title}</h4>
      <div class={styles.content}>
        <Show fallback={<p>{t('unableToLoadData')}</p>} when={props.tooltip.stats}>
          <div class={styles.stats}>
            <For each={props.tooltip.stats}>
              {statGroup => (
                <dl class={styles.statGroup}>
                  <For each={statGroup}>
                    {stat => {
                      const id = nanoid();

                      return (
                        <>
                          <dt id={id}>{t(stat.labelKey)}</dt>
                          <dd aria-labelledby={id}>{getValue(stat)}</dd>
                        </>
                      );
                    }}
                  </For>
                </dl>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
};
