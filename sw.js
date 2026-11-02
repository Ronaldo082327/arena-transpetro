// Service worker do Arena Transpetro: abre offline e atualiza em segundo plano.
const CACHE = 'arena-202611021516';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png',
  'questoes.json', 'cards.json', 'banca.json', 'videos.json', 'links.json',
  'cadernos.json', 'familia.json', 'musicas.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const cdn = /(^|\.)cdn\.jsdelivr\.net$|(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !cdn) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const key = sameOrigin ? new Request(url.origin + url.pathname) : req;
    const hit = await cache.match(key);
    const net = fetch(sameOrigin ? new Request(req, {cache: 'no-cache'}) : req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(key, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const res = await net;
    return res || new Response('Sem conexão e sem cópia salva.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
  }));
});
