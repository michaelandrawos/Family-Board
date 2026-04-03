// Family Board — Service Worker
// Handles scheduled local notifications via postMessage

// Take control immediately on install/activate
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

const pending = {};

self.addEventListener('message', e => {
  const d = e.data;
  if (!d) return;

  if (d.type === 'SCHEDULE') {
    // Cancel any existing timer for this tag
    if (pending[d.tag]) { clearTimeout(pending[d.tag]); delete pending[d.tag]; }
    const delay = d.fireTime - Date.now();
    if (delay <= 0) return;
    pending[d.tag] = setTimeout(() => {
      self.registration.showNotification(d.title, {
        body: d.body,
        tag: d.tag,
        requireInteraction: false,
        data: d.data || {}
      });
      delete pending[d.tag];
    }, delay);
  }

  if (d.type === 'CANCEL') {
    if (pending[d.tag]) { clearTimeout(pending[d.tag]); delete pending[d.tag]; }
    self.registration.getNotifications({ tag: d.tag })
      .then(ns => ns.forEach(n => n.close()));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const date = (e.notification.data && e.notification.data.date) ? e.notification.data.date : '';
  const url = self.registration.scope + (date ? '?date=' + date : '');
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
