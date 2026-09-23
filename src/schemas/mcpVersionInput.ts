import { z } from 'zod';

export const MCP_VERSION_INPUT_SCHEMA = z.object({});

export const MCP_VERSION_TOOL_NAME = 'mcp_version';

export const MCP_VERSION_DESCRIPTION =
  'Return the published traceorb-mcp pin from GET /v1/mcp and compare it with this process. Does not use the read key. Do not use @latest.';
