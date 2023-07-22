type AppApi = typeof import('./src').api;

interface Window {
  app: AppApi;
}
