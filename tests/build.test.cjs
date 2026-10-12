const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {build,files}=require('../tools/build.cjs'),repo=path.resolve(__dirname,'..');
test('M5: data-only changes produce a different complete offline bundle and worker',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'gd-build-test-')),out=path.join(temp,'output');
 try{for(const f of files(repo)){const target=path.join(temp,f);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(repo,f),target);}
 const first=build(temp,out),worker=fs.readFileSync(path.join(out,'sw.js'),'utf8');assert.ok(worker.includes(first.revision));assert.ok(!worker.includes('__GD_BUILD_HASH__'));assert.equal(build(temp,out).revision,first.revision);
 fs.appendFileSync(path.join(temp,'data/bundle.js'),'\n/* updated educational content */\n');const second=build(temp,out);assert.notEqual(second.revision,first.revision);assert.notEqual(fs.readFileSync(path.join(out,'sw.js'),'utf8'),worker);
 const manifest=JSON.parse(fs.readFileSync(path.join(out,'build-info.json'),'utf8'));for(const [file,hash] of Object.entries(manifest.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(out,file))).digest('hex'),hash);
 }finally{if(path.dirname(temp)===path.resolve(os.tmpdir())&&path.basename(temp).startsWith('gd-build-test-'))fs.rmSync(temp,{recursive:true,force:true});}
});
