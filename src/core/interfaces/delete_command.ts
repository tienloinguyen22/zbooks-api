import { GUID } from './guid';
import { Command } from './command';

export interface DeleteCommand extends Command {
  id: GUID;
}
