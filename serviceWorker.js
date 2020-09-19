"use strict";
const swListener = new BroadcastChannel("swListener");
const cacheName = "cache-v0.3";
var oldCache = false;
const precacheResources = [
    "./",

    "manifest.json",

    "css/landscape.css",
    "css/portrait.css",
    "css/style.css",

    "img/dice/1.png",
    "img/dice/2.png",
    "img/dice/3.png",
    "img/dice/4.png",
    "img/dice/5.png",
    "img/dice/6.png",
    "img/icon.png",
    "img/icon.svg",
    "img/plus.svg",

    "js/components/addPlayersListItem.js",
    "js/components/gamefield.js",
    "js/vue/app.js",
    "js/vue/computed.js",
    "js/vue/data.js",
    "js/vue/methods.js",
    "js/vue/text.js",
    "js/vue/watch.js",
    "js/confetti.min.js",
    "js/game.js",
    "js/script.js",
    "js/vueMin.js"
];

self.addEventListener('install', (event ) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
          console.log('[ServiceWorker] Pre-caching offline page');
          return cache.addAll(precacheResources);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event ) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(oldCache)
                    swListener.postMessage("update"); //message on update available
                oldCache = true;
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event  => {//Add fetch event handler
    event.respondWith(
        caches.open(cacheName).then((cache) => {
          return cache.match(event.request)
              .then((response) => {
                return response || fetch(event.request);
              });
        })
    );
});