var GHPATH = '/jellyfin-slideshow';
var APP_PREFIX = 'jfss_';
var VERSION = 'version_001';
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/js/blurhash_pure_js_port.min.js`,
  `${GHPATH}/js/jellyfin_api.js`,
  `${GHPATH}/js/login.js`,
  `${GHPATH}/static/jellyfin.256x256.png`,
  `${GHPATH}/slideshow_swiper.html`,
  'https://unpkg.com/swiper/swiper-bundle.min.css',
  'https://unpkg.com/swiper/swiper-bundle.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@500&display=swap',
  'https://picsum.photos/800/300?random=1',
  'https://picsum.photos/800/300?random=2',
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {       
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})