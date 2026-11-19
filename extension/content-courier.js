/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BROWSER
TAG: LEEWAY.UNIVERSAL_EXTENSION.SELECTION.V1
5WH:
WHAT: Obtain only the text the owner selects after opening the LeeWay extension.
WHY: Prohibit background page collection and unattended browser surveillance.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: extension/content-courier.js.
WHEN: 2026-11-19.
HOW: Expose a bounded selection accessor without network, storage or credentials.
LICENSE: Existing repository terms apply.
*/
(function (scope) { 'use strict'; if (scope.__LEEWAY_COURIER__) return; const B = scope.LeeWayExtension; if (!B) return; scope.__LEEWAY_COURIER__ = Object.freeze({ selected: () => B.excerpt({ href: scope.location.href, title: scope.document.title.slice(0, 256), selection: String(scope.getSelection?.() || '') }) }); })(window);
