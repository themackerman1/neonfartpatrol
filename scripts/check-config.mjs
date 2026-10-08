import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync('wrangler.json','utf8'));
const id=config.d1_databases?.find(x=>x.binding==='DB')?.database_id;
if(!id||! /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)||id==='00000000-0000-0000-0000-000000000000'){
 console.error('Set database_id in wrangler.json to the ID printed by npm run db:create, then deploy again.');process.exit(1);
}
console.log('D1 configuration ready.');
