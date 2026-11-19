/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BROWSER
TAG: LEEWAY.UNIVERSAL_EXTENSION.PORTABLE_API.V1
5WH:
WHAT: Normalize browser-extension APIs and constrain the owner-authorized native session protocol.
WHY: Keep browser content outside credentials, device execution and independent evidence authority.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: extension/browser-polyfill.js.
WHEN: 2026-11-19.
HOW: Provide validation and API wrappers only; no independent bridge, identity or execution authority.
LICENSE: Existing repository terms apply.
*/
(function (scope) {
  'use strict';
  const VERSION = 3;
  // This exact identity is the one used by the current Device Bridge installer.
  const HOST = 'com.leewayindustries.device_bridge';
  const MAX_SELECTION = 8192;
  const api = scope.browser || scope.chrome || null;
  const promiseApi = Boolean(scope.browser);
  function allowedPage(value) { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password; } catch { return false; } }
  function excerpt(value) {
    if (!value || typeof value !== 'object') throw new Error('PAGE_PAYLOAD_INVALID');
    const { href, title, selection } = value;
    if (typeof href !== 'string' || href.length > 2048 || !allowedPage(href)) throw new Error('PAGE_URL_REJECTED');
    if (typeof title !== 'string' || title.length > 256) throw new Error('PAGE_TITLE_REJECTED');
    if (typeof selection !== 'string' || !selection.trim() || selection.length > MAX_SELECTION) throw new Error('SELECTION_REQUIRED_OR_TOO_LONG');
    return { href, title, selection: selection.trim() };
  }
  function call(path, ...args) {
    const [area, method] = path.split('.');
    if (!api?.[area]?.[method]) return Promise.reject(new Error('BROWSER_METHOD_UNAVAILABLE'));
    const fn = api[area][method].bind(api[area]);
    if (promiseApi) return Promise.resolve().then(() => fn(...args));
    return new Promise((resolve, reject) => fn(...args, result => api.runtime?.lastError ? reject(new Error(api.runtime.lastError.message)) : resolve(result)));
  }
  function supportsNativeMessageRequestReply() {
    return typeof api?.runtime?.sendNativeMessage === 'function';
  }
  scope.LeeWayExtension = Object.freeze({ VERSION, HOST, api, allowedPage, excerpt, call, supportsNativeMessageRequestReply });
})(globalThis);
