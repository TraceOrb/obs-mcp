import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import rewriteEsmSource from '../dist/build/rewriteEsmSource.js';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }

    if (!path.endsWith('.js')) {
      continue;
    }

    const source = await readFile(path, 'utf8');
    await writeFile(path, rewriteEsmSource(source));
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  await walk(join(process.cwd(), 'dist'));
}
