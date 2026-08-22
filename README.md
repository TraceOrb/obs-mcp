# traceorb-mcp

MCP server for [Traceorb](https://traceorb.com). Any MCP client can query your org's telemetry through the same GETs the panel uses.

## Install

Node.js ≥ 22 and `npx` on `PATH`. Create a **read key** in Traceorb Settings. The secret is shown once. Do not commit it.

```bash
npx -y traceorb-mcp
```

The process speaks MCP over stdio. It does not start unless `TRACEORB_READ_KEY` is set.

## Environment

| Variable | Required | Default |
| --- | --- | --- |
| `TRACEORB_READ_KEY` | yes | — |
| `TRACEORB_API_URL` | no | `https://api.traceorb.com` |

## Configure

Point the client at this stdio server:

```json
{
  "command": "npx",
  "args": ["-y", "traceorb-mcp"],
  "env": {
    "TRACEORB_READ_KEY": "<token>",
    "TRACEORB_API_URL": "https://api.traceorb.com"
  }
}
```

Where that JSON lives depends on the client.

### Cursor

`~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (this repo):

```json
{
  "mcpServers": {
    "traceorb": {
      "command": "npx",
      "args": ["-y", "traceorb-mcp"],
      "env": {
        "TRACEORB_READ_KEY": "<token>",
        "TRACEORB_API_URL": "https://api.traceorb.com"
      }
    }
  }
}
```

### Claude Desktop

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Same `mcpServers.traceorb` object as Cursor. Restart Claude Desktop.

### Claude Code

Project file `.mcp.json`, or:

```bash
claude mcp add --transport stdio --env TRACEORB_READ_KEY=<token> --env TRACEORB_API_URL=https://api.traceorb.com traceorb -- npx -y traceorb-mcp
```

### VS Code (Copilot)

`.vscode/mcp.json` in the workspace, or user MCP settings:

```json
{
  "servers": {
    "traceorb": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "traceorb-mcp"],
      "env": {
        "TRACEORB_READ_KEY": "<token>",
        "TRACEORB_API_URL": "https://api.traceorb.com"
      }
    }
  }
}
```

### Other MCP clients

Any client that runs a stdio server: `command` `npx`, `args` `["-y", "traceorb-mcp"]`, and the two env vars above. Restart the client after saving.

License: MIT.
