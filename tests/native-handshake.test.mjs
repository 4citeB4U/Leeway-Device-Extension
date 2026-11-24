/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.NATIVE_HANDSHAKE.TEST
TAG: LEEWAY.W01.UNIVERSAL_EXTENSION.NATIVE_HANDSHAKE.NEGATIVE.V1
5WH:
WHAT = Exercise actual browser background code with bounded fake native ports and correlated messages.
WHY = Reject stale/unsolicited acknowledgments, unauthorized origins, concurrent connection races and false receipts.
WHO = Creator-authorized LeeWay W01 source contributor; no production identity or native device authority.
WHERE = tests/native-handshake.test.mjs.
WHEN = 2026-11-19.
HOW = Execute the checked-out browser modules in isolated Node VM contexts; no hardware access.
LICENSE = Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto, randomUUID } from 'node:crypto';
import vm from 'node:vm';

const load = file => readFileSync(new URL('../extension/' + file, import.meta.url), 'utf8');
function setup(options = {}) {
  const ports = [];
  const runtimeListeners = [];
  const actionListeners = [];
  const scripting = [];
  let disconnects = 0;
  const runtime = {
    id: 'test-extension-id',
    getURL(path){return 'chrome-extension://test-extension-id/'+path;},
    onMessage: {addListener(fn) {runtimeListeners.push(fn);}},
    connectNative(name) {
      if (options.failConnect) throw new Error('host missing');
      const messages = [], gone = [];
      const port = {
        name, sent: [],
        onMessage: {addListener(fn) {messages.push(fn);}},
        onDisconnect: {addListener(fn) {gone.push(fn);}},
        postMessage(payload) {
          if (options.failSend) throw new Error('write failed');
          this.sent.push(payload);
        },
        disconnect() {disconnects++;},
        deliver(payload) {messages.forEach(fn => fn(payload));},
        close() {gone.forEach(fn => fn());}
      };
      ports.push(port);
      return port;
    }
  };
  const chrome = {
    runtime,
    action: {onClicked: {addListener(fn) {actionListeners.push(fn);}}},
    scripting: {executeScript(request, cb) {scripting.push(request); cb?.();}}
  };
  const scope = {chrome, crypto: {randomUUID}, URL, setTimeout, clearTimeout};
  scope.globalThis = scope;
  vm.runInNewContext(load('browser-polyfill.js'), scope, {filename:'browser-polyfill.js'});
  vm.runInNewContext(load('bridge-session-contract.js'), scope, {filename:'bridge-session-contract.js'});
  vm.runInNewContext(load('background.js'), scope, {filename:'background.js'});
  async function request(type, payload = undefined, origin = 'https://example.test/page', id = runtime.id) {
    let response;
    const yes = runtimeListeners[0]({type,payload},{id,tab:{url:origin}},data=>{response=data;});
    if (!yes) return null;
    for (let i=0; i<6 && response===undefined; i++) await new Promise(resolve => setImmediate(resolve));
    if (response === undefined) throw new Error('RESPONSE_NOT_SETTLED');
    return response;
  }
  function schedule(type, payload = undefined) {
    return request(type,payload);
  }
  async function panelRequest(type,payload){
    let response;
    const yes=runtimeListeners[0]({type,payload},
      {id:runtime.id,url:runtime.getURL('operating-system.html')},data=>{response=data;});
    if(!yes)return null;
    for(let i=0;i<6&&response===undefined;i++)await new Promise(resolve=>setImmediate(resolve));
    if(response===undefined)throw Error('PANEL_RESPONSE_NOT_SETTLED');
    return response;
  }
  return {ports,request,schedule,panelRequest, actionListeners,scripting, getDisconnects:()=>disconnects};
}

const ownerAck = (port, changes={})=>({
  type:'leeway.extension.hello-ack',
  version:3,helloId:port.sent[0].helloId,
  authenticated:true,sessionId:'qualified-session-00001',
  capabilities:['device.bridge.discovery.read','tablet.session.open','page.excerpt.submit'],...changes
});
async function openSession(f) {
  const connecting=f.schedule('LEEWAY_CONNECT');
  await new Promise(resolve=>setImmediate(resolve));
  const p=f.ports[0];
  p.deliver(ownerAck(p));
  const result=await connecting;
  assert.equal(result.ok,true);
  assert.equal(result.result.connected,true);
  return p;
}

test('toolbar activation injects only after deliberate click on allowed URL',()=>{
  const f=setup();
  f.actionListeners[0]({id:7,url:'https://example.test'});
  f.actionListeners[0]({id:8,url:'chrome://extensions'});
  assert.equal(f.scripting.length,1);
  assert.equal(f.scripting[0].target.tabId,7);
  assert.equal(f.scripting[0].files[2],'floating-tablet.js');
});
test('matching challenge allows only an acknowledged native session',async()=>{
  const f=setup();await openSession(f);
  const status=await f.request('LEEWAY_STATUS');
  assert.equal(status.result.connected,true);
});
test('wrong challenge rejects native handshake',async()=>{
  const f=setup();const wait=f.schedule('LEEWAY_CONNECT');
  await new Promise(resolve=>setImmediate(resolve));
  f.ports[0].deliver(ownerAck(f.ports[0],{helloId:'old-hello'}));
  const result=await wait;
  assert.equal(result.ok,false);assert.match(result.error,/NATIVE_AUTHENTICATION_NOT_QUALIFIED/);
});
test('native host self-assertion without authenticated grant is rejected',async()=>{
  const f=setup();const wait=f.schedule('LEEWAY_CONNECT');
  await new Promise(resolve=>setImmediate(resolve));
  f.ports[0].deliver(ownerAck(f.ports[0],{authenticated:false}));
  assert.equal((await wait).ok,false);
});
test('two concurrent connects use one port and the same native challenge',async()=>{
  const f=setup();const first=f.schedule('LEEWAY_CONNECT'), second=f.schedule('LEEWAY_CONNECT');
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(f.ports.length,1);
  f.ports[0].deliver(ownerAck(f.ports[0]));
  assert.equal((await first).ok,true);assert.equal((await second).ok,true);
});
test('selected text cannot be submitted without a qualified host',async()=>{
  const f=setup();
  const result=await f.request('LEEWAY_SHARE_SELECTION',{href:'https://example.test/p',title:'Title',selection:'text'});
  assert.match(result.error,/NATIVE_HOST_NOT_AUTHENTICATED/);
});
test('native receipt acknowledgement is not Veritas proof',async()=>{
  const f=setup();const p=await openSession(f);
  const awaitReceipt=f.schedule('LEEWAY_SHARE_SELECTION',{href:'https://example.test/p',title:'Title',selection:'selected'});
  await new Promise(resolve=>setImmediate(resolve));
  const excerpt=p.sent[1];
  assert.equal(excerpt.excerpt.selection,'selected');
  p.deliver({type:'leeway.extension.receipt',requestId:excerpt.requestId,sessionId:excerpt.sessionId,accepted:true});
  const result=await awaitReceipt;
  assert.equal(result.result.authority,'NATIVE_HOST_ACK_NOT_VERITAS');
});
test('wrong native session receipt is ignored, then actual session receipt denies',async()=>{
  const f=setup();const p=await openSession(f);
  const wait=f.schedule('LEEWAY_SHARE_SELECTION',{href:'https://example.test/p',title:'T',selection:'x'});
  await new Promise(resolve=>setImmediate(resolve));
  const excerpt=p.sent[1];
  p.deliver({type:'leeway.extension.receipt',requestId:excerpt.requestId,sessionId:'wrong-session',accepted:true});
  p.deliver({type:'leeway.extension.receipt',requestId:excerpt.requestId,sessionId:excerpt.sessionId,accepted:false});
  assert.match((await wait).error,/NATIVE_REQUEST_REJECTED/);
});
test('native disconnect rejects pending operations and clears state',async()=>{
  const f=setup();const p=await openSession(f);
  const wait=f.schedule('LEEWAY_SHARE_SELECTION',{href:'https://example.test/p',title:'T',selection:'x'});
  await new Promise(resolve=>setImmediate(resolve));
  p.close();
  assert.match((await wait).error,/NATIVE_HOST_DISCONNECTED/);
  assert.equal((await f.request('LEEWAY_STATUS')).result.connected,false);
});
test('a sender from another extension cannot call background actions',async()=>{
  const f=setup();const result=await f.request('LEEWAY_CONNECT',undefined,'https://example.test','another-extension');
  assert.equal(result,null);assert.equal(f.ports.length,0);
});
test('page selection from a different origin is denied',async()=>{
  const f=setup();
  const result=await f.request('LEEWAY_SHARE_SELECTION',{href:'https://other.test/p',title:'T',selection:'x'});
  assert.equal(result,null);
});
test('handshake transport error fails closed and does not produce a session',async()=>{
  const f=setup({failSend:true});const result=await f.request('LEEWAY_CONNECT');
  assert.equal(result.ok,false);
  assert.match(result.error,/NATIVE_HELLO_SEND_FAILED/);
  assert.equal((await f.request('LEEWAY_STATUS')).result.connected,false);
});
test('unknown native host fails without claiming connected',async()=>{
  const f=setup({failConnect:true});const result=await f.request('LEEWAY_CONNECT');
  assert.match(result.error,/NATIVE_HOST_UNAVAILABLE/);
});

const realBridgeReply=(request,overrides={})=>({
 type:'leeway.extension.bridge-snapshot',
 version:3,requestId:request.requestId,sessionId:request.sessionId,
 authority:'LEEWAY_DEVICE_BRIDGE_CANONICAL_PROTOCOL',
 ownerBinding:'ZITADEL_OWNER_SUB_VERIFIED',
 runtimeStatus:'AVAILABLE',runtimeAuthentication:'OIDC_ACCESS_TOKEN_VERIFIED',
 registrationState:'TRUSTED_REGISTRY_READ',
 observedAt:new Date().toISOString(),
 capabilities:['device.bridge.discovery.read','tablet.session.open'],
 devices:[{id:'owner-device-01',platform:'windows',reachability:'REACHABLE',registrationState:'TRUSTED_REGISTRY_READ'}],
 tablet:{state:'OWNER_SESSION_AUTHORIZED',display:'LEEWAY_AGENT_VIRTUAL_TABLET',
   url:'https://owner-workspace.example.com/tablet/'},
 ...overrides
});

test('native courier hello alone cannot qualify original Device Bridge or open Tablet',async()=>{
 const f=setup();await openSession(f);
 const state=await f.panelRequest('LEEWAY_STATUS');
 assert.equal(state.result.connected,true);
 assert.equal(state.result.bridgeQualified,false);
 assert.equal(state.result.bridgeState,'BRIDGE_READBACK_REQUIRED');
});

test('valid correlated owner-bound Bridge readback is a display session, never execution proof',async()=>{
 const f=setup();const port=await openSession(f);
 const reading=f.panelRequest('LEEWAY_BRIDGE_SNAPSHOT');
 await new Promise(resolve=>setImmediate(resolve));
 const req=port.sent[1];
 assert.equal(req.type,'leeway.extension.bridge-snapshot-request');
 assert.deepEqual([...req.requestedCapabilities],['device.bridge.discovery.read','tablet.session.open']);
 port.deliver(realBridgeReply(req));
 const result=await reading;
 assert.equal(result.ok,true);
 assert.equal(result.result.state,'NATIVE_BRIDGE_RUNTIME_SNAPSHOT_REPORTED');
 assert.equal(result.result.execution,'NOT_ASSERTED');
 assert.equal((await f.panelRequest('LEEWAY_STATUS')).result.bridgeQualified,true);
});

test('unbound device registry is denied even with a forged successful native courier session',async()=>{
 const f=setup();const port=await openSession(f);
 const reading=f.panelRequest('LEEWAY_BRIDGE_SNAPSHOT');
 await new Promise(resolve=>setImmediate(resolve));
 port.deliver(realBridgeReply(port.sent[1],{registrationState:'REGISTRATION_AUTHORITY_UNBOUND',devices:[]}));
 const result=await reading;
 assert.equal(result.ok,false);
 assert.match(result.error,/AUTHORITY_UNBOUND/);
 assert.equal((await f.panelRequest('LEEWAY_STATUS')).result.bridgeQualified,false);
});

test('page tab sender cannot request owner device registry or Tablet session URL',async()=>{
 const f=setup();
 const response=await f.request('LEEWAY_BRIDGE_SNAPSHOT');
 assert.equal(response,null);
 assert.equal(f.ports.length,0);
});

test('native disconnect clears previously qualified Bridge snapshot and rejects outstanding readback',async()=>{
 const f=setup();const port=await openSession(f);
 const first=f.panelRequest('LEEWAY_BRIDGE_SNAPSHOT');
 await new Promise(resolve=>setImmediate(resolve));
 port.deliver(realBridgeReply(port.sent[1]));
 assert.equal((await first).ok,true);
 const second=f.panelRequest('LEEWAY_BRIDGE_SNAPSHOT');
 await new Promise(resolve=>setImmediate(resolve));
 port.close();
 const failed=await second;
 assert.equal(failed.ok,false);
 assert.match(failed.error,/NATIVE_HOST_DISCONNECTED/);
 assert.equal((await f.panelRequest('LEEWAY_STATUS')).result.bridgeQualified,false);
});

test('page courier only or missing Tablet grant must NOT authenticate as the Device Bridge',async()=>{
 for (const caps of [['page.excerpt.submit'],['device.bridge.discovery.read']]) {
  const f=setup();const waiting=f.schedule('LEEWAY_CONNECT');
  await new Promise(resolve=>setImmediate(resolve));
  f.ports[0].deliver(ownerAck(f.ports[0],{capabilities:caps}));
  const result=await waiting;
  assert.equal(result.ok,false);
  assert.match(result.error,/NATIVE_AUTHENTICATION_NOT_QUALIFIED/);
 }
});
