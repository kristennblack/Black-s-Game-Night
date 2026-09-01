#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function readGlb(file){
  const b=fs.readFileSync(file);if(b.length<20)throw new Error('File too small for GLB');
  if(b.toString('ascii',0,4)!=='glTF')throw new Error('Not a binary glTF/GLB file');
  const version=b.readUInt32LE(4),length=b.readUInt32LE(8);if(version!==2)throw new Error(`Unsupported glTF version ${version}`);if(length>b.length)throw new Error('GLB declared length exceeds file size');
  let off=12,json=null;while(off+8<=length){const len=b.readUInt32LE(off),type=b.readUInt32LE(off+4);off+=8;const chunk=b.subarray(off,off+len);off+=len;if(type===0x4E4F534A)json=JSON.parse(chunk.toString('utf8').replace(/\0+$/,''));}
  if(!json)throw new Error('GLB has no JSON chunk');return {json,bytes:b.length};
}
function accessorCount(g,i){return Number(g.accessors?.[i]?.count||0)}
function triangles(g){let n=0;for(const mesh of g.meshes||[])for(const p of mesh.primitives||[]){const mode=p.mode??4;if(mode!==4)continue;const c=p.indices!=null?accessorCount(g,p.indices):accessorCount(g,p.attributes?.POSITION);n+=Math.floor(c/3)}return n}
function mapCoverage(g){const out={baseColor:0,normal:0,roughnessMetallic:0,occlusion:0,emissive:0};for(const m of g.materials||[]){if(m.pbrMetallicRoughness?.baseColorTexture)out.baseColor++;if(m.normalTexture)out.normal++;if(m.pbrMetallicRoughness?.metallicRoughnessTexture)out.roughnessMetallic++;if(m.occlusionTexture)out.occlusion++;if(m.emissiveTexture)out.emissive++;}return out}
function audit(file){const {json:g,bytes}=readGlb(file),maps=mapCoverage(g);return {file:path.resolve(file),bytes,megabytes:+(bytes/1024/1024).toFixed(2),scenes:(g.scenes||[]).length,nodes:(g.nodes||[]).length,meshes:(g.meshes||[]).length,triangles:triangles(g),materials:(g.materials||[]).length,textures:(g.textures||[]).length,images:(g.images||[]).length,skins:(g.skins||[]).length,joints:(g.skins||[]).reduce((n,s)=>n+(s.joints?.length||0),0),animations:(g.animations||[]).length,animationNames:(g.animations||[]).map(a=>a.name||'(unnamed)'),maps,extensionsUsed:g.extensionsUsed||[],extensionsRequired:g.extensionsRequired||[]}}
const files=process.argv.slice(2);if(!files.length){console.error('Usage: node tools/w40_audit_external_glb.mjs <file.glb> [more.glb]');process.exit(2)}
let failed=false;for(const file of files){try{const r=audit(file);console.log(JSON.stringify(r,null,2));if(r.meshes<1||r.triangles<100){console.error(`W40 AUDIT FAIL ${file}: insufficient visible geometry`);failed=true}}catch(err){console.error(`W40 AUDIT FAIL ${file}: ${err.message}`);failed=true}}
process.exitCode=failed?1:0;
