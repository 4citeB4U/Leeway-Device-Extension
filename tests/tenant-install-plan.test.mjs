/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.TENANT_BOOTSTRAP.TEST
TAG: LEEWAY.OPERATING_SYSTEM.TENANT_INSTALL_NEGATIVE_TESTS.V1
5WH:
WHAT = Test public customer installation plan rejects Creator privilege, secrets, non-GitHub ownership and falsely provisioned services.
WHY = Ensure owner-account segregation and free-tier truth before native customer provisioning exists.
WHO = Creator-authorized outside GPT-6 source contributor; not Veritas.
WHERE = tests/tenant-install-plan.test.mjs in 4citeB4U/Leeway-Device-Extension.
WHEN = 2026-11-23.
HOW = Node assertions over actual tenant-install-plan.mjs, without network, login or deployment.
LICENSE = Existing repository terms apply.
*/
import test from 'node:test';
import assert from 'node:assert/strict';
import {createTenantInstallPlan} from '../provisioning/tenant-install-plan.mjs';

const personal={instanceKind:'personal',tenantLabel:'Customer Family',
 githubRepository:'https://github.com/customer/new-leeway'};
test('personal customer owns service resources while retaining Creator licensing boundaries',()=>{
 const plan=createTenantInstallPlan(personal);
 assert.equal(plan.tenant.instanceKind,'PERSONAL');
 assert.equal(plan.tenant.githubRepository,'https://github.com/customer/new-leeway');
 assert.equal(plan.tenant.creatorPrivilege,'NOT_COPIED');
 assert.equal(plan.freeHosting.plan,'free');
 assert.equal(plan.freeHosting.freeInstanceHoursPerWorkspacePerMonth,750);
 assert.equal(plan.freeHosting.workspaceOwner,'TENANT_ACCOUNT_NOT_CONNECTED');
 assert.equal(plan.capabilities.remoteEmployeeDispatch,'DENIED_UNLESS_CREATOR_LICENSE_RUNTIME_GRANT_AND_CONSENT');
 assert.equal(plan.capabilities.adapters.length,4);
 assert.ok(plan.services.every(s=>s.state!=='DEPLOYED'&&s.state!=='READY'));
 assert.equal(plan.recovery.allDevicesLostRestore,'NOT_QUALIFIED');
 assert.doesNotMatch(JSON.stringify(plan),/397621082842543343|token_secret|private\.pem|LEEWAY_MCP_OWNER_SUB/);
});
test('industrial services do not inherit Creator workforce export privilege',()=>{
 const plan=createTenantInstallPlan({...personal,instanceKind:'INDUSTRIAL'});
 assert.equal(plan.tenant.instanceKind,'INDUSTRIAL');
 assert.match(plan.capabilities.remoteEmployeeDispatch,/DENIED_UNLESS_CREATOR_LICENSE/);
});
test('Creator installation is non-transferable and secrets may never enter public plan',()=>{
 assert.throws(()=>createTenantInstallPlan({...personal,instanceKind:'CREATOR'}),/NOT_CLONABLE/);
 assert.throws(()=>createTenantInstallPlan({...personal,ownerSub:'397621082842543343'}),/SECRET_OR_UNKNOWN_INPUT_REFUSED/);
 assert.throws(()=>createTenantInstallPlan({...personal,renderApiKey:'secret'}),/SECRET_OR_UNKNOWN_INPUT_REFUSED/);
 assert.throws(()=>createTenantInstallPlan({...personal,license:'creator'}),/SECRET_OR_UNKNOWN_INPUT_REFUSED/);
 assert.throws(()=>createTenantInstallPlan({...personal,githubRepository:'https://github.com/4citeB4U/Leeway-Device-Extension/tree/main'}),/INVALID/);
 assert.throws(()=>createTenantInstallPlan({...personal,githubRepository:'http://github.com/customer/repo'}),/INVALID/);
 assert.throws(()=>createTenantInstallPlan({...personal,githubRepository:'https://bad.example/repo'}),/INVALID/);
});
