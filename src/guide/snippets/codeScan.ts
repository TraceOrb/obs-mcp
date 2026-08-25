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

export default function codeScanSections(): string[] {
  return [CODE_SCAN];
}
