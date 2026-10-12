/* Analytic reference drawings. Render at 2x; no geometric content is painted by hand. */
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('@playwright/test');
const ink='#17364f',blue='#167294',orange='#aa5b23';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(x,y,s,size=19,color=ink,anchor='middle')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color=ink,width=1.5)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
const wrap=(title,body,w=1200,h=780)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Arial, sans-serif"><rect width="100%" height="100%" fill="white"/>${text(w/2,44,title,25)}${body}</svg>`;
function p14(){
 const scale=140,X=x=>95+x*scale,Y=z=>530-z*scale;
 let b=`<path d="M${X(0)} ${Y(0)}H${X(6.45)}V${Y(2.8)}H${X(0)}Z" fill="none" stroke="${ink}" stroke-width="3"/>`;
 for(const [x,z,w,h] of [[.9,0,.9,2.1],[3.3,.9,1.2,1.2]])b+=`<rect x="${X(x)}" y="${Y(z+h)}" width="${w*scale}" height="${h*scale}" fill="#edf7fa" stroke="${blue}" stroke-width="2.5"/>`;
 b+=text(X(1.35),Y(.8),'Ușă',19,blue)+text(X(3.9),Y(1.45),'Fereastră',19,blue);
 const ends=[0,.9,1.8,3.3,4.5,6.45];
 for(const x of ends)b+=line(X(x),Y(0)+10,X(x),650,'#8c9ca7',1);
 function dimension(a,c,y,label){return line(X(a),y,X(c),y)+line(X(a)-5,y+5,X(a)+5,y-5)+line(X(c)-5,y+5,X(c)+5,y-5)+text((X(a)+X(c))/2,y-12,label);}
 ['90','90','1,50','1,20','1,95'].forEach((s,i)=>b+=dimension(ends[i],ends[i+1],590,s));
 b+=dimension(0,6.45,648,'6,45');
 for(const [z,s] of [[0,'±0,00'],[.9,'+0,90'],[2.1,'+2,10'],[2.8,'+2,80']]){const x=1024,y=Y(z);b+=line(X(6.45),y,1125,y,orange,1)+`<path d="M${x-7} ${y-12}L${x+7} ${y-12}L${x} ${y}Z" fill="white" stroke="${orange}"/><path d="M${x-7} ${y-12}L${x} ${y-12}L${x} ${y}Z" fill="${orange}"/>`+text(x+10,y-17,s,20,orange,'start');}
 b+=text(600,710,'Convenția din curs: sub 1 m în cm; de la 1 m în metri cu două zecimale.',17)+text(600,740,'Sârbu 2017, p. 68–69 · Control aritmetic: 0,90 + 0,90 + 1,50 + 1,20 + 1,95 = 6,45 m',16);
 return wrap('P14 · Elevație cotată: pozițiile golurilor',b);
}
function p05(){
 const X=x=>620-90*x,Y=v=>380-90*v,points=[[2,1,1],[4,1,3],[3,3,2]],green='#208576';let b='';
 b+=line(50,380,1150,380)+line(620,90,620,715)+text(60,365,'+OX',18,ink,'start')+text(635,98,'+OZ',18,ink,'start')+text(650,715,'+OY(H)',17);
 const ph=X(1);b+=line(ph,380,ph,710,green,2)+text(ph-15,700,'Ph : x=1',17,green,'end');
 b+=line(X(1),380,X(4.3),Y(3.3),orange,2)+text(X(4.3)+100,Y(3.3),'Pv : z=x−1',17,orange,'start');
 const dot=(x,y,n,c,dx=12,dy=-14)=>`<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`+text(x+dx,y+dy,n,19,c,'start');
 const polygon=(pts,c)=>`<polygon points="${pts.map(p=>[X(p[0]),Y(-p[1])].join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
 b+=polygon(points,blue);
 points.forEach((p,i)=>{const n='abc'[i];b+=line(X(p[0]),Y(p[2]),X(p[0]),Y(-p[1]),'#a7b9c5',1)+dot(X(p[0]),Y(p[2]),n+'′',orange)+dot(X(p[0]),Y(-p[1]),n,blue,12,25);});
 for(const sense of [-1,1]){const pts=points.map(([x,y])=>[1+sense*(x-1)*Math.sqrt(2),y]);const c=sense<0?'#a44876':green;b+=polygon(pts,c);pts.forEach((p,i)=>b+=dot(X(p[0]),Y(-p[1]),'ABC'[i]+'₀',c,8,-14));}
 b+=dot(ph,380,'Pₓ',ink,10,-12);
 // The two triangles are related by a rigid half-turn about Ph; the lengths are identical.
 b+=text(305,755,'Aceeași parte de Ph · x₀=1+(x−1)√2',17,green);
 b+=text(850,755,'Partea opusă · x₀=1−(x−1)√2',17,'#a44876')+text(850,785,'Sensul din Sârbu, Fig. 5.4.3',17,'#a44876')+text(600,825,'AB=√8 m; AC=BC=√6 m în ambele sensuri. Alege același sens pentru întregul triunghi.',17);
 return wrap('P05 · Rabaterea planului de capăt P: z=x−1',b,1200,860);
}
function epure(title,draw,scale=100,cy=460){
 const X=x=>800-scale*x,Y=v=>cy-scale*v,axes=line(50,cy,1140,cy)+line(800,95,800,905)+text(60,cy-15,'+OX',18,ink,'start')+text(815,105,'+OZ',18,ink,'start')+text(815,888,'+OY(H)',17,ink,'start');
 const dot=(x,v,n,c=blue,dx=10,dy=-12)=>`<circle cx="${X(x)}" cy="${Y(v)}" r="5" fill="${c}"/>`+text(X(x)+dx,Y(v)+dy,n,21,c,'start');
 const seg=(a,b,c=blue,w=2)=>line(X(a[0]),Y(a[1]),X(b[0]),Y(b[1]),c,w);
 return wrap(title,axes+draw({X,Y,dot,seg}),1200,980);
}
function p02(){return epure('P02 · Epura a patru puncte: același OX',({dot,seg})=>{
 let b='';for(const [n,x,y,z] of [['a',4,2,3],['b',3,-2,1],['c',2,-1,-3],['d',1,3,-2]])b+=seg([x,-y],[x,z],'#a7b9c5',1)+dot(x,-y,n,blue,-25,25)+dot(x,z,n+'′',orange,10,-12)+dot(x,0,String(x),ink,0,25);return b+text(600,960,'A (4;2;3) · B (3;−2;1) · C (2;−1;−3) · D (1;3;−2) · coordonate în m',18);
});}
function p03(){return epure('P03 · Urmele dreptei prin A și B',({dot,seg,X,Y})=>{
 // D(t)=(3+2t,1+2t,1−2t); H: t=.5; V: t=−.5; W: t=−1.5.
 let b=seg([-.2,2.2],[6,-4],blue)+seg([-.2,4.2],[6,-2],orange);
 for(const [n,x,y,z] of [['a',3,1,1],['b',5,3,-1]])b+=seg([x,-y],[x,z],'#a7b9c5',1)+dot(x,-y,n)+dot(x,z,n+'′',orange);
 b+=seg([4,-2],[4,0],'#a7b9c5',1)+seg([2,0],[2,2],'#a7b9c5',1)+dot(4,-2,'h',blue,-25,25)+dot(4,0,'h′',orange,10,-12)+dot(2,0,'v',blue,10,26)+dot(2,2,'v′',orange,10,-12);
 b+=dot(0,2,'w',blue,15,0)+dot(0,4,'w′',orange,15,0)+dot(2,4,'w″','#208576',-40,0)+seg([0,4],[2,4],'#b9c8ce',1);
 return b+text(580,935,'W=(0;−2;4) m → w″ la stânga lui OZ la 2 m, deasupra OX la 4 m.',18)+text(580,963,'H=(4;2;0) m · V=(2;0;2) m · +OX spre stânga',18);
},90,500);}
function p04(){return epure('P04 · Intersecția P ∩ Q prin urmele H și V',({dot,seg})=>{
 let b=seg([6,0],[0,-4],blue)+seg([6,0],[.3,3.8],orange)+seg([5,0],[.6,-4.4],'#208576')+seg([5,0],[3.1,3.8],'#a44876');
 b+=seg([3,-2],[4.5,0],ink,3)+seg([3,0],[4.5,1],ink,3)+seg([3,-2],[3,0],'#a7b9c5',1)+seg([4.5,0],[4.5,1],'#a7b9c5',1);
 b+=dot(3,-2,'hᵢ',blue,10,25)+dot(3,0,'hᵢ′',orange,10,-12)+dot(4.5,0,'vᵢ',blue,-28,28)+dot(4.5,1,'vᵢ′',orange,-32,-14);
 b+=text(760,845,'Ph',20,blue)+text(730,85,'Pv',20,orange)+text(770,895,'Qh',20,'#208576')+text(490,88,'Qv',20,'#a44876');
 return b+text(600,950,'P: 2x+3y+3z=12 · Q: 2x+2y+z=10 · Hᵢ=(3;2;0), Vᵢ=(4,5;0;1) m',18);
});}
const figures={P14:p14,P05:p05,P02:p02,P03:p03,P04:p04};
async function main(){const browser=await chromium.launch({headless:true});try{const page=await browser.newPage({deviceScaleFactor:2});for(const name of process.argv.slice(2).length?process.argv.slice(2):Object.keys(figures)){if(!figures[name])throw Error('Unknown figure '+name);const svg=figures[name]();fs.mkdirSync('figures',{recursive:true});fs.writeFileSync(path.join('figures',name+'.svg'),svg);await page.setContent('<style>body{margin:0}</style>'+svg);await page.locator('svg').screenshot({path:path.join('images',name+'.png')});console.log('Rendered '+name);}}finally{await browser.close();}}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={figures};
