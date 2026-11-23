/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.TENANT_BOOTSTRAP
TAG: LEEWAY.OPERATING_SYSTEM.BYOC_TENANT_PLAN.V1
5WH:
WHAT = Prepare a customer-owned, no-secrets LeeWay Operating System service installation plan.
WHY = Avoid spending Creator workspace hours or cloning the Creator's Zitadel, GitHub, native passport or encrypted Continuum secrets.
WHO = Creator-authorized outside GPT-6 source contributor; tenant owner must authorize provider creation.
WHERE = provisioning/tenant-install-plan.mjs in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Deterministic source inventory, exact owner GitHub repository validation and explicit unexecuted free-instance gates.
LICENSE = Existing repository terms apply; no new license asserted.
*/
import {fileURLToPath} from 'node:url';

const SOURCE=Object.freeze({
 extension:'4citeB4U/Leeway-Device-Extension',
 tablet:'4citeB4U/Leeway-Agent-Virtual-Tablet',
 bridge:'4citeB4U/LEEWAY-DEVICE-BRIDGE',
 runtime:'4citeB4U/Leeway-Runtime-Fabric',
 continuum:'4citeB4U/LeeWay-Continuum',
 skills:'4citeB4U/LeeWay-Agent-Skills'
});
const SERVICES=Object.freeze([
  Object.freeze({name:'operating-extension',kind:'BROWSER_EXTENSION',source:SOURCE.extension,hosting:'USER_DEVICE',state:'SOURCE_ONLY'}),
  Object.freeze({name:'tablet',kind:'STATIC_WEB',source:SOURCE.tablet,hosting:'TENANT_GITHUB_PAGES',state:'NOT_DEPLOYED'}),
  Object.freeze({name:'device-bridge',kind:'NODE_MCP',source:SOURCE.bridge,hosting:'TENANT_RENDER_FREE',state:'NOT_DEPLOYED'}),
  Object.freeze({name:'runtime-fabric',kind:'NODE_RUNTIME',source:SOURCE.runtime,hosting:'TENANT_PROVIDER_ACCOUNT',state:'NOT_DEPLOYED'}),
  Object.freeze({name:'continuum',kind:'RECOVERY_PROVIDER',source:SOURCE.continuum,hosting:'TENANT_AUTHORIZED_STORAGE',state:'NOT_DEPLOYED'})
]);
function repository(input){
  if(typeof input!=='string')throw Error('TENANT_GITHUB_REPOSITORY_REQUIRED');
  let u;try{u=new URL(input)}catch{throw Error('TENANT_GITHUB_REPOSITORY_INVALID')}
  const p=u.pathname.split('/').filter(Boolean);
  if(u.protocol!=='https:'||u.hostname!=='github.com'||u.username||u.password||u.search||u.hash||
     p.length!==2||p.some(x=>!(/^[a-zA-Z0-9_.-]{1,100}$/.test(x))))
    throw Error('TENANT_GITHUB_REPOSITORY_INVALID');
  return 'https://github.com/'+p.join('/');
}
export function createTenantInstallPlan(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('TENANT_OWNER_INPUT_REQUIRED');
  const allowed=['instanceKind','tenantLabel','githubRepository'];
  if(Object.keys(input).some(k=>!allowed.includes(k)))throw Error('TENANT_SECRET_OR_UNKNOWN_INPUT_REFUSED');
  const kind=String(input.instanceKind||'').toUpperCase();
  if(!['PERSONAL','INDUSTRIAL'].includes(kind))
    throw Error('CREATOR_INSTANCE_IS_NOT_CLONABLE_BY_PUBLIC_INSTALLER');
  const label=String(input.tenantLabel||'').trim();
  if(!label||label.length>60)throw Error('TENANT_LABEL_REQUIRED');
  const githubRepository=repository(input.githubRepository);
  return {
    schemaVersion:'leeway.operating-system.install-plan.v1',
    classification:'SOURCE_PLAN_ONLY_NOT_INSTALLED',
    tenant:{instanceKind:kind,tenantLabel:label,githubRepository,
      githubAccount:'TENANT_OWNED_NOT_AUTHENTICATED',
      zitadelOwnerSubject:'TENANT_ENROLLMENT_REQUIRED',
      creatorPrivilege:'NOT_COPIED'},
    services:SERVICES.map(s=>({...s})),
    freeHosting:{
      provider:'Render',workspaceOwner:'TENANT_ACCOUNT_NOT_CONNECTED',
      plan:'free',freeInstanceHoursPerWorkspacePerMonth:750,
      admission:'USER_PROVIDER_CONFIRMATION_REQUIRED',
      noCreditCardGuarantee:'NOT_CLAIMED',
      neverCloneCreatorWorkspace:true
    },
    capabilities:{
      creatorAuthority:'EXTERNAL_CREATOR_LICENSE_AND_REVOCATION_ONLY',
      personalTablet:'PUBLIC_SOURCE_ENTRY',
      localEmployeeDesign:'AVAILABLE_ONLY_AFTER_OWNER_RUNTIME_ADMISSION',
      remoteEmployeeDispatch:'DENIED_UNLESS_CREATOR_LICENSE_RUNTIME_GRANT_AND_CONSENT',
      businessEntitlements:'CANONICAL_RUNTIME_LICENSE_REQUIRED',
      deviceExecution:'NOT_AUTHORIZED',
      adapters:['Microsoft Windows','Linux','Apple','Android'].map(os=>({os,state:'NOT_ENROLLED'}))
    },
    recovery:{
      githubSource:'PUBLIC_SOURCE_OR_OWNER_AUTHENTICATED_PRIVATE_REPOSITORY',
      githubRole:'CUSTOMER_OWNED_PROJECT_RECOVERY_ANCHOR_NOT_LIVE_DATABASE',
      projectManifest:'leeway.project.json',
      continuumAuthorityRef:'leeway.continuum',
      logicalCompartments:['runtime-state','evidence-vault','memory','learning'],
      databaseAuthority:'CANONICAL_CONTINUUM_ONLY',
      formulaCodec:'EXACT_LOSSLESS_AND_SHA256_READBACK_REQUIRED',
      githubCheckpointPolicy:'VERSIONED_GOVERNED_ENCRYPTED_SNAPSHOTS_NOT_PER_WRITE',
      encryptedContinuum:'NOT_PROVISIONED',
      keyCustody:'NOT_PROVEN',
      allDevicesLostRestore:'NOT_QUALIFIED'
    },
    pendingOwnerActions:[
      'Authorize GitHub repository in tenant account',
      'Confirm tenant-owned Render Free workspace without paid upgrade',
      'Enroll separate tenant Zitadel owner subject and approved release',
      'Bind tenant-specific Runtime, Bridge, Continuum and device passports',
      'Verify signed Creator license and revocation on Runtime',
      'Test physical adapter denial, reconnect, restore and rollback'
    ]
  };
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
  const [instanceKind,tenantLabel,githubRepository,...other]=process.argv.slice(2);
  if(other.length)throw Error('UNEXPECTED_TENANT_ARGUMENTS');
  const plan=createTenantInstallPlan({instanceKind,tenantLabel,githubRepository});
  process.stdout.write(JSON.stringify(plan,null,2)+'\n');
}
