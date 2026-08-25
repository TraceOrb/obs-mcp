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

  test.each([
    { language: 'go', runtime: 'gin' },
    { language: 'go', runtime: 'auto' },
    { language: 'both', runtime: 'gin' },
    { language: 'both', runtime: 'auto' },
  ])(
    '$language $runtime install includes the separate Gin module',
    ({ language, runtime }) => {
      const text = buildSdkSetupGuide({
        language,
        runtime,
        topic: 'install',
      });

      expect(text).toContain('go get github.com/TraceOrb/obs-sdk-go/gin');
    },
  );

  test('tags explains future business-dimension grouping without Tour or city', () => {
    const text = buildSdkSetupGuide({
      language: 'both',
      runtime: 'auto',
      topic: 'tags',
    });

    expect(text).toContain('business dimensions');
    expect(text).toContain('tag');
    expect(text).toContain('groupBy=tag:');
    expect(text).toContain('phase 3');
    expect(text).not.toMatch(/\b(?:tour|city)\b/i);
  });
});
