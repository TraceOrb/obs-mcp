export default function truncateResponseText({
  text,
  maxBytes,
}: {
  text: string;
  maxBytes: number;
}): string {
  const bytes = Buffer.byteLength(text, 'utf8');
  if (bytes <= maxBytes) {
    return text;
  }

  return JSON.stringify({
    truncated: true,
    bytes,
    hint: 'narrow filters or lower size',
  });
}
