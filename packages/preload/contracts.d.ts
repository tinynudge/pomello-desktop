type AppApi = typeof import('./src').default;

interface Window {
  app: AppApi;
}
