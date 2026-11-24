/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM
TAG: LEEWAY.W01.AUTHENTICATED_BRIDGE_FIRST_UI.V1
5WH:
WHAT = Display the real owner-bound Device Bridge snapshot and only its authorized Tablet entry.
WHY = Remove preview-only shortcuts, manually typed host URLs and simulated enrollment from the extension.
WHO = Creator-authorized LeeWay outside contributor; native Bridge and Runtime still own all device operations.
WHERE = extension/operating-system.js in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Ask the installed native host for correlated Runtime/registry/Tablet readback; fail closed if absent.
LICENSE = Existing repository terms; no new rights conferred.
*/
(function(scope){
'use strict';
const api=scope.browser||scope.chrome;
const promiseApi=Boolean(scope.browser);
if(!api?.runtime||!scope.document)return;
const $=id=>scope.document.getElementById(id);
let snapshot=null;
let busy=false;
function announce(value){$('message').textContent=String(value).slice(0,200)}
function clear(reason){
 snapshot=null;
 $('openTablet').disabled=true;
 $('openBusiness').disabled=true;
 $('instanceLabel').textContent='Not connected';
 $('instanceState').textContent='CONNECTION REQUIRED';
 $('bridgeStatus').textContent=reason||'NOT PROBED';
 $('nativeStatus').textContent=reason||'Native Device Bridge enrollment not verified';
 $('deviceList').replaceChildren();
 const p=document.createElement('p');p.className='muted';
 p.textContent='No verified enrolled devices shown.';
 $('deviceList').append(p);
}
function nativeMessage(type){
 if(!api?.runtime?.sendMessage)return Promise.reject(Error('EXTENSION_NATIVE_MESSAGING_UNAVAILABLE'));
 if(promiseApi)return api.runtime.sendMessage({type});
 return new Promise((resolve,reject)=>{
  api.runtime.sendMessage({type},result=>{
   const error=api.runtime?.lastError;
   if(error)reject(Error(error.message||'EXTENSION_BACKGROUND_UNAVAILABLE'));
   else resolve(result);
  });
 });
}
function showDevices(devices){
 const list=$('deviceList');list.replaceChildren();
 for(const device of devices){
  const item=document.createElement('div');item.className='adapter';
  const name=document.createElement('strong');name.textContent=device.id;
  const state=document.createElement('small');
  state.textContent=device.platform.toUpperCase()+' · '+device.reachability;
  item.append(name,state);list.append(item);
 }
}
async function connectBridge(){
 if(busy)return;
 busy=true;
 $('connectBridge').disabled=true;
 clear('Native host admission and physical Device Bridge readback pending');
 $('instanceState').textContent='VERIFYING';
 try{
  // An accepted browser port/hello is NOT a Bridge. Only the separate
  // correlated owner-bound Runtime/registry readback may open the Tablet.
  const result=await nativeMessage('LEEWAY_BRIDGE_SNAPSHOT');
  if(!result?.ok||result?.result?.state!=='NATIVE_BRIDGE_RUNTIME_SNAPSHOT_REPORTED')
   throw Error(result?.error||'BRIDGE_RUNTIME_READBACK_NOT_QUALIFIED');
  const candidate=result.result;
  if(!Array.isArray(candidate.devices)||candidate.devices.length<1||
     typeof candidate.tabletUrl!=='string'||candidate.execution!=='NOT_ASSERTED')
     throw Error('BRIDGE_SESSION_RESPONSE_INVALID');
  snapshot=candidate;
  $('instanceLabel').textContent='Original Device Bridge';
  $('instanceState').textContent='RUNTIME OBSERVED';
  $('nativeStatus').textContent='Native host reported a current enrolled-device Runtime snapshot';
  $('bridgeStatus').textContent='Authenticated host-reported snapshot · '+candidate.devices.length+' devices; execution not asserted';
  showDevices(candidate.devices);
  $('openTablet').disabled=false;
  $('openBusiness').disabled=false;
  announce('The Tablet can open from this host-reported owner session. Native device execution still requires C3 and its own receipts.');
 }catch(error){
  clear('BLOCKED · '+String(error?.message||error).slice(0,135));
  announce('The existing Device Bridge installer/host and authenticated enrollment must be repaired before release.');
 }finally{
  busy=false;
  $('connectBridge').disabled=false;
 }
}
async function openTablet(view=null){
 if(!snapshot||$('openTablet').disabled)return;
 // An old browser session is not a current native owner/device admission.
 // Revalidate against the original host and physical device on every launch.
 await connectBridge();
 if(!snapshot||$('openTablet').disabled)return;
 const url=new URL(snapshot.tabletUrl);
 if(view==='erpCrm'){
   // This selects an existing Tablet app only. It is not a Creator claim.
   // Original Runtime must separately authorize private customer reads.
   url.searchParams.set('view','erpCrm');
 }
 // Opening the real owner-authorized Tablet is a display action only;
 // the Tablet itself must independently authenticate before any private data.
 try{
  const opened=api.tabs?.create?.({url:url.toString(),active:true});
  if(!opened)throw Error('BROWSER_TAB_API_UNAVAILABLE');
  if(typeof opened.catch==='function')opened.catch(()=>announce('Tablet launch denied by browser'));
 }catch{announce('Authenticated Tablet launch unavailable in this browser')}
}
async function disconnect(){
 try{await nativeMessage('LEEWAY_DISCONNECT')}catch{/* Always clear UI state. */}
 clear('DISCONNECTED');
 announce('Device Bridge browser session closed. No native enrollment or owner data was deleted.');
}
$('connectBridge').addEventListener('click',()=>void connectBridge());
$('openTablet').addEventListener('click',()=>void openTablet());
$('openBusiness').addEventListener('click',()=>void openTablet('erpCrm'));
$('disconnect').addEventListener('click',()=>void disconnect());
// One session probe when the owner opens the installed extension; no background
// polling, screen scraping, URL-field setup or automatic native command dispatch.
void connectBridge();
})(globalThis);
