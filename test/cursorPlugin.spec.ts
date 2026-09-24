import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function readJson(relativePath: string): {
  [key: string]: unknown;
} {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8')) as {
    [key: string]: unknown;
  };
}

describe('cursor plugin manifest', () => {
  test('runs the latest npm package and leaves the read key as a placeholder', () => {
    const pkg = readJson('package.json');
    const plugin = readJson('.cursor-plugin/plugin.json');
    const mcp = readJson('mcp.json');
    const servers = mcp.mcpServers as {
      traceorb: {
        command: string;
        args: string[];
        env: { TRACEORB_READ_KEY: string; TRACEORB_API_URL: string };
      };
    };
    const traceorb = servers.traceorb;
    const variables = plugin.variables as {
      required: string[];
      properties: { TRACEORB_READ_KEY: { type: string } };
    };

    expect(plugin.name).toBe('traceorb');
    expect(plugin.version).toBe(pkg.version);
    expect(plugin.logo).toBe('assets/logo.svg');
    expect(variables.required).toEqual(['TRACEORB_READ_KEY']);
    expect(variables.properties.TRACEORB_READ_KEY.type).toBe('string');
    expect(traceorb.command).toBe('npx');
    expect(traceorb.args).toEqual(['-y', 'traceorb-mcp@latest']);
    expect(traceorb.env.TRACEORB_READ_KEY).toBe('${TRACEORB_READ_KEY}');
    expect(traceorb.env.TRACEORB_API_URL).toBe('https://api.traceorb.com');
    expect(pkg.files).toEqual(['dist']);
  });

  test('logo.svg is the square brand mark', () => {
    const logo = readFileSync(join(root, 'assets/logo.svg'), 'utf8');
    const brand = readFileSync(
      join(root, '../brand/logos/traceorb-logo-square.svg'),
      'utf8',
    );
    expect(logo).toBe(brand);
  });
});
