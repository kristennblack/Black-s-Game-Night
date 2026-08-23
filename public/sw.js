const CACHE='black-family-game-night-v160-prop-mystery-test';
const SHELL=['/','/styles.css','/app.js','/new-games.html','/prop-hunt-3d.css','/prop-hunt-3d.js','/birthday-climb.css','/birthday-climb.js','/home-cabin-approved.png','/family-3d-lineup-approved.png','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.pathname.startsWith('/api/')) return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone(); void caches.open(CACHE).then(c=>c.put(event.request,copy)); return response;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match('/'))));
});
