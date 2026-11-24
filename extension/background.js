/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BROWSER
TAG: LEEWAY.UNIVERSAL_EXTENSION.COURIER.SIDEBAR.V3
5WH:
WHAT: Preserve correlated native-host courier while exposing one owner-activated LeeWay Operating System side panel.
WHY: Reject stale or unsolicited host acknowledgments, concurrent connect races and silent transport failures.
WHO: Creator-authorized LeeWay Device Extension contributors; original Device Bridge and Runtime remain the only authority.
WHERE: extension/background.js in 4citeB4U/Leeway-Device-Extension.
WHEN: 2026-11-19.
HOW: Preserve single-flight native handshake, accept only exact extension-panel messages and open Chromium side panel on action click.
LICENSE: Existing repository terms apply.
*/
(function (scope) {
  'use strict';
  if (!scope.LeeWayExtension && typeof importScripts === 'function') importScripts('browser-polyfill.js');
  if (!scope.LeeWayBridgeSessionContract && typeof importScripts === 'function') importScripts('bridge-session-contract.js');
  const B = scope.LeeWayExtension;
  const Bridge = scope.LeeWayBridgeSessionContract;
  if (!B?.api || !Bridge?.verifySnapshot) return;
  let port = null;
  let sessionId = null;
  let connectPromise = null;
  let handshakeId = null;
  let handshakeTimer = null;
  let failHandshake = null;
  const pending = new Map();
  const bridgePending = new Map();
  let bridgeSnapshot = null;

  const status = () => ({
    connected: Boolean(port && sessionId),
    host: B.HOST,
    authority: 'NATIVE_HOST_ONLY',
    execution: 'NOT_ASSERTED',
    bridgeQualified: Boolean(port && sessionId && bridgeSnapshot),
    deviceCount: bridgeSnapshot?.devices?.length || 0,
    bridgeState: bridgeSnapshot ? 'NATIVE_BRIDGE_RUNTIME_SNAPSHOT_REPORTED' : 'BRIDGE_READBACK_REQUIRED'
  });

  function reset(reason = 'NATIVE_HOST_DISCONNECTED') {
    const oldPort = port;
    port = null;
    sessionId = null;
    bridgeSnapshot = null;
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
    for (const item of bridgePending.values()) {
      clearTimeout(item.timer);
      item.reject(new Error(reason));
    }
    bridgePending.clear();
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
        if (message?.type === 'leeway.extension.bridge-snapshot') {
          const entry = bridgePending.get(message?.requestId);
          if (!entry) return;
          bridgePending.delete(message.requestId);
          clearTimeout(entry.timer);
          try {
            const snapshot = Bridge.verifySnapshot(message, {
              requestId: entry.requestId, sessionId: entry.sessionId
            });
            if (port !== candidate || sessionId !== entry.sessionId) throw Error('NATIVE_SESSION_CHANGED');
            bridgeSnapshot = snapshot;
            entry.resolve(snapshot);
          } catch (error) {
            bridgeSnapshot = null;
            entry.reject(error);
          }
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

  async function readBridgeSnapshot() {
    await connect();
    if (!port || !sessionId) throw Error('NATIVE_HOST_NOT_AUTHENTICATED');
    const requestId = crypto.randomUUID();
    const candidate = port;
    const currentSession = sessionId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        bridgePending.delete(requestId);
        bridgeSnapshot = null;
        reject(Error('BRIDGE_RUNTIME_READBACK_TIMEOUT'));
      }, 10000);
      bridgePending.set(requestId, {requestId,sessionId:currentSession,resolve,reject,timer});
      try {
        candidate.postMessage({
          type:'leeway.extension.bridge-snapshot-request',
          version:B.VERSION,requestId,sessionId:currentSession,
          requestedCapabilities:[...Bridge.SESSION_CAPABILITIES]
        });
      } catch {
        bridgePending.delete(requestId);
        clearTimeout(timer);
        bridgeSnapshot = null;
        reject(Error('BRIDGE_RUNTIME_READBACK_SEND_FAILED'));
        if (port === candidate) reset('NATIVE_HOST_TRANSPORT_FAILURE');
      }
    });
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

  function trusted(sender, request) {
    if (sender?.id !== B.api.runtime.id) return false;
    // The extension's own sidebar can connect its optional native host, but
    // it cannot submit content excerpts without a selected HTTP(S) page.
    const panelUrl = B.api.runtime.getURL?.('operating-system.html');
    if (panelUrl && sender?.url === panelUrl &&
      ['LEEWAY_STATUS','LEEWAY_CONNECT','LEEWAY_BRIDGE_SNAPSHOT','LEEWAY_DISCONNECT','LEEWAY_OPEN_COURIER'].includes(request?.type))
      return true;
    if (!B.allowedPage(sender?.tab?.url)) return false;
    try {
      return !request?.payload?.href ||
        new URL(request.payload.href).origin === new URL(sender.tab.url).origin;
    } catch { return false; }
  }
  async function openCourier(){
    const tabs = await B.call('tabs.query',{active:true,currentWindow:true});
    const tab = Array.isArray(tabs)?tabs[0]:null;
    if (!Number.isInteger(tab?.id) || !B.allowedPage(tab?.url))
      throw Error('COURIER_ACTIVE_PAGE_REQUIRED');
    await B.call('scripting.executeScript',{
      target:{tabId:tab.id},
      files:['browser-polyfill.js','content-courier.js','floating-tablet.js']
    });
    return {opened:true,authority:'USER_ACTIVATED_COURIER_ONLY'};
  }

  B.api.runtime.onMessage.addListener((request, sender, respond) => {
    if (!request || !trusted(sender, request)) return false;
    const job = request.type === 'LEEWAY_STATUS'
      ? Promise.resolve(status())
      : request.type === 'LEEWAY_CONNECT'
        ? connect()
        : request.type === 'LEEWAY_BRIDGE_SNAPSHOT'
          ? readBridgeSnapshot()
        : request.type === 'LEEWAY_DISCONNECT'
          ? Promise.resolve().then(() => { reset(); return status(); })
          : request.type === 'LEEWAY_SHARE_SELECTION'
            ? share(request.payload)
            : request.type === 'LEEWAY_OPEN_COURIER'
              ? openCourier()
              : null;
    if (!job) return false;
    job.then(result => respond({ ok: true, result }),
      error => respond({ ok: false, error: String(error?.message || error).slice(0, 256) }));
    return true;
  });

  let panelReady = false;
  if (B.api.sidePanel?.setPanelBehavior) {
    try {
      const setting = B.api.sidePanel.setPanelBehavior({openPanelOnActionClick:true});
      if (setting?.then) void setting.then(()=>{panelReady=true;},()=>{panelReady=false;});
    } catch { panelReady=false; }
  }
  B.api.action.onClicked.addListener(tab => {
    // On Chromium, toolbar action opens the OS sidebar; preserve the older
    // explicit native courier click only on browsers without that ability.
    if (panelReady) return;
    if (Number.isInteger(tab?.id) && B.allowedPage(tab.url)) {
      void B.call('scripting.executeScript', {
        target: { tabId: tab.id },
        files: ['browser-polyfill.js', 'content-courier.js', 'floating-tablet.js']
      }).catch(() => {/* Not authorized or unsupported; no background collection. */});
    }
  });
})(globalThis);
