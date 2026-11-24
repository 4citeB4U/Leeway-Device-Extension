/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.INVITATION_DIRECTORY.TEST
TAG: LEEWAY.EXTENSION.ORIGINAL_CUSTOMER_JOIN_DIRECTORY.V1
5WH:
WHAT = Verify GitHub Pages deploys the existing protected Runtime Join client, not a second signup UI.
WHY = An invitation should open the Bridge setup without leaking tokens or falsely registering a customer.
WHO = Creator-authorized extension source QA, not Runtime identity service.
WHERE = tests/join-directory.test.mjs in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-24.
HOW = Offline source policy tests for the original join fragment, CSRF/OIDC, and Pages packaging.
LICENSE = Existing repository terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=path=>readFileSync(new URL(path,import.meta.url),'utf8');
test('original secure join client remains source of truth for invitation redemption',()=>{
 const s=source('../join/join.js');
 assert.match(s,/location\.hash/);
 assert.match(s,/history\.replaceState/);
 assert.match(s,/\/api\/join\/bootstrap/);
 assert.match(s,/\/api\/join\/begin/);
 assert.match(s,/code_challenge_method/);
 assert.match(s,/x-leeway-csrf/);
 assert.match(s,/credentials:'same-origin'/);
 assert.match(s,/!available\|\|!invite\|\|!csrf/);
 assert.doesNotMatch(s,/localStorage|sessionStorage|window\.name/);
});
test('GitHub Pages copies original join screen into project /join without an alternative account registration route',()=>{
 const workflow=source('../.github/workflows/extension-install-directory-pages.yml');
 assert.match(workflow,/cp join\/index\.html join\/join\.js docs\/join\//);
 assert.match(workflow,/path: \.\/docs/);
 const setup=source('../docs/install/index.html');
 assert.match(setup,/invitation-only/);
 assert.match(setup,/href="\.\.\/join\/"/);
 const orig=source('../join/index.html');
 assert.match(orig,/id="join"/);
 assert.match(orig,/id="terms"/);
});
test('invitation page cannot claim customer records/marketing consent without original Runtime',()=>{
 const s=source('../join/join.js');
 assert.match(s,/CUSTOMER_JOIN_NOT_YET_CONFIGURED/);
 assert.match(s,/JOIN_RUNTIME_HTTP_/);
 assert.doesNotMatch(s,/GITHUB_PAGES_CUSTOMER_CONFIRMED|VERIFIED_CUSTOMER_SYNCHRONIZED/);
});
