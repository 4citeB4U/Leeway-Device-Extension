/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.ONBOARDING.NEGATIVE_TESTS
TAG: LEEWAY.DEVICE_BRIDGE.FIRST_ADDITIONAL_ONBOARDING.TEST_V1
5WH:
WHAT = Test first device/new owner/returning owner plus OS device profile selection.
WHY = No account or Creator entitlement may be inferred from browser/user-chosen strings.
WHO = Creator-authorized source QA; browser/user fixtures are synthetic.
WHERE = tests/onboarding-policy.test.mjs.
WHEN = 2026-11-24.
HOW = Execute actual pure policy JS in VM against original distribution setup and catalog.
LICENSE = Existing repository terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const get=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const sandbox={};sandbox.globalThis=sandbox;
for(const path of ['../docs/install/setup-policy.js','../docs/install/onboarding-policy.js'])
 vm.runInNewContext(get(path),sandbox,{filename:path});
const S=sandbox.LeeWaySetupPolicy,P=sandbox.LeeWayOnboardingPolicy;
const catalog=JSON.parse(get('../docs/release-catalog.json'));
const env=(family,form='desktop',browser='chrome')=>({family,form,browser,hintOnly:true});
const plan=(overrides={})=>P.planOnboarding({
 environment:env('Windows'),deviceRelation:'first',account:'existing',
 github:'yes',browsers:['chrome','edge'],catalog,setupPolicy:S,...overrides
});

test('existing Creator/account can run FULL first-device setup without recreating account or inheriting Creator grants',()=>{
 const p=plan();
 assert.equal(p.path,'FULL_DEVICE_SETUP');
 assert.equal(p.ownerType,'ISSUER_DECIDES_CREATOR_OR_USER');
 assert.equal(p.steps.find(s=>s.id==='account').status,'AUTHENTICATED_RUNTIME_REQUIRED');
 assert.match(p.steps.find(s=>s.id==='account').label,/Sign in/);
 assert.equal(p.steps.find(s=>s.id==='github').status,'GITHUB_OAUTH_CONSENT_REQUIRED');
 assert.equal(p.steps.find(s=>s.id==='install-0').channel,'windows-companion');
 assert.equal(p.actualConnectedDevice,'NOT_VERIFIED');
 assert.equal(p.approvedBootstrapTicket,'NOT_ISSUED');
 assert.equal(p.ownerPassport,'NOT_ISSUED');
 assert.equal(p.containsCredentials,false);
});
test('new customer first device needs original Zitadel signup and human GitHub signup',()=>{
 const p=plan({account:'new',github:'no',browsers:['edge']});
 assert.equal(p.path,'FULL_DEVICE_SETUP');
 assert.match(p.steps.find(s=>s.id==='account').label,/Register a new LeeWay identity/);
 assert.equal(p.steps.find(s=>s.id==='github').status,'GITHUB_USER_SIGNUP_REQUIRED');
 assert.equal(p.steps.find(s=>s.id==='install-0').channel,'windows-companion');
 assert.equal(p.identity,'NOT_AUTHENTICATED');
});
test('additional device uses quick enrollment with NEW per-device passport, no key copying',()=>{
 const p=plan({deviceRelation:'additional',account:'existing',github:'yes'});
 assert.equal(p.path,'ADDITIONAL_DEVICE_QUICK_SETUP');
 assert.match(p.steps.find(s=>s.id==='enroll').detail,/NEW device/);
 assert.match(p.steps.find(s=>s.id==='enroll').detail,/never transfer another device passport/);
 assert.equal(p.profile.trustedIdentity,'NOT_PROBED');
 assert.equal(p.installer.nativeEnrollment,'REQUIRED_PER_DEVICE');
});
test('cannot add additional device to a new nonexistent LeeWay account',()=>{
 assert.throws(()=>plan({deviceRelation:'additional',account:'new'}),/NEW_ACCOUNT_CANNOT_BE_ADDITIONAL_DEVICE/);
});
test('Android foldable phone selects native Android and respects selected desktop Chrome limitations',()=>{
 const p=plan({
  environment:env('Android','phone','chrome'),form:'foldable',
  browsers:['chrome','edge','firefox']
 });
 assert.equal(p.profile.deviceStyle,'foldable');
 assert.equal(p.profile.form,'phone');
 assert.equal(p.profile.packageArchitecture,'NATIVE_ADAPTER_MUST_DETECT_ARCHITECTURE_AND_ABI');
 assert.equal(p.installer.actions[0].channel,'android-companion');
 assert.equal(p.installer.actions[1].state,'ANDROID_CHROME_NO_DESKTOP_EXTENSION');
 assert.equal(p.installer.actions[2].state,'ANDROID_EDGE_NATIVE_BRIDGE_NOT_QUALIFIED');
 assert.equal(p.installer.actions[3].state,'FIREFOX_ANDROID_NATIVE_MESSAGING_NOT_AVAILABLE');
});
test('Android tablet is not a Windows desktop; Apple iPhone/iPad and desktop select correct companions',()=>{
 assert.equal(plan({environment:env('Android','tablet','chrome'),browsers:['chrome']}).profile.form,'tablet');
 assert.equal(plan({environment:env('Apple','phone','safari'),browsers:['safari']}).installer.actions[0].channel,'apple-companion');
 assert.equal(plan({environment:env('Apple','tablet','safari'),browsers:['safari']}).profile.form,'tablet');
 assert.equal(plan({environment:env('Apple','desktop','safari'),browsers:['safari']}).installer.actions[0].channel,'apple-companion');
});
test('Chinese Linux distributions use Linux native adapter with distribution/ABI qualification, not a new OS authority',()=>{
 for(const distro of ['deepin','uos','openkylin','kylin','openeuler','other-linux']){
  const p=plan({environment:env('Linux','desktop','firefox'),
    linuxDistribution:distro,browsers:['firefox']});
  assert.equal(p.profile.family,'Linux');
  assert.equal(p.profile.distribution,distro);
  assert.match(p.profile.displayName,/Linux desktop/);
  assert.equal(p.installer.actions[0].channel,'linux-companion');
  assert.equal(p.profile.trustedIdentity,'NOT_PROBED');
 }
});
test('unsupported China OS and contradictory hardware/OS guesses require native qualification',()=>{
 assert.throws(()=>plan({environment:env('Linux'),linuxDistribution:'unknown-proprietary-os'}),/LINUX_VARIANT_UNRECOGNIZED/);
 assert.throws(()=>plan({environment:env('Windows'),linuxDistribution:'deepin'}),/LINUX_VARIANT_OS_MISMATCH/);
 assert.throws(()=>plan({environment:env('Windows'),form:'phone'}),/OS_FORM_FACTOR_CONFLICT/);
 assert.throws(()=>plan({environment:env('Android','phone'),form:'desktop'}),/OS_FORM_FACTOR_CONFLICT/);
 assert.throws(()=>plan({environment:env('Unknown','unknown')}),/UNVERIFIED_PLATFORM/);
});
test('explicit account and GitHub choice required; no free self-declared Creator role',()=>{
 assert.throws(()=>plan({account:null}),/ACCOUNT_CHOICE_REQUIRED/);
 assert.throws(()=>plan({github:null}),/GITHUB_CHOICE_REQUIRED/);
 assert.throws(()=>plan({deviceRelation:null}),/DEVICE_RELATION_REQUIRED/);
 const x=plan({ownerRole:'CREATOR',approved:true,account:'existing'});
 assert.equal(x.ownerType,'ISSUER_DECIDES_CREATOR_OR_USER');
 assert.equal(x.identity,'NOT_AUTHENTICATED');
});
test('source UI collects no passwords, recovery phrases, tokens, or static one-click registrations',()=>{
 const html=get('../docs/install/index.html');
 const ui=get('../docs/install/setup.js');
 assert.match(html,/id="deviceForm"/);
 assert.match(html,/id="linuxVariant"/);
 assert.match(html,/name="deviceRelation"/);
 assert.match(html,/name="accountChoice"/);
 assert.match(html,/name="githubChoice"/);
 assert.match(ui,/planOnboarding/);
 assert.match(ui,/github\.com\/signup/);
 assert.match(ui,/Zitadel sign-in\/registration integration is NOT CONNECTED/);
 assert.doesNotMatch(html,/<input[^>]*type="password"/);
 assert.doesNotMatch(ui,/sessionStorage|localStorage|document\.cookie/);
 assert.doesNotMatch(ui,/fetch\(['"]https:\/\/github\.com\/signup/);
});
