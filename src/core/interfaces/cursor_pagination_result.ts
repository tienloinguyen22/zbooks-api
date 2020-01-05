export type CursorPaginationResult = {
  type: 'CURSOR';
  prevCursor?: string;
  nextCursor?: string;
};
