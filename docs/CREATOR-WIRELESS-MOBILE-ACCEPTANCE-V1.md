<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_WIRELESS_MOBILE
TAG: LEEWAY.CREATOR.MOBILE_ZERO_USB.ACCEPTANCE_V1
5WH:
WHAT = Qualification contract for same Creator Master Tablet and native Bridge on Android and Apple phones.
WHY = Preserve one Creator experience without copying the Golden Master, trusting a debug APK, or faking phone GPU execution.
WHO = Creator authority, original Device Bridge/Tablet/Runtime/Edge GPU owners; outside support is not Agent Lee.
WHERE = docs/CREATOR-WIRELESS-MOBILE-ACCEPTANCE-V1.md in Leeway-Device-Extension.
WHEN = 2026-11-23/24 UTC.
HOW = Runtime-issued owner pairing, authentic platform-specific signed installers, native proof, real device readback and end-to-end state acceptance.
LICENSE = Existing repository terms; no new license asserted.
-->

# Wireless Creator Master: original Tablet, two phones, zero USB — acceptance V1

**Continuation:** Engineering #6; Bridge #109; Extension draft PR #5 (stacked on #3), separate Safari draft PR #4; Tablet PR #17; Runtime PR #198. No new issuer, Bridge, Runtime, Formula, Veritas, Continuum or control plane.

## Product invariant

The **same Creator identity, permitted application catalog, project/Continuum state and Tablet interaction semantics** appear on primary Windows PC, Android and iPhone 11. These are synchronized authenticated workspaces, not OS-binary clones. Each device creates its own device-held key/passport, distinct capability grants, native OS bridge, Diagnostics source and GPU provider. Local Digital Brain files remain local unless individually consented to encrypted Continuum transfer. User devices never receive private Creator signing keys, full desktop executable files or model weights by copying the Windows installation.

A right-edge Agent Lee control is required *inside the owned Tablet/native app* with consistent behavior and real-state readback. Android can separately request the OS overlay permission for a floating control. iOS cannot promise an always-on overlay over unrelated apps: use a right-edge in-app control, supported home-screen entry or signed Safari extension within Safari.

## Release and install contract

1. Preserve and verify existing primary-PC installation as the reference; record source SHA, Tablet route, latest good Continuum snapshot and runtime roles.
2. Creator console (authenticated original Runtime) issues **one owner-only, ten-minute, single-use pairing challenge per new device**. Sent to the phone by email, direct link or QR. The link grants no authority by possession; same Creator Zitadel sign-in + native ownership proof + active owner consent are mandatory.
3. Phone opens /creator/connect/ using mobile browser. No USB/ADB/device pairing with PC. **Signed native app package is an independent prerequisite** for actual device commands or GPU execution; installing a PWA icon alone does not provide native capabilities.
4. Original Runtime's /api/creator/pairing/bootstrap may offer a **non-secret, server-authorized release catalog** under mobileInstallers. This route and contract are NOT DEPLOYED. Client policy creator/connect/mobile-install-policy.js requires:
   - osFamily Android or Apple based only on installer UX selection, NOT as identity proof;
   - edition CREATOR_COMPANION, releaseAuthority ORIGINAL_LEEWAY_DEVICE_BRIDGE, releaseState SIGNED_PUBLISHED, version;
   - Android ANDROID_SIGNED_APK: HTTPS same-origin /releases/android/creator/*.apk, non-debug/non-unsigned name, 64-hex SHA-256; Android installer and actual certificate/signature must independently validate package, approved trust and continuity;
   - Apple APPLE_TESTFLIGHT: https://testflight.apple.com/join/{code}; Apple packaging, signing, eligibility, TestFlight membership, device approval and containing app/native handoff must actually exist.
5. The original Runtime must authenticate and bind the release version, approved app signing identity and device passport before marking registered. Client metadata strings cannot independently certify signing or Veritas. Do not send a pairing challenge to an arbitrary APK website or embed it in the download URL.
6. Mobile PWA/home-screen Tablet is an allowed *lightweight workspace access path*, not a substitution for a native Device Bridge, full OS global overlay or physical LeeWay GPU proof. Normal browser extensions are not available in stock Android Chrome; iOS Safari extensions require a containing signed app.
7. App/extension updates follow the native OS/store signing channel. Runtime policy may toggle *already-installed authorized features*, never silently install binaries or modify unrelated local files.

## Known source-state blockers (measured versus source)

- At this checkpoint, authenticated managed Runtime health is AVAILABLE, but bridge_devices returns devices=[] / REGISTRATION_AUTHORITY_UNBOUND / reachability NOT_PROBED. An actual phone cannot be accepted without enrollment. No phone/PC native read was observed through the new channel.
- Extension PR #5 is a public draft, **customer edition** is deliberately only 3 core apps + optional local AI. It must NEVER be presented as the full Creator phone package. The Creator console and pairing front door are separate source assets and must authenticate against original server before any Master UI.
- Current public Bridge main docs/downloads/leeway-device-bridge-android-latest.json at inspection points to leeway-device-bridge-android-latest-debug.apk, versionCode 25 (source sha blob 267cc8533ed58a72a021eb2fa26dd00e0fab11). This is NOT a qualified signed Creator installer. The installer policy rejects debug-labelled files.
- Safari extension PR #4 is source-only and reports no signed IPA/containing app, physical iPhone execution, or verified runtime handoff. TestFlight route is NOT populated or deployed here.
- LeeWay Edge GPU README acknowledges native Vulkan and Metal backend acceptance and protected production enrollment as open. Shader/contract tests do not prove Android/iPhone native GPU inference.
- Creator /api/creator/overview, /device-pairs, /pairing/bootstrap, /pairing/begin and /api/creator/tablet session endpoints must be proved **deployed and owner-authenticated**, not inferred from client source. Current source addition only consumes optional mobileInstallers if a real original Runtime serves it.

## Physical acceptance matrix — no assumption of PASS

| Gate | Primary PC | Android | Apple iPhone 11 |
|---|---|---|---|
| Original Creator Tablet baseline, apps, widgets, right-click and responsive mobile controls | REQUIRED_REFERENCE | REQUIRED_SAME_BEHAVIOR | REQUIRED_SAME_BEHAVIOR |
| Link delivered directly; USB and ADB completely disconnected | N/A | PHYSICAL_REQUIRED | PHYSICAL_REQUIRED |
| Approved non-debug signed native package, independent certificate / TestFlight verification | EXISTING_HOST_IDENTITY | NOT_VERIFIED | NOT_VERIFIED |
| Same Creator Zitadel subject, distinct native device-held passport, current registry readback | NOT_VERIFIED_NEW_BRIDGE | NOT_VERIFIED | NOT_VERIFIED |
| Device Bridge health/info/directory/diagnostics exact bounded consent and response | NOT_VERIFIED_NEW_BRIDGE | NOT_VERIFIED | NOT_VERIFIED |
| Project/Tablet session and user app state live sync via original Continuum with conflict and reconnection tests | NOT_VERIFIED | NOT_VERIFIED | NOT_VERIFIED |
| Original native LeeWay GPU real command and buffer readback, model activation, inference, thermal/battery attribution, no false CPU fallback | NOT_VERIFIED | NOT_VERIFIED | NOT_VERIFIED |
| Voice and Vision owner consent, media start/stop, reconnect; no unrelated OS access | NOT_VERIFIED | NOT_VERIFIED | NOT_VERIFIED |
| Revoked/wrong-owner/offline/replay/expired challenge denial, rollback, original Veritas + Receipt readback | NOT_VERIFIED | NOT_VERIFIED | NOT_VERIFIED |

**Test sequence:** backup/verify first; preserve working PC; deny anonymous relay; obtain signed releases, verify signatures; unregister old phone passports only via revocation; disconnect USB/ADB; clear/replace phone apps only after safe recovery snapshot and signed installer availability; open owner link on phone over network; platform install; sign in; native enrollment; true live Bridge phone probe; open original Tablet; verify one project/Continuum state across PC/phones; run physical GPU, Voice, Vision; offline/reconnect/OTA/rollback and wrong-owner negative cases. A phone file wipe does not prove lossless recovery.

## Ownership and exact implementation next gates

- **Extension W01 / PR #5:** guarded installer link and responsive launcher/Creator pairing page, source tests (this change); do not package Creator console in Customer Starter ZIP.
- **Device Bridge original owner / #109:** approved Android release signing and route; existing Apple containing app and Safari extension; native device passport/owner enrollment; no debug APK production release.
- **Runtime Fabric original owner / PR #198:** deploy real creator/pairing APIs, trusted release manifest provider, external owner proofs, strong CSRF+Zitadel PKCE, single-use challenge redemption, actual registry readback. Do not accept UI claim as authority.
- **Tablet original owner / PR #17:** mobile-responsive original Creator Tablet and embedded/right-edge Agent Lee control; one authoritative widget/session state, not a separate mobile copy.
- **Edge GPU + VRAM/LDWMD owners:** actual Android Vulkan / Apple Metal native provider and governed command/readback; prove separate model residency, memory/thermal budgets, CPU fallback decisions.
- **Continuum / Formula / independent Veritas / Receipt:** exact cross-device project-state sync, authorized recovery, independent PRE/POST and original receipt custody.

**Rollback:** leave phones unchanged and release HOLD when install signature, approved enrollment, owner identity, current registry, storage recovery or original C3 providers are absent. Do not erase phone apps merely to demonstrate installation; perform only after an owner-proven backup and a usable signed replacement.

**Source evidence:** Extension PR #5 head 610fd64f2d2a36c98678bf0581911100a3e99c51, GitHub Actions 45306162547 and 45306162636 SUCCESS at this stage; 44/44 source tests passed including 4 new mobile release gating tests. Physical mobile installation, native GPU, deployment, original Veritas and receipts remain NOT_EXECUTED.
