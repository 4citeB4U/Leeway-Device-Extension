/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.DISTRIBUTION.TEST
TAG: LEEWAY.EXTENSION.SIX_CHANNEL_RELEASE_CATALOG_NEGATIVE.V1
5WH:
WHAT = Verify browser-store release directory is honest and fail-closed across six channels.
WHY = Prevent unapproved ZIPs, fabricated store listings and arbitrary URL injection into a global install page.
WHO = Creator-authorized outside extension source test contributor.
WHERE = tests/distribution-catalog.test.mjs.
WHEN = 2026-11-24.
HOW = Offline Node VM and synthetic DOM using actual GitHub release catalog source.
LICENSE = Existing repository terms.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../docs/',import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('release-catalog.json',root),'utf8'));
const source = readFileSync(new URL('install/install.js',root),'utf8');
const sandbox = { URL };
sandbox.globalThis=sandbox;
vm.runInNewContext(source,sandbox,{filename:'install.js'});
const D=sandbox.LeeWayDistribution;
const dup = () => structuredClone(catalog);
const channel = (id,status='PUBLISHED',storeUrl='https://chromewebstore.google.com/detail/leeway-bridge/abcdefghijklmnopabcdefghijklmnop') =>
 ({...dup().channels.find(x=>x.id===id),status,storeUrl});
class Node {
 constructor(tag='div'){this.tag=tag;this.children=[];this.textContent='';this.className='';this.href=null;this.rel=null;}
 replaceChildren(){this.children=[];}
 append(...children){this.children.push(...children);}
}
class Document {
 constructor(){this.elements={channels:new Node(),overall:new Node()};}
 getElementById(id){return this.elements[id];}
 createElement(tag){return new Node(tag);}
}

test('canonical source lists eight browser and native companion channels, all blocked until qualified',()=>{
 assert.equal(D.validateCatalog(catalog),true);
 assert.equal(catalog.channels.length,8);
 assert.deepEqual(catalog.channels.map(c=>c.id),[
  'chrome','edge','firefox','safari','android-companion','apple-companion','windows-companion','linux-companion'
 ]);
 assert.ok(catalog.channels.every(c=>c.storeUrl===null&&c.status!=='PUBLISHED'));
 assert.equal(catalog.status,'NOT_PUBLISHED');
 const doc = new Document();
 assert.equal(D.render(catalog,doc),true);
 assert.equal(doc.elements.channels.children.length,8);
 assert.equal(doc.elements.channels.children.flatMap(c=>c.children.filter(x=>x.tag==='a')).length,0);
 assert.match(doc.elements.overall.textContent,/No production browser or native companion channel published/);
});
test('trusted official store links require exact published status and expected provider hostname/path',()=>{
 const good=[
  ['chrome','https://chromewebstore.google.com/detail/leeway-bridge/abcdefghijklmnopabcdefghijklmnop'],
  ['edge','https://microsoftedge.microsoft.com/addons/detail/leeway-bridge/abcdefghijklmnopabcdefghijklmnop'],
  ['firefox','https://addons.mozilla.org/en-US/firefox/addon/leeway-bridge/'],
  ['safari','https://apps.apple.com/us/app/leeway-device-bridge/id123456789'],
  ['android-companion','https://play.google.com/store/apps/details?id=industries.leeway.devicebridge'],
  ['apple-companion','https://apps.apple.com/us/app/leeway-device-bridge/id123456789']
 ];
 for(const [id,url] of good) assert.equal(D.officialStoreUrl(channel(id,'PUBLISHED',url)),url,id);
 for(const [id,url] of good) assert.equal(D.officialStoreUrl(channel(id,'SOURCE_BUILT_NOT_LISTED',url)),null,id);
});
test('rejects false store URLs, unapproved domains, HTTP/local URLs and token fragments',()=>{
 const bad=[
  'https://evil.example.com/addons/detail/leeway',
  'http://chromewebstore.google.com/detail/leeway/id',
  'https://chromewebstore.google.com.evil.test/detail/leeway/id',
  'https://chromewebstore.google.com/detail/leeway/id?token=private',
  'https://chromewebstore.google.com/detail/leeway/id#secret',
  'https://user:secret@chromewebstore.google.com/detail/leeway/id',
  'https://127.0.0.1/install',
  'javascript:alert(1)',
  'https://chromewebstore.google.com/help'
 ];
 for(const url of bad) assert.equal(D.officialStoreUrl(channel('chrome','PUBLISHED',url)),null,url);
});
test('catalog cannot silently insert a ninth app or mark an unverified listing published',()=>{
 const extra=dup();extra.channels.push({id:'unapproved',status:'PUBLISHED',title:'Unknown',storeUrl:'https://x.test'});
 assert.equal(D.validateCatalog(extra),false);
 const forged=dup();forged.channels[0].status='PUBLISHED';forged.channels[0].storeUrl=null;
 assert.equal(D.validateCatalog(forged),false);
 const wrong=dup();wrong.channels[0].distribution='MALICIOUS_STORE';
 assert.equal(D.validateCatalog(wrong),false);
});
test('malformed catalog shows no links and no false install claims',()=>{
 const doc=new Document();
 assert.equal(D.render({schema:'unknown',channels:[]},doc),false);
 assert.equal(doc.elements.channels.children.flatMap(x=>x.children).length,0);
 assert.match(doc.elements.overall.textContent,/invalid/);
});
test('installation directory never directly packages Desktop/Creator private components',()=>{
 const html=readFileSync(new URL('install/index.html',root),'utf8');
 const setup=readFileSync(new URL('install/setup.js',root),'utf8');
 const source=readFileSync(new URL('install/setup-policy.js',root),'utf8');
 assert.match(html,/Agent Lee/);
 assert.match(html,/id="setupForm"/);
 assert.match(html,/id="browserChoices"/);
 assert.match(setup,/planSetup/);
 assert.match(source,/ANDROID_CHROME_NO_DESKTOP_EXTENSION/);
 assert.match(html,/Digital Brain/);
 assert.match(html,/separate passport/);
 assert.match(html,/Chrome on Android does not run desktop Chrome extensions/);
 assert.doesNotMatch(html,/href=".*-BLOCKED-NOT-INSTALLABLE\.zip"/);
 assert.doesNotMatch(html,/src="https:\/\//);
});
