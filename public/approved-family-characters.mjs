/*
 * Black Family Game Night - Approved Family Character Registry
 * Phase W.5 - 2026-08-27
 *
 * PURPOSE
 * -------
 * This file is the code-level identity lock for family characters whose
 * ultra-simplified 3D turnaround has been explicitly approved by Kristen.
 *
 * IMPORTANT:
 * - The approved turnaround controls identity. Never redesign from memory.
 * - Simplify geometry, not identity.
 * - A turnaround PNG is an art/source reference, not a GLB model.
 * - `expectedModel` is the path a future authored GLB must use after it passes
 *   visual comparison against the approved turnaround.
 * - Until an approved GLB exists, games may use the lightweight procedural
 *   fallback style below without claiming the authored model is complete.
 */

export const APPROVED_FAMILY_CHARACTER_VERSION='W5-approved-turnarounds-2026-08-27';
export const APPROVED_VIEW_ORDER=Object.freeze(['front','front3q','side','back3q','back']);
const APPROVED_MODEL_DIRECTORY='/models/characters/'+'approved';

const human=(spec)=>Object.freeze({
  kind:'human',
  approvalStatus:'TURNAROUND_APPROVED_MODEL_PENDING',
  identityLocked:true,
  geometryPolicy:'SIMPLIFY_GEOMETRY_NOT_IDENTITY',
  views:APPROVED_VIEW_ORDER,
  rig:'shared-humanoid-v1',
  lods:['LOD0','LOD1','LOD2'],
  texturePolicy:'mobile-first atlas; preserve approved colours and clothing read',
  sockets:['rightHand','leftHand','back','head'],
  cosmeticSockets:Object.freeze({hat:'HeadTop',glasses:'Face',accessory:'ChestAccessory'}),
  cosmeticPolicy:'Only unlocked catalog cosmetics may be attached as removable child meshes; never alter base identity geometry.',
  baseAnimations:['idle','walk','run','sprint','turnLeft','turnRight','jump','fall','land','crouch','wave','point','react','celebrate'],
  ...spec
});

export const APPROVED_FAMILY_CHARACTERS=Object.freeze({
  john:human({
    id:'john',characterCode:'CHAR_JOHN',displayName:'John Black',referenceHeightM:1.82,
    turnaround:'/approved-character-turnarounds/john-approved-turnaround.png',
    expectedModelFile:'CHAR_JOHN.glb',
    legacyRuntimeModel:'/models/characters/john-production-skinned.glb',
    triangleBudget:{lod0:6500,lod1:3200,lod2:1400},
    proportions:{bodyWidth:1.00,hipWidth:1.00,headScale:1.02},
    style:{skin:0xd9a06f,hair:0x3b291d,top:0x8b2f27,legs:0x2f5f91,boots:0x6b431f,pattern:'plaid'},
    identity:{hairStyle:'short side-swept brown hair',facialHair:'full short brown beard',glasses:false,outfit:'red/black plaid shirt, blue jeans, brown work boots, brown belt'}
  }),
  kristen:human({
    id:'kristen',characterCode:'CHAR_KRISTEN',displayName:'Kristen Black',referenceHeightM:1.77,
    turnaround:'/approved-character-turnarounds/kristen-approved-turnaround.png',
    expectedModelFile:'CHAR_KRISTEN.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_KRISTEN.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:6200,lod1:3000,lod2:1300},
    proportions:{bodyWidth:.94,hipWidth:.97,headScale:1.03},
    style:{skin:0xe0ab81,hair:0xe1a140,top:0x181818,legs:0x2f5f91,boots:0x6b431f},
    identity:{hairStyle:'shoulder-length wavy blonde hair',facialHair:'none',glasses:false,outfit:'black fitted T-shirt, blue jeans, brown belt, brown boots'}
  }),
  holly:human({
    id:'holly',characterCode:'CHAR_HOLLY',displayName:'Holly',referenceHeightM:1.42,
    turnaround:'/approved-character-turnarounds/holly-approved-turnaround.png',
    expectedModelFile:'CHAR_HOLLY.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_HOLLY.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:5200,lod1:2500,lod2:1100},
    proportions:{bodyWidth:.88,hipWidth:.89,headScale:1.13},
    style:{skin:0xefb98c,hair:0xe9a539,top:0xe8c98f,legs:0x2f5f91,boots:0x6b431f,backpack:0x2e6fa8},
    identity:{hairStyle:'bright blonde double buns with simple loose front pieces',facialHair:'none',glasses:false,outfit:'cream padded sweater/vest look, blue pants, blue backpack straps, brown shoes'}
  }),
  vanessa:human({
    id:'vanessa',characterCode:'CHAR_VANESSA',displayName:'Vanessa',referenceHeightM:1.79,
    turnaround:'/approved-character-turnarounds/vanessa-approved-turnaround.png',
    expectedModelFile:'CHAR_VANESSA.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_VANESSA.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:6500,lod1:3200,lod2:1400},
    proportions:{bodyWidth:.95,hipWidth:.98,headScale:1.02},
    style:{skin:0xe0aa82,hair:0xe6a13e,top:0x8d3b34,legs:0x2f5f91,boots:0x6b431f},
    identity:{hairStyle:'long voluminous curly blonde hair',facialHair:'none',glasses:false,outfit:'dark red/maroon long-sleeve top, blue jeans, brown belt, brown boots'}
  }),
  elizabeth:human({
    id:'elizabeth',aliases:['lizzie'],characterCode:'CHAR_LIZZIE',displayName:'Elizabeth (Lizzy)',referenceHeightM:1.46,
    turnaround:'/approved-character-turnarounds/elizabeth-approved-turnaround.png',
    expectedModelFile:'CHAR_LIZZIE.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_LIZZIE.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:5200,lod1:2500,lod2:1100},
    proportions:{bodyWidth:.89,hipWidth:.90,headScale:1.12},
    style:{skin:0xefb98c,hair:0xe9a539,top:0xf3a8b9,skirt:0xee7896,legs:0xf4c6a2,boots:0xf06b95,accent:0xffffff},
    identity:{hairStyle:'bright blonde high ponytail with large pink bow',facialHair:'none',glasses:false,outfit:'pink hoodie, pink white-polka-dot skirt, white socks, pink Crocs'}
  }),
  logan:human({
    id:'logan',characterCode:'CHAR_LOGAN',displayName:'Logan',referenceHeightM:1.82,
    turnaround:'/approved-character-turnarounds/logan-approved-turnaround.png',
    expectedModelFile:'CHAR_LOGAN.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_LOGAN.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:5600,lod1:2700,lod2:1200},
    proportions:{bodyWidth:.95,hipWidth:.94,headScale:1.01},
    style:{skin:0xe6b080,hair:0xe0a13f,top:0x1b1b1b,legs:0x202020,boots:0xa36a28,accent:0xd68a18},
    identity:{hairStyle:'short messy/spiky blonde hair',facialHair:'none',glasses:false,outfit:'black fishing-logo hoodie, black cargo pants, tan/brown work boots'}
  }),
  james:human({
    id:'james',characterCode:'CHAR_JAMES',displayName:'James',referenceHeightM:1.75,
    turnaround:'/approved-character-turnarounds/james-approved-turnaround.png',
    expectedModelFile:'CHAR_JAMES.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_JAMES.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:5600,lod1:2700,lod2:1200},
    proportions:{bodyWidth:1.02,hipWidth:1.00,headScale:1.03},
    style:{skin:0xd7a47c,hair:0x9e9b93,top:0x2669b3,legs:0x2f5f91,boots:0x6b431f,glasses:0x262626},
    identity:{hairStyle:'short curly grey hair',facialHair:'grey moustache only',glasses:true,outfit:'bright blue button-up shirt, blue jeans, brown belt, brown shoes'}
  }),
  dorothy:human({
    id:'dorothy',characterCode:'CHAR_DOROTHY',displayName:'Dorothy',referenceHeightM:1.69,
    turnaround:'/approved-character-turnarounds/dorothy-approved-turnaround.png',
    expectedModelFile:'CHAR_DOROTHY.glb',
    v1CandidateModel:'/models/characters/approved/CHAR_DOROTHY.glb',v1CandidateStatus:'W29_V1_CANDIDATE_DEVICE_PENDING',
    triangleBudget:{lod0:5800,lod1:2800,lod2:1250},
    proportions:{bodyWidth:.94,hipWidth:.98,headScale:1.04},
    style:{skin:0xe2aa82,hair:0xe0a13f,top:0x2e6fa8,legs:0x2e6fa8,boots:0x2e5e83,apron:0xe8d6b8,floral:0xd98573},
    identity:{hairStyle:'blonde hair in a neat high updo/bun; no glasses',facialHair:'none',glasses:false,outfit:'blue long-sleeve dress/top with cream floral apron and blue shoes'}
  })
});

export const APPROVED_FAMILY_CHARACTER_IDS=Object.freeze(Object.keys(APPROVED_FAMILY_CHARACTERS));

export function canonicalFamilyCharacterId(id=''){
  const key=String(id).trim().toLowerCase();
  if(key==='lizzie')return'elizabeth';
  return key;
}

export function getApprovedFamilyCharacter(id){
  return APPROVED_FAMILY_CHARACTERS[canonicalFamilyCharacterId(id)]||null;
}

export function isTurnaroundApproved(id){
  return !!getApprovedFamilyCharacter(id)?.identityLocked;
}

/** Return the exact lightweight material colours used by procedural fallback rigs. */
export function approvedFallbackStyle(id,fallback={}){
  const spec=getApprovedFamilyCharacter(id);
  return spec?{...fallback,...spec.style}:fallback;
}

/**
 * Attach the approval contract to a loaded or procedural 3D root.
 * This does not certify the geometry as approved; it records what reference it
 * must match and prevents downstream systems from silently inventing identity.
 */
export function tagWithApprovedIdentity(root,id,{modelMatchesReference=false}={}){
  const spec=getApprovedFamilyCharacter(id);if(!root||!spec)return root;
  root.userData=root.userData||{};
  root.userData.familyCharacterApproval={
    version:APPROVED_FAMILY_CHARACTER_VERSION,
    id:spec.id,
    characterCode:spec.characterCode,
    turnaround:spec.turnaround,
    identityLocked:true,
    modelMatchesReference:!!modelMatchesReference,
    rule:'APPROVED TURNAROUND CONTROLS IDENTITY; SIMPLIFY GEOMETRY, NOT IDENTITY'
  };
  return root;
}

/** Candidate model path for an asset-authoring/import pipeline. */
export function expectedApprovedModelPath(id){
  const s=getApprovedFamilyCharacter(id);return s?`${APPROVED_MODEL_DIRECTORY}/${s.expectedModelFile}`:null;
}

/** Compact QA record usable by tests, build scripts and future GLB audits. */
export function approvedCharacterQaContract(id){
  const s=getApprovedFamilyCharacter(id);if(!s)return null;
  return Object.freeze({
    id:s.id,characterCode:s.characterCode,turnaround:s.turnaround,expectedModelFile:s.expectedModelFile,
    requiredViews:[...s.views],identityLocked:true,
    cosmeticSockets:{...s.cosmeticSockets},
    rejectIf:['skin-tone-changed','hair-colour-changed','hair-style-changed','clothing-redesigned','face-redesigned','unapproved-nonstore-accessory-added']
  });
}
