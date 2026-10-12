/* Geometria GD Lab — toate coordonatele sunt în unități euclidiene; SVG-urile nu sunt imagini generate artistic. */
(function(root){'use strict';
const pi=Math.PI;
const fmt=(n,d=2)=>Number(n).toFixed(d).replace('.',',').replace(/,?0+$/,'').replace(/,$/,'').replace(/-/g,'−');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const point=(x,y,z)=>[x,y,z];
const add=(a,b)=>a.map((v,i)=>v+b[i]);const diff=(a,b)=>a.map((v,i)=>v-b[i]);
const norm=(v)=>Math.hypot(...v);
const line=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const intersect=(a,b,axis)=>{let den=b[axis]-a[axis];if(Math.abs(den)<1e-10)return null;return line(a,b,-a[axis]/den);};
function safe(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fig(content,view='0 0 500 320') {return `<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="${view}" aria-label="Construcție geometrică determinată prin coordonate"><g font-family="Inter,system-ui,Arial" stroke-linecap="round" stroke-linejoin="round">${content}</g></svg>`;}
function sl(x,y,t,fill='#405e73',size=13,anchor='start'){return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}" fill="${fill}" font-size="${size}" text-anchor="${anchor}">${safe(t)}</text>`;}
function ln(a,b,c='#628398',w=1.6,dash=''){return `<line x1="${a[0].toFixed(2)}" y1="${a[1].toFixed(2)}" x2="${b[0].toFixed(2)}" y2="${b[1].toFixed(2)}" stroke="${c}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;}
function circle(p,r=4,c='#176c9a'){return `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="${r}" fill="${c}" stroke="white" stroke-width="1.2"/>`;}
function path(points,c='#176c9a',w=2,fill='none',dash=''){return `<path d="${points.map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+','+p[1].toFixed(2)).join(' ')}" fill="${fill}" stroke="${c}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;}
function pol(points,fill='#cce8f4',stroke='#176c9a',opacity=.28){return `<polygon points="${points.map(p=>p.map(n=>n.toFixed(2)).join(',')).join(' ')}" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="1.3"/>`;}
const TX='#176c9a',V='#b5672b',OK='#238b69',INK='#334c60',GRID='#e2e9ed';
function svgGrid(w=500,h=320){let a='';for(let x=25;x<w;x+=25)a+=ln([x,15],[x,h-15],GRID,.65);for(let y=15;y<h;y+=25)a+=ln([15,y],[w-15,y],GRID,.65);return a;}
/* Grilă legată de unitatea METRULUI, nu de pixeli arbitrar aleși. */
function metricGrid(C,scale,step=1,w=500,h=320){
 const delta=scale*step;let t='';
 for(let x=C[0];x<w;x+=delta)t+=ln([x,12],[x,h-12],GRID,.65);
 for(let x=C[0]-delta;x>10;x-=delta)t+=ln([x,12],[x,h-12],GRID,.65);
 for(let y=C[1];y<h-12;y+=delta)t+=ln([12,y],[w-12,y],GRID,.65);
 for(let y=C[1]-delta;y>12;y-=delta)t+=ln([12,y],[w-12,y],GRID,.65);
 return t;
}
function epureAxes(C,scale,grid=true){
 let t=grid?metricGrid(C,scale):'';
 t+=ln([18,C[1]],[482,C[1]],INK,1.9)+ln([C[0],15],[C[0],303],INK,1.9);
 t+=sl(20,C[1]-8,'+OX',INK,11)+sl(C[0]+8,26,'+OZ',INK,11)+sl(C[0]+8,C[1]+15,'O',INK,11);
 return t;
}
function epo(P,{W=false,lines=[],more=[],scale=31,labelOffsets={}}={}){
 const C=[330,150],s=scale,H=a=>[C[0]-s*a[0],C[1]+s*a[1]],VV=a=>[C[0]-s*a[0],C[1]-s*a[2]],WW=a=>[C[0]+s*a[1],C[1]-s*a[2]];
 let t=epureAxes(C,s);
 for(let L of lines){let [A,B,color=TX]=L;t+=path([H(A),H(B)],color,2.3)+path([VV(A),VV(B)],V,2.3);}
 for(let [p,label] of P){if(!p)continue;let h=H(p),v=VV(p);
  t+=ln(h,v,INK,.85,'4 5')+circle(h,4,TX)+circle(v,4,V);
  const n=label.toLowerCase(),dh=labelOffsets[n]||[6,16],dv=labelOffsets[n+'′']||[6,-9];
  t+=sl(h[0]+dh[0],h[1]+dh[1],n,TX,12)+sl(v[0]+dv[0],v[1]+dv[1],n+'′',V,12);
  if(W){let w=WW(p);t+=circle(w,4,OK)+sl(w[0]+7,w[1]-9,label.toLowerCase()+'″',OK,12);}
 }
 for(let q of more)t+=q({H,V:VV,W:WW,C,s});
 t+=sl(19,309,'Grilă: 1 pătrat = 1 m',INK,11);
 return fig(t);
}

/* Vizibilitate pe H/V: compară adâncimile pe aceeași proiectantă,
   inclusiv pentru poliedre oblice. Nu clasifică după orientarea intuitivă a muchiei. */
function hiddenLines(vertices,edges,faces,proj){
 const axis=proj==='H'?[0,1,2]:[0,2,1];let segments='';
 const norm2=p=>[p[axis[0]],p[axis[1]]];
 function bary(p,a,b,c){let den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-10)return null;let u=((b[1]-c[1])*(p[0]-c[0])+(c[0]-b[0])*(p[1]-c[1]))/den;let v=((c[1]-a[1])*(p[0]-c[0])+(a[0]-c[0])*(p[1]-c[1]))/den;let w=1-u-v;return (u>=-1e-8&&v>=-1e-8&&w>=-1e-8)?[u,v,w]:null;}
 function buried(q){let xy=norm2(q);for(let F of faces)for(let k=1;k<F.length-1;k++){
  let a=vertices[F[0]],b=vertices[F[k]],c=vertices[F[k+1]],weights=bary(xy,norm2(a),norm2(b),norm2(c));
  if(!weights)continue;let dep=weights[0]*a[axis[2]]+weights[1]*b[axis[2]]+weights[2]*c[axis[2]];
  if(dep>q[axis[2]]+1e-7)return true;
 }return false;}
 const plot=p=>proj==='H'?[330-31*p[0],150+31*p[1]]:[330-31*p[0],150-31*p[2]];
 const backgrounds=[],foregrounds=[];
 for(let [ai,bi] of edges){let A=vertices[ai],B=vertices[bi],N=50,start=0,last=null;
  const emit=(stop,status)=>{if(stop<=start)return;let a=plot(line(A,B,start/N)),b=plot(line(A,B,stop/N));
    (status?backgrounds:foregrounds).push(ln(a,b,status?'#8e9da8':proj==='H'?TX:V,status?1.4:2.15,status?'5 5':''));};
  for(let i=0;i<N;i++){let status=buried(line(A,B,(i+.5)/N));if(last===null){last=status;start=i;}else if(status!==last){emit(i,last);last=status;start=i;}}
  emit(N,last);
 }
 segments=backgrounds.join('')+foregrounds.join('');
 return segments;
}

function isoFactory(angle=42,scalar=28,center=[250,197]){let a=angle*pi/180;return p=>[center[0]+scalar*(p[0]*Math.cos(a)-p[1]*Math.sin(a)),center[1]+scalar*(.46*(p[0]*Math.sin(a)+p[1]*Math.cos(a))-p[2]*Math.sqrt(1-.46*.46))];}
/* Scalare uniforma si incadrare in SVG pentru model + proiectante + axe.
   Un singur factor in X/Y: evita atat taierea figurii, cat si deformarea geometriei. */
function isoFit(angle,points,extent,top,pad=40){
 const e=extent, all=points.concat([[0,0,0],[e,0,0],[0,e,0],[e,e,0],[e,0,top],[0,e,top],[0,0,top],
   [e+1.1,0,0],[0,e+1.1,0],[0,0,top+1.3]]);
 const raw=isoFactory(angle,1,[0,0]);let xs=all.map(p=>raw(p)[0]),ys=all.map(p=>raw(p)[1]);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const sc=Math.min((500-2*pad)/Math.max(1e-8,maxX-minX),(320-2*pad)/Math.max(1e-8,maxY-minY));
 return isoFactory(angle,sc,[(500-sc*(maxX+minX))/2,(320-sc*(maxY+minY))/2]);
}
/* Tangente exacte de la varful proiectat la elipsa proiectata a bazei conului.
   Daca B(theta)=C+u cos(theta)+v sin(theta), A^-1(S-C)=t, contactul satisface
   t_x cos(theta)+t_y sin(theta)=1; rezolvam cele doua solutii reale. */
function coneSilhouetteAngles(project,cx,cy,R,h){
 const c=project([cx,cy,0]),s=project([cx,cy,h]),pr=project([cx+R,cy,0]),ps=project([cx,cy+R,0]);
 const u=[pr[0]-c[0],pr[1]-c[1]],v=[ps[0]-c[0],ps[1]-c[1]],w=[s[0]-c[0],s[1]-c[1]];
 const det=u[0]*v[1]-u[1]*v[0];if(Math.abs(det)<1e-10)return [];
 const tx=(w[0]*v[1]-w[1]*v[0])/det,ty=(u[0]*w[1]-u[1]*w[0])/det,dist=Math.hypot(tx,ty);
 if(dist<=1+1e-10)return [];
 const theta=Math.atan2(ty,tx),beta=Math.acos(1/dist);
 return [theta-beta,theta+beta];
}
function isoBasic(project,{planes=true,extent=3,top=4}={}){
 let t='';if(planes){let e=extent;
 t+=pol([[0,0,0],[e,0,0],[e,e,0],[0,e,0]].map(project),'#9ad0e7',TX,.14);
 t+=pol([[0,0,0],[e,0,0],[e,0,top],[0,0,top]].map(project),'#e1bb92',V,.11);
 t+=pol([[0,0,0],[0,e,0],[0,e,top],[0,0,top]].map(project),'#b0d5c3',OK,.09);}
 t+=ln(project([0,0,0]),project([extent+1,0,0]),TX,2.1)+ln(project([0,0,0]),project([0,extent+1,0]),V,2.1)+ln(project([0,0,0]),project([0,0,top+1]),OK,2.1);
 t+=sl(...project([extent+1.1,0,0]),'x',TX,13)+sl(...project([0,extent+1.1,0]),'y',V,13)+sl(...project([0,0,top+1.3]),'z',OK,13);
 return t;
}
const f=(v)=>Number(v).toFixed(2).replace('.',',');
function choiceQuestion(q,choices,answer,reason){return {type:'choice',prompt:q,options:choices,answer,reason};}
function numberQuestion(q,answer,tol,reason){return {type:'numeric',prompt:q,answer,tol,reason};}
const defaultParams={1:{sh:6},2:{x:2,y:-1,z:3},3:{dz:2},4:{k:6},5:{dz:2},6:{shape:'prism'},7:{shape:'sphere',d:1},8:{k:.5},9:{r:1.2},10:{den:50}};
const ctrl={
 1:[{id:'sh',label:'Înălțimea centrului S (m)',type:'range',min:5,max:9,step:1}],
 2:[{id:'x',label:'Abscisa x (m)',type:'range',min:1,max:5,step:1},{id:'y',label:'Depărtarea y (m)',type:'range',min:-3,max:3,step:1},{id:'z',label:'Cota z (m)',type:'range',min:-3,max:3,step:1}],
 3:[{id:'dz',label:'Diferența de cotă Δz (m)',type:'range',min:1,max:4,step:.5}],
 4:[{id:'k',label:'Termenul liber k (m)',type:'range',min:3,max:8,step:1}],
 5:[{id:'dz',label:'Diferența de cotă Δz (m)',type:'range',min:1,max:5,step:.5}],
 6:[{id:'shape',label:'Corpul geometric',type:'select',options:[['prism','Prismă oblică'],['pyramid','Piramidă oblică']]}],
 7:[{id:'shape',label:'Suprafața',type:'select',options:[['sphere','Sferă'],['cylinder','Cilindru'],['cone','Con']]},{id:'d',label:'Distanța sau cota planului (m)',type:'range',min:0,max:2,step:.25}],
 8:[{id:'k',label:'Panta planului secant k (m/m)',type:'range',min:.2,max:1.2,step:.1}],
 9:[{id:'r',label:'Raza cilindrului R (m)',type:'range',min:.8,max:2,step:.2}],
 10:[{id:'den',label:'Scara desenului',type:'select',options:[['20','1:20'],['50','1:50'],['100','1:100']]}]
};
const LAB=[
 {title:'Proiecția: de la spațiu la desen',sub:'Schimbă centrul și vezi de ce imaginea unui segment poate crește.',concept:'Proiectantele determină pozițiile imaginilor pe plan. Direcția lor schimbă geometria proiecției.'},
 {title:'Punctul în cele patru diedre',sub:'Schimbă y și z. Urmărește n, n′ și n″ împreună cu punctul 3D.',concept:'Diedrul rezultă exclusiv din semnele depărtării y și cotei z. Abscisa determină linia de ordine.'},
 {title:'Dreapta și urmele ei',sub:'Modifică panta și găsește unde dreapta intersectează H și V.',concept:'O urmă este intersecția spațială cu un plan; proiecțiile ei trebuie să aparțină aceleiași linii de ordine.'},
 {title:'Planul și urmele sale',sub:'Modifică poziția unui plan și observă cele trei intersecții cu axele.',concept:'Urmele unui plan sunt drepte, nu puncte. Ele arată cum planul taie H, V și W.'},
 {title:'Adevărata mărime',sub:'Compară segmentul real cu proiecția sa și verifică Pitagora.',concept:'Proiecția ortogonală prescurtează componentele perpendiculare pe planul de proiecție.'},
 {title:'Poliedre și vizibilitate',sub:'Compară prisma oblică și piramida, apoi identifică elementele lor.',concept:'Vârfurile, muchiile și fețele sunt definite prin coordonate; vizibilitatea depinde de direcția de observare.'},
 {title:'Suprafețele și secțiunile lor',sub:'Alege o sferă, un cilindru sau un con și urmărește secțiunea.',concept:'Pe aceeași suprafață pot exista mai multe puncte cu aceeași proiecție. Poziția spațială cere suficiente date.'},
 {title:'Secțiunea unui cilindru',sub:'Schimbă înclinarea planului și vezi elipsa în adevărată mărime.',concept:'Cercul proiectat pe H nu este adevărata mărime a unei secțiuni oblice. Rabaterea o arată.'},
 {title:'Desfășurarea mantalei',sub:'Deschide mantaua unui cilindru și verifică păstrarea lungimilor.',concept:'Lungimea desfășurată este arcul cercului de bază: s = Rθ. Înălțimile rămân cele reale.'},
 {title:'Scară, cote și desen tehnic',sub:'Schimbă scara și citește dimensiunea reală și cea desenată.',concept:'Pe desen se cotează dimensiunea reală a obiectului, nu lungimea măsurată cu rigla pe planșă.'}
];
function compute(unit,v,angle=42){let models=[],note='',question=null,details='';let iso=isoFactory(angle);let out3='',out2='';
 if(unit===1){
  const h=+v.sh, A=[2,3],B=[4,3],magn=h/(h-3),central=2*magn,coord=(x,z,ox=0)=>[ox+34+22*x,260-22*z];
  function section(ox,type){
   let t='',S=coord(0,h,ox),a=coord(2,3,ox),b=coord(4,3,ox);
   let aa=type==='central'?coord(2*magn,0,ox):coord(3.5,0,ox), bb=type==='central'?coord(4*magn,0,ox):coord(5.5,0,ox);
   for(let k=0;k<=10;k++)t+=ln(coord(k,0,ox),coord(k,7.5,ox),'#e2e9ed',.55);
   for(let k=0;k<=9;k++)t+=ln(coord(0,k,ox),coord(10,k,ox),'#e2e9ed',.55);
   t+=ln(coord(0,0,ox),coord(10,0,ox),INK,1.9)+path([a,b],TX,2.9)+path([aa,bb],OK,2.9);
   if(type==='central'){
    t+=ln(S,aa,V,2)+ln(S,bb,V,2)+circle(S,4,V)+sl(S[0]+7,S[1]-7,'S',V,12);
    t+=ln(S,coord(0,0,ox),INK,.9,'4 4')+sl(ox+9,44,'SO = '+fmt(h)+' m',INK,11);
   }else{t+=ln(a,aa,V,1.7)+ln(b,bb,V,1.7);}
   t+=circle(a,4,TX)+circle(b,4,TX)+circle(aa,4,OK)+circle(bb,4,OK);
   t+=sl(a[0]-4,a[1]-10,'A',TX,12)+sl(b[0]+3,b[1]-10,'B',TX,12);
   t+=sl(aa[0]-3,aa[1]+18,'a',OK,12)+sl(bb[0]-3,bb[1]+18,'b',OK,12);
   return t;
  }
  out2=fig(sl(24,24,'CENTRALĂ · P: z = 0',INK,12)+sl(287,24,'PARALELĂ · P: z = 0',INK,12)+section(0,'central')+section(250,'parallel')+sl(20,307,'Grilă: 1 pătrat = 1 m (ambele secțiuni)',INK,11));
  let iso=isoFactory(angle,24,[160,248]),S=[0,0,h],A3=[2,0,3],B3=[4,0,3],ap=[2*magn,0,0],bp=[4*magn,0,0];
  out3=fig(isoBasic(iso,{extent:5,top:8})+path([A3,B3].map(iso),TX,3)+ln(iso(S),iso(ap),V,2)+ln(iso(S),iso(bp),V,2)+path([ap,bp].map(iso),OK,2.7)+circle(iso(S),5,V)+sl(...iso(S),' S',V,12)+circle(iso(A3),4,TX)+circle(iso(B3),4,TX));
  details=`Date: P: z = 0; S = (0; 0; ${fmt(h)}) m; AB = 2 m, paralel cu P, la cota 3 m. Din triunghiuri asemenea: ab/AB = SO/(SO − 3) = ${fmt(h)}/${fmt(h-3)} = ${fmt(magn)}. Rezultă ab = 2 × ${fmt(magn)} = ${fmt(central)} m. În proiecția paralelă, ab = 2 m. Unghiul camerei modifică doar vederea 3D.`;
  question=numberQuestion('Cât măsoară imaginea centrală ab (m)?',central,.02,`Triunghiurile asemenea dau ab/AB = SO/(SO − 3) = ${fmt(h)}/${fmt(h-3)} = ${fmt(magn)}, deci ab = 2 m × ${fmt(magn)} = ${fmt(central)} m. Proiecția paralelă ar da 2 m.`);
 } else if(unit===2){
  const x=+v.x,y=+v.y,z=+v.z,p3=[x,y,z];
  const region=y===0&&z===0?'pe OX':y===0?'pe V':z===0?'pe H':y>0?(z>0?'I':'IV'):(z>0?'II':'III');
  out2=epo([[p3,'N']],{W:true});
  const pi2=isoFit(angle,[p3,[x,y,0],[x,0,z],[0,y,z]],4,4);
  out3=fig(isoBasic(pi2,{extent:4,top:4})+ln(pi2([x,y,0]),pi2(p3),INK,1,'5 4')+ln(pi2([x,0,z]),pi2(p3),INK,1,'5 4')+ln(pi2([0,y,z]),pi2(p3),INK,1,'5 4')+circle(pi2(p3),6,V)+sl(...pi2(p3),' N',V,14));
  details=`Date: N = (${fmt(x)}; ${fmt(y)}; ${fmt(z)}) m. Poziția: ${region}. Proiecții spațiale: n = (${fmt(x)};${fmt(y)};0), n′ = (${fmt(x)};0;${fmt(z)}), n″ = (0;${fmt(y)};${fmt(z)}). Epură: abscisa pozitivă spre stânga; y pozitiv sub OX; z pozitiv deasupra OX. Pentru y=z=0, N se află pe OX, adică simultan în H și V.`;
  question=choiceQuestion('Unde se află punctul N?', ['I','II','III','IV','pe H','pe V','pe OX'],region,'Analizezi mai întâi y=0 și z=0 (cazuri pe plane sau pe OX), apoi semnele lui y și z. x nu determină diedrul.');
 } else if(unit===3){
  const A=[2,1,.6],B=[4,3,.6+(+v.dz)],H=intersect(A,B,2),Vt=intersect(A,B,1),Wt=intersect(A,B,0),dd=+v.dz;
  out2=epo([[A,'M'],[B,'N'],[H,'H'],[Vt,'V']],{lines:[[Wt,B,TX]],labelOffsets:{'h′':[-22,-14],'v′':[15,30],'h':[-20,21],'v':[8,-10]},more:[({H:ph,V:pv})=>sl(19,29,'d și d′ sunt prelungite până la urmele H și V',INK,11)]});
  out3=fig(isoBasic(iso,{extent:4,top:5})+path([Wt,B].map(iso),TX,2.4)+circle(iso(H),5,OK)+circle(iso(Vt),5,V)+circle(iso(A),5,TX)+circle(iso(B),5,TX));
  details=`M=(2;1;0,6) m; N=(4;3;${fmt(B[2])}) m. D(t)=(2+2t;1+2t;0,6+${fmt(dd)}t). Impui z=0 pentru H, y=0 pentru V și x=0 pentru W. H=(${fmt(H[0])};${fmt(H[1])};0) m; V=(${fmt(Vt[0])};0;${fmt(Vt[2])}) m; W=(0;−1;${fmt(Wt[2])}) m.`;
  question=numberQuestion('Care este abscisa x a urmei orizontale H (m)?',H[0],.02,`Din z(t)=0,6+${fmt(dd)}t=0 obții t=−0,6/${fmt(dd)}; înlocuiești în x(t)=2+2t și găsești x_H=${fmt(H[0])} m.`);
 } else if(unit===4){
  const k=+v.k,A=[k,0,0],B=[0,k,0],C=[0,0,k],scale=14,p=isoFactory(angle,25,[224,229]);
  out2=epo([],{scale,more:[({H,V:pv,W,C:O,s})=>{
    const px=H(A),py=H(B),pz=pv(C),pyw=W(B);
    return path([px,py],TX,2.7)+path([px,pz],V,2.7)+path([pyw,pz],OK,2.7)
      +`<path d="M${py[0].toFixed(2)},${py[1].toFixed(2)} A${(k*s).toFixed(2)},${(k*s).toFixed(2)} 0 0 0 ${pyw[0].toFixed(2)},${pyw[1].toFixed(2)}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="5 4"/>`
      +circle(px,4,INK)+circle(py,4,TX)+circle(pz,4,V)+circle(pyw,4,OK)
      +sl(px[0]-20,px[1]-11,'Px',INK,12)+sl(py[0]-25,py[1]-8,'Py',TX,12)+sl(pz[0]-23,pz[1]-7,'Pz',V,12)+sl(pyw[0]+6,pyw[1]-7,'Py(W)',OK,11)
      +sl(19,44,'Ph: albastru · Pv: portocaliu · Pw: verde',INK,12);
  }]});
  out3=fig(isoBasic(p,{extent:8,top:8})+pol([A,B,C].map(p),'#8ec7dc',TX,.33)+circle(p(A),5,TX)+circle(p(B),5,TX)+circle(p(C),5,V));
  details=`Planul P: x+y+z=${fmt(k)} m. Urma orizontală Ph: x+y=${fmt(k)}, z=0; verticală Pv: x+z=${fmt(k)}, y=0; laterală Pw: y+z=${fmt(k)}, x=0. Px=(${fmt(k)};0;0), Py=(0;${fmt(k)};0), Pz=(0;0;${fmt(k)}) m. Pw leagă Py rabătut pe W de Pz.`;
  question=numberQuestion('La ce abscisă x (m) planul întâlnește axa OX?',k,.01,`Pe OX avem y=0 și z=0, deci ecuația devine x=${fmt(k)} m.`);
 } else if(unit===5){
  const dz=+v.dz,L=Math.hypot(3,4,dz),LH=5,C=[89,270],s=39,a=C,b=[C[0]+5*s,C[1]],c=[b[0],b[1]-dz*s];
  out2=fig(metricGrid(C,s,1)+path([a,b,c,a],TX,2.4,'#cfe7f3')+ln(b,c,V,2.6)
     +sl(123,288,'L_H = 5 m',TX,13)+sl(c[0]+9,(b[1]+c[1])/2,'Δz = '+fmt(dz)+' m',V,12)
     +sl(118,52,'L = '+fmt(L)+' m',INK,15)+sl(20,308,'Diagramă metrică: 1 pătrat = 1 m, identic pe ambele axe',INK,11));
  let p=isoFactory(angle,27,[205,212]);out3=fig(isoBasic(p,{extent:5,top:6})+path([[0,0,0],[3,4,dz]].map(p),TX,3)+ln(p([3,4,0]),p([3,4,dz]),V,2,'5 4')+ln(p([0,0,0]),p([3,4,0]),INK,1.5,'4 4'));
  details=`Diferențe de coordonate: Δx=3 m, Δy=4 m, Δz=${fmt(dz)} m. Proiecția pe H: L_H=√(3²+4²)=5 m. Catetele diagramei au aceeași scară de 39 px/m. Lungimea reală L=√(25+${fmt(dz*dz)})=${fmt(L)} m.`;
  question=numberQuestion('Care este lungimea reală a segmentului (m)?',L,.025,`Teorema lui Pitagora: L=√(Δx²+Δy²+Δz²)=√(25+${fmt(dz*dz)})=${fmt(L)} m; nu confunda cu proiecția L_H=5 m.`);
 } else if(unit===6){
  const base=[[1,1,0],[3,1,0],[3,2,0],[1,2,0]],prism=v.shape==='prism';
  let upper=prism?base.map(a=>add(a,[.5,.3,1.8])):[[3.6,2.5,2.4]],vertices=base.concat(upper),edges=[],faces=[];
  const p=isoFit(angle,vertices,3,3);
  for(let i=0;i<4;i++)edges.push([i,(i+1)%4]);
  if(prism){faces.push([0,1,2,3],[4,5,6,7]);for(let i=0;i<4;i++){edges.push([i+4,(i+1)%4+4],[i,i+4]);faces.push([i,(i+1)%4,(i+1)%4+4,i+4]);}}
  else{faces.push([0,1,2,3]);for(let i=0;i<4;i++){edges.push([i,4]);faces.push([i,(i+1)%4,4]);}}
  out3=fig(isoBasic(p,{extent:3,top:3})+edges.map(([i,j])=>ln(p(vertices[i]),p(vertices[j]),TX,2.3)).join('')+base.map((a,i)=>circle(p(a),4,TX)+sl(...p(a),' '+('ABCD'[i]),TX,11)).join('')+upper.map((a,i)=>circle(p(a),5,V)+sl(...p(a),' '+(prism?['A₁','B₁','C₁','D₁'][i]:'S'),V,12)).join(''));
  const C=[330,150],s=31;
  out2=fig(epureAxes(C,s)+vertices.map(t=>ln([C[0]-s*t[0],C[1]+s*t[1]],[C[0]-s*t[0],C[1]-s*t[2]],INK,.8,'3 5')).join('')
    +hiddenLines(vertices,edges,faces,'H')+hiddenLines(vertices,edges,faces,'V')
    +sl(19,308,'Grilă: 1 pătrat = 1 m · văzute: plin · acoperite: întrerupt',INK,11));
  details=prism?'Prismă cu bazele în plane paralele: 8 vârfuri, 12 muchii și 6 fețe. Vectorul exact de translație al bazei superioare este (0,5;0,3;1,8) m. Vizibilitatea rezultă din compararea cotelor pe H și a depărtărilor pe V.':'Piramidă: baza ABCD în H, vârful S=(3,6;2,5;2,4) m, 5 vârfuri, 8 muchii și 5 fețe. Segmentele acoperite se determină din direcția proiectantelor.';
  question=choiceQuestion('Câte fețe are corpul?', ['4','5','6','8'],prism?'6':'5','Prisma patrulateră are 2 baze și 4 fețe laterale (6). Piramida patrulateră are 1 bază și 4 fețe laterale (5).');
 } else if(unit===7){
  const shape=v.shape,d=+v.d,R=2,h=4,cen=[3,2],z0=shape==='sphere'?3+d:d;
  const r=shape==='sphere'?Math.sqrt(Math.max(0,R*R-d*d)):(shape==='cone'?R*(1-d/h):R);
  const ring=(z,rad)=>Array.from({length:145},(_,i)=>[3+rad*Math.cos(2*pi*i/144),2+rad*Math.sin(2*pi*i/144),z]);
  const spatialBounds=[[1,2,3],[5,2,3],[3,0,3],[3,4,3],[3,2,1],[3,2,5],[1,2,0],[5,2,0],[3,2,h]];
  const p=isoFit(angle,spatialBounds,5,6);let sp=isoBasic(p,{extent:5,top:6});
  if(shape==='sphere'){
   const equator=ring(3,R);let mer=Array.from({length:145},(_,i)=>[3+R*Math.cos(2*pi*i/144),2,3+R*Math.sin(2*pi*i/144)]);
   sp+=path(equator.map(p),TX,1.6)+path(mer.map(p),TX,1.25)+path(ring(z0,r).map(p),V,2.8);
  }else{
   const bottom=ring(0,R),top=shape==='cylinder'?ring(h,R):[[3,2,h]];
   sp+=path(bottom.map(p),TX,2)+ (shape==='cylinder'?path(top.map(p),TX,2):circle(p(top[0]),5,V));
   // Silueta cilindrului: tangente paralele cu axa proiectata; la con: tangentele din varful proiectat la elipsa bazei.
   const silhouette=shape==='cone'?coneSilhouetteAngles(p,3,2,R,h):[-angle*pi/180,pi-angle*pi/180];
   for(let theta of silhouette){
    let base=[3+R*Math.cos(theta),2+R*Math.sin(theta),0];
    let end=shape==='cylinder'?[base[0],base[1],h]:top[0];
    sp+=ln(p(base),p(end),TX,2);
   }
   sp+=path(ring(z0,r).map(p),V,2.8);
  }
  out3=fig(sp+sl(18,307,'Suprafață transparentă · secțiune portocalie',INK,11));
  // Epură H–V cu OX comună și reprezentarea explicită a secțiunii pe ambele plane.
  const C=[390,186],s=25,H=a=>[C[0]-s*a[0],C[1]+s*a[1]],VV=a=>[C[0]-s*a[0],C[1]-s*a[2]];
  const cc=H([3,2,0]),cv=VV([3,0,shape==='sphere'?3:0]),rad=R*s;
  let ep=epureAxes(C,s);
  ep+=`<circle cx="${cc[0]}" cy="${cc[1]}" r="${rad}" fill="none" stroke="${TX}" stroke-width="2"/>`;
  if(shape==='sphere'){
   ep+=`<circle cx="${cv[0]}" cy="${cv[1]}" r="${rad}" fill="none" stroke="${TX}" stroke-width="2"/>`;
   ep+=`<circle cx="${cc[0]}" cy="${cc[1]}" r="${r*s}" fill="none" stroke="${V}" stroke-width="2.6"/>`;
   ep+=ln(VV([3-r,0,z0]),VV([3+r,0,z0]),V,2.6);
  } else {
   if(shape==='cylinder'){
    ep+=ln(VV([1,0,0]),VV([1,0,h]),TX,2)+ln(VV([5,0,0]),VV([5,0,h]),TX,2);
    ep+=ln(VV([1,0,h]),VV([5,0,h]),TX,2);
   }else{
    ep+=ln(VV([1,0,0]),VV([3,0,h]),TX,2)+ln(VV([5,0,0]),VV([3,0,h]),TX,2);
   }
   ep+=`<circle cx="${cc[0]}" cy="${cc[1]}" r="${r*s}" fill="none" stroke="${V}" stroke-width="2.4"/>`;
   ep+=ln(VV([3-r,0,z0]),VV([3+r,0,z0]),V,2.6);
  }
  ep+=sl(19,34,'H (jos) / V (sus): OX comună',INK,12)+sl(19,309,'Grilă: 1 pătrat = 1 m · secțiune: portocaliu',INK,11);
  out2=fig(ep);
  if(shape==='sphere'){
   details=`Sferă cu R=2 m și centru G=(3;2;3) m. Planul orizontal de secțiune este la d=${fmt(d)} m deasupra centrului: z=${fmt(z0)} m. Raza cercului: r=√(R²−d²)=√(4−${fmt(d*d)})=${fmt(r)} m. Pe H: cerc; pe V: segment de ${fmt(2*r)} m la cota z=${fmt(z0)} m.`;
   question=numberQuestion('Care este raza secțiunii sferei (m)?',r,.025,`r²+d²=R²; pentru R=2 m și d=${fmt(d)} m, r=√(4−${fmt(d*d)})=${fmt(r)} m.`);
  }else if(shape==='cylinder'){
   details=`Cilindru circular drept cu R=2 m, h=4 m. Plan de nivel la cota z=${fmt(z0)} m: secțiunea este un cerc de rază 2 m. Pe H cercul se suprapune peste cel al bazei; pe V apare segmentul orizontal la z=${fmt(z0)} m (lungime 4 m).`;
   question=numberQuestion('Care este diametrul secțiunii orizontale (m)?',2*R,.02,'Un cilindru drept circular are secțiune paralelă cu baza, de același diametru 2R=4 m, indiferent de cota planului între baze.');
  }else{
   details=`Con drept circular cu R=2 m, h=4 m. Plan orizontal la cota z=${fmt(z0)} m: cerc de rază r=R(1−z/h)=2(1−${fmt(z0)}/4)=${fmt(r)} m. Pe H: cerc concentric cu baza; pe V: segment la cota z=${fmt(z0)} m.`;
   question=numberQuestion('Care este raza secțiunii conului la cota indicată (m)?',r,.025,`Prin asemănarea triunghiurilor r/R=(h−z)/h. Cu R=2 m, h=4 m și z=${fmt(z0)} m, r=${fmt(r)} m.`);
  }
 } else if(unit===8){
  const k=+v.k,R=1.2,cen=[3,2],pts=Array.from({length:145},(_,i)=>{let a=2*pi*i/144,x=cen[0]+R*Math.cos(a),y=cen[1]+R*Math.sin(a);return [x,y,.3+k*x];});
  const p=isoFactory(angle,40,[202,221]);
  out3=fig(isoBasic(p,{extent:5,top:6})+path(pts.map(p),V,3)+path(pts.map(t=>p([t[0],t[1],0])),TX,2,'none','5 4')+[0,36,72,108].map(i=>ln(p([pts[i][0],pts[i][1],0]),p(pts[i]),INK,1,'4 4')).join(''));
  const C=[330,166],maxZ=.3+k*4.2,s=Math.min(31,133/maxZ),H=t=>[C[0]-s*t[0],C[1]+s*t[1]],VV=t=>[C[0]-s*t[0],C[1]-s*t[2]];
  const a=pts[0],b=pts[72];
  out2=fig(epureAxes(C,s)+path(pts.map(H),TX,2.6)+path([a,b].map(VV),V,2.8)
     +ln(H(a),VV(a),INK,.8,'3 5')+ln(H(b),VV(b),INK,.8,'3 5')
     +sl(19,28,'P: z = '+fmt(k)+'x + 0,30 (m)',INK,13)+sl(19,309,'Grilă: 1 pătrat = 1 m · ambele proiecții: același OX',INK,11));
  const minor=R,major=R*Math.sqrt(1+k*k);
  details=`Cilindru circular vertical: axă prin (3;2) m, R=1,20 m; plan secant P: z=${fmt(k)}x+0,30 (m). Pe H: cerc cu centrul (3;2) m. Pe V: segment din urma P, pentru x∈[1,80;4,20] m. Semiaxa mică b=1,20 m; semiaxa mare a=R√(1+k²)=${fmt(major)} m. Centrul și axele din desen folosesc aceeași origine (${C[0]};${C[1]}) SVG.`;
  question=numberQuestion('Care este semiaxa mare a secțiunii (m)?',major,.025,`a=R√(1+k²)=1,20·√(1+${fmt(k*k)})=${fmt(major)} m; adevărata mărime diferă de cercul proiectat pe H.`);
 } else if(unit===9){
  const R=+v.r,smax=2*pi*R,hAt=u=>1.8+.5*R*Math.cos(u/R),hmax=1.8+.5*R,hmin=1.8-.5*R;
  const scale=Math.min(425/smax,204/hmax),C=[45,276],pt=u=>[C[0]+u*scale,C[1]-hAt(u)*scale];
  const pts=Array.from({length:145},(_,i)=>pt(smax*i/144));
  out2=fig(metricGrid(C,scale,1)+ln([C[0],C[1]],[C[0]+smax*scale,C[1]],INK,1.8)+ln([C[0],C[1]],[C[0],C[1]-hmax*scale-12],INK,1.8)
     +path(pts,V,3)+ln([C[0],C[1]],pt(0),TX,1.6)+ln([C[0]+smax*scale,C[1]],pt(smax),TX,1.6)
     +sl(20,31,'Plan P: z = 0,5x + 0,3 (m)',INK,13)+sl(20,308,'Grilă: 1 pătrat = 1 m · scară izometrică pe s și z',INK,11));
  // Centrul cilindrului are x=3; în coordonate desfășurate z(s)=0,5·3+0,3+0,5R cos(s/R).
  const p=isoFactory(angle,41,[216,223]),ring=(z,r)=>Array.from({length:145},(_,i)=>[3+r*Math.cos(2*pi*i/144),2+r*Math.sin(2*pi*i/144),z]);
  const cut=Array.from({length:145},(_,i)=>{let a=2*pi*i/144;return [3+R*Math.cos(a),2+R*Math.sin(a),1.8+.5*R*Math.cos(a)]});
  out3=fig(isoBasic(p,{extent:5,top:5})+path(ring(0,R).map(p),TX,1.7)+path(cut.map(p),V,3)+[0,36,72,108].map(i=>ln(p(ring(0,R)[i]),p(cut[i]),INK,1.2)).join(''));
  details=`Cilindru: axa prin (3;2) m, R=${fmt(R)} m. Plan: z=0,5x+0,3 (m). La x=3+R cosθ, cota z=1,8+0,5R cosθ (m). Pe desfășurare s=Rθ; L=2πR=${fmt(smax)} m, înălțimile între ${fmt(hmin)} și ${fmt(hmax)} m. Ambele direcții ale desenului au aceeași scară (${fmt(scale)} px/m în modelul SVG).`;
  question=numberQuestion('Care este lățimea totală a desfășurării (m)?',smax,.03,`L=2πR=2π×${fmt(R)}=${fmt(smax)} m. Lățimea și înălțimea sunt trasate la aceeași scară.`);
 }else if(unit===10){
  const den=+v.den,wall=6450/den,height=2800/den;
  // Sus: geometrie în metri; jos: hârtie în mm cu zoom FIX pentru toate scările.
  const sc=55.8,O=[55,249],x=m=>O[0]+m*sc,z=m=>O[1]-m*sc;
  let rect=(xx,zz,w,h,stroke=TX)=>`<rect x="${x(xx)}" y="${z(zz+h)}" width="${w*sc}" height="${h*sc}" fill="none" stroke="${stroke}" stroke-width="2.2"/>`;
  const el=rect(0,0,6.45,2.8,INK)+rect(.9,0,.9,2.1,V)+rect(3.3,.9,1.2,1.2,TX);
  out3=fig(metricGrid(O,sc,1)+el+ln([x(0),281],[x(6.45),281],INK,1.2)+sl(228,302,'6,45 m · dimensiune reală',INK,12,'middle')+sl(24,32,'Modelul obiectului · în metri',INK,13));
  const zoom=1.24,X=mm=>60+mm*zoom,Y=mm=>260-mm*zoom;
  const paper=(xx,zz,w,h,stroke)=>{
   let left=xx*1000/den,bottom=zz*1000/den,wide=w*1000/den,high=h*1000/den;
   return `<rect x="${X(left)}" y="${Y(bottom+high)}" width="${wide*zoom}" height="${high*zoom}" fill="none" stroke="${stroke}" stroke-width="2.1"/>`;
  };
  const spacing=25*zoom,C=[60,260];let grid=metricGrid(C,zoom*1000/den,1); // aici 1 pătrat = 1 m real, specific scării curente
  const image=paper(0,0,6.45,2.8,INK)+paper(.9,0,.9,2.1,V)+paper(3.3,.9,1.2,1.2,TX);
  let scaleBar=ln([60,286],[60+50*zoom,286],INK,2)+ln([60,281],[60,291],INK,1.5)+ln([60+50*zoom,281],[60+50*zoom,291],INK,1.5);
  out2=fig(grid+image+scaleBar+sl(20,29,'Scara 1:'+den+' · lungime desenată '+fmt(wall)+' mm',INK,13)
       +sl(20,49,'Înălțime desenată '+fmt(height)+' mm',INK,12)
       +sl(60,306,'Bară fixă = 50 mm pe desen · zoom constant',INK,11));
  details=`Perete: 6,45 m × 2,80 m; ușa x=0,90–1,80 m, z=0–2,10 m; fereastra x=3,30–4,50 m, z=0,90–2,10 m. La scara 1:${den}, pe hârtie: ${fmt(wall)} mm × ${fmt(height)} mm. Dimensiunea simulată pe ecran se modifică odată cu scara, la același zoom. Pe planșă se cotează dimensiunile reale (m).`;
  question=numberQuestion('Care este lungimea peretelui pe desen (mm)?',wall,.05,`6,45 m = 6450 mm; la scara 1:${den}, lungimea desenată = 6450/${den} = ${fmt(wall)} mm. Cota înscrisă pe plan rămâne 6,45 m.`);
 }

 const givens=[
  `P: z=0; S=(0;0;${fmt(+v.sh)}) m; AB=2 m, în planul z=3 m, paralel cu P.`,
  `N=(${fmt(+v.x)};${fmt(+v.y)};${fmt(+v.z)}) m. Planele: H (z=0), V (y=0), W (x=0).`,
  `M=(2;1;0,6) m; N=(4;3;${fmt(.6+(+v.dz))}) m.`,
  `P: x+y+z=${fmt(+v.k)} m, cu H:z=0, V:y=0, W:x=0.`,
  `Δx=3 m, Δy=4 m și Δz=${fmt(+v.dz)} m.`,
  `Baza ABCD în H: A(1;1;0), B(3;1;0), C(3;2;0), D(1;2;0) m.`,
  v.shape==='sphere'?`Sferă: centru (3;2;3) m; R=2 m; distanța d=${fmt(+v.d)} m.`:
     `${v.shape==='cone'?'Con':'Cilindru'}: axa prin (3;2) m, R=2 m, h=4 m; plan orizontal la z=${fmt(+v.d)} m.`,
  `Cilindru drept vertical: centru bază (3;2) m; R=1,20 m; secant P: z=${fmt(+v.k)}x+0,30 (m).`,
  `Cilindru drept circular: axa prin (3;2) m; R=${fmt(+v.r)} m; secant P: z=0,5x+0,3 (m).`,
  `Perete real: 6,45 m × 2,80 m; scara desenului 1:${+v.den}.`
 ][unit-1];
 const method=[
   'Folosește asemănarea triunghiurilor cu vârful S. Compară proiecția centrală cu proiecția paralelă.',
   'Verifică întâi y=0 sau z=0. În rest, semnele depărtării și cotei stabilesc diedrul.',
   'Scrie D(t)=M+t(N−M). Pentru urma H impune z(t)=0; pentru V impune y(t)=0.',
   'Pentru urme, anulează pe rând z, y și x în ecuația planului.',
   'Construiește triunghiul dreptunghic cu catetele L_H=√(Δx²+Δy²) și Δz; calculează ipotenuza.',
   'Identifică muchiile și fețele. Pentru vizibilitate compară adâncimile pe aceeași proiectantă.',
   'Secționează cu un plan de nivel. Sfera: r²+d²=R²; cilindrul: r=R; conul: r/R=(h−z)/h.',
   'Construiește intersecția cu planul de capăt. Adevărata semiaxă mare a=R√(1+k²).',
   'La desfășurare, s=Rθ. Verifică faptul că scara e identică pe direcția s și pe direcția z.',
   'Transformă lungimea reală în mm și împarte la numitorul scării. Observă schimbarea dimensiunii desenate.'
 ][unit-1];
 return {unit,title:LAB[unit-1].title,sub:LAB[unit-1].sub,concept:LAB[unit-1].concept,diagram3d:out3,diagram2d:out2,details,givens,method,question};
}
root.GD_GEOM={defaultParams,controls:ctrl,LAB,compute,intersect,point,add,diff,norm,fmt,isoFit,coneSilhouetteAngles};
})(window);
