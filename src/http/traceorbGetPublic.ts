export type TraceorbGetResult = {
  status: number;
  text: string;
};

export default async function traceorbGetPublic({
  apiUrl,
  path,
}: {
  apiUrl: string;
  path: string;
}): Promise<TraceorbGetResult> {
  const url = new URL(path, `${apiUrl}/`);
  const response = await fetch(url, {
    method: 'GET',
  });

  const text = await response.text();
  return {
    status: response.status,
    text,
  };
}
