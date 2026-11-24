/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.OPERATING_SYSTEM.CREATOR_MOBILE_INSTALL
TAG: LEEWAY.CREATOR.MOBILE_RELEASE_LINK_POLICY.V1
5WH:
WHAT = Select a platform-specific published Creator companion installer from the original Runtime.
WHY = Phones cannot use the desktop extension or acquire Creator device identity by copying PC files.
WHO = Creator-authorized LeeWay outside support contributor, not Agent Lee.
WHERE = creator/connect/mobile-install-policy.js in Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Fail-closed URL/channel/release-state checks; OS remains responsible for package signing verification.
LICENSE = Existing repository terms apply.
*/
(function(scope){
'use strict';
function familyFromUserAgent(value){
 if(typeof value!=='string')return null;
 if(/Android/i.test(value))return 'Android';
 if(/\b(iPhone|iPad|iPod)\b/i.test(value))return 'Apple';
 return null;
}
function choosePublishedInstaller(installers,userAgent,origin){
 const family=familyFromUserAgent(userAgent);
 if(!family||!Array.isArray(installers)||installers.length>8)return null;
 let base;
 try{base=new URL(origin)}catch{return null}
 if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash||base.pathname!=='/'||base.hostname.length<4)return null;
 const record=installers.find(v=>v&&typeof v==='object'&&!Array.isArray(v)&&v.osFamily===family);
 if(!record||record.edition!=='CREATOR_COMPANION'||record.releaseState!=='SIGNED_PUBLISHED'||
    record.releaseAuthority!=='ORIGINAL_LEEWAY_DEVICE_BRIDGE'||typeof record.version!=='string'||
    !/^[0-9]+(?:\.[0-9]+){1,3}$/.test(record.version)||typeof record.url!=='string'||
    record.url.length>1200)return null;
 let url;
 try{url=new URL(record.url)}catch{return null}
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)return null;
 if(family==='Android'){
  if(record.channel!=='ANDROID_SIGNED_APK'||url.origin!==base.origin||
     !/^\/releases\/android\/creator\/[A-Za-z0-9.-]+\.apk$/.test(url.pathname)||
     /debug|unsigned|test/i.test(url.pathname)||!/^[a-f0-9]{64}$/.test(record.sha256||''))return null;
  return Object.freeze({url:url.href,label:'Open published Android installer',family,version:record.version});
 }
 if(family==='Apple'){
  if(record.channel!=='APPLE_TESTFLIGHT'||url.hostname!=='testflight.apple.com'||
    !/^\/join\/[A-Za-z0-9]{4,64}$/.test(url.pathname))return null;
  return Object.freeze({url:url.href,label:'Open Apple TestFlight installation',family,version:record.version});
 }
 return null;
}
scope.LeeWayCreatorMobileInstall=Object.freeze({familyFromUserAgent,choosePublishedInstaller});
})(globalThis);
