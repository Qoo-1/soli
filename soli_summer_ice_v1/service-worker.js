const CACHE="soli-summer-ice-v1";
const ASSETS=["./","./index.html","./manifest.json","./css/theme.css","./css/app.css","./js/store.js","./js/icons.js","./js/engine.js","./js/app.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request))));
