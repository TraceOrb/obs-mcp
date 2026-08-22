function withJsExtension(specifier: string): string {
  if (!specifier.startsWith('.')) {
    return specifier;
  }

  if (specifier.endsWith('.js')) {
    return specifier;
  }

  if (specifier.endsWith('.json')) {
    return specifier;
  }

  return `${specifier}.js`;
}

function rewriteQuotedSpecifier({
  prefix,
  quote,
  specifier,
}: {
  prefix: string;
  quote: string;
  specifier: string;
}): string {
  return `${prefix}${quote}${withJsExtension(specifier)}${quote}`;
}

export default function rewriteEsmSource(source: string): string {
  return source.replace(
    /(from\s+|import\s*(?:\(\s*)?)(['"])(\.[^'"]+)\2/g,
    function rewriteMatch(
      _match: string,
      prefix: string,
      quote: string,
      specifier: string,
    ): string {
      return rewriteQuotedSpecifier({ prefix, quote, specifier });
    },
  );
}
