import { describe, expect, test } from 'vitest';

import buildSdkSetupGuide from '../src/sdkSetupGuide';

describe('buildSdkSetupGuide', () => {
  test('code_scan playbook mentions redact and tags search areas', () => {
    const text = buildSdkSetupGuide({
      language: 'both',
      runtime: 'auto',
      topic: 'code_scan',
    });

    expect(text.includes('redactKeys') || text.includes('RedactKeys')).toBe(true);
    expect(
      text.toLowerCase().includes('settags') || text.includes('setTags'),
    ).toBe(true);
    expect(text.includes('userId')).toBe(true);
    expect(text.toLowerCase().includes('tour')).toBe(false);
    expect(Buffer.byteLength(text, 'utf8')).toBeLessThanOrEqual(64 * 1024);
  });

  test('node express install includes createClient', () => {
    const text = buildSdkSetupGuide({
      language: 'node',
      runtime: 'express',
      topic: 'install',
    });

    expect(text.includes('createClient')).toBe(true);
    expect(text.includes('traceorb.New')).toBe(false);
  });
});
