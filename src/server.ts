import { createRequire } from 'node:module';

// eslint-disable-next-line no-restricted-syntax
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// eslint-disable-next-line no-restricted-syntax
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import fillPath from './catalog/fillPath';
import { TRACEORB_HTTP_TOOLS, httpToolDescription } from './catalog/httpTools';
import { MAX_RESPONSE_BYTES, PACKAGE_NAME } from './constants';
import readMcpEnv from './env';
import buildMcpVersion from './guide/buildMcpVersion';
import buildSdkSetupGuide from './guide/buildSdkSetupGuide';
import traceorbGet from './http/traceorbGet';
import traceorbGetPublic from './http/traceorbGetPublic';
import truncateResponseText from './http/truncateResponse';
import { HTTP_TOOL_SCHEMAS } from './schemas/httpToolSchemas';
import {
  MCP_VERSION_DESCRIPTION,
  MCP_VERSION_INPUT_SCHEMA,
  MCP_VERSION_TOOL_NAME,
} from './schemas/mcpVersionInput';
import {
  SDK_SETUP_GUIDE_DESCRIPTION,
  SDK_SETUP_GUIDE_INPUT_SCHEMA,
  SDK_SETUP_GUIDE_TOOL_NAME,
} from './schemas/sdkSetupGuideInput';

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
    name: PACKAGE_NAME,
    version: mcpPackageVersion(),
  });

  for (const tool of TRACEORB_HTTP_TOOLS) {
    server.registerTool(
      tool.name,
      {
        description: httpToolDescription(tool),
        inputSchema: HTTP_TOOL_SCHEMAS[tool.name],
      },
      async function handleHttpTool(args: object) {
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
    SDK_SETUP_GUIDE_TOOL_NAME,
    {
      description: SDK_SETUP_GUIDE_DESCRIPTION,
      inputSchema: SDK_SETUP_GUIDE_INPUT_SCHEMA,
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

  server.registerTool(
    MCP_VERSION_TOOL_NAME,
    {
      description: MCP_VERSION_DESCRIPTION,
      inputSchema: MCP_VERSION_INPUT_SCHEMA,
    },
    async function handleMcpVersion() {
      return {
        content: [
          {
            type: 'text' as const,
            text: await buildMcpVersion({
              running: mcpPackageVersion(),
              apiUrl: env.apiUrl,
              getPublic: traceorbGetPublic,
            }),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
