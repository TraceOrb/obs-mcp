# traceorb-mcp

MCP server for [Traceorb](https://traceorb.com). Cursor (and other MCP clients) call the Traceorb query API with a **read key**. The process never talks to ClickHouse or Postgres.

```json
{
  "mcpServers": {
    "traceorb": {
      "command": "npx",
      "args": ["-y", "traceorb-mcp"],
      "env": {
        "TRACEORB_READ_KEY": "ok_read_…",
        "TRACEORB_API_URL": "https://api.traceorb.com"
      }
    }
  }
}
```

Put this in `~/.cursor/mcp.json` or `.cursor/mcp.json`. Do not commit the key.
