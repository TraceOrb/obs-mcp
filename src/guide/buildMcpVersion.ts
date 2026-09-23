function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export default async function buildMcpVersion({
  running,
  apiUrl,
  getPublic,
}: {
  running: string;
  apiUrl: string;
  getPublic: (args: {
    apiUrl: string;
    path: string;
  }) => Promise<{ status: number; text: string }>;
}): Promise<string> {
  const result = await getPublic({
    apiUrl,
    path: '/v1/mcp',
  });

  if (result.status !== 200) {
    return JSON.stringify({
      error: true,
      status: result.status,
      body: result.text,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    return JSON.stringify({
      error: true,
      status: result.status,
      body: result.text,
    });
  }

  if (!isRecord(parsed)) {
    return JSON.stringify({
      error: true,
      status: result.status,
      body: result.text,
    });
  }

  const body = parsed;
  if (typeof body.version !== 'string' || typeof body.npx !== 'string') {
    return JSON.stringify({
      error: true,
      status: result.status,
      body: result.text,
    });
  }

  let update: string[] = [];
  if (Array.isArray(body.update)) {
    update = body.update.filter(function isString(entry): entry is string {
      return typeof entry === 'string';
    });
  }

  return JSON.stringify({
    running,
    latest: body.version,
    needsUpdate: running !== body.version,
    npx: body.npx,
    update,
  });
}
