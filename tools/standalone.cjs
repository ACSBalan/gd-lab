/* Build the complete integrated app as one local HTML file, without runtime requests. */
const fs=require('node:fs'),path=require('node:path');
function standalone(root,destination){
 const read=p=>fs.readFileSync(path.join(root,p),'utf8');
 const data=(p,type)=>'data:'+type+';base64,'+fs.readFileSync(path.join(root,p)).toString('base64');
 const script=s=>s.replace(/<\/script/gi,'<\\/script');
 let html=read('index.html');
 html=html.replace(/<link rel="manifest"[^>]*>/,'');
 html=html.replace(/href="\.\/(icons\/[^\"]+)"/g,(_,p)=>'href="'+data(p,'image/png')+'"');
 html=html.replace(/<link rel="stylesheet" href="\.\/([^\"]+)">/g,(_,p)=>'<style>'+read(p)+'</style>');
 const imports={},names=new Map();
 function moduleId(file){
  file=file.replaceAll('\\','/');if(names.has(file))return names.get(file);
  const name='gd-'+file.replace(/[^a-z0-9]/gi,'-');names.set(file,name);
  const source=read(file).replace(/\bfrom\s*(['"])([^'"]+)\1/g,(all,quote,specifier)=>{
   if(specifier!=='three'&&!specifier.startsWith('.'))return all;
   const dependency=specifier==='three'?'vendor/three.module.js':path.posix.normalize(path.posix.join(path.posix.dirname(file),specifier));
   return 'from '+JSON.stringify(moduleId(dependency));
  });
  imports[name]='data:text/javascript;base64,'+Buffer.from(source).toString('base64');return name;
 }
 const entry=moduleId('scripts/studio.js');
 html=html.replace(/<script type="importmap">[\s\S]*?<\/script>/,'<script type="importmap">'+JSON.stringify({imports})+'</script>');
 const images=Object.fromEntries(fs.readdirSync(path.join(root,'images')).filter(p=>p.endsWith('.png')).map(p=>[path.basename(p,'.png'),data('images/'+p,'image/png')]));
 html=html.replace('<script src="./data/bundle.js">','<script>window.GD_STANDALONE=true;window.GD_IMAGES='+JSON.stringify(images)+';</script><script src="./data/bundle.js">');
 html=html.replace(/<script src="\.\/([^\"]+)"><\/script>/g,(_,p)=>'<script>'+script(read(p))+'</script>');
 html=html.replace(/<script type="module" src="\.\/scripts\/studio.js"><\/script>/,'<script type="module">import '+JSON.stringify(entry)+';</script>');
 if(/(?:src|href)="\.\//.test(html))throw new Error('A local runtime dependency was not embedded');
 fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,html);
 return {bytes:Buffer.byteLength(html),modules:names.size,images:Object.keys(images).length};
}
if(require.main===module)console.log(JSON.stringify(standalone(process.cwd(),path.resolve(process.argv[2]||'GD_Lab.html'))));
module.exports={standalone};
