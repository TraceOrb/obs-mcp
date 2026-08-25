import {
  includesGo,
  includesNode,
  type SdkLanguage,
  type SdkRuntime,
} from '../types';

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

const GIN_INSTALL = `### Install the separate Gin module

\`\`\`bash
go get github.com/TraceOrb/obs-sdk-go/gin
\`\`\``;

const INCLUDE_GIN_INSTALL: Record<SdkRuntime, boolean> = {
  express: false,
  fastify: false,
  'net/http': false,
  gin: true,
  auto: true,
};

export default function installSections({
  language,
  runtime,
}: {
  language: SdkLanguage;
  runtime: SdkRuntime;
}): string[] {
  const sections: string[] = [];
  if (includesNode(language)) {
    sections.push(NODE_INSTALL);
  }

  if (includesGo(language)) {
    sections.push(GO_INSTALL);
    if (INCLUDE_GIN_INSTALL[runtime]) {
      sections.push(GIN_INSTALL);
    }
  }

  return sections;
}
