self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('app-cache').then(function(cache) {
        return cache.addAll([
            '/login.html',
            '/slideshow_swiper.html',
            '/js/jellyfin_api.js',
            '/js/login.js',
            '/js/blurhash_pure_js_port.min.js',
            '/js/service-worker.js',
            '/static/jellyfin.256x256.png',
            'https://unpkg.com/swiper/swiper-bundle.min.js',
            'https://unpkg.com/swiper/swiper-bundle.min.css',
            'https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@500&display=swap',
            'https://picsum.photos/800/300?random=1',
            'https://picsum.photos/800/300?random=2'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  