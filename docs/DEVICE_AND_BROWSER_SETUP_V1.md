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
