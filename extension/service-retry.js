/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM
TAG: LEEWAY.OPERATING_SYSTEM.BOUNDED_FREE_WAKEUP.V1
5WH:
WHAT = Retry only an explicitly user-requested public cloud-health read when a free service is cold or transiently unavailable.
WHY = Handle Render Free cold-start latency without creating keepalive billing, a second host or unattended background traffic.
WHO = Creator-authorized outside GPT-6 support contributor; no independent authority or Veritas admission.
WHERE = extension/service-retry.js in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Up to three bounded read attempts, only transient status/network timeouts, explicit status callback and fail-closed denial.
LICENSE = Existing repository terms apply; no new license asserted.
*/
(function(scope){
'use strict';
function retryable(error){
 const code=String(error?.message||'');
 if(/^PUBLIC_ENDPOINT_HTTP_(502|503|504)$/.test(code))return true;
 return error?.name==='TypeError'||error?.name==='TimeoutError'||error?.name==='AbortError';
}
async function retryPublicHealth(read,{onRetry=()=>{},delay=ms=>new Promise(done=>setTimeout(done,ms)),maxAttempts=3}={}){
 if(typeof read!=='function')throw Error('HEALTH_READ_REQUIRED');
 if(!Number.isInteger(maxAttempts)||maxAttempts<1||maxAttempts>3)throw Error('HEALTH_RETRY_BUDGET_INVALID');
 let lastError;
 for(let attempt=1;attempt<=maxAttempts;attempt++){
  try{return await read()}catch(error){
   lastError=error;
   if(attempt===maxAttempts||!retryable(error))throw error;
   try{onRetry({attempt,nextAttempt:attempt+1,reason:'TRANSIENT_SERVICE_WAKEUP'})}catch{ /* UI callback has no authority. */ }
   await delay(attempt*1500);
  }
 }
 throw lastError||Error('PUBLIC_HEALTH_NOT_VERIFIED');
}
scope.LeeWayServiceRetry=Object.freeze({retryPublicHealth,retryable});
})(globalThis);
