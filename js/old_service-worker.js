self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('app-cache').then(function(cache) {
        return cache.addAll([
            './',
            './slick.html',
            './jellyfin_api.js',
            './blurhash_pure_js_port.min.js',
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
  