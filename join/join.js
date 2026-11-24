/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.JOIN
TAG: LEEWAY.CUSTOMER.INVITATION_REDEEM_CLIENT_V1
5WH:
WHAT = Collect the one-time emailed invite from URL fragment and begin existing Runtime-managed customer enrollment.
WHY = Let recipients sign in safely from any device without disclosing Creator secrets or collecting passwords in LeeWay.
WHO = Customer/browser, original Runtime handles Zitadel and GitHub authorization.
WHERE = join/join.js in Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Fragment-only one-time nonce, same-origin server-confirmed terms/CSRF/OIDC, fail-closed unavailable state.
LICENSE = Existing repository terms apply.
*/
(function(){
'use strict';
const $=id=>document.getElementById(id);
const message=text=>{$('status').textContent=String(text).slice(0,280)};
let invite=null,csrf=null,available=false,termsVersion=null;
function invitePart(){
 const params=new URLSearchParams(location.hash.slice(1));
 const code=params.get('invite');
 if(params.size!==1||typeof code!=='string'||
    !/^[a-f0-9-]{36}\.[A-Za-z0-9_-]{43}$/i.test(code))return null;
 // Avoid leaving invitation nonce in browser history or a pasted screenshot.
 history.replaceState(null,'',location.pathname);
 return code;
}
async function sameOriginJSON(path,body){
 if(!path.startsWith('/api/join/'))throw Error('JOIN_ENDPOINT_INVALID');
 const response=await fetch(path,{
  method:body?'POST':'GET',
  cache:'no-store',credentials:'same-origin',redirect:'error',
  headers:{accept:'application/json',...(body?{
    'content-type':'application/json','x-leeway-csrf':csrf}:{})},
  ...(body?{body:JSON.stringify(body)}:{}),
  signal:AbortSignal.timeout(12000)
 });
 if(!response.ok)throw Error('JOIN_RUNTIME_HTTP_'+response.status);
 const data=await response.json();
 if(!data||typeof data!=='object'||JSON.stringify(data).length>8192)
  throw Error('JOIN_RESPONSE_INVALID');
 return data;
}
async function prepare(){
 invite=invitePart();
 if(!invite){message('This invitation is missing or invalid. Ask the person who invited you for a fresh private link.');return}
 try{
  const data=await sameOriginJSON('/api/join/bootstrap');
  if(data.status!=='JOIN_ENABLED'||data.edition!=='CUSTOMER_STARTER'||
     !Array.isArray(data.legalDocuments)||data.legalDocuments.length!==2||
     typeof data.csrf!=='string'||data.csrf.length<24||
     typeof data.termsVersion!=='string'||!data.termsVersion)
    throw Error('CUSTOMER_JOIN_NOT_YET_CONFIGURED');
  for(const link of data.legalDocuments){
   let url;try{url=new URL(link.url,location.origin)}catch{throw Error('JOIN_LEGAL_URL_INVALID')}
   if(url.origin!==location.origin||url.protocol!=='https:'||!['TERMS','PRIVACY'].includes(link.kind))
    throw Error('JOIN_LEGAL_URL_INVALID');
  }
  csrf=data.csrf;termsVersion=data.termsVersion;available=true;
  const links=$('termsLinks');links.replaceChildren();
  for(const [i,doc] of data.legalDocuments.entries()){
   if(i)links.append(document.createTextNode(' and '));
   const a=document.createElement('a');a.href=doc.url;a.textContent=doc.kind==='TERMS'?'Terms':'Privacy Notice';a.target='_blank';a.rel='noopener noreferrer';links.append(a);
  }
  message('Your invitation is ready for secure account enrollment.');
  $('join').disabled=false;
 }catch(e){message('Customer enrollment is not available yet: '+String(e.message||e));
  invite=null;csrf=null;available=false;$('join').disabled=true}
}
$('join').addEventListener('click',async()=>{
 if(!available||!invite||!csrf)return;
 if($('terms').checked!==true){message('Please read and accept the published terms to continue.');return}
 $('join').disabled=true;
 try{
  // Runtime must bind invitation to its session first and then construct
  // the actual Zitadel PKCE redirect. This client never handles passwords.
  const data=await sameOriginJSON('/api/join/begin',{
   invitationCode:invite,termsAccepted:true,termsVersion
  });
  if(data.status!=='OIDC_OWNER_ACTION_REQUIRED')throw Error('JOIN_AUTHORIZATION_UNVERIFIED');
  const u=new URL(data.authorizationUrl);
  if(u.protocol!=='https:'||u.username||u.password||u.hash||
      !u.searchParams.has('state')||!u.searchParams.has('code_challenge')||
      u.searchParams.get('code_challenge_method')!=='S256')
    throw Error('JOIN_OIDC_PKCE_REQUIRED');
  invite=null;
  location.assign(u.href);
 }catch(e){message('Sign-in could not begin: '+String(e.message||e));
  $('join').disabled=false}
});
void prepare();
})();
