export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, itemIndex: number, arr: T[]) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};
