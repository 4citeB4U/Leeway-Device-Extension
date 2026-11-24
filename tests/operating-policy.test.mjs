/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM.TEST
TAG: LEEWAY.OPERATING_SYSTEM.TENANT_BOUNDARY.NEGATIVE_TESTS.V1
5WH:
WHAT = Test the exact shipped Operating System policy for safe URLs, four OS labels and default-denied export.
WHY = Block unsafe tenant host injection, secret persistence and fake license grants in the universal extension.
WHO = Creator-authorized outside GPT-6 source contributor; not independent Veritas.
WHERE = tests/operating-policy.test.mjs in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Execute actual extension policy in a Node VM with positive and negative test cases.
LICENSE = Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const src=readFileSync(new URL('../extension/operating-policy.js',import.meta.url),'utf8');
const sandbox={URL};sandbox.globalThis=sandbox;
vm.runInNewContext(src,sandbox,{filename:'operating-policy.js'});
const P=sandbox.LeeWayOperatingPolicy;

test('portable four-OS catalog and cloud-first unbound launcher',()=>{
 assert.equal(P.version,'0.4.0');
 assert.deepEqual([...P.OS_FAMILIES],['Microsoft Windows','Linux','Apple','Android']);
 assert.equal(P.DEFAULTS.tabletUrl,null);
 assert.equal(P.DEFAULTS.bridgeHealthUrl,null);
 assert.equal(P.DEFAULTS.githubRepo,null);
 assert.equal(P.EDITION,'CUSTOMER_STARTER');
 const fresh=P.normalizeProfile({});
 assert.equal(fresh.githubRepo,null);
 assert.equal(fresh.tabletUrl,null);
 assert.equal(fresh.bridgeHealthUrl,null);
 assert.deepEqual(Array.from(P.APPS,x=>x.id),
  ['digital-brain','continuum','diagnostics','local-ai']);
 assert.equal(P.APPS.some(app=>app.id==='employee-export'),false);
});

test('employee export and unknown application cannot be granted by client-supplied profile',()=>{
 assert.equal(P.presentationGate('employee-export'),'NOT_IN_CUSTOMER_PACKAGE');
 assert.equal(P.presentationGate('unknown-creator-app'),'UNKNOWN_APP_DENIED');
 assert.equal(P.presentationGate('continuum'),'CUSTOMER_CORE_ENTRY');
 assert.equal(P.presentationGate('local-ai'),'LOCAL_PROVIDER_ADMISSION_REQUIRED');
 for(const id of ['model-hub','office','blackboard','app-foundry','employee-studio',
    'creator-console','machine-consciousness','veritas-admin','formula-admin'])
  assert.equal(P.presentationGate(id),'NOT_IN_CUSTOMER_PACKAGE',id);
 assert.throws(()=>P.normalizeProfile({instanceLabel:'Creator',token:'secret'}),/TENANT_PROFILE_FIELD_NOT_PUBLIC/);
 assert.throws(()=>P.normalizeProfile({instanceLabel:'Creator',ownerSub:'owner'}),/TENANT_PROFILE_FIELD_NOT_PUBLIC/);
 assert.throws(()=>P.normalizeProfile({instanceLabel:'Creator',licenseRole:'creator'}),/TENANT_PROFILE_FIELD_NOT_PUBLIC/);
 assert.equal(P.presentationGate('employee-export'),'NOT_IN_CUSTOMER_PACKAGE');
});

test('public tenant profile allows only deliberate HTTPS resources',()=>{
 const profile=P.normalizeProfile({instanceLabel:'Customer A',
   githubRepo:'https://github.com/customer-a/my-leeway',
   tabletUrl:'https://customer-a.github.io/my-tablet/',
   bridgeHealthUrl:'https://customer-a.onrender.com/healthz'});
 assert.equal(profile.instanceLabel,'Customer A');
 assert.equal(profile.githubRepo,'https://github.com/customer-a/my-leeway');
 assert.equal(profile.bridgeHealthUrl,'https://customer-a.onrender.com/healthz');
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',githubRepo:'https://github.com/a/b/tree/main'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',githubRepo:'https://github.com/a/b?token=q'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',tabletUrl:'javascript:alert(1)'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',tabletUrl:'http://localhost:3200'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',tabletUrl:'https://127.0.0.1/mcp'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',tabletUrl:'https://192.168.1.10/mcp'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',tabletUrl:'https://user:pass@example.com/'}));
 assert.throws(()=>P.normalizeProfile({instanceLabel:'x',bridgeHealthUrl:'https://customer.onrender.com/mcp'}),/BRIDGE_HEALTH_PATH_REQUIRED/);
});

test('GitHub API selection is public and pinned to exact owner/repository',()=>{
 const repo=P.parseGitHubRepo('https://github.com/Example/LeeWay');
 assert.equal(repo.api,'https://api.github.com/repos/Example/LeeWay');
 assert.throws(()=>P.parseGitHubRepo('https://github.com/Example/LeeWay/issues'));
 assert.throws(()=>P.parseGitHubRepo('https://evil.github.com/Example/LeeWay'));
 assert.throws(()=>P.parseGitHubRepo('https://github.com/Example/LeeWay#private'));
});

test('shortcuts are HTTPS-only and bounded; no automatic device permissions',()=>{
 const shortcuts=P.safeShortcuts([
 {name:'One',url:'https://example.com/a'},
 {name:'Dup',url:'https://example.com/a'},
 {name:'Local',url:'http://127.0.0.1:8080'},
 {name:'File',url:'file:///tmp/secret'},
 {name:'Creds',url:'https://username:secret@example.com'},
 {name:'Two',url:'https://example.com/b'}]);
 assert.equal(shortcuts.length,2);
 assert.deepEqual(Array.from(shortcuts,x=>x.name),['One','Two']);
 assert.equal(P.safeShortcuts(Array.from({length:50},(_,i)=>({name:'App '+i,url:'https://example.com/'+i}))).length,24);
});

test('two platform manifests have no ambient host grants or silent content injection',()=>{
 const chromium=JSON.parse(readFileSync(new URL('../extension/manifest.json',import.meta.url),'utf8'));
 const firefox=JSON.parse(readFileSync(new URL('../extension/manifest.firefox.json',import.meta.url),'utf8'));
 for(const m of [chromium,firefox]){
   assert.equal(m.name,'LeeWay Operating System');
   assert.equal(m.manifest_version,3);
   assert.equal(m.host_permissions,undefined);
   assert.equal(m.content_scripts,undefined);
   assert.deepEqual(m.optional_host_permissions,['https://*/*']);
   assert.match(m.content_security_policy.extension_pages,/script-src 'self'/);
   assert.match(m.content_security_policy.extension_pages,/frame-src https:\/\/4citeb4u\.github\.io/);
 }
 assert.equal(chromium.side_panel.default_path,'operating-system.html');
 assert.equal(chromium.background.service_worker,'background.js');
 assert.equal(firefox.sidebar_action.default_panel,'operating-system.html');
 assert.deepEqual(firefox.background.scripts,['browser-polyfill.js','background.js']);
 assert.equal(firefox.permissions.includes('sidePanel'),false);
});
