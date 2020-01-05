import { asyncForEach } from '@app/core';

describe('core/helpers/async_for_each', () => {
  it('runs an array of promises successfully', async () => {
    const task1 = jest.fn();
    const task2 = jest.fn();
    const task1Async = async (): Promise<void> => {
      task1();
    };
    const task2Async = async (): Promise<void> => {
      task2();
    };
    const arr = [task1Async, task2Async];

    await asyncForEach(arr, async (task) => {
      await task();
    });

    expect(task1).toBeCalledTimes(1);
    expect(task2).toBeCalledTimes(1);
  });
});

export {};
