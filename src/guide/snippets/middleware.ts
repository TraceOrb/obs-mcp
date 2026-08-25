import {
  includesGo,
  includesNode,
  type SdkLanguage,
  type SdkRuntime,
} from '../types';

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

const NODE_MIDDLEWARE_BY_RUNTIME: Record<SdkRuntime, readonly string[]> = {
  express: [EXPRESS_MIDDLEWARE],
  fastify: [FASTIFY_MIDDLEWARE],
  'net/http': [],
  gin: [],
  auto: [EXPRESS_MIDDLEWARE, FASTIFY_MIDDLEWARE],
};

const GO_MIDDLEWARE_BY_RUNTIME: Record<SdkRuntime, readonly string[]> = {
  express: [],
  fastify: [],
  'net/http': [NET_HTTP_MIDDLEWARE],
  gin: [GIN_MIDDLEWARE],
  auto: [NET_HTTP_MIDDLEWARE, GIN_MIDDLEWARE],
};

export default function middlewareSections({
  language,
  runtime,
}: {
  language: SdkLanguage;
  runtime: SdkRuntime;
}): string[] {
  const sections: string[] = [];
  if (includesNode(language)) {
    sections.push(...NODE_MIDDLEWARE_BY_RUNTIME[runtime]);
  }

  if (includesGo(language)) {
    sections.push(...GO_MIDDLEWARE_BY_RUNTIME[runtime]);
  }

  return sections;
}
