import { nanoid } from 'nanoid';
import { Component, For, Match, Switch } from 'solid-js';
import styles from './ChartTooltip.module.scss';

type ChartTooltipProps = {
  tooltip: TooltipWithPosition;
  ref?: HTMLDivElement;
};

export type TooltipWithPosition = Tooltip & { position: TooltipPosition };

export type Tooltip = {
  title: string;
  content: TooltipContent[];
};

type TooltipPosition = {
  alignment: 'left' | 'right';
  x: number;
  y: number;
};

type TooltipContent = StatsContent | TextContent;

type StatsContent = {
  type: 'stats';
  stats: {
    label: string;
    type: 'duration' | 'number';
    value: number;
  }[];
};

type TextContent = {
  type: 'text';
  value: string;
};

export const tooltipMaxWidth = 300;

export const ChartTooltip: Component<ChartTooltipProps> = props => {
  const getAlignment = () => {
    return props.tooltip.position.alignment === 'left'
      ? { left: `${props.tooltip.position.x}px` }
      : { right: `${props.tooltip.position.x}px` };
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.round((duration % 3600) / 60);

    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  };

  const formatNumber = (value: number) => Math.round(value * 100) / 100;

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
        <For each={props.tooltip.content}>
          {content => (
            <Switch>
              <Match when={content.type === 'text' && content.value}>
                {getValue => <p>{getValue()}</p>}
              </Match>
              <Match when={content.type === 'stats' && content.stats}>
                {getStats => (
                  <dl class={styles.stats}>
                    <For each={getStats()}>
                      {stat => {
                        const id = nanoid();

                        return (
                          <>
                            <dt id={id}>{stat.label}</dt>
                            <dd aria-labelledby={id}>
                              {stat.type === 'duration'
                                ? formatDuration(stat.value)
                                : formatNumber(stat.value)}
                            </dd>
                          </>
                        );
                      }}
                    </For>
                  </dl>
                )}
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </div>
  );
};
