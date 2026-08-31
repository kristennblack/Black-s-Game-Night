import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const cabin=fs.readFileSync(new URL('../public/cabin.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/cabin.css',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../public/cabin.html',import.meta.url),'utf8');

test('cabin overview is not blocked by eager 3D CDN import',()=>{
  assert.ok(!cabin.includes("import { mountCabinRoom3D } from './cabin-3d-room.mjs';"));
  assert.ok(cabin.includes("import('./cabin-3d-room.mjs')"));
  assert.ok(cabin.includes('/cabin-assets/cabin-aerial-scene.jpg'));
});

test('cabin has visible static shell while 3D loads or fails',()=>{
  assert.ok(cabin.includes('cabin3d-static-fallback'));
  assert.ok(cabin.includes('/cabin-assets/generated/empty-room-shell.svg'));
  assert.ok(cabin.includes('3D view unavailable. Your room and cabin data are safe; refresh to retry.'));
  assert.ok(css.includes('.cabin3d-static-fallback'));
});

test('service worker precaches core cabin presentation assets',()=>{
  for(const asset of ['/cabin.html','/cabin.css','/cabin.js','/cabin-3d-room.mjs','/cabin-assets/generated/empty-room-shell.svg','/cabin-assets/cabin-aerial-scene.jpg']){
    assert.ok(sw.includes(`'${asset}'`),`missing ${asset}`);
  }
});

test('cabin entrypoint remains intact',()=>{
  assert.ok(html.includes('id="cabinApp"'));
  assert.ok(html.includes('type="module" src="/cabin.js"'));
});
