import { describe, expect, it, vi } from 'vitest';

import { withTimeout } from '../../app/lib/with-timeout';

describe('withTimeout', () => {
  it('resolves when promise finishes before timeout', async () => {
    const result = await withTimeout(Promise.resolve('ok'), 1000);
    expect(result).toBe('ok');
  });

  it('rejects with the provided label after timeout', async () => {
    vi.useFakeTimers();

    try {
      const never = new Promise<string>(() => {});
      const resultPromise = withTimeout(never, 50, 'Too slow');

      const expectation = expect(resultPromise).rejects.toThrow('Too slow');
      await vi.advanceTimersByTimeAsync(50);
      await expectation;
    } finally {
      vi.useRealTimers();
    }
  });
});
