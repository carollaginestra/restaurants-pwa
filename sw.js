/**
 * On install - caching the application shell
 */
let PWA = 'restaurants-cache';
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(PWA)
            .then(function(cache) {
            return cache.addAll(
                [
                    './',
                    './index.html',
                    './restaurant.html',
                    './css/styles.css',
                    './js/main.js',
                    './js/restaurant_info.js',
                    './js/dbhelper.js',
                    './js/sw_register.js',
                    './data/restaurants.json',
                    './img/1.jpg',
                    './img/2.jpg',
                    './img/3.jpg',
                    './img/4.jpg',
                    './img/5.jpg',
                    './img/6.jpg',
                    './img/7.jpg',
                    './img/8.jpg',
                    './img/9.jpg',
                    './img/10.jpg',
                    './img/favicon.png',
                ]
            );
        })
    );
});


/**
 * Activation of service worker
 */
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurants-') &&
                        cacheName != PWA;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


/**
 * Fetching for offline content viewing
 */
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            }
    
            var fetchRequest = event.request.clone();
    
            return fetch(fetchRequest).then(
                function(response) {
                    // Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
        
                    var responseToCache = response.clone();
        
                    caches.open(PWA)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
        
                    return response;
                }
            );
        })
    );
});