/* Generated per production build. Only same-origin, public application assets are cached. */
const CACHE = __CACHE_NAME__;
const PRECACHE = __PRECACHE__;
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Small batches avoid a burst of requests while preparing offline study.
    for (let index = 0; index < PRECACHE.length; index += 8) {
      await cache.addAll(PRECACHE.slice(index, index + 8));
    }
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).filter(key => key.startsWith("lernzi-pwa-") && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") void self.skipWaiting();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;
  // Router responses depend on request headers. Never confuse them with cached HTML.
  if (request.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch {
        const cache = await caches.open(CACHE);
        return await cache.match(url.pathname) || await cache.match("/offline.html");
      }
    })());
    return;
  }
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/pdfjs/") || url.pathname.startsWith("/icons/") || url.pathname === "/logo-mark.svg" || url.pathname === "/manifest.webmanifest") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    })());
  }
});
