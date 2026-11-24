/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_AND_JOIN.TEST
TAG: LEEWAY.CREATOR.PAIR_AND_INVITE.FRONTEND_SOURCE_NEGATIVE_TESTS_V1
5WH:
WHAT = Verify real Creator device/invitation UI and customer join front end are separate from the tiny customer archive.
WHY = Prevent customer ZIP leakage of Creator dashboard and ensure no password capture or fabricated share links.
WHO = Creator-authorized outside GPT-6 source contributor; not live browser admission.
WHERE = tests/creator-join-source.test.mjs in Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Parse UI source and Chromium/Firefox allowlisted package files; assert no Creator controls in customer edition.
LICENSE = Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
test('Creator console has four device slots, owner-only pairing, copy/email invitation',()=>{
 const html=file('creator/creator-console.html');
 const js=file('creator/creator-console.js');
 assert.match(html,/Creator Master · Devices · Customer invitations/);
 assert.match(js,/Primary PC/);
 assert.match(js,/Phone/);
 assert.match(js,/Additional device 1/);
 assert.match(js,/Additional device 2/);
 assert.match(js,/\/api\/creator\/overview/);
 assert.match(js,/\/api\/creator\/device-pairs/);
 assert.match(js,/\/api\/creator\/invitations/);
 assert.match(js,/masterRoleGranted!==false/);
 assert.match(js,/mailto:\?/);
 assert.match(js,/CREATOR_CONSOLE_IDENTITY_UNVERIFIED/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|privateKey|eval\(/);
});
test('customer join never asks for password or grants Master role',()=>{
 const html=file('join/index.html');
 const js=file('join/join.js');
 assert.match(html,/Welcome to LeeWay/);
 assert.match(html,/I agree to the published LeeWay Terms/);
 assert.match(html,/No LeeWay password is requested here/);
 assert.match(js,/history\.replaceState/);
 assert.match(js,/code_challenge_method/);
 assert.match(js,/\/api\/join\/bootstrap/);
 assert.match(js,/\/api\/join\/begin/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|document\.cookie|privateKey|eval\(|input\[type=password\]/);
 assert.doesNotMatch(html,/<input[^>]*type="password"/);
});
test('Creator console and public signup UI are not packaged into the customer extension',()=>{
 const pack=file('scripts/package-extension.py');
 const manifest=JSON.parse(file('extension/manifest.json'));
 assert.doesNotMatch(pack,/['"]creator\/creator-console|['"]join\/index\.html/);
 assert.doesNotMatch(JSON.stringify(manifest),/creator\/|join\/|creator-console/);
 assert.match(file('extension/operating-policy.js'),/creator-console/);
});
