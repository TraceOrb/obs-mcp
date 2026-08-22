import { afterEach, describe, expect, test } from 'vitest';

import readMcpEnv from '../src/env';

describe('readMcpEnv', () => {
  afterEach(function restoreEnv() {
    delete process.env.TRACEORB_READ_KEY;
    delete process.env.TRACEORB_API_URL;
  });

  test('throws when TRACEORB_READ_KEY is missing', () => {
    delete process.env.TRACEORB_READ_KEY;
    expect(function missing() {
      readMcpEnv();
    }).toThrow('TRACEORB_READ_KEY is required');
  });

  test('defaults api url and reads the key', () => {
    process.env.TRACEORB_READ_KEY = 'ok_read_test_secret';
    expect(readMcpEnv()).toEqual({
      readKey: 'ok_read_test_secret',
      apiUrl: 'https://api.traceorb.com',
    });
  });
});
