import { describe, expect, test } from 'vitest';

import truncateResponseText from '../src/truncateResponse';

describe('truncateResponseText', () => {
  test('returns payloads within the byte limit unchanged', () => {
    expect(truncateResponseText({ text: '{"ok":true}', maxBytes: 256 })).toBe(
      '{"ok":true}',
    );
  });

  test('marks truncated payloads and reports their UTF-8 size', () => {
    const text = 'x'.repeat(300_000);
    const output = truncateResponseText({
      text,
      maxBytes: 256 * 1024,
    });

    expect(JSON.parse(output)).toEqual({
      truncated: true,
      bytes: 300_000,
      hint: 'narrow filters or lower size',
    });
  });

  test('measures multibyte payloads in bytes', () => {
    const output = truncateResponseText({ text: 'éé', maxBytes: 3 });

    expect(JSON.parse(output)).toMatchObject({
      truncated: true,
      bytes: 4,
    });
  });
});
