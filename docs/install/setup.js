/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.SETUP.BROWSER_SELECTION_UI
TAG: LEEWAY.DEVICE_EXTENSION.AUTH_FIRST_AND_ADDITIONAL_DEVICE_SETUP_V2
5WH:
WHAT = Guide full first-device or quick additional-device onboarding through one Bridge site.
WHY = Account sign-in, optional GitHub builder onboarding and device-specific native installation must be unambiguous.
WHO = Creator and customers; original Zitadel/Runtime/Bridge are sole identity and installation authorities.
WHERE = docs/install/setup.js.
WHEN = 2026-11-24.
HOW = Progressive, accessible, non-credential browser planning; no fake enrollment or automatic extension installation.
LICENSE = Existing repository terms.
*/
(function(root){
'use strict';
const S=root.LeeWaySetupPolicy;
const P=root.LeeWayOnboardingPolicy;
const D=root.LeeWayDistribution;
const doc=root.document;
if(!S||!P||!D||!doc)return;
const names=Object.freeze({chrome:'Chrome',edge:'Microsoft Edge',firefox:'Firefox',safari:'Safari',other:'Other browser'});
const $=id=>doc.getElementById(id);
const env=S.detectEnvironment(root.navigator||{});
let catalog=null;
function el(tag,value){
 const node=doc.createElement(tag);
 if(value!==undefined)node.textContent=value;
 return node;
}
function selectedRadio(name){
 return doc.querySelector('input[name="'+name+'"]:checked')?.value||null;
}
function approvedLink(url,text){
 const a=el('a',text);
 a.href=url;a.rel='noopener noreferrer';a.target='_blank';
 return a;
}
function updateGithubHelp(){
 const help=$('githubHelp');help.replaceChildren();
 const answer=selectedRadio('githubChoice');
 if(answer==='no'){
  help.append(el('span','GitHub account creation happens at GitHub, with its own confirmation and security setup. After signup, return here to connect the account to LeeWay through a future approved GitHub App flow. '),
   approvedLink('https://github.com/signup','Open GitHub account signup'));
 }else if(answer==='yes'){
  help.append(el('span','Already have GitHub? You will authorize the official LeeWay GitHub integration through a future approved OAuth/GitHub App flow. This page does not request your GitHub password. '),
    approvedLink('https://github.com/login','Open GitHub sign-in'));
 }else help.textContent='Select yes or no. GitHub is for approved app building, not a LeeWay login or device key.';
}
function updateDeviceForm(){
 const form=$('deviceForm');
 const valid=env.family==='Android'?['phone','tablet','foldable']:
   env.family==='Apple'?['desktop','phone','tablet']:
   env.family==='Windows'||env.family==='Linux'?['desktop']:[];
 for(const option of form.options)option.disabled=!valid.includes(option.value);
 form.value=valid.includes(env.form)?env.form:valid[0]||'desktop';
 $('linuxVariantWrap').hidden=env.family!=='Linux';
}
function renderOptions(){
 $('detectedEnvironment').textContent='Browser-reported: '+env.label+
  ' · Current browser: '+(names[env.browser]||'Other')+
  '. Select your actual device type. Trusted hardware identification occurs after installing the signed original Device Bridge.';
 updateDeviceForm();
 const choices=$('browserChoices');choices.replaceChildren();
 for(const browser of S.allowedChoices(env)){
  const label=el('label');label.className='browser-choice';
  const box=el('input');box.type='checkbox';box.name='leeway-browser';box.value=browser;
  box.checked=browser===env.browser;
  label.append(box,el('span',names[browser]||browser));choices.append(label);
 }
 if(env.family==='Unknown'){
  $('reviewSetup').disabled=true;
  $('detectedEnvironment').textContent='Unrecognized operating system: contact LeeWay for qualification; no device package selected.';
 }
 updateGithubHelp();
}
function addStep(item){
 const li=el('li');
 const heading=el('strong',item.label||item.id);
 const desc=el('p',item.detail||'Original LeeWay authority verification required.');
 const status=el('span',item.status||'NOT_VERIFIED');status.className='setup-state';
 li.append(heading,desc,status);
 const channel=catalog?.channels?.find(c=>c.id===item.channel);
 const approved=channel&&D.officialStoreUrl(channel);
 if(approved&&item.status==='APPROVED_STORE_LINK_REQUIRED')
  li.append(approvedLink(approved,'Open the official approved installation listing'));
 else if(item.id==='github'&&item.status==='GITHUB_USER_SIGNUP_REQUIRED')
  li.append(approvedLink('https://github.com/signup','Create GitHub account at GitHub'));
 else if(item.id==='github'&&item.status==='GITHUB_OAUTH_CONSENT_REQUIRED')
  li.append(el('small','GitHub App connection requires the original approved OAuth callback; no credentials accepted on this page.'));
 else if(item.id==='account')
  li.append(el('small','Zitadel sign-in/registration integration is NOT CONNECTED. This page cannot authenticate an account or issue a device enrollment ticket.'));
 else if(item.channel){
  const hint=el('small','No qualified signed package or approved store listing is available for this step yet.');
  hint.className='setup-unavailable';li.append(hint);
 }
 $('setupActions').append(li);
}
function showPlan(event){
 event?.preventDefault?.();
 $('setupResults').hidden=false;
 $('setupActions').replaceChildren();
 if(!catalog||!D.validateCatalog(catalog)){
  $('setupStatus').textContent='Official catalog unavailable; no download, identity, or device enrollment permitted.';
  return;
 }
 const selected=[...$('browserChoices').querySelectorAll('input:checked')].map(x=>x.value);
 let plan;
 try{
  plan=P.planOnboarding({
   environment:env,form:$('deviceForm').value,
   linuxDistribution:env.family==='Linux'?$('linuxVariant').value:'unspecified',
   deviceRelation:selectedRadio('deviceRelation'),
   account:selectedRadio('accountChoice'),github:selectedRadio('githubChoice'),
   browsers:selected,catalog,setupPolicy:S
  });
 }catch(error){
  $('setupStatus').textContent='Setup needs correction: '+String(error?.message||'INVALID_SELECTION').slice(0,95);
  return;
 }
 $('setupStatus').textContent=
   (plan.path==='FULL_DEVICE_SETUP'?'Full setup':'Additional-device setup')+
   ' for '+plan.profile.displayName+', '+selected.length+' selected browsers. '+
   'This is a preparation plan, not account registration, a completed installation or permission approval.';
 for(const item of plan.steps)addStep(item);
 const final=el('li');
 final.append(el('strong','Confirm genuine Device Bridge enrollment and workspace display'),
   el('p','The original authenticated Runtime must issue a fresh, device-bound registration and return physical health before Agent Lee, the Tablet, Digital Brain, and floating widgets are shown. The Creator and customers use the same steps; the Runtime decides their actual permissions.'));
 const state=el('span','DEVICE REGISTRY READBACK NOT EXECUTED');state.className='setup-state';
 final.append(state);$('setupActions').append(final);
}
async function loadCatalog(){
 try{
  const response=await root.fetch('../release-catalog.json',{cache:'no-store',credentials:'omit'});
  if(!response.ok)throw Error('CATALOG_UNAVAILABLE');
  const next=await response.json();
  if(!D.validateCatalog(next))throw Error('CATALOG_INVALID');
  catalog=next;
 }catch{catalog=null;}
}
renderOptions();
$('setupForm').addEventListener('submit',showPlan);
for(const input of doc.querySelectorAll('input[name="githubChoice"]'))
 input.addEventListener('change',updateGithubHelp);
for(const input of doc.querySelectorAll('input[name="accountChoice"]'))
 input.addEventListener('change',()=>{
  if(selectedRadio('accountChoice')==='new'){
   const extra=doc.querySelector('input[name="deviceRelation"][value="additional"]');
   if(extra?.checked)doc.querySelector('input[name="deviceRelation"][value="first"]').checked=true;
  }
 });
void loadCatalog();
})(globalThis);
