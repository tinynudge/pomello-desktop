import { TrelloConfigStore, TrelloList } from '../../domain';

export const getPreferences = (
  currentList: TrelloList,
  preferences: TrelloConfigStore['preferences']
) => {
  const globalPreferences = preferences?.global;
  const boardPreferences = preferences?.boards?.[currentList.idBoard];
  const listPreferences = preferences?.lists?.[currentList.id];

  const defaultPreferences = {
    addChecks: true,
    keepLogs: true,
    trackStats: true,
    archiveCards: false,
  };

  return {
    ...defaultPreferences,
    ...globalPreferences,
    ...boardPreferences,
    ...listPreferences,
  };
};
