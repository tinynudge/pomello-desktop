import { QueryClient } from '@tanstack/solid-query';

export const createTrelloQueryClient = (): QueryClient => new QueryClient();
