/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }));

self.skipWaiting();
clientsClaim();

main();

async function main() {
  console.log('******************** Server worker registered ********************');

  self.addEventListener('push', (event) => {
    console.log('push event', event);
    const payload = event.data?.text() ?? 'no payload';
    event.waitUntil(
      self.registration.showNotification('Tessarus KGEC', {
        body: JSON.parse(payload),
        icon: 'https://res.cloudinary.com/dvgapxbzj/image/upload/v1730005376/tessarus-25/tessarus-email-logo.png',
        badge: 'https://res.cloudinary.com/dvgapxbzj/image/upload/v1730005376/tessarus-25/tessarus-email-logo.png',
      }),
    );
  });

  self.addEventListener('notificationclick', (event) => {
    console.log('notification clicked', event);
  });
}

// main();
