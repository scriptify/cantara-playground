import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

/* CACHING */

const toPrecache = self.__WB_MANIFEST.filter(
  (file) => !file.url.includes('index.html'),
);

precacheAndRoute(toPrecache);

registerRoute(
  ({ url }) => url.pathname.includes('index.html'),
  new NetworkFirst(),
);

console.log('[SW] execute...');

// Update the service worker as soon
// we receive a SKIP_WAITING message
// from the app.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting...');
    self.skipWaiting();
  }
  try {
    const parsed = JSON.parse(event.data);
    if (parsed.pushIcon) {
      pushIcon = parsed.pushIcon;
    }
    if (parsed.userLangCode) {
      userLangCode = parsed.userLangCode;
    }
  } catch (e) {
    console.log('Failed parsing SW event data (you can ignore this)!', e);
  }
});

// claim any clients that match the worker scope immediately. requests on these pages will
// now go via the service worker.
clientsClaim();
