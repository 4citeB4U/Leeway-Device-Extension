<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CUSTOMER_DELIVERY
TAG: LEEWAY.CUSTOMER_SEED.VS_CREATOR_GOLDEN_MASTER.V1
5WH:
WHAT = Separate non-distributable Creator Golden Master from tiny customer-delivered LeeWay OS starter on any supported device.
WHY = Deliver working Digital Brain, Continuum and LeeWay Diagnostics while preventing Creator-capability transfer, excessive downloads and Creator free-tier consumption.
WHO = Creator/Human Authority, outside GPT-6 engineering contributor not Agent Lee.
WHERE = docs/CUSTOMER-SEED-VS-CREATOR-MASTER-V1.md in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Closed release allowlist, tenant project identity, canonical Runtime authority checks, platform-specific optional native adapter, and first-device acceptance.
LICENSE = Existing repository license decision governs; this note grants no distribution rights.
-->

# Customer Starter vs Creator Golden Master

**Owner decision:** The Creator Golden Master remains a non-distributable governing installation. The *customer* receives only the **LeeWay Operating System CUSTOMER_STARTER** client and its personally bound services. The name and appearance may be LeeWay, but code distribution, device scope and capabilities are different.

## Product separation: not a gray button

| Boundary | Creator Golden Master | Customer Starter |
|---|---|---|
| Software included | The original Creator's private and licensed ecosystem, managed separately | Only the extension's audited nine-file HTML/CSS/JS shell and pre-approved customer connectors |
| Visible starter apps | Creator-authorized full workspace | **Digital Brain**, **Continuum**, **LeeWay Diagnostics**, optional **local AI** connector |
| Device data | Governed Creator identity and enrolled devices | Owner-granted per-device capability; files stay device-local unless explicitly admitted by Continuum |
| Continuum | Original canonical authority | Same *service contract*, separate owner/project namespace and keys; no new authority |
| Diagnostics | LeeWay diagnostic implementation | LeeWay Diagnostics reads each customer's actual qualified OS adapter; not an invented customer diagnostic engine |
| AI | Creator-approved LeeWay models, Machine Consciousness, Formula and workload providers | Optional **user-supplied local AI**; no model weights, LeeWay GPU or Machine Consciousness bundled |
| Business/workforce export | Independently creator-granted operations | Not present in shipped client; runtime requests denied unless a later signed license grants an **explicit** narrow operation |
| Recovery | Creator's own repositories | Customer's private project GitHub repository is source/recovery anchor; original Continuum retains live records |
| Availability | Current managed Runtime/Bridge on existing free infrastructure, subject to its real availability | Customer-owned resource references; never default to Creator's Render health endpoint or spend Creator's hours by a customer click |

**Creator controls:** separately protected hosted components, source branches, secrets, roles, deployments, commercial license issuer, and optional leased employee providers **must never be bundled**. Removing an icon alone is insufficient: original Runtime authorization and device consent must reject calls from unlicensed customers. A repository clone does not grant server credentials or access to protected services.

**Customer rights:** retains customer-owned projects, local files, approved recovery data, personal Continuum export and permitted local AI after licensed hosted services are paused; revocation targets only the leased services and employees, not the customer's data.

## Public source, product identity and legal boundary

Actual GitHub repository metadata read during this source audit: **Leeway-Device-Extension is public; Leeway-Agent-Virtual-Tablet is public; LeeWay-Continuum is public with an MIT LICENSE; Leeway-Runtime-Fabric is private.** Customer packaging should exclude the private Creator Runtime source, signing keys and administrative services. Public source cannot be made inaccessible by merely revoking a browser button; existing copies permitted under a published open-source license remain governed by that license. A service lease can revoke **future access to hosted/leased services**, not retroactively delete customer copies of public code or customer-owned data. The Creator retains the separately protected brand, licensing, managed services and nonpublic authority implementations subject to applicable law and provenance. No existing repo visibility, license, or permissions were changed by this source work.

## Small delivery, no customer ZIP workflow

1. **Browser/web entry:** a tenant-aware signed-in web Tablet is the primary entry point on Windows, Linux, Apple or Android; no full LeeWay source checkout or model download. It is **not yet deployed**.
2. **Chrome/Edge side panel:** publish signed, store-delivered lightweight LeeWay Operating System extension. The current unsigned development ZIP is a CI build artifact **only**, not what end users should be instructed to manually extract.
3. **Native host:** browser sandbox cannot inspect all device internals. For LeeWay Diagnostics and opt-in Digital Brain file indexes, install a small separately signed, OS-qualified helper *only after owner permission*. Device Bridge server stays cloud hosted independent of any one PC. Native Message host setup remains per OS; avoid universal machine paths.
4. **Continuum:** bind the customer/project to original `leeway.continuum`; the four logical cells are `runtime-state`, `evidence-vault`, `memory` and `learning`. Original database/replication providers and exact-lossless Formula archive contract apply; the user's own GitHub is versioned recovery anchor, not a per-record live database.
5. **Local AI:** a user can operate an approved local model without LeeWay Machine Consciousness/Creator model service; the adapter's data and file access are limited by the user's explicit permissions.

The shipped browser packaging script lists **exactly nine** audited client assets and rejects ZIPs exceeding **256 KiB** (compressed). These limits do not qualify RAM, installation disk consumption, native helper size, model size, or browser-store signing.

## Critical runtime authorization rules

- `src/server/customer-product-admission.mjs` in [Runtime PR #198](https://github.com/4citeB4U/Leeway-Runtime-Fabric/pull/198) is a source-only preflight. It denies Creator admin rights for all customer sessions, verifies the original tenant/project session and separately checks native device grants or Continuum owner scope. Workforce export requires an injected *real* Creator license, Runtime grant and independent Veritas PASS.
- This adapter is **NOT yet attached to the deployed Runtime API**; a direct privileged endpoint must still be individually protected in production. Do not market an app hidden by the extension as proof of operational denial until the actual server route rejects it.
- The extension's `CUSTOMER_STARTER` product catalog never includes Creator apps or full Tablet source. The first-install defaults for tenant GitHub repo, Tablet URL and Bridge URL are all **null**. Cloud resource URLs must be bound from verified customer identity and production onboarding, not invented from an arbitrary local setting.
- App creation and licensed upgrades remain controlled by original Runtime grants; installing optional apps must not patch the Creator binaries into the starter ZIP.

## First actual device: primary PC, as a fresh customer

The existing Creator environment stays untouched. Use a **separate Windows user or browser profile, new tenant owner identity, fresh GitHub customer project and new registered device passport** so no old Creator tokens/keys or trusted registry records can leak into test evidence.

| Canary check | Expected evidence |
|---|---|
| Install starter | One link/store install; customer sees 3 core tiles plus optional local AI, **no** Creator apps |
| Native diagnostics | Independently enrolled Windows adapter reads *actual* primary PC hardware and owner-approved values, not synthetic fixtures |
| Brain | Opt-in, device-local index; unauthorized file reads denied |
| Continuum | Same owner/project across qualified PC and second device; actual encrypted record write/readback, conflict and reconnect evidence |
| Cloud continuity | Creator PC turned off must not halt customer's cloud service; free-host wake-up behavior measured, no uptime claim without proof |
| Distribution denial | Attempt admin, workforce export, license issue from client and direct Runtime API; all denied for customer identity |
| Upgrade and revocation | Real signed narrow feature lease added then revoked; customer-owned local files and Continuum remain accessible |
| Recovery | Rejoin a fresh device through tenant GitHub source/recovery anchor plus original Continuum replica, exact Formula reconstruction, protected key custody and actual readback |
| Gate | Original C3, Veritas PRE/POST, Receipt Authority, rollback and Learning gates separately observed |

**Status:** Client source separation and Runtime guard source tests are possible now. Store signing, live OAuth-to-provisioning, native helper first install, hardware binding, per-tenant synced Continuum and on-device recovery remain **NOT_EXECUTED**. Do not erase or reassign the existing Creator PC installation to run the test. No paid resource is authorized.

**Original governing sources:** [Extension PR #5](https://github.com/4citeB4U/Leeway-Device-Extension/pull/5), [Runtime PR #198](https://github.com/4citeB4U/Leeway-Runtime-Fabric/pull/198), [Continuum PR #18](https://github.com/4citeB4U/LeeWay-Continuum/pull/18). This source document is part of the same Engineering #6 mission.
