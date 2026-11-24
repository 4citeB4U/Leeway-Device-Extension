/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.BRIDGE.SESSION
TAG: LEEWAY.W01.CANONICAL_BRIDGE_SNAPSHOT_CONTRACT.V1
5WH:
WHAT = Validate a source-bound native Device Bridge Runtime readback before opening the Tablet.
WHY = A courier handshake, public health response or website URL cannot qualify a physical Bridge session.
WHO = Creator-authorized LeeWay outside support; the original Runtime, Zitadel and Device Bridge retain authority.
WHERE = extension/bridge-session-contract.js in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Require correlated native session, explicit owner/runtime/registry state, recent device readback and bounded Tablet URL.
LICENSE = Existing repository terms; no new rights claimed.
*/
(function(scope){
 'use strict';
 const SESSION_CAPABILITIES=Object.freeze(['device.bridge.discovery.read','tablet.session.open']);
 const VALID_PLATFORMS=new Set(['windows','linux','android','apple']);
 const validId=value=>typeof value==='string'&&/^[A-Za-z0-9._:-]{8,128}$/.test(value);
 const deny=reason=>{throw Error('LEEWAY_BRIDGE_'+reason)};
 function tabletUrl(value){
  if(typeof value!=='string'||value.length>2048)deny('TABLET_URL_INVALID');
  let url;
  try{url=new URL(value)}catch{deny('TABLET_URL_INVALID')}
  const host=url.hostname.toLowerCase();
  const isLocal=host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||
   host==='0.0.0.0'||host==='[::1]'||/^127\./.test(host)||
   /^(10|192\.168|169\.254)\./.test(host)||
   /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||
   !host.includes('.')||isLocal||host==='4citeb4u.github.io')deny('OWNER_TABLET_ORIGIN_REQUIRED');
  return url.toString();
 }
 function verifySnapshot(message, {requestId,sessionId,now=Date.now()}={}){
  if(!message||typeof message!=='object'||message.type!=='leeway.extension.bridge-snapshot'||
     message.version!==3||!validId(requestId)||message.requestId!==requestId||
     !validId(sessionId)||message.sessionId!==sessionId)deny('CORRELATION_INVALID');
  // These are host-reported results; the installed native host must independently
  // validate Zitadel tokens, trusted passports, grants, Runtime and device receipts.
  // The browser is NOT an issuer, Veritas verifier or direct Device Bridge executor.
  if(message.authority!=='LEEWAY_DEVICE_BRIDGE_CANONICAL_PROTOCOL'||
     message.ownerBinding!=='ZITADEL_OWNER_SUB_VERIFIED'||
     message.runtimeStatus!=='AVAILABLE'||
     message.runtimeAuthentication!=='OIDC_ACCESS_TOKEN_VERIFIED'||
     message.registrationState!=='TRUSTED_REGISTRY_READ')deny('AUTHORITY_UNBOUND');
  const at=Date.parse(message.observedAt);
  if(!Number.isFinite(at)||!Number.isFinite(now)||at>now+10000||now-at>90000)
    deny('STALE_RUNTIME_OBSERVATION');
  if(!Array.isArray(message.capabilities)||
     SESSION_CAPABILITIES.some(item=>!message.capabilities.includes(item))||
     message.capabilities.length>32||
     message.capabilities.some(item=>typeof item!=='string'||item.length>128))
    deny('CAPABILITY_UNBOUND');
  if(!Array.isArray(message.devices)||message.devices.length<1||message.devices.length>32)
    deny('DEVICE_REGISTRY_EMPTY');
  const seen=new Set();
  const devices=message.devices.map(device=>{
   if(!device||!validId(device.id)||seen.has(device.id)||
      !VALID_PLATFORMS.has(device.platform)||
      !['REACHABLE','OFFLINE','NOT_PROBED'].includes(device.reachability)||
      device.registrationState!=='TRUSTED_REGISTRY_READ')
      deny('DEVICE_RECORD_INVALID');
   seen.add(device.id);
   return Object.freeze({id:device.id,platform:device.platform,reachability:device.reachability});
  });
  if(!devices.some(device=>device.reachability==='REACHABLE'))deny('NO_REACHABLE_ENROLLED_DEVICE');
  if(!message.tablet||message.tablet.state!=='OWNER_SESSION_AUTHORIZED'||
     message.tablet.display!=='LEEWAY_AGENT_VIRTUAL_TABLET')
     deny('TABLET_SESSION_UNBOUND');
  const url=tabletUrl(message.tablet.url);
  return Object.freeze({
    state:'NATIVE_BRIDGE_RUNTIME_SNAPSHOT_REPORTED',
    authority:message.authority,
    observedAt:message.observedAt,
    devices:Object.freeze(devices),
    tabletUrl:url,
    execution:'NOT_ASSERTED',
    independentVeritas:'NOT_ASSERTED'
  });
 }
 scope.LeeWayBridgeSessionContract=Object.freeze({SESSION_CAPABILITIES,verifySnapshot,tabletUrl});
})(globalThis);
