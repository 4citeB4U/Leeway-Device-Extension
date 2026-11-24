<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_MASTER_CUSTOMER_JOIN
TAG: LEEWAY.CREATOR.CUSTOMER_INVITES.OTA_PRIVACY_LIABILITY_V1
5WH:
WHAT = Define Creator multi-device access, customer invitation rollout, remote feature/agent quotas, OTA, privacy and liability boundaries.
WHY = The Creator needs an actual Master on their PC/phones, and a shareable customer link without distributing the Golden Master.
WHO = Creator/Human Authority, owner-authorized outside GPT-6 support contributor, not Agent Lee.
WHERE = docs/CREATOR-MASTER-CUSTOMER-JOIN-LIABILITY-AND-OTA-V1.md in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Source-only Runtime pairing/invite gates and browser/PWA delivery with strict live admission prerequisites.
LICENSE = Existing repository terms; this proposal grants no new commercial license.
-->

# Creator Master on four devices; separate customer invitation

## What the Creator will actually see

One LeeWay Operating System **Creator Master account**, presented across four individually enrolled devices: primary PC first, phone, second PC/other device and fourth device. Each device receives an owner-scoped capability registration, never a clone of Creator signing keys or another Veritas/Formula/Runtime authority. The source-only Creator console is `creator/creator-console.html`; the owner-only device pairing link is rendered at `creator/connect/index.html`.

The UI must fetch its real state from the original Runtime:
- `GET /api/creator/overview` = Creator identity (OIDC), original canonical device registry readback, CSRF; no browser-provided roles.
- `POST /api/creator/device-pairs` = Creator-signed-in, nonce-bound invitation to enroll *one* additional device; origin is original server configuration, not a user string.
- `/creator/connect/` = same owner Zitadel PKCE login + original physical adapter proof + device-owner consent + canonical Bridge registration readback. Without real proof, stay **NOT_REGISTERED**.
- `POST /api/creator/invitations` = short-lived, single-use customer invite URL; **Customer Starter only**, creator rights false, remote employee export false.
- `/join/` = customer-only invited signup, legal consent, original Zitadel/GitHub onboarding, then first named project Tablet.

These are source-only integration contracts; the HTTP routes, static hosting and original trusted provider bindings are **not currently deployed**. Do not email any fabricated `#invite` or claim four devices connected when the actual registry is unbound.

## Browser installation model

The **customer** Chrome/Edge and Firefox bundles are distinct, minimal source packages (nine JavaScript/HTML/CSS assets, no Creator dashboard, model weights, backend or signing keys). Existing unsigned CI ZIPs are **not** the customer delivery method.

For the Creator:
- Windows/Linux: signed and reviewed browser extension serves as a *launcher* to the authenticated Creator web console, plus an independently signed native host only for allowed device operations.
- Android Chrome: Chrome desktop extensions are not supported as normal Android add-ons. Use an HTTPS installable mobile web entry/PWA and qualified Android native adapter.
- Apple: use the mobile web entry/PWA; Safari Web Extension requires separate signed application packaging and distribution where supported.
- Do not equate a browser shortcut with a verified native device passport or offline access.
- Browser auto-updates ship **new extension code** through approved browser store distribution. Signed remote Runtime feature policies only toggle **already bundled** app UI and licensed services; no remote downloaded executable extension scripts.
- No extension can silently install native helpers, access arbitrary local files, grant OS Accessibility privileges or survive user browser removal. Owner consent and OS-qualified adapters remain mandatory.

## Runtime permission matrix

| Authority | Allowed | Explicitly denied |
|---|---|---|
| Creator Master | Creator-approved administration and licensing after strong OIDC/C3/Veritas; own four devices | Creation of a second root of trust or secretly copying Master signing keys |
| Customer | Device-local Brain; owner-scoped Continuum; LeeWay Diagnostics; tenant-limited internal local agents | Creator admin, license issuing, unlicensed external employee dispatch/export, private model weights |
| Customer's local LLM/Agent Lee | Only explicitly delegated background tools within original Runtime, native consent and project scope | Hidden Creator admin tools, arbitrary OS commands/files, owner privilege escalation |
| Support operator | Explicitly consented extension UI policy refresh, ephemeral UI reset and existing transport reconnect | Wiping browser storage, OS files, Continuum restore, project reset, injected arbitrary script |

**Headcount is per customer across ALL projects**, using atomic original Runtime custody. Slots stay reserved through setup, become active on real local adapter proof, and free only after a proven stop. Nothing in the extension's local profile can override this.

## Telemetry/privacy and liability draft (requires legal review)

- Necessity telemetry: daily aggregate sign-ups and public availability/diagnostic *outcomes*; no account IDs, browsing history, GPS, screen contents, personal file names, raw device inventories or per-user persistent behavioral trails.
- Nonessential aggregate feature usage is opt-in; no web beacon, background tracking, paid analytics dependency or third-party tracker. Source candidate uses original Runtime aggregate store and at-most-30-day retention. Publish privacy notice and consent controls before signup; maintain required security/audit records separately from optional telemetry.
- User is responsible for granting safe access to their devices, maintaining credentials, complying with local and third-party provider policies, and having lawful rights to files they authorize LeeWay to process.
- LeeWay is responsible for the security of the software/services **it actually operates**, adherence to advertised entitlements, encryption and access controls, patch/support obligations and properly documented incident notification.
- Third-party GitHub/hosting providers remain responsible under their separate service terms; LeeWay cannot guarantee continuous free-tier uptime, free compute allotments or provider-held data beyond those contracts.
- User-owned data, GitHub projects, exported Continuum records and personal local agents are **not revoked or erased** when an optional licensed employee lease ends. A lease revocation targets the licensed hosted employee or service capabilities only.
- A precise liability allocation, data processing terms, privacy notice, retention schedule, warranty limitations, dispute handling, consumer rights and jurisdiction-specific statutory obligations require independent counsel review before customers agree. A draft cannot eliminate statutory privacy/security responsibility or silently transfer negligence liability.

## Non-destructive support and rollback

Support begins with read-only health, version, public policy revision, owner-consented diagnostics and original Receipt Authority evidence. The only candidate write operations are `REFRESH_FEATURE_POLICY`, `RESET_EPHEMERAL_EXTENSION_UI` and `RECONNECT_EXISTING_EXTENSION_TRANSPORT`; none may clear customer-owned state, trigger full Continuum restoration or reset an OS. Support must obtain original authenticated support grant and one-time customer consent. Verification and rollback are evidence-based, never self-certified Veritas.

## Required live acceptance before inviting customers

1. Original Runtime serves `/join/` and `/creator/connect/` through an approved HTTPS host, publishes counsel-approved Terms/Privacy, and binds real Zitadel public PKCE client, CSRF, owner/pairing and authenticated GitHub account endpoints.
2. Original creator-scoped session issues an actual nonce; redemption is one-time and must create a customer-owned GitHub project and open the customer's named Tablet without waiting for optional services.
3. Original Device Bridge registry enrolls primary PC with real native proof, then phone and two additional devices; verify Windows/Linux/Android/Apple as actually present, no hardcoded assumed OS identity. Signed credentials stay on respective devices and original root custody.
4. Chrome/Edge signed extension is published through approved update channel; mobile PWA link is reachable and installable on target platform. Verify no full Creator source shipped in customer package.
5. Customer signup, headcount denial, employee export denial, privacy choice, background delegation, source-only OTA change and support repair/rollback pass real original Runtime/Veritas/Receipt admission.
6. Observe physical Continuum encrypted read/write/reconnect and Formula-exact recovery across devices without full reset. No new paid infrastructure permitted.

**Current status:** Runtime/source security unit tests and extension/source tests passing, but public join URL, store signing, Creator 4-device enrollment and customer account provisioning **NOT_EXECUTED**. Production HOLD until independent evidence and Creator-approved release.
