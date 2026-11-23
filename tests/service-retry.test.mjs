/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM.TEST
TAG: LEEWAY.OPERATING_SYSTEM.FREE_WAKEUP_NEGATIVE_TESTS.V1
5WH:
WHAT = Exercise the exact shipped public health retry with transient wakeups and irreversible authorization denials.
WHY = Prevent perpetual retries, hidden traffic or auth-bypass during free-host cold starts.
WHO = Creator-authorized outside GPT-6 source contributor; not independent Veritas.
WHERE = tests/service-retry.test.mjs in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Actual extension JS in isolated VM; bounded in-memory read fixtures and zero external calls.
LICENSE = Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../extension/service-retry.js',import.meta.url),'utf8');
const sandbox={};sandbox.globalThis=sandbox;vm.runInNewContext(source,sandbox);
const {retryPublicHealth,retryable}=sandbox.LeeWayServiceRetry;
const error=(message,name='Error')=>Object.assign(new Error(message),{name});
test('three-attempt transient Free health warm-up reaches a genuine public body',async()=>{
 let calls=0;const notices=[];const slept=[];
 const result=await retryPublicHealth(async()=>{
  calls++;
  if(calls<3)throw error(calls===1?'PUBLIC_ENDPOINT_HTTP_503':'network timed out','TimeoutError');
  return {service:'leeway-managed-device-mcp',status:'RUNNING'};
 },{onRetry:notice=>notices.push(notice),delay:async ms=>slept.push(ms)});
 assert.equal(result.status,'RUNNING');
 assert.equal(calls,3);
 assert.deepEqual(slept,[1500,3000]);
 assert.deepEqual(Array.from(notices,x=>x.nextAttempt),[2,3]);
});
test('retry budget stops at three without constant polling',async()=>{
 let attempts=0;
 await assert.rejects(retryPublicHealth(async()=>{
   attempts++;throw error('PUBLIC_ENDPOINT_HTTP_502');
 },{delay:async()=>{}}),/PUBLIC_ENDPOINT_HTTP_502/);
 assert.equal(attempts,3);
});
test('denials and malformed health bodies fail immediately',async()=>{
 for(const reason of ['PUBLIC_ENDPOINT_HTTP_401','PUBLIC_ENDPOINT_HTTP_403','PUBLIC_ENDPOINT_HTTP_429','MANAGED_BRIDGE_CONTRACT_UNVERIFIED','JWT_OWNER_MISMATCH']){
  let called=0;
  await assert.rejects(retryPublicHealth(async()=>{called++;throw error(reason)},
    {delay:async()=>{}}),new RegExp(reason));
  assert.equal(called,1,reason);
 }
});
test('retry classification is restricted to transient network and 502/503/504',()=>{
 assert.equal(retryable(error('PUBLIC_ENDPOINT_HTTP_503')),true);
 assert.equal(retryable(error('PUBLIC_ENDPOINT_HTTP_504')),true);
 assert.equal(retryable(error('fetch failed','TypeError')),true);
 assert.equal(retryable(error('expired','AbortError')),true);
 assert.equal(retryable(error('PUBLIC_ENDPOINT_HTTP_401')),false);
 assert.equal(retryable(error('PRIVATE_TOKEN_REQUIRED')),false);
});
test('malformed retry input never triggers network access',async()=>{
 assert.rejects(retryPublicHealth(null),/HEALTH_READ_REQUIRED/);
 assert.rejects(retryPublicHealth(()=>({}),{maxAttempts:1000}),/HEALTH_RETRY_BUDGET_INVALID/);
});
