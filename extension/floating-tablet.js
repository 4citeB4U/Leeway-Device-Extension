/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BROWSER
TAG: LEEWAY.UNIVERSAL_EXTENSION.PANEL.V1
5WH:
WHAT: Render a visible, user-controlled LeeWay courier panel in a selected browser tab.
WHY: Require human action before data can leave a page.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: extension/floating-tablet.js.
WHEN: 2026-11-19.
HOW: Inject one closed-shadow panel after toolbar activation; no automatic network or page observation.
LICENSE: Existing repository terms apply.
*/
(function (scope) { 'use strict'; if (scope.__LEEWAY_PANEL__) { scope.__LEEWAY_PANEL__.remove(); scope.__LEEWAY_PANEL__ = null; return; } if (!scope.LeeWayExtension || !scope.__LEEWAY_COURIER__) return; const host = document.createElement('div'); Object.assign(host.style, { position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647' }); const root = host.attachShadow({ mode: 'closed' }); root.innerHTML = '<style>section{width:296px;padding:16px;background:#0b1724;color:#eef8ff;font:14px system-ui;border:1px solid #4c7892;border-radius:14px;box-shadow:0 14px 38px #0008}button{margin:3px;padding:8px;border-radius:7px;border:1px solid #6790ab;background:#17364c;color:white}p{min-height:36px;font-size:12px}small{display:block;color:#bcd4e1}</style><section role="dialog" aria-label="LeeWay extension"><b>LeeWay</b><p id="s">Not connected</p><button id="c">Connect</button><button id="x">Share selection</button><button id="d">Disconnect</button><small>Only text you select and explicitly share is sent.</small></section>'; document.documentElement.appendChild(host); scope.__LEEWAY_PANEL__ = host; const status = root.querySelector('#s'); const send = (type, payload) => scope.LeeWayExtension.call('runtime.sendMessage', { type, payload }); root.querySelector('#c').onclick = async () => { status.textContent = 'Connecting…'; const result = await send('LEEWAY_CONNECT'); status.textContent = result.ok ? 'Authenticated native host session' : result.error; }; root.querySelector('#d').onclick = async () => { const result = await send('LEEWAY_DISCONNECT'); status.textContent = result.ok ? 'Disconnected' : result.error; }; root.querySelector('#x').onclick = async () => { try { status.textContent = 'Submitting…'; const result = await send('LEEWAY_SHARE_SELECTION', scope.__LEEWAY_COURIER__.selected()); status.textContent = result.ok ? 'Native host acknowledged receipt; not a Veritas result.' : result.error; } catch { status.textContent = 'Select text before sharing.'; } }; })(window);
