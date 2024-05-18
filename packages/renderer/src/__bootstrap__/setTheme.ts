import { ThemeCss } from '@pomello-desktop/domain';

export const setTheme = (themeCss: ThemeCss): void => {
  document.documentElement.style.setProperty('color-scheme', themeCss.theme);
  document.body.style.cssText = themeCss.css;

  window.app.onThemeCssChange(({ css, theme }) => {
    document.documentElement.style.setProperty('color-scheme', theme);
    document.body.style.cssText = css;
  });
};
