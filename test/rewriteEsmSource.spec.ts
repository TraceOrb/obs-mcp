import { describe, expect, test } from 'vitest';

import rewriteEsmSource from '../src/build/rewriteEsmSource';

describe('rewriteEsmSource', () => {
  test('rewrites from import', () => {
    expect(rewriteEsmSource("import readMcpEnv from './env';")).toBe(
      "import readMcpEnv from './env.js';",
    );
  });

  test('rewrites named from import', () => {
    expect(rewriteEsmSource("import { foo } from './tools';")).toBe(
      "import { foo } from './tools.js';",
    );
  });

  test('keeps existing js extension', () => {
    expect(rewriteEsmSource("from './env.js'")).toBe("from './env.js'");
  });
});
