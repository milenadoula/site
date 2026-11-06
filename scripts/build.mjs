import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const photos = [
  { source: 'amor-de-leite.png', width: 1280, responsive: true },
  { source: 'laserterapia.jpeg', width: 1280, responsive: true },
  { source: 'amamentacao-home.jpg', width: 1280, responsive: true },
  ...Array.from({ length: 12 }, (_, i) => ({
    source: `doulagem-galeria-${i + 1}.jpg`, width: 960, responsive: false,
  })),
];
const generated = new Set(photos.flatMap(({ source, responsive }) => {
  const stem = source.replace(/\.[^.]+$/, '');
  return [join(root, 'assets', `${stem}.webp`),
    ...(responsive ? [join(root, 'assets', `${stem}-640.webp`)] : [])];
}));

// Rebuild a static output directory without exposing source or dependencies.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const pages = (await readdir(root)).filter(name => name.endsWith('.html'));
for (const name of [...pages, 'robots.txt', 'sitemap.xml', 'css', 'js', 'assets']) {
  await cp(join(root, name), join(output, name), {
    recursive: true,
    filter: source => !generated.has(source),
  });
}

let originalBytes = 0;
let optimizedBytes = 0;
for (const { source, width, responsive } of photos) {
  const input = join(root, 'assets', source);
  const stem = source.replace(/\.[^.]+$/, '');
  originalBytes += (await stat(input)).size;
  for (const targetWidth of responsive ? [width, 640] : [width]) {
    const suffix = targetWidth === 640 ? '-640' : '';
    const destination = join(output, 'assets', `${stem}${suffix}.webp`);
    const result = await sharp(input).autoOrient()
      .resize({ width: targetWidth, height: targetWidth === 640 ? 1600 : 2400,
        fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 6 })
      .toFile(destination);
    if (!suffix) optimizedBytes += result.size;
  }
}

// Fail the deployment if any local image or responsive source is missing.
for (const page of pages) {
  const html = await readFile(join(output, page), 'utf8');
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    const sources = [...tag.matchAll(/\bsrc="([^"]+)"/g)].map(match => match[1]);
    const srcset = tag.match(/\bsrcset="([^"]+)"/);
    if (srcset) sources.push(...srcset[1].split(',').map(item => item.trim().split(/\s+/)[0]));
    for (const source of sources) {
      if (!/^(https?:|data:)/.test(source)) await stat(join(output, source));
    }
  }
}
console.log(`Built ${pages.length} pages and 18 optimized WebP files.`);
console.log(`Main image variants: ${originalBytes} -> ${optimizedBytes} bytes.`);
