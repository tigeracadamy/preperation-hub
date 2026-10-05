const CACHE_NAME = 'tiger-warriors-dynamic-v1';

// 1. ஆப் ஓபன் ஆனவுடன் பேசிக் ஃபைல்களை மட்டும் லோட் செய்து கொள்ளும்
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// 2. மாணவன் எதைக் கேட்டாலும் அதைத் தூக்கி கேச்சில் சேமித்துக்கொள்ளும் (Dynamic Fetch)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse; // ஏற்கனவே சேமிக்கப்பட்டிருந்தால் அதைக் கொடுக்கும்
            }
            return fetch(event.request).then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    // புதிய டெஸ்ட் அல்லது பேஜாக இருந்தால் அதை ஆட்டோமேட்டிக்காக சேமித்து வைத்துக் கொள்ளும்!
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // இன்டர்நெட்டும் இல்லை, கேச்சிலும் இல்லை என்றால் காட்ட வேண்டியது
                return caches.match('./index.html');
            });
        })
    );
});
