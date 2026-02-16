import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { axisLeft, scaleBand, scaleLinear, select, timeDay } from 'd3';
import { format, parseISO } from 'date-fns';
import { Component, createEffect, createMemo, createSignal, For, onCleanup, Show } from 'solid-js';
import styles from './Chart.module.scss';
import { ChartTooltip, Tooltip, tooltipMaxWidth, TooltipWithPosition } from './ChartTooltip';
import { WeeklyProductivity } from './WeeklyProductivityPanels';

const allLegendTypes = [
  'task',
  'taskOver',
  'void',
  'pause',
  'shortBreak',
  'shortBreakOver',
  'longBreak',
  'longBreakOver',
] as const;

type ChartProps = {
  dateRange: [Date, Date];
  view: 'overview' | 'timeline';
  weeklyProductivity: WeeklyProductivity;
};

type OverviewSegment = {
  date: string;
  duration: number;
  overDuration: number;
  serviceId: string;
  type: 'task' | 'void';
  value: number;
};

export const Chart: Component<ChartProps> = props => {
  const settings = useSettings();
  const t = useTranslate();

  const [getChartWidth, setChartWidth] = createSignal(0);
  const [getChartHeight, setChartHeight] = createSignal(0);

  const [getTooltip, setTooltip] = createSignal<TooltipWithPosition>();

  const getLeftMargin = () => (props.view === 'overview' ? 64 : 88);

  createEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = chartRef.getBoundingClientRect();

      setChartWidth(width);
      setChartHeight(height);
    });

    resizeObserver.observe(chartRef);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  const getXDomain = createMemo(() => {
    const visibleDays = new Set(settings.productivityChartDays);

    return timeDay.range(...props.dateRange).filter(date => {
      const day = format(date, 'EEEEEE');
      const fullDate = format(date, 'yyyy-MM-dd');

      return visibleDays.has(day) || props.weeklyProductivity.has(fullDate);
    });
  });

  const getXScale = createMemo(() => {
    const xDomain = getXDomain();

    return scaleBand()
      .domain(xDomain.map(date => format(date, 'yyyy-MM-dd')))
      .range([getLeftMargin(), getChartWidth() - 32]);
  });

  const getYScale = createMemo(() => {
    const chartHeight = getChartHeight();

    const yScale = scaleLinear();

    if (chartHeight === 0) {
      // Avoid rendering issues on initial load when height is 0. Otherwise we might get negative values.
      yScale.range([0, 0]);
    } else {
      yScale.range([chartHeight - 12, 12]);
    }

    if (props.view === 'timeline') {
      yScale.domain([24, 0]);
    } else {
      const yMax = Array.from(props.weeklyProductivity.values()).reduce(
        (max, { pomodoros, voidedPomodoros }) => {
          const currentMax = Math.round(pomodoros + voidedPomodoros) + 1;

          return Math.max(max, currentMax);
        },
        10
      );

      yScale.domain([0, yMax]);
    }

    return yScale;
  });

  const getLegendTypes = createMemo(() =>
    props.view === 'timeline'
      ? allLegendTypes
      : allLegendTypes.filter(type => type === 'task' || type === 'void')
  );

  createEffect(() => {
    drawYAxis();
    drawXColumns();

    if (props.view === 'overview') {
      drawOverviewChart();
    }
  });

  const handleXColumnMouseMove = (event: MouseEvent, date: string) => {
    // Reactivity is handled by D3
    // eslint-disable-next-line solid/reactivity
    showTooltip(date, event.offsetY, () => {
      const productivity = props.weeklyProductivity.get(date);

      const tooltip: Tooltip = {
        title: format(parseISO(date), 'EEEE, MMMM d, yyyy'),
        content: [],
      };

      if (!productivity) {
        tooltip.content.push({
          type: 'text',
          value: t('unableToLoadData'),
        });
      } else {
        tooltip.content.push(
          {
            type: 'stats',
            stats: [
              {
                label: t('tooltip.stat.pomodoros'),
                type: 'number',
                value: productivity.pomodoros,
              },
              {
                label: t('tooltip.stat.taskTime'),
                type: 'duration',
                value: productivity.taskTime,
              },
              {
                label: t('tooltip.stat.overTaskTime'),
                type: 'duration',
                value: productivity.overTaskTime,
              },
            ],
          },
          {
            type: 'stats',
            stats: [
              {
                label: t('tooltip.stat.breakTime'),
                type: 'duration',
                value: productivity.breakTime,
              },
              {
                label: t('tooltip.stat.overBreakTime'),
                type: 'duration',
                value: productivity.overBreakTime,
              },
            ],
          },
          {
            type: 'stats',
            stats: [
              {
                label: t('tooltip.stat.voidedPomodoros'),
                type: 'number',
                value: productivity.voidedPomodoros,
              },
              {
                label: t('tooltip.stat.voidedTime'),
                type: 'duration',
                value: productivity.voidTime,
              },
            ],
          }
        );
      }

      return tooltip;
    });
  };

  const handleBarSegmentMouseMove = (event: MouseEvent, segment: OverviewSegment) => {
    showTooltip(segment.date, event.offsetY, () => {
      const tooltip: Tooltip = {
        title: segment.serviceId,
        content: [],
      };

      if (segment.type === 'task') {
        tooltip.content.push({
          type: 'stats',
          stats: [
            {
              label: t('tooltip.stat.pomodoros'),
              type: 'number',
              value: segment.value,
            },
            {
              label: t('tooltip.stat.taskTime'),
              type: 'duration',
              value: segment.duration,
            },
            {
              label: t('tooltip.stat.overTaskTime'),
              type: 'duration',
              value: segment.overDuration,
            },
          ],
        });
      } else {
        tooltip.content.push({
          type: 'stats',
          stats: [
            {
              label: t('tooltip.stat.voidedPomodoros'),
              type: 'number',
              value: segment.value,
            },
            {
              label: t('tooltip.stat.voidedTime'),
              type: 'duration',
              value: segment.duration,
            },
          ],
        });
      }

      return tooltip;
    });
  };

  const handleTooltipHide = () => {
    tooltipRef = undefined;
    setTooltip(undefined);
  };

  const drawYAxis = () => {
    const axis = axisLeft(getYScale());

    if (props.view === 'timeline') {
      axis.ticks(24).tickFormat(tick => {
        const tickValue = tick.valueOf();
        const meridiem = tickValue < 12 || tickValue === 24 ? 'AM' : 'PM';
        const hour = tickValue > 12 || tickValue === 0 ? Math.abs(tickValue - 12) : tickValue;

        return `${hour} ${meridiem}`;
      });
    }

    select(yAxisRef)
      .html('')
      .call(axis)
      .call(axis => {
        axis.attr('text-anchor', null);
        axis.attr('font-family', null);
        axis.attr('font-size', null);
        axis.select('.domain').remove();

        axis.selectAll('.tick line').attr('class', styles.line).attr('x1', 0).attr('x2', '100%');

        axis.selectAll('.tick').each((_datum, index, group) => {
          const tick = select(group[index]);
          const text = tick.select('text');
          const textNode = text.node();

          if (textNode instanceof SVGTextElement) {
            text.attr('class', styles.value).attr('x', 32);

            // Add a white background rectangle behind the text for better readability
            const { height, width, x, y } = textNode.getBBox();
            const textBackgroundOffset = 4;

            tick
              .insert('rect', 'text')
              .attr('width', width + textBackgroundOffset * 2)
              .attr('height', height + textBackgroundOffset * 2)
              .attr('x', x - textBackgroundOffset)
              .attr('y', y - textBackgroundOffset)
              .attr('class', styles.textBackground);
          }
        });
      });
  };

  const drawXColumns = () => {
    const xScale = getXScale();
    const yScale = getYScale();

    const [yMin, yMax] = yScale.domain();
    const width = xScale.bandwidth();
    const height = yScale(yMin) - yScale(yMax);
    const y = yScale(yMax);

    select(xColumnsRef)
      .html('')
      .selectAll('rect')
      .data(getXDomain().map(date => format(date, 'yyyy-MM-dd')))
      .enter()
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', date => xScale(date) ?? 0)
      .attr('y', y)
      .on('mousemove', handleXColumnMouseMove)
      .on('mouseout', handleTooltipHide);
  };

  const drawOverviewChart = () => {
    const xScale = getXScale();
    const yScale = getYScale();

    const fullHeight = yScale(0);
    const width = xScale.bandwidth() * 0.8;
    const x = (xScale.bandwidth() - width) / 2;

    const bars = select(barsRef)
      .html('')
      .selectAll('g')
      .data(props.weeklyProductivity)
      .enter()
      .append('g')
      .attr(
        'transform',
        ([date, { pomodoros, voidedPomodoros }]) =>
          `translate(${xScale(date)}, ${yScale(pomodoros + voidedPomodoros)})`
      );

    barGroupsByDate = {};
    bars.each(([date], index, nodes) => {
      barGroupsByDate[date] = nodes[index];
    });

    const segments = bars
      .selectAll('g')
      .data(([date, data]) => {
        // Group events by service and type to aggregate pomodoro counts
        const eventGroups = new Map<string, OverviewSegment>();

        for (const event of data.events) {
          if (event.type !== 'task' && event.type !== 'void') {
            continue;
          }

          const groupKey = `${event.type}:${event.serviceId}`;
          const group = eventGroups.get(groupKey) ?? {
            date,
            duration: 0,
            overDuration: 0,
            serviceId: event.serviceId,
            type: event.type,
            value: 0,
          };

          group.duration += event.meta.duration;
          group.value += event.type === 'task' ? event.meta.pomodoros : event.meta.voidedPomodoros;

          if (event.type === 'task') {
            for (const childEvent of event.children) {
              if (childEvent.type === 'over_task') {
                group.overDuration += childEvent.meta.duration;
              }
            }
          }

          eventGroups.set(groupKey, group);
        }

        // Sort so voided pomodoros render at the top, then by value for stacking order
        const sortedGroups = Array.from(eventGroups.values()).sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'void' ? -1 : 1;
          }

          return a.value - b.value;
        });

        // Calculate y positions for stacked bar segments
        let cumulativeY = 0;

        return sortedGroups.map(group => {
          const height = fullHeight - yScale(group.value);
          const y = cumulativeY;

          cumulativeY += height;

          return {
            ...group,
            height,
            y,
          };
        });
      })
      .enter();

    segments
      .append('rect')
      .attr('data-testid', ({ serviceId, type }) => `bar-segment-${serviceId}-${type}`)
      .attr('data-type', ({ type }) => type)
      .attr('width', width)
      .attr('height', ({ height }) => height)
      .attr('x', x)
      .attr('y', ({ y }) => y)
      .on('mousemove', handleBarSegmentMouseMove)
      .on('mouseout', handleTooltipHide);

    segments
      .filter((_data, index) => index > 0)
      .append('line')
      .classed(styles.eventBorder, true)
      .attr('transform', ({ y }) => `translate(${x}, ${y})`)
      .attr('x2', width);
  };

  const showTooltip = (date: string, mouseY: number, createTooltip: () => Tooltip) => {
    // The tooltip already exists, just update its position
    if (tooltipRef) {
      tooltipRef.style.top = `${mouseY}px`;

      return;
    }

    const barGroup = barGroupsByDate[date];

    if (!barGroup || !(barGroup instanceof SVGGElement)) {
      return;
    }

    const chartBounds = chartRef.getBoundingClientRect();
    const barGroupBounds = barGroup.getBoundingClientRect();

    const exceedsRightBoundary = barGroupBounds.right + tooltipMaxWidth > chartBounds.right;
    const offset = 12;

    const x = exceedsRightBoundary
      ? chartBounds.right - barGroupBounds.left + offset
      : barGroupBounds.right - chartBounds.left + offset;

    setTooltip({
      ...createTooltip(),
      position: {
        alignment: exceedsRightBoundary ? 'right' : 'left',
        x,
        y: mouseY,
      },
    });
  };

  let barGroupsByDate: Record<string, SVGGElement> = {};

  let barsRef!: SVGGElement;
  let chartRef!: SVGSVGElement;
  let xColumnsRef!: SVGGElement;
  let yAxisRef!: SVGGElement;

  // The tooltip is dynamically created, so the reference may not always exist
  let tooltipRef: HTMLDivElement | undefined;

  return (
    <div
      classList={{
        [styles.chart]: true,
        [styles.isTimeline]: props.view === 'timeline',
      }}
    >
      <svg class={styles.plot} ref={chartRef}>
        <defs>
          <pattern height="10" id="overTask" patternUnits="userSpaceOnUse" width="10">
            <rect fill="var(--dashboard-chart-over-task-background)" height="10" width="10" />
            <path
              d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5"
              stroke="var(--dashboard-chart-over-task-line)"
            />
          </pattern>
          <pattern height="10" id="overShortBreak" patternUnits="userSpaceOnUse" width="10">
            <rect
              fill="var(--dashboard-chart-over-short-break-background)"
              height="10"
              width="10"
            />
            <path
              d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5"
              stroke="var(--dashboard-chart-over-short-break-line)"
            />
          </pattern>
          <pattern height="10" id="overLongBreak" patternUnits="userSpaceOnUse" width="10">
            <rect fill="var(--dashboard-chart-over-long-break-background)" height="10" width="10" />
            <path
              d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5"
              stroke="var(--dashboard-chart-over-long-break-line)"
            />
          </pattern>
          <pattern height="8" id="void" patternUnits="userSpaceOnUse" width="8">
            <path d="M0,8L8,0 M0,0l8,8" stroke="var(--dashboard-chart-task)" />
          </pattern>
        </defs>
        <g class={styles.yAxis} data-testid="productivity-chart-y-axis" ref={yAxisRef} />
        <g
          class={styles.dateBackgrounds}
          data-testid="productivity-chart-date-backgrounds"
          ref={xColumnsRef}
        />
        <g data-testid="productivity-chart-bars" ref={barsRef} />
      </svg>
      <Show when={getTooltip()}>
        {getTooltip => <ChartTooltip tooltip={getTooltip()} ref={tooltipRef} />}
      </Show>
      <footer class={styles.footer}>
        <div class={styles.xAxis} style={{ 'padding-left': `${getLeftMargin()}px` }}>
          <For each={getXDomain()}>
            {date => <div class={styles.date}>{format(date, 'MMM d')}</div>}
          </For>
        </div>
        <div class={styles.legend}>
          <For each={getLegendTypes()}>
            {type => (
              <div class={styles.item}>
                <svg width={24} height={16}>
                  <rect width={24} height={16} data-type={type} />
                </svg>
                <span>{t(`legend.${type}`)}</span>
              </div>
            )}
          </For>
        </div>
      </footer>
    </div>
  );
};
