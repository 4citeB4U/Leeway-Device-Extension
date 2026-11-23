<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM.ARCHITECTURE
TAG: LEEWAY.OPERATING_SYSTEM.BYOC_RECOVERY_AND_LICENSING.V1
5WH:
WHAT = Establish the new universal LeeWay Operating System extension, Creator instance, tenant-owned installations and recovery/employee license handoff.
WHY = Make LeeWay distributable under each user's free workspace without confusing the cloud control plane with physical device proof.
WHO = Creator/Human Authority; outside GPT-6 source contributor, not Agent Lee or independent Veritas.
WHERE = docs/LEEWAY-OPERATING-SYSTEM-UNIVERSAL-INSTANCE-V1.md in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Preserve the original Device Bridge/Tablet/Runtime/Continuum ownership; define fail-closed tenant and platform acceptance gates.
LICENSE = Existing repository terms; do not assert an unverified commercial distribution license.
-->

# LeeWay Operating System — universal extension and tenant-owned installation V1

**Parent mission:** [LeeWay Engineering issue #6](https://github.com/4citeB4U/LeeWay-Engineering/issues/6) and [Device Bridge issue #109](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/issues/109). This extends the existing W01 extension, not a second bridge, issuer, registry, runtime, Formula, Veritas, receipt store or recovery authority.

**V1 implementation maturity:** Source-only sidebar and bounded public health/source adapters. **NOT signed, published, installed on a customer machine, tenant-provisioned, or production-qualified.** The managed Creator cloud Bridge is reachable by the existing authenticated ChatGPT client; that does not imply an unregistered extension already has an OIDC session or an OS-native passport.

## Runtime boundaries

```text
Creator's canonical authorities (LeeWay Standards, Zitadel, Runtime, Formula,
independent Veritas, Receipt Authority, signed Creator license/revocation)
               |
     signed, scoped license and explicit revocation API [NOT YET INTEGRATED]
               |
    user-owned Personal or Industrial LeeWay instance
    |   GitHub repo / release pins owned by the user
    |   GitHub Pages Tablet source release owned by the user
    |   Render FREE Bridge / qualified Runtime owned by the user
    |   Continuum encrypted storage and keys owned by the user
    |   ZITADEL owner subject, tenant-specific device passport/registry
    |
    +--- LeeWay Operating System right-side extension / web Tablet entry
         |--- user-click public GitHub source read (no token)
         |--- user-click public Bridge health (no token)
         |--- hosted canonical Tablet (authoritative app/session backend)
         |--- optional enrolled native Device Bridge courier on desktop
         |--- OS adapter: Microsoft Windows / Linux / Apple / Android
               only if independently registered and actually installed
```

A user with no Creator-owned computer online can open the hosted Tablet and the public extension interface. **Real native device observation/control still depends on an authorized adapter running on the target device and on canonical C3/Formula/Veritas/receipt gates.** Cloud availability never proves physical reachability or offline backup durability.

## Available first-release features

1. Chromium browser toolbar button opens the `LeeWay Operating System` right-side side panel using the platform's Manifest V3 Side Panel API. The previous native courier remains optional after deliberate user action. Firefox receives its own `sidebar_action` and background-script manifest, not an unsupported Chromium service worker manifest. Safari native app/extension packaging and mobile app-wrapper signing remain independently blocked.
2. Hosted **full Tablet** opener and optional embedded preview of the original GitHub Pages Tablet; a fallback full-window link exists for websites that deny being framed.
3. Starter application launcher opens the canonical Tablet surfaces. Diagnostics, Continuum, Digital Brain, Office, Blackboard, Model Hub, App Foundry and local employee design are entrypoints; no app's privileged capabilities are granted by being in the launcher.
4. **Employee Deployment** appears locked. Only a Creator-issued, signed, tenant-scoped, time-bounded license and live Runtime authorization may ever permit remote digital employee movement. A gray button is presentation, never security.
5. Explicit **Check health** calls only `/healthz` via user-consented exact-origin browser permission. It proves a public service response, not authenticated MCP discovery, an owner, a registry or device execution.
6. **Inspect GitHub** calls only public repository metadata with an explicit browser permission prompt. Private repositories need a future approved GitHub App/OAuth + tenant-bound server exchange. No personal access token, client secret or GitHub password is stored.
7. Users may add local HTTPS shortcuts, with input limits and no automatic synchronization. An app created in the actual Tablet must later flow through the authorized app registry API; local shortcuts **are not** durable Continuum apps.
8. A source-only tenant installation planner can be invoked using `node provisioning/tenant-install-plan.mjs personal "Household" "https://github.com/owner/repo"`. It does **not** create a GitHub account, Render service, license, device registry or private backup.

## Customer-owned setup: not Creator-account cloning

Customer workflow, with the **owner** authenticating to each provider:

1. User creates or signs in to their own GitHub account. Obtain an approved, version-pinned LeeWay source release into an owner-controlled repository. **Do not fork or publish private Creator runtime keys, JWTs, host profiles, Formula artifacts, private receipts or user data.**
2. User creates or selects their **own** Render Hobby/Free workspace and signs in via Render. Service plans must be explicitly `free`; no paid upgrade, datastore or billing instrument automatically provisioned. The tenant-specific Bridge/Runtime still require a signed release and independent admission qualification.
3. Use the canonical LeeWay Zitadel issuer to enroll a **separate tenant owner** identity/project binding. Never copy the Creator owner subject, tenant signing key, approved passport, existing access token or original production environment variables.
4. Bind only the owner's fresh private service endpoints, protected owner enrollment, allowed per-tenant GitHub repository and actual adapter registrations. Deploy only after owner approval, cost/instance-hour check, verification and rollback snapshot.
5. Issue a scoped Creator-controlled service license for the tenant through a qualified Runtime provider. Continuum records, encrypted backups and private user data belong to the tenant; revocation may disable **licensed LeeWay services** but must not confiscate tenant-owned accounts or erase their data.
6. Verify genuine Chrome/Edge or Firefox client installation, authenticated GitHub access, native device passport on the target OS, wrong-owner denial, empty registry, revoked license, offline/restart/reconnect, restored account, actual encrypted backup readback and recoverability without original device.

**Render Free facts:** 750 Free instance hours are per workspace per calendar month, shared by its Free services, not 750 per installed device or a guaranteed always-on node. A customer-owned workspace can have its own allowance under Render's rules; multiple concurrently running services can exhaust it. Idle services may spin down, cold-start latency applies, and account/usage limits can suspend services. **No entitlement to evade rate limits, free-tier restrictions or payment requirements by cycling accounts.** Source and statically hosted entrypoints can remain reachable when a Free compute service sleeps, but execution cannot.

## Personal versus Industrial and Creator rights

| Instance | Default presentation | Real protected capability |
|---|---|---|
| **Creator (existing, non-clonable)** | Original owner workspace and full app catalog | Explicit Creator identity/license issuer; exports require C3 and independently proven authorization |
| **Personal (customer-owned)** | Tablet, optional local apps, Diagnostics/Continuum/Digital Brain entrypoints | Personal device actions require owner scopes/passport, secure backing and per-operation grants |
| **Industrial (customer-owned)** | Relevant Tablet, app-building and diagnostics surfaces | Business features independently licensed; workforce outbound/export remains denied until Creator-issued contract |
| **Unenrolled client** | Public source/health links, public Tablet entry | No employee export, credential access, recovery, device enrollment or execution |

The Creator can remotely revoke or change a **leased employee capability** via Runtime-verified license state and an independently auditable receipt, even when the employee is reached from an extension. This capability is **NOT IMPLEMENTED** by a static client flag. Fail closed on unknown, revoked, expired or offline license state for outbound employee operations. Personal locally designed employees may remain local under their user's own lawful data control.

## Recovery and loss of every device

GitHub restores versioned public source, signed release references, starter applications and authorized nonsecret configuration. It is **not** the canonical private Continuum storage or encryption-key escrow. To recover the full user's state after every device is lost, separately prove:
- independent, tenant-controlled **encrypted** Continuum replica;
- recovery key custody outside all lost devices with verified tenant ownership and rotation/revocation controls;
- reproducible app/data metadata matching, owner preview and explicit restoration consent;
- restore on a genuinely new Windows/Linux/Apple/Android adapter with fresh signed device identity;
- denial and rollback receipts under the original Veritas, Receipt Authority and Learning admissions.

These four recovery gates remain **UNVERIFIED**; never market full-device-loss recovery as accepted until physically demonstrated.

## Four-family support is a contract, not one binary

| Family | First client | Native execution qualifier |
|---|---|---|
| Microsoft Windows | Chromium/Firefox extension + hosted Tablet | Original Device Bridge Windows adapter, signed host enrollment |
| Linux | Chromium/Firefox extension + hosted Tablet | Linux native host / authorized capabilities, HIL required |
| Apple (macOS/iOS/iPadOS) | Safari signed wrapper (future) + hosted Tablet | Signed Apple app-entitlement/native adapter; browser extension alone cannot drive arbitrary native UI |
| Android | Hosted Tablet / compatible mobile browser (extension availability varies) | Approved Android app UID/services, consent and passport; no implied root |

**R10/R25:** customer installation identity is an authorized account+source version+signed device, never a Windows profile, disk path, browser brand or Creator machine. No single OS is required for cloud uptime, but supported native devices require appropriate adapters.

## Next source and live gates

- **SOURCE QUALIFICATION:** validate manifest and all UI scripts on real source SHA, extension package hashing, negative permission/tenant tests and existing native handshake CI.
- **INSTALL QUALIFICATION:** approve Chromium extension ID/store policy, install on one Chrome/Edge machine and verify panel; qualify Firefox and Safari/Android independently.
- **CLOUD QUALIFICATION:** register the extension's own Zitadel public client (PKCE), separate GitHub App with least-privilege approved repository access, tenant license+revocation API and server authorization; recheck no client secrets.
- **PROVISIONING QUALIFICATION:** authenticated BYO GitHub/Render account flow, user-approved Free plan, fresh owner and device registrations; no public tenant auto-provisioner exists today.
- **RECOVERY QUALIFICATION:** owner-isolated Continuum encrypted backup/restore, cross-device and all-devices-lost exercise with actual receipts.
- **C3 RELEASE GATE:** Formula PRE / independent Veritas PRE+POST / original Receipt Authority append+readback / Learning eligibility; explicit Creator approval and rollback.

All statuses are source, client, cloud and hardware-specific. An unsigned build artifact is not a store release.
