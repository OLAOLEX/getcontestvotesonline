import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
execFileSync(process.execPath,['build.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['check.mjs'],{stdio:'inherit'});
const dest=new URL('../production-package/',import.meta.url);
const origin='https://getcontestvotesonline.com';
const urls=[...(await readFile('sitemap.xml','utf8')).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
const manifest={preparedAt:new Date().toISOString(),origin,files:{},status:'Prepared only; not deployed. Confirm domain/contact/HTTPS before publication.'};
async function save(path,data){await mkdir(new URL('./'+path.slice(0,path.lastIndexOf('/')+1),dest),{recursive:true});await writeFile(new URL(path,dest),data);manifest.files[path]=createHash('sha256').update(data).digest('hex');}
for(const url of urls){if(url.origin!==origin)throw Error('Unexpected sitemap origin');const path=url.pathname.slice(1)+'index.html';let s=await readFile(path,'utf8');s=s.replaceAll('content="noindex,nofollow"','content="index,follow"').replace(/<div class="preview">.*?<\/div>/s,'');await save(path,s);}
for(const path of ['components.css','site.css','forms.css','polish.css','site.mjs','planner.mjs','intake.mjs','submit.mjs','assets/logo-mark.png','assets/contest-supporters.webp','assets/contest-supporters-small.webp','assets/contest-people.webp','assets/contest-people-small.webp','sitemap.xml','404.html'])await save(path,await readFile(path));
await save('robots.txt','User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
await save('_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
await save('_redirects','/index.html / 301\n');
for(const url of urls){const s=await readFile(new URL(url.pathname.slice(1)+'index.html',dest),'utf8');if(s.includes('noindex')||s.includes('LOCAL PREVIEW'))throw Error('Preview markup in release');if(!s.includes('href="'+url.href+'"'))throw Error('Missing canonical');}
if(!(await readFile(new URL('404.html',dest),'utf8')).includes('noindex'))throw Error('404 indexable');
await writeFile(new URL('../PRODUCTION-PACKAGE-MANIFEST.json',dest),JSON.stringify(manifest,null,2));
console.log('Production package prepared at '+dest.pathname+'; '+urls.length+' indexable pages, no raw generation assets or authoring scripts. Not deployed.');
