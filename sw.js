const C='booth-v2',OK=['cdn.jsdelivr.net','storage.googleapis.com'];
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
  const ext=OK.includes(u.hostname),same=u.origin===location.origin;if(!ext&&!same)return;
  const store=x=>{if(x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x};
  // CDN files (pose code + model): cache-first. Own files: network-first so updates arrive.
  e.respondWith(ext?caches.match(r).then(h=>h||fetch(r).then(store)):fetch(r).then(store).catch(()=>caches.match(r)));
});
