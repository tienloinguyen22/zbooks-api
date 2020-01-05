import { debug } from './debug';

export const recordError = async (error: Error): Promise<void> => {
  if (debug()) {
    global.console.log(error);
    return;
  }

  try {
    // TODO: update logic
  } catch (internalError) {
    // do nothing
  }
};
