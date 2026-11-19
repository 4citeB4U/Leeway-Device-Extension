/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BROWSER
TAG: LEEWAY.UNIVERSAL_EXTENSION.COURIER.V2
5WH:
WHAT: Bind user-initiated browser communication to one correlated native-host handshake and scoped excerpt submission.
WHY: Reject stale or unsolicited host acknowledgments, concurrent connect races and silent transport failures.
WHO: Creator-authorized LeeWay Device Extension contributors; original Device Bridge and Runtime remain the only authority.
WHERE: extension/background.js in 4citeB4U/Leeway-Device-Extension.
WHEN: 2026-11-19.
HOW: Promise single-flight, challenge correlation, fail-closed disconnect and bounded request acknowledgment.
LICENSE: Existing repository terms apply.
*/
(function (scope) {
  'use strict';
  if (!scope.LeeWayExtension && typeof importScripts === 'function') importScripts('browser-polyfill.js');
  const B = scope.LeeWayExtension;
  if (!B?.api) return;
  let port = null;
  let sessionId = null;
  let connectPromise = null;
  let handshakeId = null;
  let handshakeTimer = null;
  let failHandshake = null;
  const pending = new Map();

  const status = () => ({
    connected: Boolean(port && sessionId),
    host: B.HOST,
    authority: 'NATIVE_HOST_ONLY',
    execution: 'NOT_ASSERTED'
  });

  function reset(reason = 'NATIVE_HOST_DISCONNECTED') {
    const oldPort = port;
    port = null;
    sessionId = null;
    handshakeId = null;
    if (handshakeTimer) clearTimeout(handshakeTimer);
    handshakeTimer = null;
    const rejectHandshake = failHandshake;
    failHandshake = null;
    connectPromise = null;
    if (rejectHandshake) rejectHandshake(new Error(reason));
    for (const item of pending.values()) {
      clearTimeout(item.timer);
      item.reject(new Error(reason));
    }
    pending.clear();
    try { oldPort?.disconnect(); } catch { /* No authority inferred from disconnect. */ }
  }

  function connect() {
    if (port && sessionId) return Promise.resolve(status());
    if (connectPromise) return connectPromise;

    // A nonce is only a correlation guard. The native host must independently
    // verify the owner identity, device passport and Runtime grants.
    connectPromise = new Promise((resolve, reject) => {
      let candidate;
      try {
        candidate = B.api.runtime.connectNative(B.HOST);
        if (!candidate?.onMessage?.addListener || !candidate?.onDisconnect?.addListener ||
          typeof candidate.postMessage !== 'function') throw new Error('NATIVE_PORT_INVALID');
      } catch {
        reset('NATIVE_HOST_UNAVAILABLE');
        reject(new Error('NATIVE_HOST_UNAVAILABLE'));
        return;
      }
      port = candidate;
      handshakeId = crypto.randomUUID();
      const expectedId = handshakeId;
      failHandshake = reject;
      handshakeTimer = setTimeout(() => {
        if (port === candidate && !sessionId) reset('NATIVE_HANDSHAKE_TIMEOUT');
      }, 8000);

      candidate.onMessage.addListener(message => {
        if (port !== candidate) return;
        if (message?.type === 'leeway.extension.hello-ack') {
          if (sessionId) return;
          if (message.version !== B.VERSION || message.helloId !== expectedId ||
            message.authenticated !== true || typeof message.sessionId !== 'string' ||
            !/^[A-Za-z0-9._:-]{8,128}$/.test(message.sessionId) ||
            !Array.isArray(message.capabilities) ||
            !message.capabilities.includes('page.excerpt.submit')) {
            reset('NATIVE_AUTHENTICATION_NOT_QUALIFIED');
            return;
          }
          clearTimeout(handshakeTimer);
          handshakeTimer = null;
          handshakeId = null;
          failHandshake = null;
          connectPromise = null;
          sessionId = message.sessionId;
          resolve(status());
          return;
        }
        const item = pending.get(message?.requestId);
        if (!item || message?.type !== 'leeway.extension.receipt' ||
          message.sessionId !== sessionId) return;
        pending.delete(message.requestId);
        clearTimeout(item.timer);
        if (message.accepted === true) {
          item.resolve({ acknowledged: true, authority: 'NATIVE_HOST_ACK_NOT_VERITAS' });
        } else {
          item.reject(new Error('NATIVE_REQUEST_REJECTED'));
        }
      });
      candidate.onDisconnect.addListener(() => {
        if (port === candidate) reset('NATIVE_HOST_DISCONNECTED');
      });
      try {
        candidate.postMessage({
          type: 'leeway.extension.hello',
          version: B.VERSION,
          helloId: expectedId,
          requestedCapabilities: ['page.excerpt.submit']
        });
      } catch {
        reset('NATIVE_HELLO_SEND_FAILED');
      }
    });
    // The constructor can reject synchronously before the assignment above.
    // Clear settled attempts so a newly installed or restarted host can retry.
    const thisAttempt = connectPromise;
    void thisAttempt.then(
      () => { if (connectPromise === thisAttempt) connectPromise = null; },
      () => { if (connectPromise === thisAttempt) connectPromise = null; }
    );
    return thisAttempt;
  }

  function share(payload) {
    if (!port || !sessionId) return Promise.reject(new Error('NATIVE_HOST_NOT_AUTHENTICATED'));
    let safe;
    try { safe = B.excerpt(payload); }
    catch (error) { return Promise.reject(error); }
    const requestId = crypto.randomUUID();
    const candidate = port;
    const currentSession = sessionId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(requestId);
        reject(new Error('NATIVE_RECEIPT_TIMEOUT'));
      }, 8000);
      pending.set(requestId, { resolve, reject, timer });
      try {
        candidate.postMessage({
          type: 'leeway.extension.page-excerpt',
          version: B.VERSION,
          requestId,
          sessionId: currentSession,
          excerpt: safe
        });
      } catch {
        pending.delete(requestId);
        clearTimeout(timer);
        reject(new Error('NATIVE_EXCERPT_SEND_FAILED'));
        if (port === candidate) reset('NATIVE_HOST_TRANSPORT_FAILURE');
      }
    });
  }

  function trusted(sender, payload) {
    if (sender?.id !== B.api.runtime.id || !B.allowedPage(sender?.tab?.url)) return false;
    try {
      return !payload?.href ||
        new URL(payload.href).origin === new URL(sender.tab.url).origin;
    } catch { return false; }
  }

  B.api.runtime.onMessage.addListener((request, sender, respond) => {
    if (!request || !trusted(sender, request.payload)) return false;
    const job = request.type === 'LEEWAY_STATUS'
      ? Promise.resolve(status())
      : request.type === 'LEEWAY_CONNECT'
        ? connect()
        : request.type === 'LEEWAY_DISCONNECT'
          ? Promise.resolve().then(() => { reset(); return status(); })
          : request.type === 'LEEWAY_SHARE_SELECTION'
            ? share(request.payload)
            : null;
    if (!job) return false;
    job.then(result => respond({ ok: true, result }),
      error => respond({ ok: false, error: String(error?.message || error).slice(0, 256) }));
    return true;
  });

  B.api.action.onClicked.addListener(tab => {
    if (Number.isInteger(tab?.id) && B.allowedPage(tab.url)) {
      void B.call('scripting.executeScript', {
        target: { tabId: tab.id },
        files: ['browser-polyfill.js', 'content-courier.js', 'floating-tablet.js']
      }).catch(() => {/* Not authorized or unsupported; no background collection. */});
    }
  });
})(globalThis);
