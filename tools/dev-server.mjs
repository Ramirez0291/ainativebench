// Local dev server for ainativebench. No dependencies.
//   node tools/dev-server.mjs            → http://127.0.0.1:4323/
//   open http://127.0.0.1:4323/#build-share to regenerate p/<id>/index.html and og/<id>.png
// Besides serving files, it accepts PUT for exactly those generated paths and nothing else.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 4323;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };
const WRITABLE = [/^\/og\/[a-z_]+\.png$/, /^\/p\/[a-z_]+\/index\.html$/];

const resolve = (urlPath) => {
  const file = normalize(join(ROOT, decodeURIComponent(urlPath)));
  return file === ROOT || file.startsWith(ROOT + sep) ? file : null;
};

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  try {
    if (req.method === 'PUT') {
      if (!WRITABLE.some((re) => re.test(path))) return res.writeHead(403).end('not writable');
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const file = resolve(path);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, Buffer.concat(chunks));
      console.log('wrote', path);
      return res.writeHead(204).end();
    }
    let file = resolve(path.endsWith('/') ? path + 'index.html' : path);
    if (!file) return res.writeHead(403).end();
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
  } catch (err) {
    res.writeHead(err.code === 'ENOENT' ? 404 : 500).end(String(err.code || err));
  }
}).listen(PORT, '127.0.0.1', () => console.log(`ainativebench dev server: http://127.0.0.1:${PORT}/`));
