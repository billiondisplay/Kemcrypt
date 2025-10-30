// Service Worker for Kemcrypt Password Generator
// Version 2.0.0 - Enhanced with offline support and better caching

const CACHE_NAME = 'kemcrypt-v2.0.0';
const OFFLINE_PAGE = '/offline.html';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-180x180.png',
  '/safari-pinned-tab.svg',
  OFFLINE_PAGE
];

// Cache name for theme icons
const THEME_ICONS_CACHE = 'kemcrypt-theme-icons';

// Install event - cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .catch((error) => {
        console.error('[Service Worker] Cache addAll error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('kemcrypt-') && 
                   cacheName !== CACHE_NAME && 
                   cacheName !== THEME_ICONS_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event handler with network-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests, try network first, then cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If we got a valid response, cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
            .then(response => response || caches.match(OFFLINE_PAGE));
        })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          // Update cache in the background
          fetchAndCache(event.request);
          return cachedResponse;
        }
        // Otherwise, fetch from network
        return fetchAndCache(event.request);
      })
      .catch(() => {
        // If both cache and network fail, return offline page for HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match(OFFLINE_PAGE);
        }
      })
  );
});

// Helper function to fetch and cache responses
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // Check if we received a valid response
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // Clone the response
      const responseToCache = response.clone();

      caches.open(CACHE_NAME)
        .then((cache) => {
          cache.put(request, responseToCache);
        });

      return response;
    })
    .catch((error) => {
      console.error('Fetch failed; returning offline page.', error);
      if (request.headers.get('accept').includes('text/html')) {
        return caches.match(OFFLINE_PAGE);
      }
      throw error;
    });
}

// Listen for messages from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(processSyncRequests());
  }
});

async function processSyncRequests() {
  // Implement background sync logic here
  // This would typically involve retrying failed requests
  console.log('Processing background sync...');
}

// ==========================================
// Message Event - Manual Cache Update
// ==========================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.payload))
    );
  }
});

// ==========================================
// Background Sync (Future Enhancement)
// ==========================================

self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync event:', event.tag);
  
  if (event.tag === 'sync-passwords') {
    // Future: Sync password history or settings
    event.waitUntil(
      // Add sync logic here
      Promise.resolve()
    );
  }
});

// ==========================================
// Push Notification (Future Enhancement)
// ==========================================

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Kemcrypt',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Kemcrypt', options)
  );
});

// ==========================================
// Notification Click Event
// ==========================================

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
