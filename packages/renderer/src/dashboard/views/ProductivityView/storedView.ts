const HISTORY_PANEL_VIEW_KEY = 'historyPanelView';

export const getStoredView = (): 'overview' | 'timeline' => {
  try {
    const view = localStorage.getItem(HISTORY_PANEL_VIEW_KEY);

    if (view === 'overview' || view === 'timeline') {
      return view;
    }
  } catch {
    // Uh-oh
  }

  return 'overview';
};

export const setStoredView = (view: 'overview' | 'timeline'): void => {
  try {
    localStorage.setItem(HISTORY_PANEL_VIEW_KEY, view);
  } catch {
    // Uh-oh
  }
};
