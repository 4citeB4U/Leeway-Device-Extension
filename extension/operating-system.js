/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM
TAG: LEEWAY.OPERATING_SYSTEM.SIDEBAR_CONTROLLER.V1
5WH:
WHAT = Run the right-hand Operating System launcher using public service checks, GitHub source readback and local per-browser preferences.
WHY = Connect users to the canonical cloud workplane without copying credentials, bypassing licenses or assuming local host availability.
WHO = Creator-authorized outside GPT-6 source contributor, not Agent Lee.
WHERE = extension/operating-system.js in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = User-triggered exact-origin permissions, same existing Tablet link, bounded public responses and fail-closed native host requests.
LICENSE = Existing repository terms apply.
*/
(function(scope){
'use strict';
const policy=scope.LeeWayOperatingPolicy;
if(!policy||!scope.document)return;
const api=scope.browser||scope.chrome||null;
const promiseApi=Boolean(scope.browser);
const PREF_KEY='LEEWAY_OPERATING_SYSTEM_PUBLIC_PREFERENCES_V1';
const $=id=>document.getElementById(id);
let profile=policy.normalizeProfile({}),shortcuts=[];
function announce(message){$('message').textContent=String(message).slice(0,180)}
function fail(message){announce(message);return false}
function external(url){
  let safe;
  try{safe=policy.httpsUrl(url)}catch{return fail('Unsafe destination denied')}
  if(api?.tabs?.create){try{
    const result=api.tabs.create({url:safe,active:true});
    if(result?.catch)result.catch(()=>announce('Open this URL manually: '+safe));
    return true;
  }catch{return fail('Open link not available')}}
  scope.open(safe,'_blank','noopener,noreferrer');return true;
}
async function storageGet(){
  if(!api?.storage?.local)return null;
  if(promiseApi)return (await api.storage.local.get(PREF_KEY))[PREF_KEY]||null;
  return new Promise(resolve=>api.storage.local.get(PREF_KEY,v=>resolve(api.runtime?.lastError?null:v?.[PREF_KEY]||null)));
}
async function storageSet(){
  if(!api?.storage?.local)throw Error('BROWSER_STORAGE_UNAVAILABLE');
  const value={profile,shortcuts:policy.safeShortcuts(shortcuts)};
  if(promiseApi)return api.storage.local.set({[PREF_KEY]:value});
  return new Promise((resolve,reject)=>api.storage.local.set({[PREF_KEY]:value},()=>
    api.runtime?.lastError?reject(Error('BROWSER_STORAGE_FAILED')):resolve()));
}
async function permitOrigin(url){
  if(!api?.permissions?.request)throw Error('BROWSER_PERMISSION_API_UNAVAILABLE');
  const pattern=new URL(policy.httpsUrl(url)).origin+'/*';
  const result=promiseApi
    ? await api.permissions.request({origins:[pattern]})
    : await new Promise((resolve,reject)=>api.permissions.request({origins:[pattern]},given=>
        api.runtime?.lastError?reject(Error('BROWSER_PERMISSION_REJECTED')):resolve(given)));
  if(!result)throw Error('ORIGIN_ACCESS_NOT_APPROVED');
}
async function boundedPublicJson(url,timeoutMs=8000){
  const response=await fetch(url,{method:'GET',redirect:'error',cache:'no-store',credentials:'omit',
    headers:{accept:'application/json'},signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok)throw Error('PUBLIC_ENDPOINT_HTTP_'+response.status);
  const n=Number(response.headers.get('content-length')||0);
  if(n>16384)throw Error('PUBLIC_RESPONSE_TOO_LARGE');
  const reader=response.body?.getReader?.();
  if(!reader)throw Error('PUBLIC_BODY_UNAVAILABLE');
  const chunks=[];let len=0;
  try{
    for(;;){const {value,done}=await reader.read();if(done)break;
      len+=value.byteLength;if(len>16384)throw Error('PUBLIC_RESPONSE_TOO_LARGE');
      chunks.push(value);
    }
  }finally{reader.releaseLock()}
  const bytes=new Uint8Array(len);let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
  return JSON.parse(new TextDecoder().decode(bytes));
}
function renderAdapters(){
 const list=$('adapterList');list.replaceChildren();
 for(const os of policy.OS_FAMILIES){
  const item=document.createElement('div');item.className='adapter';
  const strong=document.createElement('strong');strong.textContent=os;
  const note=document.createElement('small');note.textContent='Not enrolled / not probed';
  item.append(strong,note);list.append(item);
 }
}
function renderApps(){
 const list=$('appList');list.replaceChildren();
 for(const app of policy.APPS){
  const gate=policy.presentationGate(app.id);
  const button=document.createElement('button');button.className='app'+(gate!=='OPEN_PUBLIC_TABLET_ONLY'?' locked':'');
  const symbol=document.createElement('span');symbol.className='glyph';symbol.textContent=app.symbol;
  const title=document.createElement('strong');title.textContent=app.name;
  const detail=document.createElement('small');detail.textContent=gate==='OPEN_PUBLIC_TABLET_ONLY'?'Open Tablet surface':'Locked · verified deployment license required';
  button.title=app.detail;button.append(symbol,title,detail);
  if(gate==='OPEN_PUBLIC_TABLET_ONLY')button.addEventListener('click',()=>external(profile.tabletUrl));
  else{button.disabled=true;button.setAttribute('aria-label',app.name+': runtime license required');}
  list.append(button);
 }
}
function renderShortcuts(){
 const list=$('shortcutList');list.replaceChildren();
 for(const [index,shortcut] of shortcuts.entries()){
  const row=document.createElement('div');row.className='shortcut';
  const open=document.createElement('button');open.textContent=shortcut.name;
  open.title=shortcut.url;open.addEventListener('click',()=>external(shortcut.url));
  const remove=document.createElement('button');remove.className='remove';remove.textContent='Remove';
  remove.setAttribute('aria-label','Remove '+shortcut.name);
  remove.addEventListener('click',async()=>{
    shortcuts.splice(index,1);try{await storageSet();renderShortcuts()}catch{announce('Could not save shortcut removal')}
  });
  row.append(open,remove);list.append(row);
 }
}
function renderProfile(){
 $('instanceLabel').textContent=profile.instanceLabel;
 $('instanceState').textContent='Profile only · not enrolled';
 const form=$('profileForm');
 for(const key of ['instanceLabel','githubRepo','tabletUrl','bridgeHealthUrl'])form.elements.namedItem(key).value=profile[key];
 $('bridgeStatus').textContent='Not checked';
 $('githubStatus').textContent='Not checked; public metadata only';
}
function selectView(name){
 for(const btn of document.querySelectorAll('[data-view]'))btn.setAttribute('aria-current',btn.dataset.view===name?'page':'false');
 for(const screen of document.querySelectorAll('[data-screen]'))screen.classList.toggle('hidden',screen.dataset.screen!==name);
}
async function checkBridge(){
 $('bridgeStatus').textContent='Checking public health…';
 try{
  const url=policy.bridgeHealthUrl(profile.bridgeHealthUrl);
  await permitOrigin(url);
  const body=await policyCheck();
  async function policyCheck(){
   if(!scope.LeeWayServiceRetry?.retryPublicHealth)
    throw Error('BOUNDED_HEALTH_RETRY_UNAVAILABLE');
   return scope.LeeWayServiceRetry.retryPublicHealth(
    ()=>boundedPublicJson(url,15000),
    {onRetry:({nextAttempt})=>{
      $('bridgeStatus').textContent='Service warming or transiently unavailable · retry '+nextAttempt+'/3';
    }}
   );
  }
  if(body?.service!=='leeway-managed-device-mcp'||!['RUNNING','BOUND'].includes(body?.status))
    throw Error('MANAGED_BRIDGE_CONTRACT_UNVERIFIED');
  $('bridgeStatus').textContent='Public cloud '+body.status+' · owner discovery and devices not verified here';
 }catch(error){$('bridgeStatus').textContent=String(error.message||error).slice(0,110)}
}
async function checkGitHub(){
 $('githubStatus').textContent='Checking public source…';
 try{
  const repo=policy.parseGitHubRepo(profile.githubRepo);
  await permitOrigin(repo.api);
  const data=await boundedPublicJson(repo.api);
  if(data?.full_name!==repo.owner+'/'+repo.repo||typeof data.default_branch!=='string')
    throw Error('GITHUB_PUBLIC_REPO_UNVERIFIED');
  $('githubStatus').textContent='Public source found · default branch '+data.default_branch;
 }catch(error){$('githubStatus').textContent=String(error.message||error).slice(0,110)}
}
async function connectNative(){
 $('nativeStatus').textContent='Checking installed host…';
 try{
  if(!api?.runtime?.sendMessage)throw Error('NATIVE_MESSAGING_BROWSER_UNAVAILABLE');
  const res=await (promiseApi?api.runtime.sendMessage({type:'LEEWAY_CONNECT'}):
    new Promise((resolve,reject)=>api.runtime.sendMessage({type:'LEEWAY_CONNECT'},v=>
      api.runtime?.lastError?reject(Error('EXTENSION_MESSAGE_REJECTED')):resolve(v))));
  if(res?.ok&&res?.result?.connected) $('nativeStatus').textContent='Owner-authenticated native host session · not Veritas';
  else $('nativeStatus').textContent=res?.error||'Native host not qualified';
 }catch(err){$('nativeStatus').textContent=String(err.message||err).slice(0,130)}
}
async function load(){
 try{
  const saved=await storageGet();
  if(saved?.profile)profile=policy.normalizeProfile(saved.profile);
  if(saved?.shortcuts)shortcuts=policy.safeShortcuts(saved.shortcuts);
 }catch{announce('Saved profile is unavailable; using public defaults')}
 renderAdapters();renderApps();renderShortcuts();renderProfile();
}
document.querySelectorAll('[data-view]').forEach(node=>node.addEventListener('click',()=>selectView(node.dataset.view)));
$('openTablet').addEventListener('click',()=>external(profile.tabletUrl));
$('previewTablet').addEventListener('click',()=>{
 const panel=$('previewPanel');panel.classList.toggle('hidden');
 if(!panel.classList.contains('hidden')){
  if(profile.tabletUrl!==policy.DEFAULTS.tabletUrl){
    panel.classList.add('hidden');announce('Customer-specific Tablet previews require frame policy qualification; open full Tablet instead');return;
  }
  $('tabletFrame').src=policy.DEFAULTS.tabletUrl;
 }
});
$('checkBridge').addEventListener('click',()=>void checkBridge());
$('checkGitHub').addEventListener('click',()=>void checkGitHub());
$('connectNative').addEventListener('click',()=>void connectNative());
$('openCourier').addEventListener('click',async()=>{
 try{
  if(!api?.runtime?.sendMessage)throw Error('COURIER_BROWSER_API_UNAVAILABLE');
  const res=await (promiseApi?api.runtime.sendMessage({type:'LEEWAY_OPEN_COURIER'}):
    new Promise((resolve,reject)=>api.runtime.sendMessage({type:'LEEWAY_OPEN_COURIER'},v=>
      api.runtime?.lastError?reject(Error('EXTENSION_MESSAGE_REJECTED')):resolve(v))));
  announce(res?.ok?'Page courier opened by explicit request':'Courier: '+String(res?.error||'not authorized'));
 }catch(err){announce('Courier unavailable: '+String(err.message||err).slice(0,90))}
});
$('openGitHub').addEventListener('click',()=>external('https://github.com/signup'));
$('forkExtension').addEventListener('click',()=>external('https://github.com/4citeB4U/Leeway-Device-Extension/fork'));
$('openRender').addEventListener('click',()=>external('https://dashboard.render.com/'));
$('openRecovery').addEventListener('click',()=>external(policy.DEFAULTS.recoveryInfo));
$('profileForm').addEventListener('submit',async event=>{
 event.preventDefault();
 const values=Object.fromEntries(new FormData(event.currentTarget).entries());
 try{
  const next=policy.normalizeProfile(values);
  const prior=profile;profile=next;
  try{await storageSet()}catch(error){profile=prior;throw error}
  renderProfile();$('profileStatus').textContent='Public profile saved locally. Tenant authorization still required.';
 }catch(error){$('profileStatus').textContent=String(error.message||error).slice(0,145)}
});
$('shortcutForm').addEventListener('submit',async event=>{
 event.preventDefault();
 const values=Object.fromEntries(new FormData(event.currentTarget).entries());
 const next=policy.safeShortcuts([...shortcuts,values]);
 if(next.length!==shortcuts.length+1){$('shortcutStatus').textContent='Shortcut rejected: use a unique HTTPS URL, name and fewer than 24 entries.';return}
 const prior=shortcuts;shortcuts=next;
 try{
  await storageSet();renderShortcuts();event.currentTarget.reset();
  $('shortcutStatus').textContent='Local shortcut saved. Not synchronized to Continuum.';
 }catch{shortcuts=prior;$('shortcutStatus').textContent='Unable to save shortcut'}
});
void load();
})(globalThis);
