/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.DEVICE_EXTENSION.CUSTOMER_INVITE_LANDING
TAG: LEEWAY.DEVICE_EXTENSION.FRAGMENT_INVITE_PRIVATE_STAGE_V1
5WH:
WHAT = Recognize one original hashed single-use Creator invitation URL without leaking its code.
WHY = Customers arrive from emailed Device Bridge invitations and cannot self-grant Creator access.
WHO = Original Runtime invitation issuer; public join UI is not authentication authority.
WHERE = docs/join/invitation-landing.js.
WHEN = 2026-11-24.
HOW = Parse and immediately erase URL fragment; show non-authoritative status; no network write or browser storage.
LICENSE = Existing repository terms; no standalone customer registry.
*/
(function(root){
'use strict';
const doc=root.document;if(!doc)return;
const status=doc.getElementById('invitationStatus');
if(!status)return;
const hash=String(root.location?.hash||'');
const match=/^#invite=([0-9a-fA-F-]{36})\.([A-Za-z0-9_-]{43})$/.exec(hash);
try{
 // The link contains an opaque single-use code; remove it from the
 // address bar and history before any other action. Never log it.
 if(hash&&root.history?.replaceState)
  root.history.replaceState(null,'',root.location.pathname+root.location.search);
}catch{/* Erasure not proven, so no private code is sent to any backend. */}
if(match){
 status.textContent='Invitation link received. Verification pending: the original Runtime login and invitation-redemption endpoint is not connected yet. You may review the setup, but cannot register, download a protected package, or enroll a device from this page.';
}else{
 status.textContent='No valid invitation reference detected. Ask the LeeWay Creator for an invitation, or use your existing authorized account when the original Runtime login is connected.';
}
})(globalThis);
