import { createRequire } from 'node:module';

// eslint-disable-next-line no-restricted-syntax
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// eslint-disable-next-line no-restricted-syntax
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import readMcpEnv from './env';
import { fillPath, TOOL_DESCRIPTION, TRACEORB_TOOLS } from './tools';
import traceorbGet from './traceorbGet';

const requirePackageJson = createRequire(import.meta.url);

function mcpPackageVersion(): string {
  const pkg: unknown = requirePackageJson('../package.json');
  if (typeof pkg !== 'object' || pkg === null) {
    throw new Error('package.json is required');
  }

  if (!('version' in pkg) || typeof pkg.version !== 'string') {
    throw new Error('package.json version is required');
  }

  return pkg.version;
}

const toolInputShape = {
  requestId: z.string().optional(),
  incidentId: z.string().optional(),
  baseline: z.string().optional(),
  range: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  method: z.string().optional(),
  routePattern: z.string().optional(),
  pathContains: z.string().optional(),
  statusCode: z.string().optional(),
  statusCodeMin: z.string().optional(),
  statusCodeMax: z.string().optional(),
  durationMin: z.string().optional(),
  durationMax: z.string().optional(),
  service: z.string().optional(),
  env: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  hasError: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  match: z.string().optional(),
  statusFamily: z.string().optional(),
  status: z.string().optional(),
  q: z.string().optional(),
};

function stringArgs(value: object): Record<string, string> {
  const args: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'string' && entry !== '') {
      args[key] = entry;
    }
  }

  return args;
}

export default async function startMcpServer(): Promise<void> {
  const env = readMcpEnv();
  const server = new McpServer({
    name: 'traceorb',
    version: mcpPackageVersion(),
  });

  for (const tool of TRACEORB_TOOLS) {
    server.registerTool(
      tool.name,
      {
        description: `${TOOL_DESCRIPTION} GET ${tool.pathTemplate}.`,
        inputSchema: toolInputShape,
      },
      async function handle(args) {
        const filled = fillPath({
          pathTemplate: tool.pathTemplate,
          args: stringArgs(args),
        });
        const result = await traceorbGet({
          apiUrl: env.apiUrl,
          key: env.readKey,
          path: filled.path,
          query: filled.query,
        });
        return {
          content: [{ type: 'text', text: result.text }],
        };
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
