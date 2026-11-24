/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_DEVICE_CONNECT
TAG: LEEWAY.CREATOR.PAIR_CHALLENGE.CLIENT_V1
5WH:
WHAT = Begin same-Creator-account device pairing without storing tokens, secrets or trusting UI-generated device identities.
WHY = The primary PC and mobile devices must register to one Creator control plane with separate real host passports.
WHO = Creator via canonical Runtime; outside contributor is not Agent Lee.
WHERE = creator/connect/connect.js in Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Single-use URL fragment, original Runtime CSRF+OIDC PKCE, device consent and external signed adapter proof.
LICENSE = Existing repository terms apply.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id);
let code=null,csrf=null;
const installPolicy=globalThis.LeeWayCreatorMobileInstall;
function status(s){$('status').textContent=String(s).slice(0,250)}
async function api(path,body){
 if(!path.startsWith('/api/creator/pairing/'))throw Error('PAIR_PATH_INVALID');
 const res=await fetch(path,{method:body?'POST':'GET',credentials:'same-origin',
  cache:'no-store',redirect:'error',
  headers:{accept:'application/json',...(body?{
    'content-type':'application/json','x-leeway-csrf':csrf}:{})},
  ...(body?{body:JSON.stringify(body)}:{}),
  signal:AbortSignal.timeout(12000)});
 if(!res.ok)throw Error('CREATOR_PAIR_HTTP_'+res.status);
 const data=await res.json();
 if(!data||typeof data!=='object'||JSON.stringify(data).length>8192)
  throw Error('CREATOR_PAIR_RESPONSE_INVALID');
 return data;
}
function showPublishedInstaller(data){
 const anchor=$('nativeInstaller');
 anchor.hidden=true;anchor.removeAttribute('href');
 const family=installPolicy?.familyFromUserAgent(navigator.userAgent);
 if(!family){$('installState').textContent='Open this link on an Android or Apple phone to check its release.';return}
 const installer=installPolicy.choosePublishedInstaller(data.mobileInstallers,navigator.userAgent,location.origin);
 if(!installer){
  $('installState').textContent=family+' signed companion is not published or verified by this Runtime. No download offered.';
  return;
 }
 anchor.href=installer.url;anchor.textContent=installer.label+' · version '+installer.version;
 anchor.hidden=false;
 $('installState').textContent='Runtime reports a published Creator companion. Your OS must still verify its signed package. Installation does not enroll this device.';
}
async function start(){
 const params=new URLSearchParams(location.hash.slice(1));
 const value=params.get('pair');
 if(params.size!==1||typeof value!=='string'||
    !/^[a-f0-9-]{36}\.[A-Za-z0-9_-]{43}$/i.test(value)){
  status('No valid pairing invitation. Open a new pairing link from your Creator console.');return;
 }
 code=value;
 history.replaceState(null,'',location.pathname);
 try{
  const data=await api('/api/creator/pairing/bootstrap');
  if(data.status!=='CREATOR_PAIRING_AVAILABLE'||
    typeof data.csrf!=='string'||data.csrf.length<24)
    throw Error('CREATOR_PAIRING_NOT_CONFIGURED');
  csrf=data.csrf;
  showPublishedInstaller(data);
  $('continue').disabled=false;
  status('Ready to verify the Creator sign-in. No device has been enrolled yet.');
 }catch(e){code=null;status('Creator pairing is not available: '+String(e.message||e))}
}
$('continue').addEventListener('click',async()=>{
 if(!code||!csrf)return;
 $('continue').disabled=true;
 try{
  const data=await api('/api/creator/pairing/begin',{pairCode:code});
  if(data.status!=='CREATOR_OIDC_ACTION_REQUIRED')throw Error('CREATOR_PAIR_OWNER_ACTION_UNVERIFIED');
  const u=new URL(data.authorizationUrl);
  if(u.protocol!=='https:'||u.username||u.password||u.hash||
    !u.searchParams.has('state')||!u.searchParams.has('code_challenge')||
    u.searchParams.get('code_challenge_method')!=='S256')
    throw Error('CREATOR_PAIR_PKCE_INVALID');
  code=null;location.assign(u.href);
 }catch(e){status('Creator sign-in could not start: '+String(e.message||e));
  $('continue').disabled=false}
});
void start();
})();