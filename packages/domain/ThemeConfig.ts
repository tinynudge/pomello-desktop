export interface ThemeConfig {
  [key: string]: ThemeType;
}

type ThemeType = ThemeConfig | ThemeValue;

type ThemeValue = string | [light: string, dark: string];
