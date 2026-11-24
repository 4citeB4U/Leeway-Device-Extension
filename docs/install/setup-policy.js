/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.SETUP.PLATFORM_ROUTING
TAG: LEEWAY.DEVICE_EXTENSION.OWNER_PLATFORM_BROWSER_SETUP.V1
5WH:
WHAT = Select original device companion and approved extension channels by OS and user-chosen browsers.
WHY = Setup must not deliver desktop extension packages to phones or assume all installed browsers are detectable.
WHO = Creator-authorized extension setup contributor; original Runtime and OS installers retain all authority.
WHERE = docs/install/setup-policy.js.
WHEN = 2026-11-24.
HOW = Local browser hints, explicit optional browser selection and fail-closed signed-store routing.
LICENSE = Existing repository terms.
*/
(function(root){
'use strict';
const desktopBrowsers=Object.freeze(['chrome','edge','firefox','safari']);
const namedBrowsers=Object.freeze(['chrome','edge','firefox','safari','other']);
const desktopOS=new Set(['Windows','Linux','Apple']);
const mobileForms=new Set(['phone','tablet']);
function detectEnvironment(navigatorLike={}){
  const ua=String(navigatorLike.userAgent||'');
  const platform=String(navigatorLike.platform||'');
  const touch=Number(navigatorLike.maxTouchPoints)||0;
  const android=/Android/i.test(ua);
  const ios=/iPhone|iPad|iPod/i.test(ua)||(/Macintosh/i.test(ua)&&touch>1);
  const apple=/Macintosh|Mac OS X|iPhone|iPad|iPod/i.test(ua)||/Mac/i.test(platform);
  const windows=/Windows NT/i.test(ua)||/^Win/i.test(platform);
  const linux=/Linux|X11/i.test(ua)||/Linux/i.test(platform);
  let family=android?'Android':apple?'Apple':windows?'Windows':linux?'Linux':'Unknown';
  let form=android?(/Mobile/i.test(ua)?'phone':'tablet'):ios?(/iPad/i.test(ua)||(/Macintosh/i.test(ua)&&touch>1)?'tablet':'phone'):'desktop';
  if(family==='Unknown')form='unknown';
  const browser=/OPR\\/|OPT\\/|Opera/i.test(ua)?'other':
    /; wv|WebView/i.test(ua)?'other':
    /EdgA\/|EdgiOS\/|Edg\//i.test(ua)?'edge':
    /FxiOS\/|Firefox\//i.test(ua)?'firefox':
    /CriOS\/|Chrome\//i.test(ua)?'chrome':
    /Safari\//i.test(ua)&&!/OPR\/|OPT\//i.test(ua)?'safari':'other';
  return Object.freeze({
    family,form,browser,hintOnly:true,
    label:family==='Unknown'?'Unknown platform':family+(form==='desktop'?' computer':' '+form)
  });
}
function allowedChoices(env){
  if(!env||!['Windows','Linux','Android','Apple'].includes(env.family))return [];
  if(env.family==='Android')return ['chrome','edge','firefox','other'];
  if(env.family==='Apple'&&mobileForms.has(env.form))return ['safari','chrome','edge','firefox','other'];
  return desktopBrowsers.filter(x=>x!=='safari'||env.family==='Apple');
}
function browserRoute(env,id){
 if(!namedBrowsers.includes(id)||!allowedChoices(env).includes(id))return 'UNSUPPORTED_BROWSER';
 if(env.family==='Android'){
   if(id==='chrome')return 'ANDROID_CHROME_NO_DESKTOP_EXTENSION';
   if(id==='firefox')return 'FIREFOX_ANDROID_NATIVE_MESSAGING_NOT_AVAILABLE';
   if(id==='edge')return 'ANDROID_EDGE_NATIVE_BRIDGE_NOT_QUALIFIED';
   return 'MOBILE_WEB_AND_COMPANION_ONLY';
 }
 if(env.family==='Apple'&&mobileForms.has(env.form))
   return id==='safari'?'SAFARI_CONTAINING_APP_REQUIRED':'IOS_BROWSER_NATIVE_BRIDGE_NOT_QUALIFIED';
 if(id==='other')return 'UNSUPPORTED_BROWSER';
 if(id==='safari'&&env.family!=='Apple')return 'UNSUPPORTED_BROWSER';
 return 'DESKTOP_EXTENSION_SUPPORTED_AFTER_RELEASE';
}
function companionId(env){
 if(env.family==='Android')return 'android-companion';
 if(env.family==='Apple')return 'apple-companion';
 if(env.family==='Windows')return 'windows-companion';
 if(env.family==='Linux')return 'linux-companion';
 return null;
}
function planSetup(env,selected,catalog){
 if(!env||!Array.isArray(selected)||selected.length>5||
   selected.some(x=>!namedBrowsers.includes(x)||!allowedChoices(env).includes(x))||
   new Set(selected).size!==selected.length)throw Error('LEEWAY_SETUP_BROWSER_SELECTION_INVALID');
 if(!catalog||catalog.schema!=='leeway.extension.distribution.v1'||
   !Array.isArray(catalog.channels))throw Error('LEEWAY_SETUP_CATALOG_UNVERIFIED');
 const indexed=Object.fromEntries(catalog.channels.map(x=>[x.id,x]));
 const actions=[];
 const companion=companionId(env);
 if(companion){
   const c=indexed[companion];
   actions.push(Object.freeze({
     kind:'native-companion',channel:companion,
     state:c?.status==='PUBLISHED'?'APPROVED_STORE_LINK_REQUIRED':'SIGNED_COMPANION_NOT_AVAILABLE',
     reason:mobileForms.has(env.form)?
       'Install the approved signed OS companion, then enroll this device with original owner consent.' :
       'Install the approved native Bridge once for this OS; it registers the qualified browser host IDs.'
   }));
 }else{
   actions.push(Object.freeze({kind:'platform-review',state:'UNKNOWN_OS_DENIED',
     reason:'Choose a qualified device platform using the original signed installation procedure.'}));
 }
 for(const id of selected){
   const route=browserRoute(env,id);
   const channel=(id==='safari')?'safari':id;
   const c=indexed[channel];
   actions.push(Object.freeze({
     kind:route==='DESKTOP_EXTENSION_SUPPORTED_AFTER_RELEASE'?'browser-extension':'browser-compatibility',
     browser:id,channel,
     state:route==='DESKTOP_EXTENSION_SUPPORTED_AFTER_RELEASE'?
       (c?.status==='PUBLISHED'?'APPROVED_STORE_LINK_REQUIRED':'BROWSER_STORE_NOT_PUBLISHED'):route,
     reason:route==='DESKTOP_EXTENSION_SUPPORTED_AFTER_RELEASE'?
       'Open the approved extension store listing and confirm installation. No silent extension install.' :
       route==='SAFARI_CONTAINING_APP_REQUIRED'?
       'Safari integration comes from the approved containing Apple app.' :
       route==='ANDROID_CHROME_NO_DESKTOP_EXTENSION'?
       'Android Chrome does not load desktop Chrome Web Store extensions. Use the Android LeeWay companion.' :
       route==='FIREFOX_ANDROID_NATIVE_MESSAGING_NOT_AVAILABLE'?
       'Firefox Android add-ons do not support desktop nativeMessaging for this host. Use the native companion.' :
       'This browser has no qualified LeeWay native-bridge extension path on this device. Use the native companion and Tablet.'
   }));
 }
 return Object.freeze({
   platform:env.family,form:env.form,browserHint:env.browser,
   selectedBrowsers:Object.freeze([...selected]),
   actions:Object.freeze(actions),
   nativeEnrollment:'REQUIRED_PER_DEVICE',
   originalRuntime:'REQUIRED',
   automaticInstallation:'NOT_PERMITTED_BY_BROWSER_STORE',
   connection:'NOT_ASSERTED'
 });
}
const api=Object.freeze({detectEnvironment,allowedChoices,browserRoute,planSetup,companionId});
root.LeeWaySetupPolicy=api;
})(globalThis);
