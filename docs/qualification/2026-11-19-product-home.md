<!--
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.QUALIFICATION
TAG: LEEWAY.W01.EXTENSION.HOME.CHECKPOINT.20261119
5WH:
WHAT = Record the new extension product repository's initialization and separate public preview, native connection and recovery evidence states.
WHY = Preserve W01 mission continuity after establishing a product home.
WHO = Creator-authorized W01 outside-support contributor, not Agent Lee or independent Veritas.
WHERE = docs/qualification/2026-11-19-product-home.md in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-19.
HOW = GitHub source inspection, additive static homepage, source checks and deferred physical acceptance.
LICENSE = Not asserted; existing repository terms apply.
-->
# W01 — Universal Extension product home checkpoint

**Continuing mission:** one initial setup, multiple devices, secure restoration after original-device loss, review available data on replacement hardware, and preserve Agent Lee recoverable progress.

## For / source actions

- Original `4citeB4U/Leeway-Device-Extension` existed as an **empty public GitHub repository**; default branch `main`, no commits, README, branches or PRs when first inspected.
- First repository README created on `main` at commit `e50474d2a94fa45ece176b8a522464e61e405909` and read back.
- Candidate branch `creator/w01-extension-home-pages-20261119` adds `docs/index.html` (no live credentials / device data, local-only Home/Devices/Recovery/Updates tabs); `tests/home.test.mjs` (truthful preview checks); source CI; GitHub Pages workflow; and this qualification record.
- The existing extension implementation **has not been copied** from Device Bridge. Draft Device Bridge PRs #120 and #121 remain separate, incompatible candidates. Native host identity is unresolved (com.leeway.devicebridge versus org.leeway.device_bridge).
- Original auth (ZITADEL + Runtime), Device Bridge authority, Continuum, independent Veritas and Receipt Authority remain unchanged. No new backup/auth/runtime/receipt/control plane.

## Against / not yet qualified

- This repository contains no independently signed/installable browser extension binary and no physically registered native host.
- The proposed GitHub Pages site cannot be declared publicly available until review, Pages settings and a successful deployment/readback.
- The preview is not live new-device enrollment, storage synchronization, encrypted backup, key recovery, or Agent Lee state restoration.
- No physical Chrome/Edge/Safari/iOS/Android cross-device acceptance or original Veritas/Receipt admission.
- Github Actions CI status, repository Pages source setting and the physical target are separately observed requirements; no fake success.
- Source tests must run against exact PR head before marking `CI_PASS`.

## Next gate

1. Validate this branch's static preview and CI, then obtain approved PR merge.
2. Set GitHub repository Settings → Pages → **GitHub Actions** if not already enabled. The workflow `.github/workflows/publish-home.yml` can publish `docs/` only after authorized merge; confirm live HTTPS URL and HTTP/browser poststate.
3. Reconcile Device Bridge extension draft PRs #120/#121 with current canonical W01 source, preserve prior tests, and adopt exactly one signed extension package lineage into this product home through reviewed migration.
4. Install the exact browser-native host for Chrome/Edge and perform fresh owner/device-authenticated command grants; never reactivate the open-CORS localhost 43117 relay.
5. Demonstrate approved first device → second device enrollment → independent encrypted snapshot and recoverable key → all original devices unavailable → owner inspection and explicit staged restoration → Agent Lee verified checkpoint continuation. Require negative cross-tenant and revoked-device tests and original Veritas/Receipt evidence.
6. Finish all relevant 12-stage loop gates before calling the Universal Extension production-ready.

**Current source classification:** README `SOURCE_DOCUMENTED`; website + workflows `SOURCE_CANDIDATE`. `CI_PASS`, `PUBLIC_PAGES_DEPLOYED`, `NATIVE_HOST_ENROLLED`, `CROSS_DEVICE_RECOVERY_VERIFIED`, `PRODUCTION_ADMITTED` are **NOT EXECUTED / NOT VERIFIED** unless later source and host evidence is appended.
