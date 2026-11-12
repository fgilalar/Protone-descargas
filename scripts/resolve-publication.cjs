'use strict';
const fs=require('node:fs');
function resolvePublication(event,manualRef,request){
 if(event==='workflow_dispatch'){
  if(typeof manualRef!=='string'||!manualRef.trim()||manualRef.length>200||/[\r\n\0]/.test(manualRef))throw Error('Referencia de código no válida.');
  return {source_ref:manualRef,expected_version:''};
 }
 if(event!=='push')throw Error('Evento de publicación no admitido.');
 if(!request||typeof request.source_sha!=='string'||!/^[a-f0-9]{40}$/.test(request.source_sha))throw Error('La orden debe indicar un source_sha completo de 40 caracteres.');
 if(typeof request.version!=='string'||!/^\d+\.\d+\.\d+(?:-rc\.\d+)?$/.test(request.version))throw Error('La orden debe indicar X.Y.Z o X.Y.Z-rc.N.');
 return {source_ref:request.source_sha,expected_version:request.version};
}
if(require.main===module){
 try{
  const request=process.env.RELEASE_EVENT==='push'?JSON.parse(fs.readFileSync('.release-control/.github/publicacion.json','utf8')):null;
  const result=resolvePublication(process.env.RELEASE_EVENT,process.env.MANUAL_SOURCE_REF,request);
  fs.appendFileSync(process.env.GITHUB_OUTPUT,Object.entries(result).map(([k,v])=>k+'='+v+'\n').join(''));
 }catch(error){console.error(error.message);process.exitCode=1}
}
module.exports={resolvePublication};
