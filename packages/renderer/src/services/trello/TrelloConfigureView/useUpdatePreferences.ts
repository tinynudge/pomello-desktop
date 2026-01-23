import { useConfigureService } from '@/shared/context/ConfigureServiceContext';
import { unwrap } from 'solid-js/store';
import { BoardOrList, TrelloConfigStore, TrelloPreferences } from '../domain';

type UpdatePreferenceOptions = {
  boardOrList: BoardOrList;
  commitChanges?: boolean;
  preferences: TrelloPreferences;
};

export const useUpdatePreferences = () => {
  const { getServiceConfigValue, setServiceConfigValue, stageServiceConfigValue } =
    useConfigureService<TrelloConfigStore>();

  return ({ boardOrList, commitChanges, preferences }: UpdatePreferenceOptions) => {
    const currentPreferences = unwrap(getServiceConfigValue('preferences'));

    const { item, type } = boardOrList;
    const categoryKey = type === 'board' ? 'boards' : 'lists';

    const updatedPreferences = {
      ...currentPreferences,
      [categoryKey]: {
        ...currentPreferences?.[categoryKey],
        [item.id]: preferences,
      },
    };

    // If no preferences were set, remove the empty object to avoid clutter
    if (updatedPreferences?.[categoryKey] && Object.keys(preferences).length === 0) {
      delete updatedPreferences[categoryKey][item.id];
    }

    // If after removal the category is empty, remove it as well
    if (
      updatedPreferences?.[categoryKey] &&
      Object.keys(updatedPreferences[categoryKey]).length === 0
    ) {
      delete updatedPreferences[categoryKey];
    }

    if (commitChanges) {
      setServiceConfigValue('preferences', updatedPreferences);
    } else {
      stageServiceConfigValue('preferences', updatedPreferences);
    }
  };
};
