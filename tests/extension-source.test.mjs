/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.TEST
TAG: LEEWAY.UNIVERSAL_EXTENSION.SOURCE_TEST.V1
5WH:
WHAT: Test the reconciled extension's permission and authority boundaries.
WHY: Prevent a silent browser collector, duplicate native host or fake execution claim.
WHO: Creator-authorized LeeWay Device Extension contributors.
WHERE: tests/extension-source.test.mjs.
WHEN: 2026-11-19.
HOW: Inspect exact source contracts without representing a browser installation.
LICENSE: Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(path.join(root, 'extension', name), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
test('uses explicit user activation and no ambient website permissions', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions.sort(), ['activeTab', 'nativeMessaging', 'scripting', 'sidePanel', 'storage']);
  assert.deepEqual(manifest.optional_host_permissions, ['https://*/*']);
  assert.equal(manifest.side_panel.default_path, 'operating-system.html');
  assert.equal(manifest.name, 'LeeWay Operating System');
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.content_scripts, undefined);
});
test('uses one reconciled native-host identity', () => {
  const source = read('browser-polyfill.js');
  assert.match(source, /com\.leewayindustries\.device_bridge/);
  assert.doesNotMatch(source, /org\.leeway\.device_bridge/);
});
test('does not impersonate a runtime or evidence authority', () => {
  const source = read('background.js');
  assert.match(source, /NATIVE_HOST_ACK_NOT_VERITAS/);
  assert.match(source, /NATIVE_HOST_NOT_AUTHENTICATED/);
  assert.doesNotMatch(source, /<all_urls>|localhost:43117|Access-Control-Allow-Origin/);
});

test('customer package never bundles a Creator Tablet entry or digital employee exports',()=>{
 const html=read('operating-system.html');
 const ui=read('operating-system.js');
 const policy=read('operating-policy.js');
 assert.match(html,/Customer Starter/);
 assert.match(html,/Open my Tablet/);
 assert.doesNotMatch(html,/Open full Tablet|Employee Deployment|Digital Employment Center|forkExtension|tabletFrame/);
 assert.doesNotMatch(ui,/external\(profile\.tabletUrl\)|forkExtension|previewTablet/);
 assert.doesNotMatch(policy,/access:'PUBLIC_LAUNCH'/);
 assert.match(policy,/EDITION='CUSTOMER_STARTER'/);
});
