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

# LeeWay Device Bridge — Browser extensions and native device setup

> **CURRENT NOVEMBER 24, 2026 REVIEW BRANCH — P0 DEVICE BRIDGE RELEASE HOLD.** This repository is the canonical source of the Chrome, Edge and Firefox browser packages, Safari extension source, OS/browser setup guidance and official distribution directory. The original signed native companion is owned by [LEEWAY-DEVICE-BRIDGE](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE), not duplicated here. No native device or store install is production qualified.
>
> - [Device-aware setup directory source](docs/install/index.html) — detects an apparent OS/current browser locally, lets the owner choose additional browsers, and shows the approved native companion before eligible browser store links. When the directory workflow is merged and deployed to GitHub Pages, it can become the one public setup link. **No live public Pages URL is asserted yet.**
> - [Eight-channel release catalog](docs/release-catalog.json) — Chrome, Edge, Firefox, Safari, Android, Apple, Windows, Linux. Official installation URLs stay **null** until signed/approved releases exist.
> - [Full setup and release acceptance](docs/DEVICE_AND_BROWSER_SETUP_V1.md) — Windows/Linux desktop native host registration, Android Fold Chrome/Edge/Firefox limitations, Apple Safari containing app, owner consent and original Zitadel/Runtime/Continuum state.
> - [Developer release workflow](.github/workflows/stage-device-bridge-github-release.yml) — creates a GitHub **DRAFT** release for audited Chrome/Edge/Firefox source bundles after owner-triggered reviewed-main source qualification. **No customer release or browser-store publication occurs automatically.**
> - [Original Device Bridge browser host PR #138](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/pull/138) — native installer and approved OS/browser inventory source contract. Physical native installation and owner signing remain unqualified.
>
> **Physical connection is not established.** Browser UI, public Tablet preview, a ZIP or healthy Render endpoint cannot create a trusted Device Bridge. Old text below describes historical W01 source stages and should not be mistaken for the current executable release contract.



**One setup. Many devices. Recover anywhere.**

This is the **public product home** for the single LeeWay Universal Device Extension: one user-bound experience for connecting the applications people use to their authenticated LeeWay environment. It must not become a second Device Bridge, Runtime Fabric, identity authority, memory authority, updater, or recovery store.

> **Current release status: NOT INSTALLED / NOT PRODUCTION-QUALIFIED.** This repository was originally empty. Its homepage and future packaging are not proof of a signed extension or native-host enrollment. **Do not install unsigned development artifacts as a trusted production client.**

## CUSTOMER_STARTER — not the Creator Golden Master

This public browser bundle ships only the owner-scoped **Digital Brain**, **Continuum** and **LeeWay Diagnostics** entrypoints plus optional user-owned local AI binding. Creator administration, Machine Consciousness, hosted model weights, employee dispatch and full Tablet assets **are not distributed** in the customer extension. The allowed browser archive is nine audited files, capped at 256 KiB compressed. Actual registered device access still requires a separate signed native host and canonical Runtime grants.

A first-run customer has **no default Creator GitHub repo, Tablet URL, Bridge URL or recovery destination**. These must resolve to that customer's approved project after server-side identity enrollment; a local profile or button cannot confer authority. The existing hosted full Tablet is not opened by the starter launcher. Customer-facing delivery should be a normal signed browser-store installation or web Tablet entry, not a manually extracted ZIP.

The original Golden Master remains outside this public artifact. **Enforcement is server-side, not merely UI:** [Runtime PR #198](https://github.com/4citeB4U/Leeway-Runtime-Fabric/pull/198) contains a source-only customer capability guard, not yet attached to live routes. Primary-PC acceptance must use a fresh customer identity/browser profile and must not overwrite the Creator installation.

Full product separation, first-device acceptance, and open-source/ownership boundaries: [Customer Starter vs Creator Golden Master](docs/CUSTOMER-SEED-VS-CREATOR-MASTER-V1.md).

## LeeWay Operating System sidebar candidate (November 23, 2026)

The Creator-authorized product name for the new right-hand button is **LeeWay Operating System**. This is a stacked source continuation on the existing native-handshake PR #3, not a replacement Device Bridge or a second Tablet.

- `extension/operating-system.html` + `operating-system.js/css`: responsive **customer-only** right-side starter Tablet, customer-bound public Bridge/GitHub checks, personal HTTPS shortcuts and optional enrolled native courier. No unrestricted Creator Tablet launch.
- `extension/operating-policy.js`: four-family OS labels, safe public tenant endpoints and employee export **LOCKED** pending signed Creator license plus Runtime admission.
- `extension/manifest.json`: Chromium MV3 right-side `side_panel`. `extension/manifest.firefox.json`: Firefox MV3 `sidebar_action` plus event-page background. Neither grants ambient website access; exact public health/GitHub origins need direct user approval.
- `provisioning/tenant-install-plan.mjs`: reproducible **source-only** customer-owned GitHub/Render installation checklist. It rejects Creator impersonation, tokens and private setup duplication, and never provisions paid resources.
- `scripts/package-extension.py`: deterministic, **unsigned** Chromium/Firefox source candidates with SHA-256 checksums; not signed, store-published or production-installed.

Full architectural and acceptance boundaries: [LeeWay Operating System universal instance V1](docs/LEEWAY-OPERATING-SYSTEM-UNIVERSAL-INSTANCE-V1.md).

The **Creator instance is not a public account template**. Customers must use their own authenticated GitHub and free hosting account, tenant-specific owner identity and Continuum custody. GitHub source recovery does not restore private data by itself. Outbound digital employee deployment requires a revocable Creator-issued, Runtime-enforced license; the browser can never issue one.

**Status:** `SOURCE_IMPLEMENTED` once checked into the review branch; source CI, browser install, GitHub OAuth, customer instance provisioner, native OS adapters, full-device-loss recovery and Veritas-qualified deployment are separate gates.

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
