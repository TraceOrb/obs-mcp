import { createRequire } from 'node:module';

// eslint-disable-next-line no-restricted-syntax
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// eslint-disable-next-line no-restricted-syntax
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import readMcpEnv from './env';
import buildSdkSetupGuide from './sdkSetupGuide';
import { TOOL_SCHEMAS } from './toolSchemas';
import { fillPath, TOOL_DESCRIPTION, TRACEORB_TOOLS } from './tools';
import traceorbGet from './traceorbGet';
import truncateResponseText from './truncateResponse';

const requirePackageJson = createRequire(import.meta.url);
const MAX_RESPONSE_BYTES = 256 * 1024;

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
        description: `${tool.description} ${TOOL_DESCRIPTION} GET ${tool.pathTemplate}.`,
        inputSchema: TOOL_SCHEMAS[tool.name],
      },
      async function handle(args: object) {
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
          content: [
            {
              type: 'text' as const,
              text: truncateResponseText({
                text: result.text,
                maxBytes: MAX_RESPONSE_BYTES,
              }),
            },
          ],
        };
      },
    );
  }

  server.registerTool(
    'sdk_setup_guide',
    {
      description:
        'Return a local Traceorb SDK setup guide and repository code-scan playbook. Does not call the Traceorb API or inspect source code.',
      inputSchema: z.object({
        language: z.enum(['node', 'go', 'both']).optional(),
        runtime: z
          .enum(['express', 'fastify', 'net/http', 'gin', 'auto'])
          .optional(),
        topic: z
          .enum(['install', 'middleware', 'redact', 'tags', 'code_scan', 'all'])
          .optional(),
      }),
    },
    async function handleSdkSetupGuide(args) {
      return {
        content: [
          {
            type: 'text' as const,
            text: buildSdkSetupGuide(args),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
