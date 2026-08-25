export default function fillPath({
  pathTemplate,
  args,
}: {
  pathTemplate: string;
  args: Record<string, string>;
}): { path: string; query: Record<string, string> } {
  let path = pathTemplate;
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(args)) {
    const token = `{${key}}`;
    if (path.includes(token)) {
      path = path.replaceAll(token, encodeURIComponent(value));
      continue;
    }

    query[key] = value;
  }

  return { path, query };
}
