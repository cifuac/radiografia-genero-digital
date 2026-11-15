/* Radiografía de un género digital — funcionamiento sin conexión.
   Siempre intenta primero la red; si no hay señal (o tarda más de 4 s), usa la copia guardada. */
const CACHE = 'rgd-v2';
const CORE = ['./', 'index.html', 'css/styles.css', 'js/app.js', 'img/hero.webp', 'img/etapa1.webp', 'img/etapa2.webp', 'img/etapa3.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cached = () => caches.match(req, { ignoreSearch: true });
    const net = fetch(req).then(res => {
      // Se guarda sin parámetros (?v=…) para no acumular copias de un mismo archivo.
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(url.origin + url.pathname, copy)); }
      return res;
    });
    net.catch(() => {});
    const slow = new Promise(r => setTimeout(r, 4000)).then(cached);
    try {
      const first = await Promise.race([net, slow]);
      return first || await net;
    } catch (err) {
      return (await cached()) || (req.mode === 'navigate' ? await caches.match('index.html') : Response.error());
    }
  })());
});
