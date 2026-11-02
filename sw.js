/* عامل خدمة بسيط: يخزّن الهيكل الثابت ويفضّل الشبكة دائمًا (البيانات الحية لا تُخزَّن أبدًا) */
const CACHE = 'sci-shell-v1';
const SHELL = ['./', './index.html', './site.html', './config.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function () {}); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;   // طلبات الخادم (script.google.com) لا تمر من هنا
  e.respondWith(fetch(req).then(function (res) {
    const copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
    return res;
  }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match('./index.html'); }); }));
});
