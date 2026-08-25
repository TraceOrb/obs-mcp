export type TraceorbGetResult = {
  status: number;
  text: string;
};

export default async function traceorbGet({
  apiUrl,
  key,
  path,
  query,
}: {
  apiUrl: string;
  key: string;
  path: string;
  query?: Record<string, string>;
}): Promise<TraceorbGetResult> {
  const url = new URL(path, `${apiUrl}/`);
  if (query !== undefined) {
    for (const [name, value] of Object.entries(query)) {
      url.searchParams.set(name, value);
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${key}`,
    },
  });

  if (response.status === 429) {
    const header = response.headers.get('retry-after');
    let retryAfter = '1';
    if (header !== null && header !== '') {
      retryAfter = header;
    }

    return {
      status: 429,
      text: JSON.stringify({
        code: 'rate_limited',
        retryAfter,
      }),
    };
  }

  const text = await response.text();
  return {
    status: response.status,
    text,
  };
}
