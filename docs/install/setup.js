/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.SETUP.BROWSER_SELECTION_UI
TAG: LEEWAY.DEVICE_EXTENSION.OWNER_BROWSER_SELECTION_UI.V1
5WH:
WHAT = Guide users through original Bridge installation by detected OS and selected browsers.
WHY = Users should not download random desktop ZIPs or manually configure each browser/device.
WHO = Creator-authorized extension distribution author; authenticated Runtime and native hosts retain authority.
WHERE = docs/install/setup.js.
WHEN = 2026-11-24.
HOW = Local UA hint, explicit browser choices, same-origin catalog and approved store links only.
LICENSE = Existing repository terms.
*/
(function(root){
'use strict';
const S=root.LeeWaySetupPolicy;
const D=root.LeeWayDistribution;
const doc=root.document;
if(!S||!D||!doc)return;
const names=Object.freeze({chrome:'Chrome',edge:'Microsoft Edge',firefox:'Firefox',safari:'Safari',other:'Other browser'});
const $=id=>doc.getElementById(id);
const env=S.detectEnvironment(root.navigator||{});
let catalog=null;
function el(tag,content){
 const n=doc.createElement(tag);
 if(content!==undefined)n.textContent=content;
 return n;
}
function renderOptions(){
 $('detectedEnvironment').textContent='Detected: '+env.label+' · Current browser hint: '+(names[env.browser]||'Other')+
  '. Device verification takes place later through the original signed companion.';
 const choices=$('browserChoices');choices.replaceChildren();
 for(const browser of S.allowedChoices(env)){
   const label=el('label');label.className='browser-choice';
   const box=el('input');box.type='checkbox';box.name='leeway-browser';box.value=browser;
   box.checked=browser===env.browser;
   const text=el('span',names[browser]||browser);
   label.append(box,text);choices.append(label);
 }
 if(env.family==='Unknown'){
   $('reviewSetup').disabled=true;
   $('detectedEnvironment').textContent='Platform could not be identified. The original device installer must verify your OS before enrollment.';
 }
}
function addStep(item){
 const li=el('li');
 const heading=el('strong',item.kind==='native-companion'?'Native Device Bridge · '+item.channel:
   (names[item.browser]||item.browser||'Device')+' · browser');
 const info=el('p',item.reason);
 const state=el('span',item.state);state.className='setup-state';
 li.append(heading,info,state);
 const ch=catalog?.channels?.find(x=>x.id===item.channel);
 const url=ch&&D.officialStoreUrl(ch);
 if(url&&item.state==='APPROVED_STORE_LINK_REQUIRED'){
   const a=el('a','Open approved '+(names[item.browser]||'native app')+' store listing');
   a.href=url;a.rel='noopener noreferrer';a.target='_blank';
   li.append(a);
 }else{
   const unavailable=el('small','No qualified installation link available for this step yet.');
   unavailable.className='setup-unavailable';
   li.append(unavailable);
 }
 $('setupActions').append(li);
}
function showPlan(event){
 event?.preventDefault?.();
 const section=$('setupResults');section.hidden=false;
 const steps=$('setupActions');steps.replaceChildren();
 if(!catalog||!D.validateCatalog(catalog)){
   $('setupStatus').textContent='Official release catalog unavailable. Installation is blocked.';
   return;
 }
 const selected=[...$('browserChoices').querySelectorAll('input:checked')].map(input=>input.value);
 let plan;
 try{plan=S.planSetup(env,selected,catalog)}
 catch{
   $('setupStatus').textContent='Browser selection or device detection is not qualified.';
   return;
 }
 $('setupStatus').textContent='Selected '+selected.length+' browser'+(selected.length===1?'':'s')+
  ' for '+env.label+'. Installation and trusted device enrollment are not yet verified.';
 for(const item of plan.actions)addStep(item);
 const final=el('li');
 final.append(el('strong','Connect to your authenticated LeeWay workspace'),
   el('p','After the original signed companion and any browser extensions are installed, sign in with your existing Zitadel-backed LeeWay identity, approve this device passport and capabilities, and confirm actual Bridge discovery. The Tablet, Digital Brain and floating widgets display only your authorized Runtime/Continuum state.'));
 const status=el('span','DEVICE ENROLLMENT NOT VERIFIED');status.className='setup-state';
 final.append(status);steps.append(final);
}
async function loadCatalog(){
 try{
   const response=await root.fetch('../release-catalog.json',{credentials:'omit',cache:'no-store'});
   if(!response.ok)throw Error('CATALOG_UNAVAILABLE');
   const incoming=await response.json();
   if(!D.validateCatalog(incoming))throw Error('CATALOG_UNVERIFIED');
   catalog=incoming;
 }catch{
   catalog=null;
 }
}
renderOptions();
$('setupForm').addEventListener('submit',showPlan);
void loadCatalog();
})(globalThis);
