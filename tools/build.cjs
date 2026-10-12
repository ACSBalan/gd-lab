const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function files(root){return ['index.html','styles.css','studio.css','manifest.webmanifest','sw.js','data/bundle.js','data/exam.js','data/cards.json','data/seminar.json',...fs.readdirSync(path.join(root,'scripts')).filter(n=>n.endsWith('.js')).map(n=>'scripts/'+n),...fs.readdirSync(path.join(root,'vendor')).filter(n=>n.endsWith('.js')||n==='LICENSE').map(n=>'vendor/'+n),...fs.readdirSync(path.join(root,'images')).map(n=>'images/'+n),...fs.readdirSync(path.join(root,'icons')).map(n=>'icons/'+n)].sort();}
function revision(root){return sha(files(root).map(f=>f+'\0'+sha(fs.readFileSync(path.join(root,f)))).join('\n'));}
function serviceWorker(root){return fs.readFileSync(path.join(root,'sw.js'),'utf8').replace('__GD_BUILD_HASH__',revision(root));}
function build(root=process.cwd(),dest=path.join(root,'dist')){
 const inputs=files(root),version=revision(root),hashes={};
 for(const file of inputs){const bytes=file==='sw.js'?Buffer.from(fs.readFileSync(path.join(root,file),'utf8').replace('__GD_BUILD_HASH__',version)):fs.readFileSync(path.join(root,file));const target=path.join(dest,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);hashes[file]=sha(bytes);}
 fs.writeFileSync(path.join(dest,'.nojekyll'),'');fs.writeFileSync(path.join(dest,'build-info.json'),JSON.stringify({builtAt:new Date().toISOString(),revision:version,files:hashes},null,2));return {files:inputs,revision:version};
}
if(require.main===module){const r=build();console.log('Built '+r.files.length+' offline assets; revision '+r.revision.slice(0,12)+'.');}
module.exports={files,revision,serviceWorker,build};
