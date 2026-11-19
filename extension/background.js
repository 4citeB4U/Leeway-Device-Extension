/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BROWSER
TAG: LEEWAY.UNIVERSAL_EXTENSION.COURIER.V1
5WH:
WHAT: Relay explicitly user-selected excerpts to an enrolled, authenticated native Device Bridge host.
WHY: Prevent ambient browsing, credential leakage and a browser-side execution bypass.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: extension/background.js.
WHEN: 2026-11-19.
HOW: Use MV3 activeTab injection, a host handshake and correlated acknowledgements.
LICENSE: Existing repository terms apply.
*/
(function (scope) {
  'use strict';
  if (!scope.LeeWayExtension && typeof importScripts === 'function') importScripts('browser-polyfill.js');
  const B = scope.LeeWayExtension;
  if (!B?.api) return;
  let port = null; let sessionId = null; const pending = new Map();
  const reset = () => { try { port?.disconnect(); } catch {} port = null; sessionId = null; for (const item of pending.values()) { clearTimeout(item.timer); item.reject(new Error('NATIVE_HOST_DISCONNECTED')); } pending.clear(); };
  const status = () => ({ connected: Boolean(port && sessionId), host: B.HOST, authority: 'NATIVE_HOST_ONLY', execution: 'NOT_ASSERTED' });
  function connect() {
    if (port && sessionId) return Promise.resolve(status());
    return new Promise((resolve, reject) => {
      try { port = B.api.runtime.connectNative(B.HOST); } catch { reject(new Error('NATIVE_HOST_UNAVAILABLE')); return; }
      const timer = setTimeout(() => { reset(); reject(new Error('NATIVE_HANDSHAKE_TIMEOUT')); }, 8000);
      port.onMessage.addListener(message => {
        if (message?.type === 'leeway.extension.hello-ack') {
          if (message.version !== B.VERSION || message.authenticated !== true || typeof message.sessionId !== 'string' || !Array.isArray(message.capabilities) || !message.capabilities.includes('page.excerpt.submit')) { clearTimeout(timer); reset(); reject(new Error('NATIVE_AUTHENTICATION_NOT_QUALIFIED')); return; }
          clearTimeout(timer); sessionId = message.sessionId; resolve(status()); return;
        }
        const item = pending.get(message?.requestId);
        if (!item || message?.type !== 'leeway.extension.receipt' || message.sessionId !== sessionId) return;
        pending.delete(message.requestId); clearTimeout(item.timer);
        message.accepted === true ? item.resolve({ acknowledged: true, authority: 'NATIVE_HOST_ACK_NOT_VERITAS' }) : item.reject(new Error('NATIVE_REQUEST_REJECTED'));
      });
      port.onDisconnect.addListener(() => { clearTimeout(timer); reset(); });
      port.postMessage({ type: 'leeway.extension.hello', version: B.VERSION, requestedCapabilities: ['page.excerpt.submit'] });
    });
  }
  function share(payload) {
    if (!port || !sessionId) return Promise.reject(new Error('NATIVE_HOST_NOT_AUTHENTICATED'));
    const requestId = crypto.randomUUID(); const safe = B.excerpt(payload);
    return new Promise((resolve, reject) => { const timer = setTimeout(() => { pending.delete(requestId); reject(new Error('NATIVE_RECEIPT_TIMEOUT')); }, 8000); pending.set(requestId, { resolve, reject, timer }); port.postMessage({ type: 'leeway.extension.page-excerpt', version: B.VERSION, requestId, sessionId, excerpt: safe }); });
  }
  function trusted(sender, payload) { if (sender?.id !== B.api.runtime.id || !B.allowedPage(sender?.tab?.url)) return false; try { return !payload?.href || new URL(payload.href).origin === new URL(sender.tab.url).origin; } catch { return false; } }
  B.api.runtime.onMessage.addListener((request, sender, respond) => { if (!request || !trusted(sender, request.payload)) return false; const job = request.type === 'LEEWAY_STATUS' ? Promise.resolve(status()) : request.type === 'LEEWAY_CONNECT' ? connect() : request.type === 'LEEWAY_DISCONNECT' ? Promise.resolve().then(() => { reset(); return status(); }) : request.type === 'LEEWAY_SHARE_SELECTION' ? share(request.payload) : null; if (!job) return false; job.then(result => respond({ ok: true, result }), error => respond({ ok: false, error: String(error.message || error).slice(0, 256) })); return true; });
  B.api.action.onClicked.addListener(tab => { if (tab?.id && B.allowedPage(tab.url)) void B.call('scripting.executeScript', { target: { tabId: tab.id }, files: ['browser-polyfill.js', 'content-courier.js', 'floating-tablet.js'] }); });
})(globalThis);
