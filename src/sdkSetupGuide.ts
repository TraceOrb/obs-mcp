export type SdkSetupGuideArgs = {
  language?: string | undefined;
  runtime?: string | undefined;
  topic?: string | undefined;
};

const NODE_INSTALL = `## Install and create a Node client

\`\`\`bash
npm install traceorb-node
\`\`\`

\`\`\`ts
import { createClient } from 'traceorb-node';

const obs = createClient({
  ingestUrl: process.env.OBS_INGEST_URL!,
  writeKey: process.env.OBS_WRITE_KEY!,
  service: 'api',
  env: process.env.NODE_ENV ?? 'production',
});
\`\`\`

Keep the write key in server-side environment variables. Never expose it to browser code or commit it.`;

const GO_INSTALL = `## Install and create a Go client

\`\`\`bash
go get github.com/TraceOrb/obs-sdk-go
\`\`\`

\`\`\`go
obs, err := traceorb.New(traceorb.Options{
    IngestURL: os.Getenv("OBS_INGEST_URL"),
    WriteKey:  os.Getenv("OBS_WRITE_KEY"),
    Service:   "api",
    Env:       "production",
})
if err != nil {
    return err
}
defer obs.Close()
\`\`\`

Keep the write key in server-side environment variables. Never expose it to client code or commit it.`;

const EXPRESS_MIDDLEWARE = `## Express middleware

\`\`\`ts
import { expressMiddleware } from 'traceorb-node';

app.use(express.json());
app.use(expressMiddleware(obs, {
  resolveTags(req) {
    return { plan: String(req.headers['x-plan'] ?? '') };
  },
}));
\`\`\`

Mount the middleware after the body parser and before routes.`;

const FASTIFY_MIDDLEWARE = `## Fastify middleware

\`\`\`ts
import { fastifyMiddleware } from 'traceorb-node';

fastifyMiddleware(app, obs, {
  skip(request) {
    return request.url === '/health';
  },
});
\`\`\``;

const NET_HTTP_MIDDLEWARE = `## net/http middleware

\`\`\`go
import "github.com/TraceOrb/obs-sdk-go/middleware"

handler := middleware.Middleware(obs, middleware.Options{
    ResolveTags: func(r *http.Request) map[string]string {
        return map[string]string{"plan": r.Header.Get("X-Plan")}
    },
})(mux)

http.ListenAndServe(":8080", handler)
\`\`\``;

const GIN_MIDDLEWARE = `## Gin middleware

\`\`\`go
import traceorbgin "github.com/TraceOrb/obs-sdk-go/gin"

router.Use(traceorbgin.Middleware(obs, traceorbgin.Options{}))
router.Use(traceorbgin.ErrorHandler(obs))
\`\`\``;

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
    return req.path === '/session/refresh' ? ['refreshToken'] : [];
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

const TAGS_INTRO = `## Tags

Use low-cardinality business dimensions such as \`plan\`, \`tenant\`, \`region\`, and \`channel\`. Set tags early in the request, after trusted context resolves.

Do not tag \`userId\`, email, IP, session ID, request ID, order ID, or another value unique per request. Those values create excessive cardinality and may contain PII. Stable business headers can seed a tag; use \`match\` only for a focused header lookup.`;

const NODE_TAGS = `### Node

\`\`\`ts
obs.setTags({ plan: account.plan, region: account.region });
\`\`\``;

const GO_TAGS = `### Go

\`\`\`go
obs.SetTags(r.Context(), map[string]string{
    "plan": account.Plan,
    "region": account.Region,
})
\`\`\``;

const CODE_SCAN = `## Local code-scan playbook

Traceorb does not read or upload source code. Inspect the local repository with its own search tools and report names only, never production values.

### Where to look for redaction

- Auth, login, refresh, session, password-reset, webhook-secret, and payment handlers.
- Request or response JSON fields matching \`*token*\`, \`*secret*\`, \`password\`, \`authorization\`, \`apiKey\`, or cookies.
- Global and route middleware. If \`redactKeys\`, \`RedactKeys\`, \`resolveRedactKeys\`, or \`ResolveRedactKeys\` already exists, list uncovered routes and fields.
- Sensitive query strings. A captured path can contain the query, so move secrets out of URLs and redact their key names.

### Where to look for tags

- Middleware that resolves tenant, organization, workspace, region, plan, or a low-cardinality feature flag.
- Stable business headers such as \`x-tenant-id\` or \`x-region\`; propose turning them into a tag instead of relying only on header search.
- Branches based on plan, internal environment, or channel.
- Locate \`setTags\` / \`SetTags\` calls and verify they run early enough in the request.

Avoid tags for \`userId\`, email, IP, session ID, order ID, or any request-unique identifier.

### Report format

1. **Finding:** file path plus handler or middleware symbol.
2. **Proposal:** tag key or redaction key name, without production values.
3. **Minimal patch:** a Node or Go snippet at the correct request lifecycle point.
4. **Excluded tags:** what not to tag and why, citing cardinality or PII.

Do not edit files or generate a pull request unless the user separately asks you to.`;

function includesNode(language: string): boolean {
  return language === 'node' || language === 'both';
}

function includesGo(language: string): boolean {
  return language === 'go' || language === 'both';
}

function selectedLanguage(value: string | undefined): string {
  if (value === 'node' || value === 'go' || value === 'both') {
    return value;
  }

  return 'both';
}

function selectedRuntime(value: string | undefined): string {
  if (
    value === 'express' ||
    value === 'fastify' ||
    value === 'net/http' ||
    value === 'gin'
  ) {
    return value;
  }

  return 'auto';
}

function selectedTopic(value: string | undefined): string {
  if (
    value === 'install' ||
    value === 'middleware' ||
    value === 'redact' ||
    value === 'tags' ||
    value === 'code_scan'
  ) {
    return value;
  }

  return 'all';
}

function addInstall(sections: string[], language: string): void {
  if (includesNode(language)) {
    sections.push(NODE_INSTALL);
  }
  if (includesGo(language)) {
    sections.push(GO_INSTALL);
  }
}

function addNodeMiddleware(sections: string[], runtime: string): void {
  if (runtime === 'express') {
    sections.push(EXPRESS_MIDDLEWARE);
    return;
  }
  if (runtime === 'fastify') {
    sections.push(FASTIFY_MIDDLEWARE);
    return;
  }
  if (runtime === 'auto' || runtime === 'net/http' || runtime === 'gin') {
    sections.push(EXPRESS_MIDDLEWARE, FASTIFY_MIDDLEWARE);
  }
}

function addGoMiddleware(sections: string[], runtime: string): void {
  if (runtime === 'net/http') {
    sections.push(NET_HTTP_MIDDLEWARE);
    return;
  }
  if (runtime === 'gin') {
    sections.push(GIN_MIDDLEWARE);
    return;
  }
  if (runtime === 'auto' || runtime === 'express' || runtime === 'fastify') {
    sections.push(NET_HTTP_MIDDLEWARE, GIN_MIDDLEWARE);
  }
}

function addMiddleware(
  sections: string[],
  language: string,
  runtime: string,
): void {
  if (includesNode(language)) {
    addNodeMiddleware(sections, runtime);
  }
  if (includesGo(language)) {
    addGoMiddleware(sections, runtime);
  }
}

function addRedact(sections: string[], language: string): void {
  sections.push(REDACT_INTRO);
  if (includesNode(language)) {
    sections.push(NODE_REDACT);
  }
  if (includesGo(language)) {
    sections.push(GO_REDACT);
  }
}

function addTags(sections: string[], language: string): void {
  sections.push(TAGS_INTRO);
  if (includesNode(language)) {
    sections.push(NODE_TAGS);
  }
  if (includesGo(language)) {
    sections.push(GO_TAGS);
  }
}

export default function buildSdkSetupGuide(args: SdkSetupGuideArgs): string {
  const language = selectedLanguage(args.language);
  const runtime = selectedRuntime(args.runtime);
  const topic = selectedTopic(args.topic);
  const sections = ['# Traceorb SDK setup guide'];

  if (topic === 'install' || topic === 'all') {
    addInstall(sections, language);
  }
  if (topic === 'middleware' || topic === 'all') {
    addMiddleware(sections, language, runtime);
  }
  if (topic === 'redact' || topic === 'all') {
    addRedact(sections, language);
  }
  if (topic === 'tags' || topic === 'all') {
    addTags(sections, language);
  }
  if (topic === 'code_scan' || topic === 'all') {
    sections.push(CODE_SCAN);
  }

  return `${sections.join('\n\n')}\n`;
}
