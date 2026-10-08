import fs from 'node:fs';
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist/server',{recursive:true});
const html=fs.readFileSync('public/index.html','utf8').replace('/*GAME_SCRIPT*/',()=>fs.readFileSync('public/game.js','utf8'));const rules=fs.readFileSync('worker/rules.js','utf8').replace(/export /g,'');const api=fs.readFileSync('worker/api.js','utf8').replace(/^import .*\n/,'').replace(/export /g,'');
fs.writeFileSync('dist/server/index.js',rules+'\n'+api+'\nconst HTML='+JSON.stringify(html)+';\nexport default {async fetch(request,env){const url=new URL(request.url);if(url.pathname.startsWith("/api/"))return api(request,env);if(url.pathname!=="/")return new Response("Not found",{status:404});return new Response(HTML,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-cache"}});}};\n');
console.log('Multiplayer Worker built.');
