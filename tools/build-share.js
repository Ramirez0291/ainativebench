// Regenerates the static share pages and link preview images from the app's own data and renderers.
// Loaded by index.html when opened at /#build-share on tools/dev-server.mjs, so it can use
// PERSONAS, QUADS, renderOG() and renderOGDefault() from the page's script.
const SITE = 'https://rami0291.com/ainativebench/';

const esc = (s) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

// Crawlers read the meta tags; people are sent straight on to the tool with their coordinates.
function pageHTML(id) {
  const P = PERSONAS[id];
  const title = `我家是「${P.name}」｜AI 原生双轴诊断`;
  const desc = `${P.poster}${P.verdict} 16 种企业 AI 人格，你家是哪一种？`;
  const url = `${SITE}p/${id}/`;
  const img = `${SITE}og/${id}.png`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AI 原生双轴诊断">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<script>location.replace('../../?p=${id}'+(location.search?'&'+location.search.slice(1):''));</script>
</head>
<body><p><a href="../../?p=${id}">查看「${esc(P.name)}」的诊断结果 →</a></p></body>
</html>
`;
}

const put = async (path, body) => {
  const res = await fetch(path, { method: 'PUT', body });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
};
const png = (cv) => new Promise((r) => cv.toBlob(r, 'image/png'));

const log = document.createElement('pre');
log.style.cssText = 'position:fixed;inset:auto 16px 16px 16px;max-height:50vh;overflow:auto;background:#2E2219;color:#F2E8D5;padding:12px;border-radius:10px;font-size:12px;z-index:99';
document.body.append(log);
const say = (s) => { log.textContent += s + '\n'; };

try {
  const ids = Object.keys(PERSONAS).filter((id) => PERSONAS[id].quad);
  for (const [k, id] of ids.entries()) {
    const P = PERSONAS[id];
    await put(`og/${id}.png`, await png(await renderOG(P, QUADS[P.quad], Object.keys(PERSONAS).indexOf(id) + 1)));
    await put(`p/${id}/index.html`, pageHTML(id));
    say(`${k + 1}/${ids.length} ${id}`);
  }
  await put('og/default.png', await png(await renderOGDefault()));
  say('default.png');
  say('DONE');
  window.__buildShare = 'done';
} catch (err) {
  say('FAILED: ' + err.message);
  window.__buildShare = 'failed: ' + err.message;
}
