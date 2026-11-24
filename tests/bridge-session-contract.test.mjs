/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BRIDGE.SESSION.TEST
TAG: LEEWAY.W01.BRIDGE_SNAPSHOT_GATE.NEGATIVE_TESTS.V1
5WH:
WHAT = Test the exact native Bridge owner/readback contract with synthetic transport fixtures.
WHY = Deny browser-only courier success, unbound registration, stale readbacks and public Tablet substitution.
WHO = Creator-authorized W01 source test contributors; not physical Device Bridge execution or Veritas.
WHERE = tests/bridge-session-contract.test.mjs in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Load real extension contract in VM, test untrusted JSON with success and negative fixtures.
LICENSE = Existing repository terms; all device identities and grants in this file are synthetic.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('../extension/bridge-session-contract.js',import.meta.url),'utf8');
const sandbox={URL,Date};sandbox.globalThis=sandbox;
vm.runInNewContext(code,sandbox,{filename:'bridge-session-contract.js'});
const C=sandbox.LeeWayBridgeSessionContract;
const req='12345678-1234-4444-8888-123456789abc';
const session='enrolled-native-session-001';
const now=Date.now();
function snapshot(){
 return {
  type:'leeway.extension.bridge-snapshot',
  version:3,requestId:req,sessionId:session,
  authority:'LEEWAY_DEVICE_BRIDGE_CANONICAL_PROTOCOL',
  ownerBinding:'ZITADEL_OWNER_SUB_VERIFIED',
  runtimeStatus:'AVAILABLE',
  runtimeAuthentication:'OIDC_ACCESS_TOKEN_VERIFIED',
  registrationState:'TRUSTED_REGISTRY_READ',
  observedAt:new Date(now).toISOString(),
  capabilities:['device.bridge.discovery.read','tablet.session.open'],
  devices:[{id:'owner-device-01',platform:'windows',
   reachability:'REACHABLE',registrationState:'TRUSTED_REGISTRY_READ'}],
  tablet:{state:'OWNER_SESSION_AUTHORIZED',
   display:'LEEWAY_AGENT_VIRTUAL_TABLET',
   url:'https://owner-workspace.example.com/agent-tablet/'}
 };
}
const validate=m=>C.verifySnapshot(m,{requestId:req,sessionId:session,now});

test('only correlated native owner/readback snapshot authorizes Tablet display (not execution)',()=>{
 const result=validate(snapshot());
 assert.equal(result.state,'NATIVE_BRIDGE_RUNTIME_SNAPSHOT_REPORTED');
 assert.equal(result.devices.length,1);
 assert.equal(result.tabletUrl,'https://owner-workspace.example.com/agent-tablet/');
 assert.equal(result.execution,'NOT_ASSERTED');
 assert.equal(result.independentVeritas,'NOT_ASSERTED');
});

test('native hello-ack or public health never qualifies a Bridge snapshot',()=>{
 assert.throws(()=>validate({type:'leeway.extension.hello-ack',authenticated:true}),/CORRELATION_INVALID/);
 assert.throws(()=>validate({service:'leeway-managed-device-mcp',status:'RUNNING'}),/CORRELATION_INVALID/);
});

test('wrong request/session/version and missing owner/Zitadel/registry fail closed',()=>{
 for(const change of [
  {requestId:'forged-request'}, {sessionId:'other-native-session'},
  {version:2}, {ownerBinding:'UNKNOWN'},
  {runtimeAuthentication:'TOKEN_NOT_VERIFIED'}, {runtimeStatus:'RUNNING'},
  {registrationState:'REGISTRATION_AUTHORITY_UNBOUND'},
  {authority:'SECONDARY_BRIDGE'}
 ]){
  assert.throws(()=>validate({...snapshot(),...change}),/LEEWAY_BRIDGE_/);
 }
});

test('registered but unreachable, absent, duplicated or spoofed device is not ready',()=>{
 const empty=snapshot();empty.devices=[];
 assert.throws(()=>validate(empty),/DEVICE_REGISTRY_EMPTY/);
 const offline=snapshot();offline.devices[0].reachability='NOT_PROBED';
 assert.throws(()=>validate(offline),/NO_REACHABLE_ENROLLED_DEVICE/);
 const duplicate=snapshot();duplicate.devices.push({...duplicate.devices[0]});
 assert.throws(()=>validate(duplicate),/DEVICE_RECORD_INVALID/);
 const unknown=snapshot();unknown.devices[0].platform='unqualified';
 assert.throws(()=>validate(unknown),/DEVICE_RECORD_INVALID/);
});

test('reject stale, future, tampered or missing native observation timestamps',()=>{
 for(const timestamp of [
  new Date(now-91000).toISOString(),new Date(now+11000).toISOString(),
  'no-time',''
 ]){
  const m=snapshot();m.observedAt=timestamp;
  assert.throws(()=>validate(m),/STALE_RUNTIME_OBSERVATION/);
 }
});

test('never launch public Tablet preview, local PC or URLs carrying browser credentials',()=>{
 for(const url of [
  'https://4citeb4u.github.io/Leeway-Agent-Virtual-Tablet/',
  'http://localhost:3200/',
  'https://192.168.1.17/',
  'https://127.0.0.1/',
  'javascript:alert(1)',
  'https://owner:secret@example.com/tablet/',
  'https://example.com/tablet/?token=secret',
  'https://example.com/tablet/#access_token=secret'
 ]){
  const m=snapshot();m.tablet.url=url;
  assert.throws(()=>validate(m),/LEEWAY_BRIDGE_/);
 }
});

test('ungranted host capability and non-Tablet launch do not establish the session',()=>{
 const a=snapshot();a.capabilities=['page.excerpt.submit'];
 assert.throws(()=>validate(a),/CAPABILITY_UNBOUND/);
 const b=snapshot();b.tablet.display='PUBLIC_WEBSITE';
 assert.throws(()=>validate(b),/TABLET_SESSION_UNBOUND/);
});
