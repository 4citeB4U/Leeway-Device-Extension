/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.OPERATING_SYSTEM
TAG: LEEWAY.OPERATING_SYSTEM.UNIVERSAL_CLIENT_POLICY.V1
5WH:
WHAT = Define the portable LeeWay Operating System extension launcher, tenant-bound public endpoints and UI-only entitlement presentation.
WHY = Give each customer one consistent entrypoint without copying Creator credentials or inventing Device Bridge execution.
WHO = Creator-authorized outside GPT-6 source contributor under canonical LeeWay Standards.
WHERE = extension/operating-policy.js in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Strict HTTPS URL and GitHub repo validation, fixed public application catalog, runtime-first entitlement display.
LICENSE = Existing repository terms apply; no new license asserted.
*/
(function(scope){
'use strict';
const version='0.4.0';
const DEFAULTS=Object.freeze({
  githubRepo:'https://github.com/4citeB4U/Leeway-Device-Extension',
  tabletUrl:'https://4citeb4u.github.io/Leeway-Agent-Virtual-Tablet/',
  bridgeHealthUrl:'https://leeway-native-device-bridge.onrender.com/healthz',
  recoveryInfo:'https://github.com/4citeB4U/LeeWay-Continuum'
});
const OS_FAMILIES=Object.freeze(['Microsoft Windows','Linux','Apple','Android']);
// This public customer edition is a MINIMAL CLIENT, not the Creator Golden Master.
// No private model weights, Creator admin applications, issuing keys, employees,
// Formula implementation, or full Tablet source are included in the bundle.
const EDITION='CUSTOMER_STARTER';
const APPS=Object.freeze([
 Object.freeze({id:'digital-brain',name:'Digital Brain',symbol:'◇',
  access:'CUSTOMER_CORE_ENTRY',detail:'Your own consent-bound local file index'}),
 Object.freeze({id:'continuum',name:'Continuum',symbol:'↺',
  access:'CUSTOMER_CORE_ENTRY',detail:'Your own owner-scoped Continuum records and recovery'}),
 Object.freeze({id:'diagnostics',name:'LeeWay Diagnostics',symbol:'◉',
  access:'CUSTOMER_CORE_ENTRY',detail:'LeeWay diagnostic provider observing your approved device'}),
 Object.freeze({id:'local-ai',name:'My Local AI',symbol:'◈',
  access:'LOCAL_PROVIDER_ADMISSION_REQUIRED',
  detail:'Optional user-chosen local AI; no Creator model or LeeWay cloud power bundled'})
]);
const WITHHELD=new Set([
 'creator-console','creator.control','creator.license.issue','creator.license.revoke',
 'office','blackboard','model-hub','app-foundry','employee-studio','employee-export',
 'digital-employment-center','workforce.remote.export','workforce.remote.dispatch',
 'machine-consciousness','veritas-admin','formula-admin','receipt-authority-admin'
]);

function httpsUrl(input){
  if(typeof input!=='string'||input.length>2048)throw Error('HTTPS_RESOURCE_INVALID');
  let url;
  try{url=new URL(input)}catch{throw Error('HTTPS_RESOURCE_INVALID')}
  const h=url.hostname.toLowerCase();
  const privateHost=h==='localhost'||h.endsWith('.localhost')||h.endsWith('.local')||
    h==='[::1]'||h==='0.0.0.0'||/^127\./.test(h)||
    /^(10|192\.168|169\.254)\./.test(h)||/^172\.(1[6-9]|2[0-9]|3[01])\./.test(h);
  if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||
    !h.includes('.')||privateHost)throw Error('HTTPS_RESOURCE_INVALID');
  return url.href;
}
function bridgeHealthUrl(input){
  const url=new URL(httpsUrl(input));
  if(url.pathname!=='/healthz')throw Error('BRIDGE_HEALTH_PATH_REQUIRED');
  return url.href;
}
function parseGitHubRepo(input){
  const url=new URL(httpsUrl(input));
  const bits=url.pathname.split('/').filter(Boolean);
  if(url.hostname!=='github.com'||bits.length!==2||
    bits.some(p=>!(/^[A-Za-z0-9_.-]{1,100}$/.test(p))||p==='.'||p==='..'))
    throw Error('GITHUB_REPOSITORY_INVALID');
  return Object.freeze({owner:bits[0],repo:bits[1],
    url:'https://github.com/'+bits[0]+'/'+bits[1],
    api:'https://api.github.com/repos/'+encodeURIComponent(bits[0])+'/'+encodeURIComponent(bits[1])});
}
function normalizeProfile(profile){
  if(!profile||typeof profile!=='object'||Array.isArray(profile))throw Error('TENANT_PROFILE_REQUIRED');
  const allowed=new Set(['instanceLabel','githubRepo','tabletUrl','bridgeHealthUrl']);
  if(Object.keys(profile).some(key=>!allowed.has(key)))throw Error('TENANT_PROFILE_FIELD_NOT_PUBLIC');
  const instanceLabel=String(profile.instanceLabel||'Personal workspace').trim();
  if(!instanceLabel||instanceLabel.length>60)throw Error('TENANT_LABEL_INVALID');
  return Object.freeze({
    instanceLabel,
    githubRepo:parseGitHubRepo(profile.githubRepo||DEFAULTS.githubRepo).url,
    tabletUrl:httpsUrl(profile.tabletUrl||DEFAULTS.tabletUrl),
    bridgeHealthUrl:bridgeHealthUrl(profile.bridgeHealthUrl||DEFAULTS.bridgeHealthUrl)
  });
}
// App availability here only controls presentation. Only canonical Runtime can
// authenticate a user, issue/revoke a license or authorize the actual operation.
function presentationGate(appId){
  if(WITHHELD.has(appId))return 'NOT_IN_CUSTOMER_PACKAGE';
  const app=APPS.find(item=>item.id===appId);
  if(!app)return 'UNKNOWN_APP_DENIED';
  return app.access;
}
function safeShortcuts(value){
  if(!Array.isArray(value))return [];
  const used=new Set();
  const result=[];
  for(const item of value.slice(0,24)){
    if(!item||typeof item!=='object')continue;
    const name=String(item.name||'').trim();
    if(!name||name.length>44)continue;
    let url;
    try{url=httpsUrl(item.url)}catch{continue}
    if(used.has(url))continue;
    used.add(url);result.push(Object.freeze({name,url}));
  }
  return result;
}
scope.LeeWayOperatingPolicy=Object.freeze({
  version,EDITION,DEFAULTS,OS_FAMILIES,APPS,httpsUrl,bridgeHealthUrl,
  parseGitHubRepo,normalizeProfile,presentationGate,safeShortcuts
});
})(globalThis);
