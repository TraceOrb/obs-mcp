# traceorb-mcp

MCP server for [Traceorb](https://traceorb.com). Cursor and other agents query your org's telemetry through the same GETs the panel uses.

## Setup

Create a **read key** in Traceorb Settings. Paste this into `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (this repo). Do not commit the key.

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

`TRACEORB_READ_KEY` is required. `TRACEORB_API_URL` defaults to `https://api.traceorb.com`. Node and `npx` must be on `PATH`.
