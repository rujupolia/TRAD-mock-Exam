const CACHE_NAME = "trad-offline-v1";

const OFFLINE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

/* INSTALL: cache core files */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting();
});

/* ACTIVATE: clean old caches */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

/* FETCH STRATEGY (OFFLINE FIRST CORE MODE) */
self.addEventListener("fetch", event => {
  const req = event.request;

  // 1. Try cache first (offline support)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      // 2. If not cached, try network
      return fetch(req).then(networkRes => {
        return networkRes;
      }).catch(() => {
        // 3. fallback: return main page for navigation
        if (req.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});