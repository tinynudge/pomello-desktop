export enum AppEvent {
  AppWindowFocus = 'app-window-focus',
  ClipboardTextWrite = 'clipboard-text-write',
  DecryptValue = 'decrypt-value',
  EncryptValue = 'encrypt-value',
  GetActiveServiceId = 'get-active-service-id',
  GetHotkeys = 'get-hotkeys',
  GetSettings = 'get-settings',
  GetThemeCss = 'get-theme-css',
  GetTranslations = 'get-translations',
  HideSelect = 'hide-select',
  LogMessage = 'log-message',
  OpenUrl = 'open-url',
  PowerMonitorChange = 'power-monitor-change',
  QuitApp = 'quit-app',
  RegisterServiceConfig = 'register-service-config',
  ResetSelect = 'reset-select',
  SelectChange = 'select-change',
  SelectOption = 'select-option',
  SetSelectBounds = 'set-select-bounds',
  SetSelectItems = 'set-select-items',
  SetStoreItem = 'set-store-item',
  ShowAuthWindow = 'show-auth-window',
  ShowDashboardWindow = 'show-dashboard-window',
  ShowMessageBox = 'show-message-box',
  ShowSelect = 'show-select',
  StoreChange = 'store-change',
  ThemeCssChange = 'theme-css-change',
  UnsetStoreItem = 'unset-store-item',
  UpdateSetting = 'update-setting',
}
