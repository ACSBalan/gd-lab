(function(root){'use strict';
const M=root.GD_MATH,pi=Math.PI;
const titles=['Proiecții și referință','Punctul și epura','Dreapta și urmele','Planul și intersecțiile','Transformări și adevărata mărime','Poliedre și vizibilitate','Suprafețe de rotație','Secțiuni plane','Desfășurări','Scări și cotare'];
const catalog=[
 ['ortho','central','oblique'],['point','symmetry'],['traces','profile'],['plane','pierce','planes'],['rabat','rotate','change'],['prism','pyramid'],['sphere','cone'],['cylinder-cut','cone-cut'],['cylinder-net','cone-net'],['scale','views']
];
const names={ortho:'Proiecție ortogonală',central:'Proiecție centrală',oblique:'Proiecție paralelă oblică',point:'Epură completă H–V–W',symmetry:'Simetrie față de H',traces:'Dreaptă și trei urme',profile:'Dreaptă de profil',plane:'Cele trei urme ale planului',pierce:'Intersecție dreaptă–plan',planes:'Intersecție plan–plan',rabat:'Rabaterea unui plan',rotate:'Rotație în jurul lui OZ',change:'Schimbarea planului vertical',prism:'Prismă: proiecții și vizibilitate',pyramid:'Piramidă: secțiune de nivel',sphere:'Sferă: secțiune de nivel',cone:'Con: generatoare și secțiune', 'cylinder-cut':'Cilindru: secțiune oblică','cone-cut':'Con: secțiune oblică','cylinder-net':'Desfășurarea cilindrului','cone-net':'Desfășurarea conului',scale:'Construiește la scară',views:'Vederi corelate H–V–W'};
const defaults=()=>({x:2,y:2,z:3,bx:4,by:1,bz:1,k:.5,r:2,h:4,d:1,angle:45,den:50,sh:6,nx:1,ny:1,nz:1,pk:4});
const fields={nx:['Coeficient a',-3,3,.5],ny:['Coeficient b',-3,3,.5],nz:['Coeficient c',-3,3,.5],pk:['Termen d (m)',-6,6,.5],x:['x (m)',-5,5,.25],y:['y (m)',-5,5,.25],z:['z (m)',-5,5,.25],bx:['xB (m)',-5,5,.25],by:['yB (m)',-5,5,.25],bz:['zB (m)',-5,5,.25],k:['Panta k (m/m)',-1.5,1.5,.1],r:['Raza R (m)',.5,3,.25],h:['Înălțimea h (m)',1,6,.25],d:['Cota secțiunii d (m)',-4,6,.25],angle:['Unghiul α (°)',-180,180,15],den:['Numitorul scării',10,200,10],sh:['Cota centrului S (m)',1,8,.25]};
const controls={ortho:['x','y','z'],central:['x','y','z','sh'],oblique:['x','y','z','k'],point:['x','y','z'],symmetry:['x','y','z'],traces:['x','y','z','bx','by','bz'],profile:['x','y','z','by','bz'],plane:['nx','ny','nz','pk'],pierce:['nx','ny','nz','pk','z','bz'],planes:[],rabat:['x','y','k'],rotate:['x','y','z','angle'],change:['x','y','z','angle'],prism:['h','k'],pyramid:['h','d'],sphere:['r','d'],cone:['r','h','d'],'cylinder-cut':['r','h','k'],'cone-cut':['r','h','k'],'cylinder-net':['r','h'],'cone-net':['r','h'],scale:['x','z','den'],views:['x','y','z']};
function build(id,p){
 const N=[p.x,p.y,p.z],A=N,B=[id==='profile'?p.x:p.bx,p.by,p.bz];
 const a={id,title:names[id],points:{},segments:[],faces:[],curves:[],targets:[],joins:[],instructions:[],notes:[],numbers:[],extent:7,board:'epure',unitLabel:'m',axes:true,source:''};
 const pt=(name,pos)=>{a.points[name]=pos;return pos;},target=(label,rule,hint)=>a.targets.push({label,rule,hint});
 const proj=(name,pos,planes=['H','V','W'])=>{pt(name,pos);planes.forEach((plane,i)=>target(name.toLowerCase()+['','′','″'][['H','V','W'].indexOf(plane)],{kind:'projection',p:pos,plane},plane==='H'?'Aceeași abscisă; depărtarea pozitivă se așază sub OX.':plane==='V'?'Aceeași abscisă; cota pozitivă se așază deasupra OX.':'Pe W, depărtarea pozitivă este spre dreapta; cota rămâne în sus.'));};
 const xy=(label,pos,hint)=>target(label,{kind:'coordinate',p:pos},hint);
 const join=(l,r)=>a.joins.push([l,r]);
 const number=(label,value,unit='m',reason='')=>a.numbers.push({label,value,unit,reason});
 const circle=(r,z)=>Array.from({length:97},(_,i)=>[r*Math.cos(i*pi/48),r*Math.sin(i*pi/48),z]);
 if(['ortho','point','symmetry','central','oblique'].includes(id)){
  proj('N',N);a.source='Sârbu, unitățile 1–2, în special §2.3; suport extins §1.1–2.4.';
  a.instructions=['Construiește proiecțiile punctului N folosind axele comune.','Alege eticheta cerută și plasează punctul în planșă; verifică liniile de ordine.'];
  const c=M.classify(N);a.notes.push(c.diedru?'N este în diedrul '+c.diedru+'.':'N este pe frontiera diedrelor; nu i se atribuie un diedru deschis.');
  if(c.planes.length)a.notes.push('N aparține '+c.planes.join(', ')+'. O proiecție pe W a unui punct de pe OX este O.');
  if(c.bisector)a.notes.push(c.bisector==='I/III'?'Bisector I–III: n și n′ sunt simetrice față de OX.':'Bisector II–IV: n și n′ coincid grafic; păstrează ambele etichete.');
  if(id==='symmetry')proj('M',[p.x,p.y,-p.z]);
  if(id==='central'){
   a.targets=[];pt('S',[0,0,p.sh]);const q=M.central(N,a.points.S);a.projection='central';
   if(q.kind==='point'){pt('Q',q.point);xy('q',[-q.point[0],-q.point[1]],'Q este intersecția dreptei SN cu H, nu piciorul perpendicularei.');a.segments.push(['S','Q']);number('Factorul de proiecție',p.sh/(p.sh-p.z),'', 'Din triunghiuri asemenea: S_z / (S_z − N_z).');}
   else a.notes.push('SN este paralelă cu H: nu există imagine finită. Dacă N=S, proiectanta nu este determinată.');
   a.instructions=['Construiește imaginea centrală q pe H, prelungind SN. Compară cu proiecția ortogonală.'];
  }
  if(id==='oblique'){a.targets=[];const q=[p.x+p.k*p.z,p.y,p.z-p.z];pt('Q',q);xy('q',[-q[0],-q[1]],'Proiectanta are direcția (k,0,−1); la z=0, x crește cu k·z.');a.segments.push(['N','Q']);a.projection='oblique';a.instructions=['Construiește proiecția pe H în direcția (k, 0, −1).'];}
 } else if(['traces','profile'].includes(id)){
  proj('A',A);proj('B',B);a.segments.push(['A','B']);['','′','″'].forEach(s=>join('a'+s,'b'+s));
  for(const [plane,normal] of [['H',[0,0,1]],['V',[0,1,0]],['W',[1,0,0]]]){
   const q=M.linePlane(A,B,normal,0);
   if(M.dist(A,B)<M.EPS){a.notes.push('A=B: nu este definită o dreaptă unică.');break;}
   if(q.kind==='point'){pt(plane+'D',q.point);target(plane.toLowerCase()+'D',{kind:'trace',a:A,b:B,plane},'Urma trebuie să aparțină dreptei AB și planului '+plane+'.');}
   else a.notes.push(plane+': '+(q.kind==='contained'?'întreaga dreaptă este în plan; nu există urmă unică.':'dreapta este paralelă cu planul; nu există urmă finită.'));
  }
  a.instructions=['Plasează proiecțiile lui A și B, apoi construiește dreptele prin câte două proiecții omonime.','Construiește hD în H, vD în V și wD în W. Folosește intersecții și linii de ordine.'];
  if(id==='profile')a.notes.push('La dreapta de profil xA=xB, verificarea doar a alinierii H/V nu este suficientă. Proiecția W arată panta și urmele.');
  a.source='Sârbu §3.2; suport extins §3.2–3.6.';
 } else if(['plane','pierce','planes'].includes(id)){
  const n=[p.nx,p.ny,p.nz],k=p.pk;
  if(M.norm(n)>M.EPS)a.plane={n,k};
  if(id==='plane'){
   a.instructions=['Planul P: '+n[0]+'x + '+n[1]+'y + '+n[2]+'z = '+k+' m. Construiește câte două puncte pe fiecare urmă și unește-le.'];
   if(M.norm(n)<M.EPS){a.notes.push(k===0?'Ecuația 0=0 descrie întreg spațiul, nu un plan unic.':'Ecuația 0=d, cu d nenul, nu are soluții.');}
   else for(const plane of ['H','V','W']){const axis={H:[0,1],V:[0,2],W:[1,2]}[plane],aa=n[axis[0]],bb=n[axis[1]];
    if(Math.abs(aa)+Math.abs(bb)<M.EPS){a.notes.push(plane+': '+(Math.abs(k)<M.EPS?'P coincide cu planul de proiecție; intersecția este un plan, nu o urmă unică.':'P este paralel cu planul de proiecție; nu există urmă.'));continue;}
    const free=Math.abs(bb)>M.EPS?axis[0]:axis[1],coordinate=['x','y','z'][free];
    a.instructions.push(plane+': fixează '+coordinate+'=0 pentru '+plane.toLowerCase()+'1 și '+coordinate+'=2 pentru '+plane.toLowerCase()+'2; calculează cealaltă coordonată din ecuația planului.');
    for(const t of [0,2]){const pos=[0,0,0];if(Math.abs(bb)>M.EPS){pos[axis[0]]=t;pos[axis[1]]=(k-aa*t)/bb;}else{pos[axis[0]]=k/aa;pos[axis[1]]=t;}pt(plane+(t===0?'1':'2'),pos);target(plane.toLowerCase()+(t===0?'1':'2'),{kind:'planeTrace',n,k,plane,t},'Punctul trebuie să satisfacă ecuația planului și să aibă coordonata liberă indicată.');}
    join(plane.toLowerCase()+'1',plane.toLowerCase()+'2');
   }
   if(Math.abs(n[0])<M.EPS)a.notes.push(k===0?'P conține OX: urmele H și V pot coincide cu OX.':'P este paralel cu OX: nu există punct comun al urmelor pe OX.');
  }else if(id==='pierce'){
   const a0=[1,1,p.z],b0=[3,2,p.bz];proj('A',a0,['H','V']);proj('B',b0,['H','V']);a.segments.push(['A','B']);const q=M.norm(n)<M.EPS?{kind:'invalid'}:M.linePlane(a0,b0,n,k);
   if(q.kind==='point'){pt('K',q.point);for(const plane of ['H','V'])target(plane==='H'?'k':'k′',{kind:'pierce',a:a0,b:b0,n,k,plane},'K trebuie să satisfacă simultan ecuația dreptei și ecuația planului.');}
   else a.notes.push(q.kind==='invalid'?'Normala este nulă: nu este definit un plan.':q.kind==='parallel'?'Dreapta este paralelă cu P: nicio intersecție.':'Dreapta este inclusă în P: infinit de multe intersecții.');
   a.instructions=['Construiește proiecțiile dreptei AB și punctul K de străpungere al planului '+n[0]+'x + '+n[1]+'y + '+n[2]+'z = '+k+'.'];
  }else{
   a.plane={n:[0,1,1],k:1};a.secondPlane={n:[0,1,2],k:3};a.points={};a.faces=[];
   for(const [label,x] of [['I',-3],['J',3]]){const q=[x,-1,2];pt(label,q);for(const plane of ['H','V','W'])target(label.toLowerCase()+{H:'',V:'′',W:'″'}[plane],{kind:'planeIntersection',x,plane},'Rezolvă y+z=1 și y+2z=3; x este liber.');}
   a.segments.push(['I','J']);join('i','j');join('i′','j′');a.notes.push('Excepție: urmele H și V ale celor două plane sunt paralele cu OX, dar planele nu sunt paralele. Urmele W disting înclinările.');a.instructions=['P: y+z=1; Q: y+2z=3. Construiește două puncte I (x=−3) și J (x=3) ale intersecției, în toate cele trei proiecții.'];
  }a.source='Sârbu unitatea 4; suport extins §4.2, §4.4–4.5 (excepția urmelor paralele).';
 }else if(['rabat','rotate','change'].includes(id)){
  const q=id==='rabat'?[p.x,p.y,p.k*p.y]:N;proj('N',q);let dest;
  if(id==='rabat'){dest=M.rotate(q,[0,0,0],[1,0,0],-Math.atan(p.k));a.transform={origin:[0,0,0],axis:[1,0,0],angle:-Math.atan(p.k)};a.plane={n:[0,-p.k,1],k:0};target('n₀',{kind:'rabat',p:q,k:p.k},'Distanța față de axa OX este √(y²+z²), cu semnul lui y.');a.instructions=['Rabatere pe H a planului z=k·y în jurul urmei OX. Construiește n₀; compară raza arcului cu distanța spațială față de OX.'];}
  if(id==='rotate'){dest=M.rotate(q,[0,0,0],[0,0,1],p.angle*pi/180);a.transform={origin:[0,0,0],axis:[0,0,1],angle:p.angle*pi/180};for(const plane of ['H','V','W'])target('r'+{H:'',V:'′',W:'″'}[plane],{kind:'rotate',p:q,angle:p.angle,plane},'Rotația în jurul OZ păstrează cota și distanța față de OZ.');a.instructions=['Rotește N în jurul OZ cu α='+p.angle+'°. Construiește proiecțiile punctului R.'];}
  if(id==='change'){a.board='metric';a.axes=false;const alpha=p.angle*pi/180;dest=[p.x*Math.cos(alpha)+p.y*Math.sin(alpha),-p.x*Math.sin(alpha)+p.y*Math.cos(alpha),p.z];xy('n₁',[-dest[0],-dest[1]],'Noua depărtare este y₁=−x sin α+y cos α.');xy('n₁′',[-dest[0],dest[2]],'Cota z se păstrează; x₁=x cos α+y sin α.');a.transform={origin:[0,0,0],axis:[0,0,1],angle:alpha,planeOnly:true};a.instructions=['Schimbă planul vertical: OX₁ face unghiul α cu OX în H. Planșa folosește cadrul local x₁,y₁,z, cu +x₁ spre stânga.'];a.notes.push('Schimbarea planului nu deplasează obiectul. Sunt schimbate axa de referință și proiecția verticală.');}
  if(id!=='change'){pt('R',dest);a.segments.push(['N','R']);}a.source='Sârbu unitatea 5; suport extins §5 (schimbarea planelor, rotație, rabatere).';
 }else if(['prism','pyramid','views'].includes(id)){
  const w=id==='views'?Math.abs(p.x)||1:3,depth=id==='views'?Math.abs(p.y)||1:2,height=id==='views'?Math.abs(p.z)||1:p.h;
  const v=[[0,0,0],[w,0,0],[w,depth,0],[0,depth,0]];const top=id==='pyramid'?[[w/2,depth/2,height]]:v.map(q=>[q[0]+(id==='prism'?p.k:0),q[1],height]);
  v.concat(top).forEach((q,i)=>pt(String.fromCharCode(65+i),q));
  a.givenNames=id==='pyramid'?['A','B','C','D','E']:['B','G'];a.faces=id==='pyramid'?[['A','D','C','B'],['A','B','E'],['B','C','E'],['C','D','E'],['D','A','E']]:[['A','D','C','B'],['E','F','G','H'],['A','B','F','E'],['B','C','G','F'],['C','D','H','G'],['D','A','E','H']];
  const edges=new Set();a.faces.forEach(f=>f.forEach((s,i)=>edges.add([s,f[(i+1)%f.length]].sort().join('|'))));a.segments=[...edges].map(e=>e.split('|'));
  if(id==='pyramid'){
   if(p.d>=0&&p.d<=p.h){const points=v.map((q,i)=>M.lerp(q,top[0],p.d/p.h));points.forEach((q,i)=>proj('K'+(i+1),q,['H']));if(p.d<p.h)points.forEach((q,i)=>join('k'+(i+1),'k'+((i+1)%4+1)));a.section=points.concat([points[0]]);number('Latura paralelă cu AB',w*(1-p.d/p.h));}
   else a.notes.push('Planul z=d nu intersectează piramida finită (0≤z≤h).');a.instructions=['Construiește în H secțiunea piramidei cu planul z=d. Găsește fiecare punct pe muchia corespunzătoare.'];
  }else{
   for(const name of ['B','G'])proj(name,a.points[name]);['','′','″'].forEach(s=>join('b'+s,'g'+s));
   a.instructions=['Construiește cele trei proiecții ale vârfurilor B și G. Unește proiecțiile pentru diagonala BG.','Observă fețele dinspre H și V; verifică vizibilitatea muchiei BF în V.'];
   if(id==='prism')a.choice={label:'Muchia BF este vizibilă în vederea V?',options:['Vizibilă','Ascunsă'],answer:'Ascunsă',reason:'BF are y=0; fața opusă, cu y=2, este mai aproape de observatorul dinspre +y.'};
  }a.source='Sârbu unitățile 6 și 10; suport extins: proiecții corelate și vizibilitate după adâncime.';
 }else if(['sphere','cone','cylinder-cut','cone-cut'].includes(id)){
  a.surface=id==='sphere'?'sphere':id==='cylinder-cut'?'cylinder':'cone';a.radius=p.r;a.height=p.h;
  if(id==='sphere'){
   const q=M.sphereSection(p.r,p.d);a.sectionPlane={n:[0,0,1],k:p.d};
   if(q.kind!=='empty'){a.section=circle(q.radius,p.d);for(const [label,sign] of [['L',-1],['R',1]]){const pos=[sign*q.radius,0,p.d];pt(label,pos);target(label.toLowerCase()+'′',{kind:'sphere',r:p.r,d:p.d,sign},'În V, x²+d²=R². La tangență, cele două extremități coincid.');}number('Raza secțiunii',q.radius);}
   a.notes.push(q.kind==='empty'?'|d|>R: plan exterior, secțiune vidă.':q.kind==='tangent'?'|d|=R: tangență într-un singur punct.':'|d|<R: secțiune circulară.');a.instructions=['Construiește extremitățile secțiunii în V și determină raza cercului de nivel.'];
  }else if(id==='cone'){
   a.sectionPlane={n:[0,0,1],k:p.d};if(p.d>=0&&p.d<=p.h){const r=p.r*(1-p.d/p.h);a.section=circle(r,p.d);xy('l′',[r,p.d],'Din asemănare: r/R=(h−d)/h; +x este spre stânga.');xy('r′',[-r,p.d],'Verifică simetria față de OZ.');join('l′','r′');number('Raza secțiunii',r);}else a.notes.push('Planul este în afara conului finit: nu există secțiune.');a.instructions=['Taie conul cu z=d. Construiește diametrul proiectat în V.'];
  }else{
   const mid=p.h/2;a.sectionPlane={n:[-p.k,0,1],k:mid};a.section=[];
   for(let i=0;i<=128;i++){const t=i*pi/64,c=Math.cos(t),s=Math.sin(t);let r=p.r,z=mid+p.k*r*c;if(id==='cone-cut'){const den=p.h+p.k*p.r*c;r=Math.abs(den)<M.EPS?NaN:p.r*(p.h-mid)/den;z=mid+p.k*r*c;}a.section.push(z>=0&&z<=p.h&&Number.isFinite(r)?[r*c,r*s,z]:null);}
   for(const sign of [-1,1]){const den=p.h+sign*p.k*p.r;const r=id==='cone-cut'?p.r*(p.h-mid)/den:p.r,z=mid+p.k*sign*r;if(r>=0&&z>=0&&z<=p.h)target(sign<0?'l′':'r′',{kind:'cut',surface:a.surface,r:p.r,h:p.h,k:p.k,sign},'Aplică simultan ecuația suprafeței și z=h/2+kx.');}
   a.instructions=['Construiește în V intersecțiile cu generatoarele din planul y=0. Observă secțiunea reală și porțiunile din afara corpului finit.'];
   if(id==='cylinder-cut'){number('Semiaxa mare a elipsei complete',p.r*Math.sqrt(1+p.k*p.k));a.notes.push('Elipsa completă are semiaxe R√(1+k²) și R. Corpul finit poate păstra numai o parte a ei.');}else a.notes.push(Math.abs(p.k)<p.h/p.r?'Pe conul nelimitat: elipsă.':Math.abs(Math.abs(p.k)-p.h/p.r)<1e-8?'Pe conul nelimitat: parabolă (plan paralel unei generatoare).':'Pe conul dublu nelimitat: hiperbolă. Se afișează numai conul finit.');
  }a.source='Sârbu unitățile 7–8; suport extins: secțiuni definite prin ecuații, cazuri limită.';
 }else if(['cylinder-net','cone-net'].includes(id)){
  a.board='metric';a.axes=false;a.surface=id==='cylinder-net'?'cylinder':'cone';a.radius=p.r;a.height=p.h;a.net=true;
  if(id==='cylinder-net'){xy('a',[0,0],'Originea desfășurării.');xy('b',[2*pi*p.r,0],'Lățimea este circumferința bazei, 2πR.');xy('c',[2*pi*p.r,p.h],'Înălțimea mantalei rămâne h.');xy('d',[0,p.h],'Înălțime h.');[['a','b'],['b','c'],['c','d'],['d','a']].forEach(q=>join(...q));number('Aria mantalei',2*pi*p.r*p.h,'m²');a.instructions=['Desfășoară cilindrul și construiește conturul dreptunghiului mantalei.'];}
  else{const g=Math.hypot(p.r,p.h),angle=2*pi*p.r/g;xy('s',[0,0],'Centrul sectorului reprezintă vârful conului.');xy('a',[0,g],'Raza sectorului este generatoarea g, nu raza bazei R.');target('b',{kind:'coneNet',r:p.r,h:p.h},'Unghiul sectorului este 360°·R/g, măsurat de la +vertical spre dreapta.');join('s','a');join('s','b');a.requiredArc={center:'s',start:'a',end:'b',angle};number('Unghiul sectorului',angle*180/pi,'°');a.instructions=['Construiește sectorul circular al mantalei: vârful s, cele două generatoare și arcul de rază g.'];}
  a.notes.push('Desfășurarea păstrează lungimile pe suprafață. Sfera nu admite o desfășurare plană exactă fără deformare.');a.source='Sârbu unitatea 9; suport extins: desfășurări cilindrice și conice.';
 }else if(id==='scale'){
  a.board='paper';a.unitLabel='mm';a.axes=false;const w=Math.max(.25,Math.abs(p.x)),h=Math.max(.25,Math.abs(p.z));
  pt('A',[0,0,0]);pt('B',[w,0,0]);pt('C',[w,0,h]);pt('D',[0,0,h]);a.faces.push(['A','B','C','D']);a.segments.push(['A','B'],['B','C'],['C','D'],['D','A']);xy('a',[0,0],'Originea desenului.');target('b',{kind:'scale',m:w,den:p.den,axis:0},'Transformă m în mm, apoi împarte la numitorul scării.');target('c',{kind:'scaleCorner',w,h,den:p.den},'Dimensiunile pe hârtie sunt 1000·L/N în mm.');target('d',{kind:'scale',m:h,den:p.den,axis:1},'Nu confunda metri spațiali cu milimetri pe hârtie.');[['a','b'],['b','c'],['c','d'],['d','a']].forEach(q=>join(...q));number('Cota reală a lățimii',1000*w,'mm','Textul cotei reprezintă mărimea reală, independent de scară.');a.instructions=['Obiect: '+w+' m × '+h+' m. Construiește dreptunghiul pe hârtie la scara 1:'+p.den+' și înscrie cota reală a lățimii în mm.'];a.source='Sârbu unitatea 10; suport extins: scări, unități și cotare.';
 }
 a.extent=Math.max(6,...Object.values(a.points).flat().map(Math.abs),p.r||0);
 return a;
}
root.GD_ACTIVITIES={titles,catalog,names,defaults,fields,controls,build};
})(globalThis);
