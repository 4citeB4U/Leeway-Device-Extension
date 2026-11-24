/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_MOBILE_INSTALL.TEST
TAG: LEEWAY.CREATOR.MOBILE_INSTALL.FAIL_CLOSED_V1
5WH:
WHAT = Test platform-specific installer selection before native owner-device enrollment.
WHY = Never provide untrusted/debug releases or copy the Creator Windows installer to phones.
WHO = Creator-authorized outside GPT-6 source reviewer, not independent Veritas.
WHERE = tests/mobile-creator-install.test.mjs in Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Execute the actual browser-only policy in a Node VM with synthetic release metadata.
LICENSE = Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const file=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
const context={URL};
context.globalThis=context;
vm.runInNewContext(file('creator/connect/mobile-install-policy.js'),context,{filename:'mobile-install-policy.js'});
const choose=context.LeeWayCreatorMobileInstall.choosePublishedInstaller;
const family=context.LeeWayCreatorMobileInstall.familyFromUserAgent;
const ORIGIN='https://leeway.example';
const ANDROID='Mozilla/5.0 (Linux; Android 16; Pixel) AppleWebKit/537.36';
const APPLE='Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)';
const release=(overrides={})=>({
  osFamily:'Android',edition:'CREATOR_COMPANION',releaseState:'SIGNED_PUBLISHED',
  releaseAuthority:'ORIGINAL_LEEWAY_DEVICE_BRIDGE',version:'1.2.3',
  url:ORIGIN+'/releases/android/creator/leeway-creator-1.2.3.apk',
  channel:'ANDROID_SIGNED_APK',sha256:'a'.repeat(64),...overrides
});
test('real browser policy selects only the Android published Creator companion',()=>{
 const result=choose([release()],ANDROID,ORIGIN+'/');
 assert.equal(result?.url,release().url);
 assert.equal(result?.family,'Android');
 assert.equal(family(ANDROID),'Android');
 assert.equal(family(APPLE),'Apple');
 assert.equal(family('Chrome Windows 11'),null);
 assert.equal(choose([release()],APPLE,ORIGIN+'/'),null);
});
test('Android release selector fails closed for untrusted metadata, debug, remote and missing hash',()=>{
 const cases=[
  {releaseState:'DRAFT'},{edition:'CUSTOMER_STARTER'},{releaseAuthority:'SELF_DECLARED'},
  {url:ORIGIN+'/releases/android/creator/debug.apk'},
  {url:ORIGIN+'/releases/android/creator/unsigned.apk'},
  {url:ORIGIN+'/releases/android/creator/leeway-creator.apk?token=abc'},
  {url:'https://attacker.example/releases/android/creator/leeway.apk'},
  {url:'http://leeway.example/releases/android/creator/leeway.apk'},
  {sha256:'0'.repeat(63)},{channel:'CHROMIUM_EXTENSION'},
  {version:'1.0.0-beta'},{osFamily:'Apple'}
 ];
 for(const patch of cases)assert.equal(choose([release(patch)],ANDROID,ORIGIN+'/'),null,JSON.stringify(patch));
 assert.equal(choose([release()],ANDROID,'http://leeway.example/'),null);
 assert.equal(choose([release()],ANDROID,'https://leeway.example/not-root'),null);
 assert.equal(choose(Array(9).fill(release()),ANDROID,ORIGIN+'/'),null);
});
test('iPhone accepts only Apple-distributed TestFlight page and not raw IPA or untrusted source',()=>{
 const apple=release({osFamily:'Apple',channel:'APPLE_TESTFLIGHT',
  url:'https://testflight.apple.com/join/a1B2c3D4',sha256:undefined});
 const r=choose([apple],APPLE,ORIGIN+'/');
 assert.equal(r?.url,apple.url);
 for(const invalid of [
  {channel:'APPLE_IPA_DIRECT'},
  {url:'https://untrusted.example/join/a1B2c3D4'},
  {url:'https://testflight.apple.com/join/a1B2c3D4?token=abc'},
  {url:'https://testflight.apple.com/download/LeeWay.ipa'},
  {url:'https://testflight.apple.com/join/a1B2c3D4#invite'},
  {releaseState:'PREVIEW'}
 ])assert.equal(choose([{...apple,...invalid}],APPLE,ORIGIN+'/'),null,JSON.stringify(invalid));
});
test('pairing UI does not automatically install, enroll, or copy native Creator credentials',()=>{
 const html=file('creator/connect/index.html');
 const js=file('creator/connect/connect.js');
 assert.match(html,/mobile-install-policy\.js/);
 assert.match(html,/id="nativeInstaller" hidden target="_blank" rel="noopener noreferrer"/);
 assert.match(js,/showPublishedInstaller\(data\)/);
 assert.match(js,/mobileInstallers/);
 assert.match(js,/Runtime reports a published Creator companion/);
 assert.match(js,/Installation does not enroll this device/);
 assert.match(js,/\/api\/creator\/pairing\/begin/);
 assert.doesNotMatch(js,/installPackage|privateKey|localStorage|sessionStorage|document\.cookie/);
 const packageSource=file('scripts/package-extension.py');
 assert.doesNotMatch(packageSource,/['"]creator\/connect\//);
});
