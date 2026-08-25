import { includesGo, includesNode, type SdkLanguage } from '../types';

const TAGS_INTRO = `## Tags

Use low-cardinality business dimensions such as \`plan\`, \`tenant\`, \`region\`, and \`channel\`. Set tags early in the request, after trusted context resolves.

Represent business dimensions as tags now so phase 3 queries can group them with \`groupBy=tag:<key>\`.

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

export default function tagsSections({
  language,
}: {
  language: SdkLanguage;
}): string[] {
  const sections = [TAGS_INTRO];
  if (includesNode(language)) {
    sections.push(NODE_TAGS);
  }

  if (includesGo(language)) {
    sections.push(GO_TAGS);
  }

  return sections;
}
