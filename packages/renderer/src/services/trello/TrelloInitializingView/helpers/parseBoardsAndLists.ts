import { SelectItem } from '@domain';
import { TrelloBoard, TrelloList, TrelloMember } from '../../domain';

interface ParseBoardsAndListsOptions {
  boardsAndLists: TrelloMember;
  listFilter?: string;
  listFilterCaseSensitive?: boolean;
  recentLists?: string[];
}

const parseBoardsAndLists = ({
  boardsAndLists,
  listFilter,
  listFilterCaseSensitive,
  recentLists,
}: ParseBoardsAndListsOptions) => {
  const boards = new Map<string, TrelloBoard>();
  const lists = new Map<string, TrelloList>();

  let selectItems: SelectItem[] = [];

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

      selectItems.push({ id: list.id, label });
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

  return { boards, lists, selectItems };
};

export default parseBoardsAndLists;
