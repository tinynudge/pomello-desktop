import { TrelloConfig, TrelloList } from '../../domain';

const getPreferences = (currentList: TrelloList, preferences: TrelloConfig['preferences']) => {
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

export default getPreferences;
