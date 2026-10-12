/* Independent of screen coordinates, camera, SVG and WebGL. Student data are metric. */
(function(root){'use strict';const M=root.GD_MATH;
function expected(r){
 switch(r.kind){
 case 'coordinate':return r.p.slice();
 case 'projection':return r.plane==='H'?[-r.p[0],-r.p[1]]:r.plane==='V'?[-r.p[0],r.p[2]]:[r.p[1],r.p[2]];
 case 'trace':{const axis={H:2,V:1,W:0}[r.plane],v=r.b.map((b,i)=>b-r.a[i]);if(Math.abs(v[axis])<1e-9)return null;const t=-r.a[axis]/v[axis],p=r.a.map((a,i)=>a+t*v[i]);return expected({kind:'projection',p,plane:r.plane});}
 case 'pierce':{const v=r.b.map((b,i)=>b-r.a[i]),den=r.n.reduce((s,n,i)=>s+n*v[i],0);if(Math.abs(den)<1e-9)return null;const t=(r.k-r.n.reduce((s,n,i)=>s+n*r.a[i],0))/den;return expected({kind:'projection',p:r.a.map((a,i)=>a+t*v[i]),plane:r.plane});}
 case 'planeTrace':{const axes={H:[0,1],V:[0,2],W:[1,2]}[r.plane],a=r.n[axes[0]],b=r.n[axes[1]],p=[0,0,0];if(Math.abs(b)>1e-9){p[axes[0]]=r.t;p[axes[1]]=(r.k-a*r.t)/b;}else{p[axes[0]]=r.k/a;p[axes[1]]=r.t;}return expected({kind:'projection',p,plane:r.plane});}
 case 'planeIntersection':return expected({kind:'projection',p:[r.x,-1,2],plane:r.plane});
 case 'rabat':return [-r.p[0],-r.p[1]*Math.sqrt(1+r.k*r.k)];
 case 'rotate':{const t=r.angle*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return expected({kind:'projection',p:[r.p[0]*c-r.p[1]*s,r.p[0]*s+r.p[1]*c,r.p[2]],plane:r.plane});}
 case 'sphere':{const q=r.r*r.r-r.d*r.d;return q<0?null:[-r.sign*Math.sqrt(q),r.d];}
 case 'cut':{const x=r.surface==='cone'?r.sign*r.r*r.h/2/(r.h+r.sign*r.k*r.r):r.sign*r.r;return [-x,r.h/2+r.k*x];}
 case 'coneNet':{const g=Math.sqrt(r.r*r.r+r.h*r.h),t=2*Math.PI*r.r/g;return [g*Math.sin(t),g*Math.cos(t)];}
 case 'scale':return r.axis===0?[1000*r.m/r.den,0]:[0,1000*r.m/r.den];
 case 'scaleCorner':return [1000*r.w/r.den,1000*r.h/r.den];
 default:throw Error('Regulă necunoscută: '+r.kind);
 }
}
function check(activity,work){
 const results=[],tol=activity.board==='paper'?.5:.12,unit=activity.unitLabel;
 for(const t of activity.targets){const p=work.points[t.label],q=expected(t.rule);if(!q){results.push({ok:false,label:t.label,text:'Caz fără soluție unică.'});continue;}if(!M.finitePoint(p,2)){results.push({ok:false,label:t.label,text:'Lipsește punctul '+t.label+'. '+t.hint});continue;}
  const dx=p[0]-q[0],dy=p[1]-q[1],ok=Math.hypot(dx,dy)<=tol;
  results.push({ok,label:t.label,text:ok?t.label+': poziție corectă.':t.label+': deplasează '+Math.abs(dx).toFixed(2)+' '+unit+' '+(dx>0?'spre stânga':'spre dreapta')+' și '+Math.abs(dy).toFixed(2)+' '+unit+' '+(dy>0?'în jos':'în sus')+'. '+t.hint});
 }
 for(const [a,b] of activity.joins){const pa=work.points[a],pb=work.points[b];if(pa&&pb&&M.dist(pa,pb)<1e-9){results.push({ok:true,label:a+b,text:'Proiecție degenerată într-un punct: '+a+'='+b+'.'});continue;}const ok=(work.lines||[]).some(l=>(l.a===a&&l.b===b)||(l.a===b&&l.b===a));results.push({ok,label:a+b,text:ok?'Dreapta '+a+'–'+b+': construită.':'Construiește dreapta prin '+a+' și '+b+' cu instrumentul Dreaptă.'});}
 if(activity.requiredArc){const r=activity.requiredArc;const arc=(work.arcs||[]).find(a=>a.center===r.center&&a.start===r.start&&a.end===r.end);const ok=!!arc&&Math.abs(arc.angle-r.angle)<.01;results.push({ok,text:ok?'Arcul sectorului: rază și unghi corecte.':'Construiește arcul cu centrul s, de la a la b, în sensul unghiului sectorului.'});}
 activity.numbers.forEach((q,i)=>{const raw=String(work.answers?.[i]??''),value=Number(raw.replace(',','.')),ok=raw.trim()!==''&&Number.isFinite(value)&&Math.abs(value-q.value)<=Math.max(.015,Math.abs(q.value)*.005);results.push({ok,text:ok?q.label+': corect.':q.label+': așteptat '+q.value.toFixed(3)+' '+q.unit+'. '+q.reason});});
 if(activity.choice){const q=activity.choice,ok=work.choice===q.answer;results.push({ok,text:(ok?'Corect. ':'Verifică vizibilitatea. ')+q.reason});}
 if(!results.length){const ok=work.exception===true;results.push({ok,text:ok?'Cazul fără construcție finită a fost identificat.':'Confirmă că ai identificat cazul fără construcție finită.'});}
 // These correspondence conditions are evaluated on the student's own placements.
 const byPoint=new Map();for(const t of activity.targets)if(t.rule.kind==='projection'){const key=JSON.stringify(t.rule.p);if(!byPoint.has(key))byPoint.set(key,{});byPoint.get(key)[t.rule.plane]=work.points[t.label];}
 for(const group of byPoint.values()){
  if(group.H&&group.V&&Math.abs(group.H[0]-group.V[0])>tol)results.push({ok:false,text:'Linia de ordine H–V nu este perpendiculară pe OX: abscisele grafice diferă.'});
  if(group.V&&group.W&&Math.abs(group.V[1]-group.W[1])>tol)results.push({ok:false,text:'Cotele din V și W nu corespund.'});
  if(group.H&&group.W&&Math.abs(group.H[1]+group.W[0])>tol)results.push({ok:false,text:'Transferul depărtării H–W este greșit: −v(H) trebuie să fie u(W).'});
 }
 return {ok:results.every(r=>r.ok),results,tolerance:tol};
}
root.GD_VALIDATE={expected,check};})(globalThis);
