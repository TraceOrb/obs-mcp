import { includesGo, includesNode, type SdkLanguage } from '../types';

const REDACT_INTRO = `## Redaction

Traceorb applies built-in sensitive field-name defaults first. Add application-specific names globally with \`redactKeys\` / \`RedactKeys\`, per middleware with \`resolveRedactKeys\` / \`ResolveRedactKeys\`, or inside one request with \`obs.redact\` / \`obs.Redact\`.

After representative traffic exists, call the separate \`suggest_redact_keys\` MCP tool and review the suggested key names. This guide never fetches or mixes observed candidate data.`;

const NODE_REDACT = `### Node

\`\`\`ts
const obs = createClient({
  ingestUrl,
  writeKey,
  service: 'api',
  env: 'production',
  redactKeys: ['customerReference'],
});

app.use(expressMiddleware(obs, {
  resolveRedactKeys(req) {
    if (req.path === '/session/refresh') {
      return ['refreshToken'];
    }

    return [];
  },
}));

obs.redact(['privateNote']);
\`\`\``;

const GO_REDACT = `### Go

\`\`\`go
obs, err := traceorb.New(traceorb.Options{
    IngestURL: ingestURL,
    WriteKey:  writeKey,
    Service:   "api",
    Env:       "production",
    RedactKeys: []string{"customerReference"},
})

middleware.Middleware(obs, middleware.Options{
    ResolveRedactKeys: func(r *http.Request) []string {
        if r.URL.Path == "/session/refresh" {
            return []string{"refreshToken"}
        }
        return nil
    },
})

obs.Redact(r.Context(), []string{"privateNote"})
\`\`\``;

export default function redactSections({
  language,
}: {
  language: SdkLanguage;
}): string[] {
  const sections = [REDACT_INTRO];
  if (includesNode(language)) {
    sections.push(NODE_REDACT);
  }

  if (includesGo(language)) {
    sections.push(GO_REDACT);
  }

  return sections;
}
