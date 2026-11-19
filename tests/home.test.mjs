/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.HOME.TESTS
TAG: LEEWAY.W01.UNIVERSAL_EXTENSION.HOME.SMOKE.V1
5WH:
WHAT = Validate the public extension home includes the original user promise, honest status and inert local-only preview.
WHY = Prevent a design preview from impersonating a connected owner session, native installer or recovery service.
WHO = Creator-directed W01 outside support, not original Veritas.
WHERE = tests/home.test.mjs in Leeway-Device-Extension.
WHEN = 2026-11-19.
HOW = Deterministic Node built-in assertions on checked-out static source.
LICENSE = Not asserted; inherit repository owner decision.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page = readFileSync(new URL('../docs/index.html', import.meta.url), 'utf8');

test('public extension home explicitly disclaims native runtime and recovery', () => {
  for (const phrase of ['NOT A CONNECTED EXTENSION','No live session','NOT QUALIFIED','CROSS-DEVICE RESTORE NOT VERIFIED','cannot log in']) {
    assert.ok(page.includes(phrase), 'Missing explicit unavailable-state assertion: ' + phrase);
  }
});
test('original one-setup multi-device restore journey is presented', () => {
  for (const phrase of ['SET UP ONCE','ADD DEVICES','RECOVER ANYWHERE','ZITADEL','Continuum','Agent Lee']) {
    assert.ok(page.includes(phrase), 'Missing original W01 user journey: ' + phrase);
  }
});
test('four accessible interactive tabs reference real panel IDs', () => {
  for (const name of ['home','devices','recovery','updates']) {
    assert.match(page, new RegExp('id="tab-' + name + '".*?aria-controls="view-' + name + '"'));
    assert.ok(page.includes('id="view-' + name + '"'));
    assert.ok(page.includes('data-panel="' + name + '"'));
  }
  assert.ok(page.includes("addEventListener('keydown'") || page.includes("addEventListener('keydown',"));
});
test('preview has no form, live device fetch, broad extension permissions or remote executable', () => {
  assert.doesNotMatch(page, /<form\b|<input\b|\bfetch\s*\(|XMLHttpRequest|chrome\.runtime|browser\.runtime|<script[^>]+src\s*=/i);
  assert.doesNotMatch(page, /Access-Control-Allow-Origin|localhost:43117|nativeMessaging/);
});
test('original authority references remain discoverable', () => {
  assert.ok(page.includes('4citeB4U/LEEWAY-DEVICE-BRIDGE'));
  assert.ok(page.includes('4citeB4U/Leeway-Device-Extension'));
});
