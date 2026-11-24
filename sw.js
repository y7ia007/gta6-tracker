const APP='gta6-app-v4',IMG='gta6-img';
const FILES=['./','index.html','data.json','data/missions.json','manifest.json','icon.svg','img/hero.jpg','img/garages.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(APP).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(APP).then(c=>c.put(req,cp));return r}).catch(()=>caches.match(req,{ignoreSearch:true})));
    return;
  }
  if(req.destination==='image'||/\.(jpe?g|png|webp)$/i.test(url.pathname)){
    e.respondWith(caches.open(IMG).then(c=>c.match(req.url).then(hit=>hit||fetch(req).then(r=>{c.put(req.url,r.clone());return r}))));
  }
});
