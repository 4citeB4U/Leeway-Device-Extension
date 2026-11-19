<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.QUALIFICATION
TAG: LEEWAY.W01.RECONCILED_EXTENSION_SOURCE.20261119
5WH:
WHAT: Record the reconciliation and source qualification of one Universal Extension candidate.
WHY: Preserve one browser-client lineage while leaving Device Bridge execution, Apple signing and evidence authorities intact.
WHO: Creator-authorized W01 contributor; not Agent Lee, Device Bridge execution, independent Veritas or Receipt Authority.
WHERE: docs/qualification/2026-11-19-reconciled-extension-source.md.
WHEN: 2026-11-19 America/Chicago.
HOW: Compare Device Bridge PR #120/#121 source, implement the smallest unified source client, test, package and state physical gates.
LICENSE: Existing repository terms apply.
-->
# W01 — Reconciled Universal Extension source

## SOURCE_FIRST_ACK

- **MISSION_ID:** W01 Universal Extension / Device Bridge browser transport.
- **WORK_ID:** `w01-extension-source-reconcile-20261119`.
- **AGENT_ID:** Codex local engineering worker.
- **SOURCES_READ:** LeeWay Standards `2cc84af9b97b337b2492bbec26a07ffd70fc8770`; this repository `52c138254c7cbb4f6335c348b9f9a37cbfdc9e47`; Device Bridge source `c275d6be230476d9b2e985dbaaa80ce5b785132d`; Device Bridge PR #120 head `7e28d07`; Device Bridge PR #121 head `e8405e6`.
- **RULES_APPLIED:** One Device Bridge authority; no open-CORS relay; native host must authenticate; source package is not an installed extension; Apple requires an embedded signed app extension.
- **ACTIVE_GATE:** unified source candidate and Apple target preparation, not production installation.

## Reconciliation decision

| Candidate | Retained | Rejected / unresolved |
| --- | --- | --- |
| Device Bridge PR #120 | Deterministic unsigned ZIP and SHA-256 package pattern | conflicting `com.leeway.devicebridge` host name and broader unrelated branch changes |
| Device Bridge PR #121 | explicit-user-action courier, zero ambient host permissions, bounded selected text, correlated native acknowledgement | proposed `org.leeway.device_bridge` host name because it conflicts with the current installer |

The reconciled candidate uses `com.leewayindustries.device_bridge`, the identifier in the current Device Bridge browser-native-host installer. This chooses one transport name; it does not register or execute a native host.

## Implemented source

- `extension/manifest.json`: MV3 with only `activeTab`, `scripting`, and `nativeMessaging`; no `host_permissions` or static `content_scripts`.
- `extension/*.js`: a toolbar-triggered panel. It can only send text the owner selected and explicitly shared after an authenticated native-host hello acknowledgement.
- `scripts/package-extension.py`: deterministic unsigned source archive plus SHA-256 declaration.
- `apple/SafariWebExtension/`: Safari extension handler and target metadata for embedding in the canonical Apple Device Bridge Xcode project.

## Actual source tests

Command: `npm test`

Result: **8 passed, 0 failed, 0 skipped.** The tests cover explicit activation, bounded permissions, one host identifier, no localhost relay, and the public product-home boundaries.

Command: `npm run package:extension`

Result: produced `dist/leeway-universal-extension-unsigned.zip` with SHA-256 `e1f88018e2d0fd11af92eac2495ebab3464f7efefc37f2c64e802446ba434fee`.

Command: `node --check extension/browser-polyfill.js extension/background.js extension/content-courier.js extension/floating-tablet.js`

Result: **pass** (all files produced zero syntax errors).

## Source-control poststate

Commit `54903bf8dfbcf6547dcf3c4e7b5be149ff7f4bf4` was created using Creator-provided repository-local Git identity and pushed on branch `codex/w01-reconciled-universal-extension-20261119`. Review PR [#2](https://github.com/4citeB4U/Leeway-Device-Extension/pull/2) is open against `main`. It is not merged and does not alter any installed browser, native host, Apple package, Runtime Fabric authorization, or production environment.

## Against acceptance / remaining gates

- The ZIP is explicitly unsigned and is **not installed** in Chrome, Edge, Firefox, or Safari.
- The current Device Bridge native-host binaries observed on this Windows device are unsigned; its installer correctly refuses them.
- The Apple source bundle is not yet wired into the canonical `LeeWayDeviceBridgeApple` Xcode project. No macOS build, Apple signing, IPA, iLoader operation, Settings → Safari enablement, or iPhone native-host handshake ran.
- No live Runtime Fabric grant, Device Bridge passport, owner authentication, app-access policy decision, device operation, Veritas decision, Receipt Authority record, or production admission was created.

## Next gate

The Device Bridge Apple source owner must embed this Safari target and shared web assets into the existing iOS project, build it on macOS, and sign the containing app plus extension. The Chromium path likewise needs a signed immutable package and signed native host. Then the owner can install via iLoader, enable the extension, test an authenticated handshake and a negative unauthorized-host case on physical devices.
