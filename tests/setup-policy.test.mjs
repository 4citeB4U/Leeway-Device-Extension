/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.SETUP.PLATFORM_ROUTING.TEST
TAG: LEEWAY.EXTENSION.OS_BROWSER_SETUP_NEGATIVE_TESTS.V1
5WH:
WHAT = Verify platform/browser qualification and original native installer routing in setup.
WHY = Never deliver desktop Chrome extensions to Android or equate browser preference with enrollment.
WHO = Creator-authorized setup contributor; synthetic user agents are not physical evidence.
WHERE = tests/setup-policy.test.mjs.
WHEN = 2026-11-24.
HOW = Offline Node VM and actual release catalog with positive/negative test fixtures.
LICENSE = Existing repository terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../docs/install/setup-policy.js',import.meta.url),'utf8');
const catalog=JSON.parse(readFileSync(new URL('../docs/release-catalog.json',import.meta.url),'utf8'));
const sandbox={};
sandbox.globalThis=sandbox;
vm.runInNewContext(source,sandbox,{filename:'setup-policy.js'});
const S=sandbox.LeeWaySetupPolicy;
const ua=(userAgent,maxTouchPoints=0)=>S.detectEnvironment({userAgent,maxTouchPoints});
const windows=ua('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/157.0.0.0 Safari/537.36');
const edgeWindows=ua('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/157.0.0.0 Safari/537.36 Edg/157.0.0.0');
const foldChrome=ua('Mozilla/5.0 (Linux; Android 15; Fold) AppleWebKit/537.36 Chrome/151.0 Mobile Safari/537.36');
const edgeAndroid=ua('Mozilla/5.0 (Linux; Android 15; Fold) Chrome/150.0 Mobile Safari/537.36 EdgA/150.0.0.0');
const firefoxAndroid=ua('Mozilla/5.0 (Android 15; Mobile; rv:150.0) Gecko/150.0 Firefox/150.0');
const iosSafari=ua('Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 Version/19.0 Mobile/15E148 Safari/604.1');
const ipadOS=ua('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/19.0 Safari/605.1.15',5);
const linux=ua('Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0');
const mac=ua('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15');
const operaAndroid=ua('Mozilla/5.0 (Linux; Android 15; Mobile) Chrome/151.0 Mobile Safari/537.36 OPR/80.1');

test('Windows Chrome Edge, Linux Firefox, Apple Safari and Opera are distinguished',()=>{
 assert.equal(windows.family,'Windows');
 assert.equal(windows.browser,'chrome');
 assert.equal(edgeWindows.browser,'edge');
 assert.equal(linux.family,'Linux');
 assert.equal(linux.browser,'firefox');
 assert.equal(mac.family,'Apple');
 assert.equal(mac.form,'desktop');
 assert.equal(mac.browser,'safari');
 assert.equal(operaAndroid.browser,'other');
});

test('Android Fold Chrome uses signed Android companion and NEVER desktop extensions',()=>{
 assert.equal(foldChrome.family,'Android');
 assert.equal(foldChrome.form,'phone');
 assert.equal(foldChrome.browser,'chrome');
 assert.equal(S.browserRoute(foldChrome,'chrome'),'ANDROID_CHROME_NO_DESKTOP_EXTENSION');
 const p=S.planSetup(foldChrome,['chrome','edge','firefox'],catalog);
 assert.equal(p.actions[0].channel,'android-companion');
 assert.equal(p.actions[0].state,'SIGNED_COMPANION_NOT_AVAILABLE');
 assert.deepEqual([...p.actions.slice(1).map(x=>x.kind)],[
  'browser-compatibility','browser-compatibility','browser-compatibility'
 ]);
 assert.equal(p.actions[1].state,'ANDROID_CHROME_NO_DESKTOP_EXTENSION');
 assert.equal(p.actions[2].state,'ANDROID_EDGE_NATIVE_BRIDGE_NOT_QUALIFIED');
 assert.equal(p.actions[3].state,'FIREFOX_ANDROID_NATIVE_MESSAGING_NOT_AVAILABLE');
 assert.equal(p.connection,'NOT_ASSERTED');
});
test('Android Edge and Firefox are recognized but original native host remains unqualified',()=>{
 assert.equal(edgeAndroid.browser,'edge');
 assert.equal(firefoxAndroid.browser,'firefox');
 assert.equal(S.browserRoute(edgeAndroid,'edge'),'ANDROID_EDGE_NATIVE_BRIDGE_NOT_QUALIFIED');
 assert.equal(S.browserRoute(firefoxAndroid,'firefox'),'FIREFOX_ANDROID_NATIVE_MESSAGING_NOT_AVAILABLE');
});
test('iPhone and iPad Safari require signed Apple containing app; iOS Chrome is not a desktop extension host',()=>{
 assert.equal(iosSafari.family,'Apple');
 assert.equal(iosSafari.form,'phone');
 assert.equal(ipadOS.form,'tablet');
 assert.equal(S.browserRoute(iosSafari,'safari'),'SAFARI_CONTAINING_APP_REQUIRED');
 assert.equal(S.browserRoute(ipadOS,'chrome'),'IOS_BROWSER_NATIVE_BRIDGE_NOT_QUALIFIED');
 assert.equal(S.browserRoute(mac,'safari'),'SAFARI_CONTAINING_APP_REQUIRED');
 const p=S.planSetup(iosSafari,['safari','chrome'],catalog);
 assert.equal(p.actions[0].channel,'apple-companion');
 assert.equal(p.actions[1].state,'SAFARI_CONTAINING_APP_REQUIRED');
 assert.equal(p.actions[2].state,'IOS_BROWSER_NATIVE_BRIDGE_NOT_QUALIFIED');
});
test('Windows and Linux select their original signed native companion before any chosen browser',()=>{
 const p=S.planSetup(windows,['chrome','edge','firefox'],catalog);
 assert.equal(p.actions[0].channel,'windows-companion');
 assert.equal(p.actions[0].kind,'native-companion');
 assert.deepEqual([...p.actions.slice(1).map(x=>x.channel)],['chrome','edge','firefox']);
 assert.equal(p.actions[1].state,'BROWSER_STORE_NOT_PUBLISHED');
 assert.equal(p.originalRuntime,'REQUIRED');
 assert.equal(p.nativeEnrollment,'REQUIRED_PER_DEVICE');
 assert.equal(p.automaticInstallation,'NOT_PERMITTED_BY_BROWSER_STORE');
 assert.equal(S.planSetup(linux,['firefox'],catalog).actions[0].channel,'linux-companion');
});
test('deny unqualified browser selections and missing release catalog',()=>{
 assert.throws(()=>S.planSetup(windows,['chrome','chrome'],catalog),/SELECTION_INVALID/);
 assert.throws(()=>S.planSetup(windows,['safari'],catalog),/SELECTION_INVALID/);
 assert.throws(()=>S.planSetup(foldChrome,['safari'],catalog),/SELECTION_INVALID/);
 assert.throws(()=>S.planSetup(windows,['fake-browser'],catalog),/SELECTION_INVALID/);
 assert.throws(()=>S.planSetup(windows,['chrome'],{channels:[]}),/CATALOG_UNVERIFIED/);
 const unknown=ua('anonymous-custom-agent');
 assert.equal(unknown.family,'Unknown');
 assert.deepEqual([...S.allowedChoices(unknown)],[]);
});
test('browser hints never issue Creator privilege, tool grants or device connected claims',()=>{
 for(const env of [foldChrome,iosSafari,windows,edgeWindows,linux,mac]){
  const p=S.planSetup(env,S.allowedChoices(env).slice(0,2),catalog);
  assert.equal(env.hintOnly,true);
  assert.equal(p.connection,'NOT_ASSERTED');
  assert.equal(p.actions[0].kind,'native-companion');
  assert.ok(!JSON.stringify(p).includes('ZITADEL_OWNER_SUB_VERIFIED'));
  assert.ok(!JSON.stringify(p).includes('TRUSTED_REGISTRY_READ'));
 }
});
test('Android setup can be native only without inventing an extension',()=>{
 const p=S.planSetup(foldChrome,[],catalog);
 assert.equal(p.actions.length,1);
 assert.equal(p.actions[0].channel,'android-companion');
});
