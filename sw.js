/* Atomic, scope-specific offline bundle. Internal version is never shown in the UI. */
const PREFIX='gd-lab:'+self.registration.scope+':';
const CACHE=PREFIX+'__GD_BUILD_HASH__';
const FILES=['./','./index.html','./styles.css','./studio.css','./manifest.webmanifest','./data/bundle.js','./data/exam.js','./scripts/app.js','./scripts/geometry.js','./scripts/labs.js','./scripts/srs.js','./scripts/math.js','./scripts/activities.js','./scripts/validation.js','./scripts/studio.js','./scripts/scene.js','./vendor/three.module.js','./vendor/three.core.js','./vendor/OrbitControls.js','./icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png',...Array.from({length:14},(_,i)=>'./images/P'+String(i+1).padStart(2,'0')+'.png')];
FILES.push('./scripts/board-labels.js','./data/cards.json','./data/seminar.json');
const URLS=new Set(FILES.map(f=>new URL(f,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(f=>new Request(new URL(f,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith(PREFIX)&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);if(!url.href.startsWith(self.registration.scope))return;
 if(request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(c=>c.match('./index.html')).then(r=>r||fetch(request)));return;}
 if(URLS.has(url.href))event.respondWith(caches.open(CACHE).then(c=>c.match(request)).then(r=>r||fetch(request)));
});
