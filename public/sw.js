/*
 * The Gatsby site registered a caching service worker (gatsby-plugin-offline)
 * at this address. Browsers that still have it check here for updates, get
 * this one instead, and it removes itself: clears the caches, unregisters,
 * and reloads open tabs so they fetch the live site. Keep it for as long as
 * returning visitors from before the move matter.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({type: 'window'});
    clients.forEach(client => client.navigate(client.url));
  })());
});
