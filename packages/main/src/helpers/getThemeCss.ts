import { ThemeConfig, ThemeCss } from '@pomello-desktop/domain';
import { nativeTheme } from 'electron';

const colors = {
  black: 'rgb(0 0 0)',
  blue: 'rgb(67 134 250)',
  blueDark: 'rgb(107 167 255)',
  dark: 'rgb(35 35 35)',
  darkAlt: 'rgb(56 56 56)',
  gold: 'rgb(255 225 0)',
  lightAlt: 'rgb(240 240 240)',
  longBreak: 'rgb(75 174 79)',
  longBreakDark: 'rgb(67 157 71)',
  primary: 'rgb(0 194 193)',
  primaryDark: 'rgb(19 175 174)',
  red: 'rgb(255 102 133)',
  shortBreak: 'rgb(32 149 242)',
  shortBreakDark: 'rgb(27 125 203)',
  task: 'rgb(243 66 53)',
  taskDark: 'rgb(204 55 45)',
  white: 'rgb(255 255 255)',
  yellow: 'rgb(255 193 7)',
};

const darken = (color: string, percent: number) => {
  const step = (100 - percent) / 100;

  const values = color
    .slice(4, -1)
    .split(' ')
    .map(value => Math.round(+value * step))
    .join(' ');

  return `rgb(${values})`;
};

const lighten = (color: string, percent: number) => {
  const values = color
    .slice(4, -1)
    .split(' ')
    .map(value => {
      const numericValue = +value;

      return Math.round((255 - numericValue) * (percent / 100)) + numericValue;
    })
    .join(' ');

  return `rgb(${values})`;
};

const opacity = (color: string, opacity: number): string => {
  return `rgba${color.slice(3, -1)} / ${opacity}%)`;
};

const defaultTheme: ThemeConfig = {
  app: {
    background: {
      default: [colors.primary, colors.dark],
      task: [colors.task, colors.dark],
      'short-break': [colors.shortBreak, colors.dark],
      'long-break': [colors.longBreak, colors.dark],
    },
    heading: {
      default: opacity(colors.white, 60),
      task: colors.white,
      'short-break': colors.white,
      'long-break': colors.white,
    },
    content: {
      default: colors.white,
      task: colors.white,
      'short-break': colors.white,
      'long-break': colors.white,
    },
    button: {
      background: {
        default: 'transparent',
        hover: [opacity(colors.dark, 4), opacity(colors.white, 2)],
      },
    },
    divider: [opacity(colors.dark, 12), colors.darkAlt],
  },
  auth: {
    background: [colors.lightAlt, colors.dark],
    content: {
      default: [colors.dark, colors.white],
      error: [colors.task, colors.taskDark],
      link: [colors.shortBreak, colors.shortBreakDark],
    },
    input: {
      background: [colors.white, colors.darkAlt],
      content: [colors.dark, colors.white],
    },
    button: {
      background: [colors.shortBreak, colors.shortBreakDark],
      color: colors.white,
    },
  },
  dial: {
    background: {
      default: [colors.white, colors.darkAlt],
      task: [colors.white, colors.taskDark],
      'short-break': [colors.white, colors.shortBreakDark],
      'long-break': [colors.white, colors.longBreakDark],
    },
    content: {
      default: [colors.primary, colors.white],
      task: [colors.task, colors.dark],
      'short-break': [colors.shortBreak, colors.dark],
      'long-break': [colors.longBreak, colors.dark],
    },
    overlay: opacity(colors.black, 24),
  },
  input: {
    content: {
      default: colors.white,
      placeholder: [opacity(colors.white, 60), opacity(colors.white, 38)],
    },
    divider: {
      default: opacity(colors.white, 38),
      focused: colors.white,
    },
    selection: [opacity(colors.black, 10), opacity(colors.white, 20)],
  },
  menu: {
    toggle: {
      content: {
        default: opacity(colors.white, 38),
        hover: opacity(colors.white, 60),
      },
    },
    button: {
      background: {
        default: 'transparent',
        hover: [opacity(colors.dark, 8), opacity(colors.dark, 60)],
      },
      content: {
        default: [opacity(colors.dark, 87), colors.white],
        hover: [opacity(colors.dark, 87), colors.white],
      },
    },
    background: [colors.lightAlt, colors.darkAlt],
  },
  overtime: {
    background: [colors.task, colors.taskDark],
    content: colors.white,
  },
  select: {
    background: {
      default: [colors.white, colors.darkAlt],
      group: [opacity(colors.black, 4), opacity(colors.black, 20)],
      selected: [opacity(colors.blue, 12), opacity(colors.white, 10)],
    },
    content: {
      default: [opacity(colors.black, 87), colors.white],
      helper: [opacity(colors.black, 38), opacity(colors.white, 38)],
    },
    divider: [colors.lightAlt, colors.dark],
  },
  dashboard: {
    'actions-menu': {
      icon: {
        default: [opacity(colors.black, 38), opacity(colors.white, 40)],
        hover: [opacity(colors.black, 60), opacity(colors.white, 60)],
      },
      border: {
        active: [opacity(colors.black, 24), opacity(colors.white, 24)],
        hover: [opacity(colors.black, 12), opacity(colors.white, 12)],
      },
    },
    badge: {
      free: {
        background: [opacity(colors.dark, 12), colors.lightAlt],
        text: colors.black,
      },
      premium: {
        background: [colors.gold, darken(colors.gold, 24)],
        text: darken(colors.gold, 80),
      },
    },
    border: [opacity(colors.dark, 24), colors.dark],
    button: {
      link: {
        active: [darken(colors.blue, 40), lighten(colors.blue, 40)],
        default: [colors.blue, colors.blueDark],
      },
      primary: {
        text: [colors.white, darken(colors.primaryDark, 72)],
        background: {
          active: [darken(colors.primary, 8), lighten(colors.primaryDark, 20)],
          default: [colors.primary, colors.primaryDark],
          hover: [darken(colors.primary, 4), lighten(colors.primaryDark, 12)],
        },
      },
      warning: {
        text: darken(colors.yellow, 72),
        background: {
          active: [darken(colors.yellow, 8), lighten(colors.yellow, 20)],
          default: [colors.yellow, colors.yellow],
          hover: [darken(colors.yellow, 4), lighten(colors.yellow, 12)],
        },
        outline: opacity(colors.yellow, 30),
      },
    },
    content: {
      background: [colors.lightAlt, colors.dark],
    },
    focus: [lighten(colors.primary, 72), darken(colors.primaryDark, 40)],
    'loading-dots': [colors.primary, colors.primaryDark],
    illustration: {
      stroke: [opacity(colors.black, 24), darken(colors.dark, 36)],
    },
    input: {
      default: {
        border: [opacity(colors.dark, 24), colors.dark],
        background: {
          active: [opacity(colors.dark, 6), opacity(colors.white, 6)],
          default: ['transparent', opacity(colors.white, 4)],
          hover: [opacity(colors.dark, 4), opacity(colors.white, 8)],
        },
      },
      error: {
        border: colors.red,
        outline: opacity(colors.red, 30),
        tooltip: {
          background: colors.red,
          text: darken(colors.red, 72),
        },
      },
      warning: {
        border: colors.yellow,
        outline: opacity(colors.yellow, 30),
        tooltip: {
          background: colors.yellow,
          text: darken(colors.yellow, 72),
        },
      },
    },
    menu: {
      default: [colors.white, colors.darkAlt],
      hover: [opacity(colors.lightAlt, 60), opacity(colors.dark, 38)],
    },
    modal: {
      background: [colors.white, colors.darkAlt],
      overlay: [opacity(colors.black, 24), opacity(colors.black, 48)],
    },
    panel: {
      background: [colors.white, colors.darkAlt],
      divider: [opacity(colors.black, 12), colors.dark],
    },
    sidebar: {
      background: {
        active: [colors.primary, colors.primaryDark],
        default: [colors.white, colors.darkAlt],
        hover: [opacity(colors.lightAlt, 60), opacity(colors.dark, 38)],
      },
    },
    slider: {
      dot: colors.white,
      progress: [colors.primary, colors.primaryDark],
      track: [opacity(colors.black, 12), colors.dark],
    },
    text: {
      default: [colors.darkAlt, opacity(colors.white, 84)],
      hint: [opacity(colors.darkAlt, 84), opacity(colors.white, 60)],
    },
    timer: {
      'long-break': [colors.longBreak, colors.longBreakDark],
      'short-break': [colors.shortBreak, colors.shortBreakDark],
      task: [colors.task, colors.taskDark],
    },
    'toggle-switch': {
      background: {
        default: [opacity(colors.black, 38), colors.dark],
        active: [colors.primary, colors.primaryDark],
      },
      dot: colors.white,
    },
    tooltip: {
      background: colors.black,
      text: colors.white,
    },
  },
};

export const getThemeCss = (): ThemeCss => {
  const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

  let css = '';

  const parseTheme = (config: ThemeConfig, prefix = '') => {
    for (const [key, value] of Object.entries(config)) {
      const propertyName = !prefix ? `--${key}` : `${prefix}-${key}`;

      if (typeof value === 'object' && !Array.isArray(value)) {
        parseTheme(value, propertyName);
        continue;
      }

      const propertyValue = Array.isArray(value)
        ? theme === 'light'
          ? value[0]
          : value[1]
        : value;

      css += `${propertyName}: ${propertyValue}; `;
    }
  };

  parseTheme(defaultTheme);

  return {
    css,
    theme,
  };
};
