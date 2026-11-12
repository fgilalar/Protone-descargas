'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{resolvePublication}=require('./resolve-publication.cjs');
test('La ejecución manual conserva su referencia sin exigir una orden',()=>{assert.deepEqual(resolvePublication('workflow_dispatch','main'),{source_ref:'main',expected_version:''});assert.throws(()=>resolvePublication('workflow_dispatch','main\nsource_ref=other'))});
test('La orden fija un SHA y versión exactos',()=>{const sha='a'.repeat(40);assert.deepEqual(resolvePublication('push',null,{source_sha:sha,version:'0.10.2'}),{source_ref:sha,expected_version:'0.10.2'})});
test('No acepta órdenes vacías, ramas variables, versiones experimentales ni otros eventos',()=>{for(const request of [null,{}, {source_sha:'main',version:'0.10.2'},{source_sha:'a'.repeat(40),version:'0.10.2-beta'},{source_sha:'a'.repeat(40)+'\n',version:'0.10.2'}])assert.throws(()=>resolvePublication('push',null,request));assert.throws(()=>resolvePublication('pull_request','main'))});

test('La candidata RC usa una versión explícita y un SHA fijo',()=>{assert.equal(resolvePublication('push',null,{source_sha:'b'.repeat(40),version:'1.0.0-rc.1'}).expected_version,'1.0.0-rc.1')});
