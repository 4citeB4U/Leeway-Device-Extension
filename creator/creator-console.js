/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_CONSOLE
TAG: LEEWAY.CREATOR.OWNER_DEVICE_AND_EMAIL_INVITATIONS_V1
5WH:
WHAT = Read authenticated Creator device slots, initiate per-device pairing and compose a customer invitation email.
WHY = Creator needs one visible Master across PC/phone with separate customer links.
WHO = Creator owner, not a browser-declared admin; outside GPT-6 support contributor.
WHERE = creator/creator-console.js (NOT INCLUDED in customer extension archive).
WHEN = 2026-11-23.
HOW = Same-origin Runtime endpoints, mandatory CSRF, safe textContent and deliberate user-generated links.
LICENSE = Existing repository terms apply.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id);
const OS=['Microsoft Windows','Android','Apple','Linux'];
const deviceNames=['Primary PC','Phone','Additional device 1','Additional device 2'];
let csrf=null,connected=false,inviteUrl=null;
const status=message=>{$('banner').textContent=String(message).slice(0,240)};
function verifyHttps(path,hashLabel){
 let u;try{u=new URL(path)}catch{throw Error('SERVER_LINK_INVALID')}
 if(u.protocol!=='https:'||u.username||u.password||u.search||
    !u.hostname||!u.hash.startsWith('#'+hashLabel+'='))
    throw Error('SERVER_LINK_INVALID');
 return u.href;
}
async function originalRuntimeJson(path,{method='GET',body=null}={}){
 if(!path.startsWith('/api/creator/'))throw Error('CREATOR_API_PATH_INVALID');
 if(method!=='GET'&&!csrf)throw Error('CREATOR_CSRF_SESSION_MISSING');
 const response=await fetch(path,{
  method,credentials:'same-origin',cache:'no-store',redirect:'error',
  headers:{'Accept':'application/json',...(method==='POST'?
   {'Content-Type':'application/json','X-LeeWay-CSRF':csrf}:{})},
  ...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)
 });
 if(!response.ok)throw Error('CREATOR_RUNTIME_HTTP_'+response.status);
 const value=await response.json();
 if(!value||typeof value!=='object'||JSON.stringify(value).length>16384)
  throw Error('CREATOR_RUNTIME_RESPONSE_INVALID');
 return value;
}
function resetUI(){
 connected=false;csrf=null;inviteUrl=null;
 $('issuePair').disabled=true;$('issueInvite').disabled=true;
 $('copyInvite').disabled=true;$('emailInvite').disabled=true;
 const slots=$('deviceSlots');slots.replaceChildren();
 for(const name of deviceNames){
  const tile=document.createElement('div');tile.className='device';
  const title=document.createElement('h3');title.textContent=name;
  const state=document.createElement('small');state.textContent='Not enrolled / not verified';
  tile.append(title,state);slots.append(tile);
 }
}
function updateSlots(devices){
 const slots=$('deviceSlots');slots.replaceChildren();
 const arr=Array.isArray(devices)?devices:[];
 for(let i=0;i<deviceNames.length;i++){
  const d=arr[i];
  const tile=document.createElement('div');tile.className='device';
  const title=document.createElement('h3');
  title.textContent=typeof d?.label==='string'?d.label.slice(0,50):deviceNames[i];
  const platform=document.createElement('small');
  platform.textContent=OS.includes(d?.osFamily)?d.osFamily:'Unassigned platform';
  const state=document.createElement('small');
  state.textContent=d?.registered===true&&d?.registryReadback===true
   ?'Registry verified · reachability must be checked':'Not enrolled / not verified';
  tile.append(title,platform,state);slots.append(tile);
 }
}
async function bootstrap(){
 resetUI();
 try{
  const data=await originalRuntimeJson('/api/creator/overview');
  if(data?.verified!==true||data.role!=='CREATOR'||data.scope!=='CREATOR_CONSOLE'||
     typeof data.csrf!=='string'||data.csrf.length<24)
    throw Error('CREATOR_CONSOLE_IDENTITY_UNVERIFIED');
  csrf=data.csrf;connected=true;
  updateSlots(data.devices);
  $('issuePair').disabled=false;
  $('issueInvite').disabled=false;
  status('Creator identity verified by the original LeeWay Runtime. Device state comes from canonical registry.');
 }catch(e){status('Creator Runtime not connected or not authorized: '+String(e.message||e));
  resetUI();}
}
$('issuePair').addEventListener('click',async()=>{
 if(!connected)return;
 $('issuePair').disabled=true;
 try{
  const osFamily=$('osFamily').value;
  if(!OS.includes(osFamily))throw Error('OS_UNSUPPORTED');
  const data=await originalRuntimeJson('/api/creator/device-pairs',{
    method:'POST',body:{osFamily}
  });
  if(data?.noMasterSigningKeyTransfer!==true)throw Error('CREATOR_PAIR_RESPONSE_UNVERIFIED');
  const url=verifyHttps(data.joinUrl,'pair');
  const output=$('pairResult');output.classList.remove('hidden');
  output.textContent='Open on the device you are enrolling, then sign in as Creator and approve its real adapter: '+url;
  status('Owner-only pairing challenge created. Device is NOT enrolled until original Bridge readback.');
 }catch(e){status('Pairing not issued: '+String(e.message||e));}
 finally{$('issuePair').disabled=!connected;}
});
$('issueInvite').addEventListener('click',async()=>{
 if(!connected)return;
 $('issueInvite').disabled=true;inviteUrl=null;
 $('copyInvite').disabled=true;$('emailInvite').disabled=true;
 try{
  const edition=$('edition').value;
  if(!['PERSONAL','INDUSTRIAL'].includes(edition))
   throw Error('INVITE_EDITION_INVALID');
  const data=await originalRuntimeJson('/api/creator/invitations',{
   method:'POST',body:{edition}
  });
  if(data?.masterRoleGranted!==false||data?.credentialsShared!==false)
   throw Error('CUSTOMER_INVITATION_AUTHORITY_INVALID');
  inviteUrl=verifyHttps(data.joinUrl,'invite');
  $('inviteResult').classList.remove('hidden');
  $('inviteResult').textContent=inviteUrl;
  $('copyInvite').disabled=false;
  $('emailInvite').disabled=false;
  status('One-use Customer Starter invitation issued by Runtime. No Master permissions included.');
 }catch(e){status('Invitation not issued: '+String(e.message||e));}
 finally{$('issueInvite').disabled=!connected;}
});
$('copyInvite').addEventListener('click',async()=>{
 if(!inviteUrl)return;
 try{await navigator.clipboard.writeText(inviteUrl);
  status('Customer invitation copied. Share only with the intended recipient.');
 }catch{status('Clipboard unavailable; select the link shown below and copy it manually.')}
});
$('emailInvite').addEventListener('click',()=>{
 if(!inviteUrl)return;
 const subject='Your invitation to LeeWay Operating System';
 const body='You are invited to join LeeWay. Create your own account and personal workspace using this private, one-time link:\n\n'+inviteUrl+
 '\n\nThis invitation does not grant Creator or external-employee privileges.';
 const mailto='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 window.location.href=mailto;
});
void bootstrap();
})();
