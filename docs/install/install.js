/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.GITHUB_DISTRIBUTION.CLIENT
TAG: LEEWAY.DEVICE_EXTENSION.FAIL_CLOSED_STORE_LINKS.V1
5WH:
WHAT = Render the original Device Bridge's available approved browser/mobile store channels.
WHY = Eliminate fabricated store listings, private download links and nonworking installation claims.
WHO = Creator-authorized extension distribution contributor.
WHERE = docs/install/install.js.
WHEN = 2026-11-24.
HOW = Same-origin catalog, fixed known store hosts, exact PUBLISHED status, no credential transfer.
LICENSE = Existing repository terms.
*/
(function(root){
 'use strict';
 const channelHosts=Object.freeze({
   chrome:['chromewebstore.google.com','chrome.google.com'],
   edge:['microsoftedge.microsoft.com'],
   firefox:['addons.mozilla.org'],
   safari:['apps.apple.com'],
   'android-companion':['play.google.com'],
   'apple-companion':['apps.apple.com'],
   'windows-companion':[], 'linux-companion':[]
 });
 const distributions=Object.freeze({
   chrome:'CHROME_WEB_STORE',edge:'EDGE_ADDONS',firefox:'MOZILLA_AMO',
   safari:'APPLE_APP_STORE','android-companion':'GOOGLE_PLAY_OR_APPROVED_SIGNED_APP',
   'apple-companion':'APPLE_APP_STORE',
   'windows-companion':'LEEWAY_SIGNED_NATIVE_RELEASE', 'linux-companion':'LEEWAY_SIGNED_NATIVE_RELEASE'
 });
 const publicationStatus=Object.freeze({
   PUBLISHED:'Available in official store',
   SOURCE_BUILT_NOT_LISTED:'Source built — not published',
   CONTAINING_APP_NOT_SIGNED:'Signed Apple app not verified',
   SIGNED_RELEASE_NOT_VERIFIED:'Signed native release not verified'
 });
 function officialStoreUrl(channel){
   if(!channel||channel.status!=='PUBLISHED'||typeof channel.storeUrl!=='string')return null;
   const allowed=channelHosts[channel.id];
   if(!allowed||distributions[channel.id]!==channel.distribution)return null;
   let parsed;
   try{parsed=new URL(channel.storeUrl)}catch{return null}
   if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.port||
      parsed.searchParams.has('token')||parsed.hash||!allowed.includes(parsed.hostname.toLowerCase()))
      return null;
   const path=parsed.pathname;
   const acceptable=channel.id==='chrome'?/^\/(?:detail|webstore\/detail)\//.test(path):
     channel.id==='edge'?/^\/addons\/detail\//.test(path):
     channel.id==='firefox'?/^\/(?:[a-zA-Z-]+\/)?firefox\/addon\//.test(path):
     channel.id==='android-companion'?path==='/store/apps/details'&&parsed.searchParams.has('id'):
     /^\/[a-z-]+\/app\//.test(path)||/^\/app\//.test(path);
   if(!acceptable)return null;
   return parsed.toString();
 }
 function validateCatalog(data){
   const ids=['chrome','edge','firefox','safari','android-companion','apple-companion','windows-companion','linux-companion'];
   if(!data||data.schema!=='leeway.extension.distribution.v1'||!Array.isArray(data.channels)||
      data.channels.length!==ids.length)return false;
   if(data.channels.some((c,i)=>!c||c.id!==ids[i]||typeof c.title!=='string'||
     !Object.hasOwn(distributions,c.id)||c.distribution!==distributions[c.id]||
     !Object.hasOwn(publicationStatus,c.status)||
     (c.status==='PUBLISHED'&&!officialStoreUrl(c))||
     (c.status!=='PUBLISHED'&&c.storeUrl!==null)))return false;
   return true;
 }
 function render(data,doc){
   const list=doc.getElementById('channels');
   list.replaceChildren();
   const overall=doc.getElementById('overall');
   if(!validateCatalog(data)){
     overall.textContent='Release catalog invalid — installations disabled.';
     const p=doc.createElement('p');p.textContent='No verified release information is available.';list.append(p);
     return false;
   }
   const published=data.channels.filter(c=>c.status==='PUBLISHED'&&officialStoreUrl(c)).length;
   overall.textContent=published===0?'No production browser or native companion channel published yet.':
     published+' of '+data.channels.length+' official channels published.';
   for(const c of data.channels){
     const card=doc.createElement('article');card.className='channel';
     const title=doc.createElement('h3');title.textContent=c.title;card.append(title);
     const status=doc.createElement('p');status.className='status';status.textContent=publicationStatus[c.status];card.append(status);
     const detail=doc.createElement('p');detail.className='detail';detail.textContent=c.notes;card.append(detail);
     const url=officialStoreUrl(c);
     if(url){
       const a=doc.createElement('a');a.href=url;a.rel='noopener noreferrer';
       a.textContent='Open official store listing';card.append(a);
     } else {
       const denied=doc.createElement('span');denied.className='unavailable';
       denied.textContent='Installation unavailable';card.append(denied);
     }
     list.append(card);
   }
   return true;
 }
 const api=Object.freeze({officialStoreUrl,validateCatalog,render});
 root.LeeWayDistribution=api;
 if(typeof root.document!=='undefined'){
   root.fetch('../release-catalog.json',{cache:'no-store',credentials:'omit'})
      .then(r=>{if(!r.ok)throw Error('CATALOG_UNAVAILABLE');return r.json()})
      .then(data=>render(data,root.document))
      .catch(()=>render(null,root.document));
 }
})(globalThis);
