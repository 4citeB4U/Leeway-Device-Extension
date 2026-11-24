<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.MULTI_OS_INSTALLATION
TAG: LEEWAY.DEVICE_EXTENSION.EIGHT_CHANNEL_OWNER_SETUP.V1
5WH:
WHAT = Define one device-aware, browser-choice guided installation for the original LeeWay Device Bridge.
WHY = Users should find approved apps through stores/GitHub without repetitive chat ZIP downloads or manual local paths.
WHO = Creator and existing original Device Bridge, Runtime, Tablet and native adapter owners.
WHERE = docs/DEVICE_AND_BROWSER_SETUP_V1.md.
WHEN = 2026-11-24.
HOW = OS hint -> choose browsers -> signed OS package -> user-approved store installs -> native host enrollment -> Runtime Tablet state.
LICENSE = Existing source repository terms, not asserted by this doc.
-->
# One LeeWay setup across Windows, Linux, Android and Apple

**Canonical source:** `4citeB4U/Leeway-Device-Extension` owns the distributable browser extension and install directory; `4citeB4U/LEEWAY-DEVICE-BRIDGE` owns all signed native OS adapters and physical device operations; the original Runtime/Zitadel/Continuum own owner grants, identity and cross-device state. The Tablet is the display. No second issuer, registry, Formula, receipt verifier, updater or control plane.

## What happens when a person opens the same GitHub-backed install link

1. The install website uses a **non-authoritative** user-agent hint to display the apparent OS family (Windows, Linux, Android, Apple), form factor (desktop, phone, tablet) and current browser (Chrome, Edge, Firefox, Safari, other). It CANNOT inventory all installed browsers, issue trusted device IDs or automatically install browser extensions. OS identity is later verified by the installed original native adapter.
2. The person chooses one or more browsers. On desktop, the original approved signed native Device Bridge is installed once per device with user consent, then its OS-native installer discovers actual installed browsers and registers only the native messaging host entries appropriate to approved, published extension IDs. An extension is acquired through a **user-initiated store install**, not a silent webpage action. An enrollment passport is unique per device and never copied from the Creator's workstation.
3. On Android, the original **signed Android companion** provides device registration and Tablet access. **Chrome on Android does not accept ordinary desktop Chrome Web Store extensions**. Firefox Android add-ons do not expose the desktop nativeMessaging bridge; Edge Android add-ons may exist but the LeeWay native messaging integration remains NOT_QUALIFIED. The browser choice can still control which supported Tablet surface the person opens, but never grants device execution.
4. On Apple phones/tablets, the original signed Apple companion provides identity, Tablet and approved native capabilities; Safari extension support must be embedded in its approved Apple containing app. Chrome/Edge/Firefox on iOS are not desktop native messaging hosts. On Apple desktop, Chrome/Edge/Firefox have desktop extension/store paths when qualified; Safari still requires its Apple containing app.
5. Supported browsers can be added or removed later without reenrolling the device or installing a new native Bridge for every browser. Store updates use the browser's supported channel; native companion updates remain governed by the original Device Bridge signed release lifecycle.
6. After original Zitadel login, trusted device registration, grants, physical health and Runtime admission, the Tablet displays the person's authorized Digital Brain, floating widgets, Agent Lee and apps from canonical Runtime/Continuum state. **The phone does not literally copy Windows executables, local keys, GPU weights or Creator-private files.** Unsupported native functions stay unavailable until qualified.

## The eight release-catalog channels

| Channel | Delivery | Current evidence |
|---|---|---|
| Chrome | Chrome Web Store, desktop | Source ZIP built. Store listing NOT_PUBLISHED |
| Edge | Microsoft Edge Add-ons, desktop | Source ZIP built. Store listing NOT_PUBLISHED |
| Firefox | Firefox Add-ons, compatible desktop | Source ZIP built. Native host for Firefox NOT_QUALIFIED |
| Safari | Apple containing app/App Store | Source only; signed containing app NOT_VERIFIED |
| Android | Original signed Android companion | Debug source candidate only; signed release NOT_VERIFIED |
| Apple | Original signed Apple companion | Signed, installed release NOT_VERIFIED |
| Windows | Original signed Windows Device Bridge | Trusted production native-host installer NOT_VERIFIED |
| Linux | Original signed Linux Device Bridge | Trusted production native-host installer NOT_VERIFIED |

GitHub Actions review artifacts do **not** constitute store listings or qualified native installers. Actual published links in `docs/release-catalog.json` remain null until approved official publication with release custody. The GitHub Pages install directory is `docs/install/` and the reviewed source-only deployment workflow is `.github/workflows/extension-install-directory-pages.yml`. The GitHub developer release workflow stages DRAFT releases from reviewed main only; it never publishes a customer installer or store listing.

## Connection and installation custody gates

- **Installer:** Original OS adapter must verify actual OS, device identity and installed browser inventory with consent. Website user-agent strings or checkbox selections cannot substitute for that.
- **Packages:** Use prebuilt version-pinned, integrity-verified, properly signed OS-specific native artifacts and separately reviewed browser-store packages. Do **not** build and execute an arbitrary repository on the end user's phone from a website visit.
- **Browser:** Human-directed per-browser official store installation. On Windows/Linux/Apple desktop the signed native installer registers the approved host; published extension IDs must match original host allowed origins. Browser extension install and OS-native host install are different approvals.
- **Identity:** Original Zitadel owner login, owner-approved signing custody, trusted passport and original Runtime registry readback. Each device must pass separate enrollment and revocation.
- **Execution:** Formula, independent Veritas, C3, Receipt Authority, Continuum and Agent Lee remain separate original authorities. Browser detection and Tablet display never grant device execution.
- **Failure:** Unknown OS, missing native installer, unsigned package, unpublished store listing, unverified browser-native support or unbound registry all show explicit blocked states; no fake install or green connected flag.

## Source and acceptance status

- `docs/install/setup-policy.js`, `setup.js`, `install.js`: OS/browser browser-only setup plan with explicit choices, platform restrictions, and official store allowlist. Tests: `tests/setup-policy.test.mjs`, `tests/distribution-catalog.test.mjs`.
- Original Bridge [PR #138](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/pull/138) adds `operator/browser/native-browser-install-plan.mjs` with original OS-adapter injected device/browser inventory and release catalog; test fixtures are synthetic, native OS installation still NOT_EXECUTED.
- Browser extensions [PR #6](https://github.com/4citeB4U/Leeway-Device-Extension/pull/6) are built for Chrome, Edge and Firefox but **NOT installable as production full Device Bridge**. Original outbound [Bridge PR #137](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/pull/137) and owner-signed device registry remain to be physically admitted.
- Release only after real Windows Chrome/Edge, Linux, Android Fold, Apple iPhone/Safari, Firefox supported device tests, user consent, Chrome/Edge/AMO/Apple store approval, exact signed native host installation and physical Bridge registry readback.

**Work state:** setup selection implementation and CI source tests; native signed installation, store publishing and real device adoption BLOCKED/NOT_EXECUTED. Never tell users an unpublished package was installed.

## Creator-approved correction — account-first onboarding and per-device packaging

**The SAME Device Bridge front door serves the Creator and customers.** A new install has no stored user identity. The browser page makes no Creator role assertion. The original authenticated Runtime determines whether this LeeWay identity owns Creator privileges, an existing customer workspace, or a new customer entitlement.

### Actual intended public setup sequence

1. Open the original LeeWay Device Bridge home page from GitHub Pages (later the Creator's website), including on a new phone. The page identifies **OS and current browser only as browser hints**. The person can correct desktop/phone/tablet/foldable and choose additional browsers.
2. Choose **Full setup on this device** or **Add device to my existing workspace**. Separately answer **I already have a LeeWay account / Create a new LeeWay account**. Existing accounts are allowed to do full setup when this particular device has never enrolled. Additional-device quick setup requires an existing account.
3. **Before a protected download**, send the person through original Zitadel OIDC sign-in/account registration on the original Runtime service. Account creation, existing-account lookup, MFA/passkeys, Creator/customer authorization and consent are checked by that authority, not a static page. A new account must complete its own activation; a returning user must reauthenticate. There is **no production onboarding callback discovered in current source**, so the static UI currently marks this step blocked; it is not a live login.
4. Ask **Do you have a GitHub account?** If not, guide the person to GitHub's official signup and return. If yes, offer an approved GitHub App OAuth connection once its registration and callback are actually present. Never harvest GitHub passwords or create accounts on a user's behalf. GitHub is a separately consented app-building/repository service, not a prerequisite for basic LeeWay identity or device authority.
5. Ask what browsers to use. The real, consented native OS adapter later detects which browsers are actually installed. On desktops the signed Bridge host registers approved native messaging identities for available Chrome, Edge, and subsequently qualified Firefox; browser store installation is explicitly user-approved. On Android phone/tablet, the signed Android Bridge companion is the device capability source; mobile Chrome/Edge/Firefox choices do not magically become desktop extensions. Apple's Safari requires the qualified containing app.
6. After authorization, the **original Runtime** atomically issues a short-lived, one-time enrollment handoff reference, bounded to the account, requested device and verified native proof. It is *not* a long-lived password, exported passport, static mesh token or custom signed installer full of personal secrets. The app binary stays common, clean, signed and version-pinned.
7. The selected signed package depends on **verified OS family, physical shape, CPU ABI, distro, OS version and approved package format**, not merely “Android” versus “Windows”. For Android, test foldable/tablet adaptive UI and actual arm64/other ABI support; for Apple distinguish iPhone/iPad iOS/iPadOS companion vs macOS desktop. For Linux Chinese desktops, deepin/UOS/openKylin/Kylin/openEuler are Linux *distribution variants* that need actual deb/rpm/ABI package qualification. Unknown proprietary Chinese OS implementations remain unqualified; do not mislabel them Linux.
8. On installation, the original signed Bridge app verifies its own package and actual hardware, redeems the one-time handoff through original Runtime, seeks device-specific consent, and asks the approved signer/registry for a **new passport for THIS device**. Source contract: [native-onboarding-handoff.mjs](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/blob/repair/w01-native-browser-authority-adapter-20261123/operator/browser/native-onboarding-handoff.mjs), not a production endpoint.
9. A second device follows the same account and authorization protections, but can use a **shorter approval** such as verified passkey or existing-device approval with a bounded challenge if original Zitadel/Runtime supports it. Do **not** transfer passwords, recovery phrases, private keys or the first device's passport. New device generates its own key proof and independently enrolls.
10. After physical signed registry and original Runtime discovery succeed, the Tablet displays the permitted Agent Lee, Digital Brain, widgets and installed user apps from original Continuum. It does not physically copy Windows binaries/keys/models to a phone.

### Exact working source and blocked integrations

**Implemented on this source branch:** browser/OS hint; explicit device-form and Linux distribution picker; full-versus-additional device, existing-versus-new account and GitHub yes/no; multi-browser selection; safe preview of the step sequence; approved store URL filtering; automated positive/negative source tests. [onboarding-policy.js](docs/install/onboarding-policy.js) makes no identity or hardware admission claim. Its \`identity:NOT_AUTHENTICATED\` and \`ownerPassport:NOT_ISSUED\` fields must not be promoted by the UI.

**Implemented on the original Bridge draft branch:** [native-device-target.mjs](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/blob/repair/w01-native-browser-authority-adapter-20261123/operator/browser/native-device-target.mjs) accepts only native adapter evidence for OS, CPU ABI, distro/format and an exact original signed-release variant. Even a matching source manifest is not an installed package until actual bytes and signature are independently verified. [native-onboarding-handoff.mjs](https://github.com/4citeB4U/LEEWAY-DEVICE-BRIDGE/blob/repair/w01-native-browser-authority-adapter-20261123/operator/browser/native-onboarding-handoff.mjs) requires original Runtime one-time handoff consumption and actual native device proof; it does not issue passport or grant device execution.

**Still BLOCKED:** original Zitadel web signup/sign-in callback; original Runtime endpoint for authenticated setup and atomic issuance/consumption of one-time install references; approved signer and native physical passport/registry; signed per-OS/per-ABI builds with hardware acceptance; install-time service binding; real GitHub App OAuth callback; store publication; native Chrome/Edge host registration and physical Tablet session. A GitHub Pages-only site cannot perform these authenticated server duties; do not falsely imply it has. Do not move secrets to static JavaScript, URL fragments, localStorage or the user’s package ZIP.

**Release acceptance:** one fresh, signed installer accepted with full setup by a genuine existing Creator account, one new customer full setup and separate device scope, one second-device short enrollment; negative tests for wrong OS/ABI, unsigned/distro mismatch, expired/replayed handoff, wrong account, no consent, revoked device and inaccessible existing device. Real original Runtime/Zitadel, physical device and independent Veritas/Receipt check are required where applicable. Until then, production HOLD.

