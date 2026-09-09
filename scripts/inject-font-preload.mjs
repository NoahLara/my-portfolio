/**
 * Angular content-hashes the self-hosted Inter file, so the preload tag cannot
 * be authored in src/index.html. This injects it into the prerendered HTML
 * using whatever hashed filename the build produced.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist/pp/browser';
const font = readdirSync(dir).find((f) => /^inter-latin-var\..*\.woff2$/.test(f));

if (!font) {
  console.error('inject-font-preload: no hashed Inter woff2 found in ' + dir);
  process.exit(1);
}

const file = join(dir, 'index.html');
const html = readFileSync(file, 'utf8');
const tag = `<link rel="preload" as="font" type="font/woff2" href="${font}" crossorigin>`;

if (html.includes(tag)) {
  console.log('inject-font-preload: already present');
  process.exit(0);
}

writeFileSync(file, html.replace('</head>', `  ${tag}\n</head>`));
console.log(`inject-font-preload: preloading ${font}`);
