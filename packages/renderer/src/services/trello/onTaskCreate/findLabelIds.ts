import { TrelloList } from '../domain';
import { TrelloRuntime } from '../TrelloRuntime';
import createQueryRegex from './createQueryRegex';

interface LabelIds {
  labelIds: string[];
  unknownLabels: string[];
}

const findLabelIds = async (
  { api }: TrelloRuntime,
  list: TrelloList,
  input?: string
): Promise<LabelIds> => {
  const labelIds: string[] = [];
  const unknownLabels: string[] = [];

  if (!input) {
    return { labelIds, unknownLabels };
  }

  const labels = await api.fetchLabelsByBoardId(list.idBoard);

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

export default findLabelIds;
