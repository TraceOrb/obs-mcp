import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

import buildMcpVersion from '../src/guide/buildMcpVersion';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('buildMcpVersion', () => {
  test('compares running pin with GET /v1/mcp without a read key', async () => {
    const calls: Array<{ apiUrl: string; path: string }> = [];
    const text = await buildMcpVersion({
      running: '0.2.0',
      apiUrl: 'https://api.traceorb.com',
      getPublic: async function getPublic(args) {
        calls.push(args);
        return {
          status: 200,
          text: JSON.stringify({
            package: 'traceorb-mcp',
            version: '0.3.0',
            npx: 'npx -y traceorb-mcp@0.3.0',
            update: ['Do not use @latest.'],
          }),
        };
      },
    });

    expect(calls).toEqual([
      { apiUrl: 'https://api.traceorb.com', path: '/v1/mcp' },
    ]);
    expect(JSON.parse(text)).toEqual({
      running: '0.2.0',
      latest: '0.3.0',
      needsUpdate: true,
      npx: 'npx -y traceorb-mcp@0.3.0',
      update: ['Do not use @latest.'],
    });
  });

  test('returns error envelope when GET fails', async () => {
    const text = await buildMcpVersion({
      running: '0.3.0',
      apiUrl: 'https://api.traceorb.com',
      getPublic: async function getPublic() {
        return { status: 429, text: '{"code":"rate_limited"}' };
      },
    });

    expect(JSON.parse(text)).toEqual({
      error: true,
      status: 429,
      body: '{"code":"rate_limited"}',
    });
  });

  test('registers mcp_version as a local tool in the server', () => {
    const server = readFileSync(join(root, 'src/server.ts'), 'utf8');
    expect(server.includes('MCP_VERSION_TOOL_NAME')).toBe(true);
    expect(server.includes('traceorbGetPublic')).toBe(true);
  });
});
