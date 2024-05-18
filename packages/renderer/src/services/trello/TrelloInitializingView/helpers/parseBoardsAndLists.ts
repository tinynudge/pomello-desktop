import { SelectItem, SelectOptionType, Translate } from '@pomello-desktop/domain';
import { TrelloBoard, TrelloList, TrelloMember } from '../../domain';

interface ParseBoardsAndListsOptions {
  boardsAndLists: TrelloMember;
  listFilter?: string;
  listFilterCaseSensitive?: boolean;
  previousListId?: string;
  recentLists?: string[];
  translate: Translate;
}

export const parseBoardsAndLists = ({
  boardsAndLists,
  listFilter,
  listFilterCaseSensitive,
  previousListId,
  recentLists,
  translate,
}: ParseBoardsAndListsOptions) => {
  const boards = new Map<string, TrelloBoard>();
  const lists = new Map<string, TrelloList>();

  let selectItems: SelectItem[] = [];
  let previousListOption: SelectOptionType | undefined;

  boardsAndLists.boards.forEach(board => {
    boards.set(board.id, board);

    board.lists.forEach(list => {
      lists.set(list.id, list);

      const label = `${board.name}: ${list.name}`;

      if (listFilter) {
        const flags = listFilterCaseSensitive !== true ? 'i' : '';
        const regExp = new RegExp(listFilter, flags);

        if (!regExp.test(label)) {
          return;
        }
      }

      if (list.id === previousListId) {
        previousListOption = {
          id: 'previous-list',
          label: translate('service:backToListLabel', { list: label }),
          type: 'customOption',
        };
      } else {
        selectItems.push({ id: list.id, label });
      }
    });
  });

  if (recentLists) {
    const recentListsIndices: Record<string, number> = recentLists.reduce(
      (indexes, listId, index) => ({ ...indexes, [listId]: index }),
      {}
    );

    selectItems = selectItems.sort((a, b) => {
      const aIndex = recentListsIndices[a.id] ?? -1;
      const bIndex = recentListsIndices[b.id] ?? -1;

      return aIndex === -1 && bIndex === -1
        ? 0
        : aIndex === -1
          ? 1
          : bIndex === -1
            ? -1
            : aIndex - bIndex;
    });
  }

  if (previousListOption) {
    selectItems.unshift(previousListOption);
  }

  return { boards, lists, selectItems };
};
