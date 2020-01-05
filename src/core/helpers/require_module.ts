// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requireModule = (path: string): any => {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(path);
  } catch (e) {
    return undefined;
  }
};
