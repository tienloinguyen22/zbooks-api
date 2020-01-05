import { GUID } from './guid';

export interface Command {
  commandId: GUID;
}

export type WithoutCommandId<T> = Omit<T, 'commandId'>;
