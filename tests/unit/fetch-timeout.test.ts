import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchWithTimeout } from '../../app/lib/fetch-timeout';

describe('fetchWithTimeout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('passes through when a signal is already provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);

    const controller = new AbortController();
    await fetchWithTimeout('https://example.test', {
      method: 'POST',
      signal: controller.signal,
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.test', {
      method: 'POST',
      signal: controller.signal,
    });
  });

  it('aborts when the timeout elapses', async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn((_, init?: RequestInit) => {
      return new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const resultPromise = fetchWithTimeout('https://example.test', {}, 25);
    const expectation = expect(resultPromise).rejects.toMatchObject({
      name: 'AbortError',
    });
    await vi.advanceTimersByTimeAsync(25);
    await expectation;
  });
});
