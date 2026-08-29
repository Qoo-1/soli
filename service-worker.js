const CACHE="soli-summer-ice-v2";
const ASSETS=[
"./","./index.html","./manifest.json",
"./css/theme.css","./css/app.css",
"./js/store.js","./js/icons.js","./js/engine.js","./js/app.js",
"./icons/soli-icon-192.png","./icons/soli-icon-512.png","./icons/apple-touch-icon.png"
];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request)));
});
