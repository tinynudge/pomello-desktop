import { axisLeft, scaleLinear, select } from 'd3';
import { Component, createEffect } from 'solid-js';
import styles from './Chart.module.scss';
import { WeeklyProductivity } from './WeeklyProductivityPanels';

type ChartProps = {
  dateRange: [Date, Date];
  view: 'overview' | 'timeline';
  weeklyProductivity: WeeklyProductivity;
};

export const Chart: Component<ChartProps> = props => {
  createEffect(() => {
    drawYAxis();
  });

  const drawYAxis = () => {
    const isTimeline = props.view === 'timeline';
    const chartHeight = chartRef.getBoundingClientRect().height;

    const yScale = scaleLinear().range([chartHeight - 12, 12]);
    if (isTimeline) {
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

    const axis = axisLeft(yScale);

    if (isTimeline) {
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

  let chartRef!: SVGSVGElement;
  let yAxisRef!: SVGGElement;

  return (
    <svg
      classList={{
        [styles.chart]: true,
        [styles.isTimeline]: props.view === 'timeline',
      }}
      ref={chartRef}
    >
      <defs>
        <pattern height="10" id="overTask" patternUnits="userSpaceOnUse" width="10">
          <rect fill="var(--dashboard-chart-over-task-background)" height="10" width="10" />
          <path
            d="M 0,10 l 10,-10 M -2.5,2.5 l 5,-5 M 7.5,12.5 l 5,-5"
            stroke="var(--dashboard-chart-over-task-line)"
          />
        </pattern>
        <pattern height="10" id="overShortBreak" patternUnits="userSpaceOnUse" width="10">
          <rect fill="var(--dashboard-chart-over-short-break-background)" height="10" width="10" />
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
    </svg>
  );
};
