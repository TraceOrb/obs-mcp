import { afterEach, describe, expect, test, vi } from 'vitest';

import traceorbGet from '../src/http/traceorbGet';

describe('traceorbGet', () => {
  afterEach(function restoreFetch() {
    vi.unstubAllGlobals();
  });

  test('sends a bearer GET to the metrics path', async () => {
    const fetchMock = vi.fn<typeof fetch>(async function fakeFetch() {
      return new Response('{"ok":true}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await traceorbGet({
      apiUrl: 'https://api.traceorb.com',
      key: 'ok_read_prefix_secret',
      path: '/v1/metrics',
      query: { range: '24h' },
    });

    expect(result.status).toBe(200);
    expect(result.text).toBe('{"ok":true}');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    if (call === undefined) {
      throw new Error('fetch was not called');
    }

    expect(String(call[0])).toBe(
      'https://api.traceorb.com/v1/metrics?range=24h',
    );
    expect(call[1]).toEqual({
      method: 'GET',
      headers: {
        authorization: 'Bearer ok_read_prefix_secret',
      },
    });
  });

  test('returns code and retryAfter on 429 without looping', async () => {
    const fetchMock = vi.fn(async function fakeFetch() {
      return new Response('{"code":"rate_limited"}', {
        status: 429,
        headers: { 'Retry-After': '12' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await traceorbGet({
      apiUrl: 'https://api.traceorb.com',
      key: 'ok_read_prefix_secret',
      path: '/v1/metrics',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(429);
    expect(JSON.parse(result.text)).toEqual({
      code: 'rate_limited',
      retryAfter: '12',
    });
  });
});
