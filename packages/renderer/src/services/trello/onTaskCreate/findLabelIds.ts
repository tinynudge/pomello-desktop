import { fetchLabelsByBoardId } from '../api/fetchLabelsByBoardId';
import { TrelloList } from '../domain';
import { createQueryRegex } from './createQueryRegex';

type LabelIds = {
  labelIds: string[];
  unknownLabels: string[];
};

export const findLabelIds = async (list: TrelloList, input?: string): Promise<LabelIds> => {
  const labelIds: string[] = [];
  const unknownLabels: string[] = [];

  if (!input) {
    return { labelIds, unknownLabels };
  }

  const labels = await fetchLabelsByBoardId(list.idBoard);

  input.split(',').forEach(query => {
    const normalizedQuery = query.trim();
    const labelRegex = createQueryRegex(normalizedQuery);

    const foundLabel = labels.find(
      ({ color, name }) => color === normalizedQuery.toLowerCase() || labelRegex.test(name)
    );

    if (foundLabel) {
      labelIds.push(foundLabel.id);
    } else {
      unknownLabels.push(normalizedQuery);
    }
  });

  return { labelIds, unknownLabels };
};
