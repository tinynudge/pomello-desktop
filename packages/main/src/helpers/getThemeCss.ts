import { ThemeConfig, ThemeCss } from '@pomello-desktop/domain';
import { nativeTheme } from 'electron';

const colors = {
  black: 'rgb(0 0 0)',
  blue: 'rgb(67 134 250)',
  dark: 'rgb(35 35 35)',
  darkAlt: 'rgb(56 56 56)',
  lightAlt: 'rgb(240 240 240)',
  longBreak: 'rgb(75 174 79)',
  longBreakDark: 'rgb(67 157 71)',
  primary: 'rgb(0 194 193)',
  shortBreak: 'rgb(32 149 242)',
  shortBreakDark: 'rgb(27 125 203)',
  task: 'rgb(243 66 53)',
  taskDark: 'rgb(204 55 45)',
  white: 'rgb(255 255 255)',
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
