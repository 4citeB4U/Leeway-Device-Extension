/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.FIRST_AND_ADDITIONAL_DEVICE
TAG: LEEWAY.DEVICE_BRIDGE.AUTH_FIRST_DEVICE_ONBOARDING_V1
5WH:
WHAT = Plan first device or additional device sign-in and OS-specific companion setup without creating a second authority.
WHY = A new owner and a returning owner must use the same trusted process, with different setup depth.
WHO = Creator and customers through original Zitadel/Runtime/Device Bridge, outside support only supplies UI source.
WHERE = docs/install/onboarding-policy.js.
WHEN = 2026-11-24.
HOW = Pure client-side preview; no identity, package approval, device passport, or credential stored/generated here.
LICENSE = Existing repository terms.
*/
(function(root){
'use strict';
const knownFamilies=new Set(['Windows','Linux','Android','Apple']);
const types=new Set(['desktop','phone','tablet','foldable']);
const chinaLinux=new Set(['deepin','uos','openkylin','kylin','openeuler','other-linux']);
const steps=Object.freeze({
 disclosure:'Read privacy and native capability explanation',
 account:'Authenticate with existing Zitadel-backed LeeWay identity',
 github:'Connect or create GitHub account for authorized developer workflows',
 device:'Verify actual OS/device model inside the signed native companion',
 install:'Install verified OS-native Device Bridge companion',
 browser:'Select and approve supported browser-store extension(s)',
 enroll:'Approve this device and create a fresh signed device passport',
 restore:'Restore permitted Agent Lee, Digital Brain, Tablet and widgets from Runtime/Continuum'
});
const fail=reason=>{throw Error('LEEWAY_ONBOARDING_'+reason)};
function classifyDevice(env,selection={}){
 if(!env||!knownFamilies.has(env.family)||!types.has(selection.form||env.form))
  fail('UNVERIFIED_PLATFORM');
 const form=selection.form||env.form;
 if((form==='desktop'&&(env.family==='Android'))||
    (form!=='desktop'&&(env.family==='Windows'||env.family==='Linux')))
  fail('OS_FORM_FACTOR_CONFLICT');
 // Apple may use macOS desktop, iPadOS tablets, iOS phones.
 const distro=selection.linuxDistribution||'unspecified';
 if(env.family==='Linux'&&!chinaLinux.has(distro)&&distro!=='unspecified')
  fail('LINUX_VARIANT_UNRECOGNIZED');
 if(env.family!=='Linux'&&distro!=='unspecified')fail('LINUX_VARIANT_OS_MISMATCH');
 const normalizedForm=form==='foldable'?'phone':form;
 const qualifiedName=env.family==='Linux'&&chinaLinux.has(distro)?
  'Linux desktop · '+distro+' (native package qualification required)':
  env.family+' '+(form==='foldable'?'foldable':form);
 return Object.freeze({
  family:env.family,form:normalizedForm,deviceStyle:form==='foldable'?'foldable':form,
  distribution:distro,displayName:qualifiedName,
  trustedIdentity:'NOT_PROBED',
  observation:'BROWSER_HINT_PLUS_USER_SELECTION',
  packageArchitecture:'NATIVE_ADAPTER_MUST_DETECT_ARCHITECTURE_AND_ABI'
 });
}
function planOnboarding({environment,form,linuxDistribution,deviceRelation,account,github,browsers=[],catalog,setupPolicy}={}){
 if(!['first','additional'].includes(deviceRelation))fail('DEVICE_RELATION_REQUIRED');
 if(!['existing','new'].includes(account))fail('ACCOUNT_CHOICE_REQUIRED');
 if(deviceRelation==='additional'&&account==='new')fail('NEW_ACCOUNT_CANNOT_BE_ADDITIONAL_DEVICE');
 if(!['yes','no'].includes(github))fail('GITHUB_CHOICE_REQUIRED');
 if(!setupPolicy||typeof setupPolicy.planSetup!=='function')fail('ORIGINAL_SETUP_POLICY_REQUIRED');
 const profile=classifyDevice(environment,{form,linuxDistribution});
 const nativeEnv={...environment,form:profile.form};
 const install=setupPolicy.planSetup(nativeEnv,browsers,catalog);
 const first=deviceRelation==='first';
 const needsSignup=account==='new';
 const sequence=[
  {id:'disclosure',label:steps.disclosure,status:'USER_REVIEW_REQUIRED'},
  {id:'account',label:needsSignup?'Register a new LeeWay identity with Zitadel':'Sign in to your existing LeeWay account with Zitadel',
    status:'AUTHENTICATED_RUNTIME_REQUIRED',
    detail:needsSignup?'Identity provider account verification and account approval required before protected download.':
      'Existing owner signs in again; no previous device password, recovery phrase or private key is copied.'},
  {id:'github',label:github==='yes'?'Connect your existing GitHub account':'Create your GitHub account at GitHub, then return to connect it',
    status:github==='yes'?'GITHUB_OAUTH_CONSENT_REQUIRED':'GITHUB_USER_SIGNUP_REQUIRED',
    detail:'GitHub is a separately authorized developer integration, never LeeWay authentication or compulsory owner key custody.'},
  {id:'device',label:steps.device,status:'ORIGINAL_NATIVE_ADAPTER_REQUIRED',
    detail:'The installed Bridge validates OS family, exact hardware class, distribution/ABI and compatible signed artifact.'},
  ...install.actions.map((a,i)=>({
    id:'install-'+i,label:a.kind==='native-companion'?steps.install:
      a.kind==='browser-extension'?steps.browser:'Browser compatibility review',
    status:a.state,channel:a.channel||null,browser:a.browser||null,detail:a.reason
  })),
  {id:'enroll',label:steps.enroll,status:'OWNER_DEVICE_CONSENT_AND_SIGNER_REQUIRED',
    detail:first?'Complete full onboarding of this device after real Zitadel authentication and per-device user approval.':
      'Approve this NEW device with fresh owner sign-in and a trusted existing-device or recovery challenge; never transfer another device passport.'},
  {id:'restore',label:steps.restore,status:'PHYSICAL_DEVICE_AND_RUNTIME_READBACK_REQUIRED'}
 ];
 return Object.freeze({
  schema:'leeway.device-bridge.onboarding-plan.v1',
  ownerType:'ISSUER_DECIDES_CREATOR_OR_USER',
  path:first?'FULL_DEVICE_SETUP':'ADDITIONAL_DEVICE_QUICK_SETUP',
  profile,github,selectedBrowsers:Object.freeze([...browsers]),
  steps:Object.freeze(sequence.map(x=>Object.freeze(x))),
  installer:install,
  approvedBootstrapTicket:'NOT_ISSUED',
  identity:'NOT_AUTHENTICATED',
  actualInstallation:'NOT_EXECUTED',
  ownerPassport:'NOT_ISSUED',
  actualConnectedDevice:'NOT_VERIFIED',
  containsCredentials:false
 });
}
root.LeeWayOnboardingPolicy=Object.freeze({classifyDevice,planOnboarding,steps});
})(globalThis);
