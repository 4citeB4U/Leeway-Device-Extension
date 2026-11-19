<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.PRODUCT_HOME
TAG: LEEWAY.W01.UNIVERSAL_EXTENSION.HOME.V1
5WH:
WHAT = Establish the LeeWay Universal Device Extension's public GitHub product home and source-integration map.
WHY = Give one extension experience a discoverable home without duplicating runtime, auth, recovery, or evidence authorities.
WHO = Creator/Human Authority and qualified LeeWay W01 contributors; this is not Agent Lee or independent Veritas.
WHERE = README.md in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-19.
HOW = Link exact owning source, identify user experience, security boundaries, qualification and staged adoption.
LICENSE = Not asserted; do not import or republish source without its applicable terms.
-->

# LeeWay Universal Device Extension

**One setup. Many devices. Recover anywhere.**

This is the **public product home** for the single LeeWay Universal Device Extension: one user-bound experience for connecting the applications people use to their authenticated LeeWay environment. It must not become a second Device Bridge, Runtime Fabric, identity authority, memory authority, updater, or recovery store.

> **Current release status: NOT INSTALLED / NOT PRODUCTION-QUALIFIED.** This repository was originally empty. Its homepage and future packaging are not proof of a signed extension or native-host enrollment. **Do not install unsigned development artifacts as a trusted production client.**

## Reconciled extension source candidate

`extension/` now contains one **source candidate**: Device Bridge draft PR #121's fail-closed, explicit-user-action courier model combined with draft PR #120's deterministic package pattern. It uses the one current installer identity, `com.leewayindustries.device_bridge`; the conflicting `org.leeway.device_bridge` identifier is not shipped.

It has no `host_permissions`, static content script, hidden collection, localhost command relay, or browser-side execution authority. The toolbar action explicitly injects a panel into a selected HTTP(S) tab; the panel can submit only owner-selected text after an enrolled native host completes its authenticated handshake.

`apple/SafariWebExtension/` provides the Safari app-extension source. It must be embedded and signed by the canonical Device Bridge Apple Xcode project before iLoader can install the combined IPA.

## What users should experience

| Experience | Required behavior |
|---|---|
| **My LeeWay — Set up once** | First Device Bridge installation establishes existing ZITADEL owner identity, device passport, approved connections, selected backup scope and recovery method. |
| **Add a device** | From an authenticated existing session, select a supported platform, obtain a signed installer, prove ownership of a fresh device key, approve capabilities and inherit only permitted non-secret configuration. No new account creation. |
| **Recover anywhere** | After losing all original devices, use an independently accessible recovery entry, recover keys under approved controls, inspect encrypted Continuum backup metadata and authorized content, explicitly approve staged restore and resume eligible Agent Lee checkpoints. |
| **One active application session** | Browser, Agent Virtual Tablet and floating widget share the owning app's authoritative session state, not selector-click replay or duplicated local state. |
| **Updates and lower latency** | Display signed release state and device health; use the existing native update component and local-first transport; record measured performance and failures. |

**No contents of an owner's Digital Brain index are automatically copied to cloud storage.** Local files are included in backups only through separately authorized, encrypted Continuum policies. Every owner and every device must remain isolated.

## Where the original Device Bridge authority lives

The original Device Bridge remains the native-device execution and passport owner. This product source does not create a second native host, Runtime Fabric, identity, recovery, or receipt authority.

- [Device Bridge: current execution and passport authority](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE)
- [Extension Manifesto V2 candidate (draft PR #120)](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/pull/120) — MV3 candidate and unsigned browser-source packaging; not deployed
- [Alternative extension adapter (draft PR #121)](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/pull/121) — reconcile host identity, paths and protocol before consolidation
- [Phoenix signed Genesis recovery staging (draft PR #124)](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/pull/124) — source tests only; no physical full-device-loss restore
- [Device Bridge issue #109](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/issues/109) — ongoing admission/transport concerns
- [Existing browser preview source](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/blob/main/docs/universal-extension.html) — interactive UI demonstration only, not a browser extension installation

**Native-host name conflict:** draft PR #120 proposes `com.leeway.devicebridge`; draft PR #121 proposes `org.leeway.device_bridge`. Neither is a registered native host. Reconcile the exact installer and manifest identifier with the original source owner; do not register both as independent execution channels.

## Authority and security boundaries

- **Identity and authorization:** approved ZITADEL + Runtime Fabric; no new email/password authority.
- **Device execution:** original LeeWay Device Bridge and distinct platform-specific signed device passports; users consent to privileged capabilities.
- **Continuity and encrypted backup:** approved Continuum adapters, independent durable replicas, verified recoverable keys and explicit owner restoration; the extension is the entry point, not the only backup.
- **Evidence:** original independent Veritas and Receipt Authority; browser source tests, website uptime and build logs cannot certify physical device control.
- **Web interface:** no open-CORS localhost command relay. Native Messaging must identify and authenticate the approved extension, user session, target device and operation grant.
- **Platform:** Chrome/Edge may share an MV3 source package. Firefox and Safari need explicitly qualified platform adapters, signing, consent and installation evidence.

## Qualification gates

1. Review and adopt this reconciled source into the original Device Bridge release lineage without replacing Device Bridge/Runtime owners.
2. Bind a signed Chrome/Edge package to an actually registered, owner-authorized native host.
3. Demonstrate first onboarding and second-device enrollment on two physical target devices, with fresh device credentials.
4. Demonstrate independently durable encrypted backup, wrong-user denial, revoked-device denial, loss of original devices, owner preview and authorized restore.
5. Demonstrate one session across tablet and widget in a real app (Office reference), retaining state across disconnection.
6. Qualify signed updates, measured latency, original Veritas/Receipt custody, reproducible packaging, rollback and production promotion.

**Evidence maturity:** This homepage is `SOURCE_DOCUMENTED` only. Installed extension, native host, signed package, Phoenix recovery and public GitHub Pages availability remain `NOT_VERIFIED` until tested.

## Project governance

Continue the existing W01 mission. Follow [LeeWay Standards](https://github.com/4citeB4U/LeeWay-Standards/blob/main/Docs/governance/LEEWAY-CANONICAL-ENGINEERING-LAWS.md), [R01–R25](https://github.com/4citeB4U/LeeWay-Standards/blob/main/standards/PERMANENT-ENGINEERING-RULES.md), [Agent Skills](https://github.com/4citeB4U/LeeWay-Agent-Skills/blob/main/AGENTS.md), the original Receipt Authority and independent Veritas. The owner must approve any code migration, packaging authority change or production release.

**Status reporting:** `SOURCE_IMPLEMENTED`, `TESTED`, `LIVE_OBSERVED`, `VERITAS_VERIFIED` and `PRODUCTION_ADMITTED` are distinct claims. Do not conflate them.
