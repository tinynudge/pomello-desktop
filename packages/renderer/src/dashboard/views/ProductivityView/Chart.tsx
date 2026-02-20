import { useSettings, useTranslate } from '@/shared/context/RuntimeContext';
import { axisLeft, ScaleBand, scaleBand, ScaleLinear, scaleLinear, select, timeDay } from 'd3';
import { format, isWithinInterval } from 'date-fns';
import {
  batch,
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  Show,
} from 'solid-js';
import styles from './Chart.module.scss';
import { ChartTooltip, Tooltip, tooltipMaxWidth, TooltipWithPosition } from './ChartTooltip';
import { createOverviewsSegments, OverviewSegment } from './createOverviewsSegments';
import { createOverviewTooltip } from './createOverviewTooltip';
import { createTimelineSegments, TimelineSegment } from './createTimelineSegments';
import { createTimelineTooltip } from './createTimelineTooltip';
import { createXColumnTooltip } from './createXColumnTooltip';
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

type TimelineRenderedEvent = {
  isCurrentWeek: boolean;
};

type XScale = ScaleBand<string>;

export type YScale = ScaleLinear<number, number>;

const timelineRenderedEvent = 'timelineRendered';

export const Chart: Component<ChartProps> = props => {
  const settings = useSettings();
  const t = useTranslate();

  const [getTooltip, setTooltip] = createSignal<TooltipWithPosition>();
  const [getHiddenHour, setHiddenHour] = createSignal<number>();

  const [getXScale, setXScale] = createSignal<XScale | undefined>(undefined, {
    equals: (previous, next) =>
      `${previous?.domain()}-${previous?.range()}` === `${next?.domain()}-${next?.range()}`,
  });

  const [getYScale, setYScale] = createSignal<YScale | undefined>(undefined, {
    equals: (previous, next) =>
      `${previous?.domain()}-${previous?.range()}` === `${next?.domain()}-${next?.range()}`,
  });

  const getXDomain = createMemo(
    () => {
      const visibleDays = new Set(settings.productivityChartDays);

      return timeDay.range(...props.dateRange).filter(date => {
        const day = format(date, 'EEEEEE');
        const fullDate = format(date, 'yyyy-MM-dd');

        return visibleDays.has(day) || props.weeklyProductivity.has(fullDate);
      });
    },
    undefined,
    { equals: (previous, next) => `${previous}` === `${next}` }
  );

  createEffect(() => {
    const initialChartWidth = chartRef.clientWidth;
    const xDomain = getXDomain();

    batch(() => {
      setXScale(() => createXScale(xDomain));
      setYScale(() => createYScale());
    });

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.clientWidth !== initialChartWidth) {
        setXScale(() => createXScale(xDomain));
      }
    });

    resizeObserver.observe(chartRef);

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  createEffect(() => {
    const xScale = getXScale();
    const yScale = getYScale();

    if (!xScale || !yScale || props.weeklyProductivity.size === 0) {
      return;
    }

    if (props.view === 'overview') {
      drawOverviewChart(xScale, yScale);
    } else if (props.view === 'timeline') {
      drawTimelineChart(xScale, yScale);
    }
  });

  createEffect(() => {
    const xScale = getXScale();
    const yScale = getYScale();

    if (xScale && yScale) {
      drawYAxis(yScale);
      drawXColumns(xScale, yScale);
    }
  });

  createEffect(() => {
    // Scroll to the current time, or the start of the timeline, when switching to the timeline view.
    // Don't change the scroll position when changing the date range while already in the timeline.
    if (props.view === 'timeline') {
      const handleTimelineRendered = (event: Event) => {
        if ((event as CustomEvent<TimelineRenderedEvent>).detail.isCurrentWeek) {
          currentTimeRef.scrollIntoView({ block: 'center' });
        } else {
          barsRef.scrollIntoView({ block: 'start' });
        }
      };

      chartRef.addEventListener(timelineRenderedEvent, handleTimelineRendered, { once: true });

      onCleanup(() => {
        chartRef.removeEventListener(timelineRenderedEvent, handleTimelineRendered);
      });
    }
  });

  createEffect(() => {
    const hiddenHour = getHiddenHour();

    if (hiddenHour) {
      select(yAxisRef).select(`[data-value="${hiddenHour}"]`).attr('data-hidden', 'true');
    } else {
      select(yAxisRef).select('[data-hidden="true"]').attr('data-hidden', null);
    }
  });

  const getLegendTypes = createMemo(() =>
    props.view === 'timeline'
      ? allLegendTypes
      : allLegendTypes.filter(type => type === 'task' || type === 'void')
  );

  const handleXColumnMouseMove = (event: MouseEvent, date: string) => {
    // Reactivity is handled by D3
    // eslint-disable-next-line solid/reactivity
    showTooltip(date, event.offsetY, () => createXColumnTooltip(date, props.weeklyProductivity));
  };

  const handleBarSegmentMouseMove = (event: MouseEvent, segment: OverviewSegment) => {
    showTooltip(segment.date, event.offsetY, () => createOverviewTooltip(segment));
  };

  const handleTimelineSegmentMouseMove = (event: MouseEvent, segment: TimelineSegment) => {
    showTooltip(segment.date, event.offsetY, () => createTimelineTooltip(segment));
  };

  const handleTooltipHide = () => {
    tooltipRef = undefined;
    setTooltip(undefined);
  };

  const getChartHeight = () => (props.view === 'overview' ? 400 : 2000);

  const getLeftMargin = () => (props.view === 'overview' ? 64 : 88);

  const createXScale = (xDomain: Date[]) =>
    scaleBand()
      .domain(xDomain.map(date => format(date, 'yyyy-MM-dd')))
      .range([getLeftMargin(), chartRef.clientWidth - 32]);

  const createYScale = () => {
    const yScale = scaleLinear().range([chartRef.clientHeight - 12, 12]);

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
  };

  const drawYAxis = (yScale: YScale) => {
    const axis = axisLeft(yScale);

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

        axis.selectAll('.tick').each((value, index, group) => {
          const tick = select(group[index]).attr('data-value', `${value}`);
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

  const drawXColumns = (xScale: XScale, yScale: YScale) => {
    const [yMin, yMax] = yScale.domain();
    const width = xScale.bandwidth();
    const height = yScale(yMin) - yScale(yMax);
    const y = yScale(yMax);

    select(xColumnsRef)
      .html('')
      .selectAll('rect')
      .data(xScale.domain())
      .enter()
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', date => xScale(date) ?? 0)
      .attr('y', y)
      .on('mousemove', handleXColumnMouseMove)
      .on('mouseout', handleTooltipHide);
  };

  const drawOverviewChart = (xScale: XScale, yScale: YScale) => {
    const { width, x } = getBarDimensions(xScale);

    const bars = createBarGroups().attr(
      'transform',
      ([date, { pomodoros, voidedPomodoros }]) =>
        `translate(${xScale(date)}, ${yScale(pomodoros + voidedPomodoros)})`
    );

    const segments = bars
      .selectAll('g')
      .data(([date, data]) => createOverviewsSegments(date, data, yScale))
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

  const drawTimelineChart = (xScale: XScale, yScale: YScale) => {
    const { width, x } = getBarDimensions(xScale);

    createBarGroups()
      .attr('transform', ([date]) => `translate(${xScale(date)}, 0)`)
      .selectAll('rect')
      .data(([, data]) => createTimelineSegments(data))
      .enter()
      .append('rect')
      .attr('data-testid', ({ event }) => `timeline-segment-${event.id}`)
      .attr('data-type', ({ type }) => type)
      .attr('width', width)
      .attr('height', ({ endHour, startHour }) => yScale(endHour) - yScale(startHour))
      .attr('x', x)
      .attr('y', ({ startHour }) => yScale(startHour))
      .on('mousemove', handleTimelineSegmentMouseMove)
      .on('mouseout', handleTooltipHide);

    const [start, end] = props.dateRange;
    const isCurrentWeek = isWithinInterval(new Date(), { start, end });

    if (isCurrentWeek) {
      drawCurrentTimeAxis(yScale);

      const intervalId = setInterval(() => {
        drawCurrentTimeAxis(yScale);
      }, 10_000);

      onCleanup(() => {
        clearInterval(intervalId);

        select(currentTimeRef).html('');
        setHiddenHour(undefined);
      });
    }

    queueMicrotask(() => {
      chartRef.dispatchEvent(
        new CustomEvent<TimelineRenderedEvent>(timelineRenderedEvent, {
          detail: { isCurrentWeek },
        })
      );
    });
  };

  const drawCurrentTimeAxis = (yScale: YScale) => {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const y = yScale(currentHour);

    const currentTimeGroup = select(currentTimeRef).html('');

    currentTimeGroup
      .attr('transform', `translate(0, ${y})`)
      .append('line')
      .classed(styles.line, true)
      .attr('x2', '100%');

    const currentTimeText = currentTimeGroup
      .append('text')
      .attr('class', styles.label)
      .attr('x', 32)
      .attr('y', 4)
      .text(format(now, 'h:mm a'))
      .node();

    if (currentTimeText) {
      const { width, height, x, y } = currentTimeText.getBBox();
      const textBackgroundOffset = 4;

      currentTimeGroup
        .insert('rect', 'text')
        .attr('class', styles.labelBackground)
        .attr('width', width + textBackgroundOffset * 2)
        .attr('height', height)
        .attr('x', x - textBackgroundOffset)
        .attr('y', y);
    }

    // Hide nearby Y-axis ticks to avoid overlap
    const minutes = now.getMinutes();

    if (minutes <= 15) {
      setHiddenHour(Math.floor(currentHour));
    } else if (minutes >= 45) {
      setHiddenHour(Math.ceil(currentHour));
    } else {
      setHiddenHour(undefined);
    }
  };

  const createBarGroups = () => {
    const bars = select(barsRef)
      .html('')
      .selectAll('g')
      .data(props.weeklyProductivity)
      .enter()
      .append('g');

    barGroupsByDate = {};
    bars.each(([date], index, nodes) => {
      barGroupsByDate[date] = nodes[index];
    });

    return bars;
  };

  const getBarDimensions = (xScale: XScale) => {
    const bandwidth = xScale.bandwidth();
    const width = bandwidth * 0.8;
    const x = (bandwidth - width) / 2;

    return { width, x };
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
  let currentTimeRef!: SVGGElement;
  let xColumnsRef!: SVGGElement;
  let yAxisRef!: SVGGElement;

  // The tooltip is dynamically created, so the reference may not always exist
  let tooltipRef: HTMLDivElement | undefined;

  return (
    <div class={styles.chart}>
      <svg class={styles.plot} ref={chartRef} style={{ height: `${getChartHeight()}px` }}>
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
        <g class={styles.bars} data-testid="productivity-chart-bars" ref={barsRef} />
        <g
          class={styles.currentTime}
          data-testid="productivity-chart-current-time"
          ref={currentTimeRef}
        />
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
                <span>{t(`chart.type.${type}`)}</span>
              </div>
            )}
          </For>
        </div>
      </footer>
    </div>
  );
};
