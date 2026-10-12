const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
require('../scripts/math.js');require('../scripts/activities.js');require('../scripts/validation.js');
const A=global.GD_ACTIVITIES,V=global.GD_VALIDATE;
function solved(a){return {points:Object.fromEntries(a.targets.map(t=>[t.label,V.expected(t.rule)])),lines:a.joins.map(([a,b])=>({a,b})),answers:Object.fromEntries(a.numbers.map((q,i)=>[i,String(q.value)])),choice:a.choice?.answer};}
test('C1: course dimension convention and paper length are independent',()=>{
 for(const [width,accepted,rejected,display] of [[2,['2,00','2.00','2'],['2000','200'],'2,00'],[.75,['75'],['0,75','750'],'75'],[1,['1','1,00'],['100','1000'],'1,00']]){
  const a=A.build('scale',{...A.defaults(),x:width,den:50}),w=solved(a);
  assert.equal(a.numbers[0].display,display);assert.equal(a.numbers[1].value,width*1000/50);
  for(const s of accepted){w.answers[0]=s;assert.equal(V.check(a,w).ok,true,s);}
  for(const s of rejected){w.answers[0]=s;const r=V.check(a,w);assert.equal(r.ok,false,s);assert.ok(r.results.some(q=>q.text.includes('p. 68')));}
 }
});
test('C2: P14 and seminar use centimetres for sub-metre dimensions and the actual course zero datum',()=>{
 const e=JSON.parse(fs.readFileSync('data/seminar.json','utf8')).exercises.find(e=>e.id==='10.3');
 assert.ok(e.solution.steps.some(s=>s.includes('90 | 90 | 1,50 | 1,20 | 1,95')));
 const {figures}=require('../tools/render-figures.cjs'),s=figures.P14();
 assert.match(s,/±0,00/);assert.match(s,/>6,45</);assert.doesNotMatch(s,/>0,90</);
});
test('M2: both rabatment senses, negative slopes and hinge distances',()=>{
 for(const k of [-1,-.5,.5,1])for(const x of [-3,1,3]){const a=A.build('rabat',{...A.defaults('rabat'),k,x}),w=solved(a),rule=a.targets.find(t=>t.label==='n₀').rule;
  for(const [index,q] of V.alternatives(rule).entries()){w.points['n₀']=q;const r=V.check(a,w);assert.ok(r.ok);assert.ok(Math.abs(Math.abs(-q[0]-1)-Math.hypot(x-1,k*(x-1)))<1e-9);if(x!==1)assert.ok(r.results.find(r=>r.label==='n₀').text.includes(index?'aceeași parte':'partea opusă'));}
  const end=global.GD_MATH.rotate(a.points.N,a.transform.origin,a.transform.axis,a.transform.angle);assert.ok(Math.abs(end[2])<1e-9);assert.ok(Math.abs(end[0]+V.expected(rule)[0])<1e-9);
 }
 const a=A.build('rabat',A.defaults('rabat'));assert.deepEqual(a.points.N,[3,2,1]);assert.ok(Math.abs(V.expected(a.targets.at(-1).rule)[0]-(Math.sqrt(5)-1))<1e-9);
});
test('M1: course coordinates map signs independently in H, V and W',()=>{
 const a=A.build('point',A.defaults());for(const [name,p,expected] of [['n',[2,2],[-2,-2]],['n′',[2,3],[-2,3]],['n″',[2,3],[2,3]]])assert.deepEqual(A.coordinateConvert(p,A.coordinateFrame(a,name).kind),expected);
});
test('M3: the coincident BF/CG silhouette is drawn continuously',()=>{const a=A.build('prism',A.defaults());assert.ok(a.choice.answer.startsWith('Continuu'));assert.match(a.choice.reason,/p. 45/);});
test('M6: pointer accuracy is capped and coarse zoom cannot validate a shortened rabatment radius',()=>{
 const a=A.build('rabat',A.defaults('rabat')),w=solved(a);w.exactPoints=Object.fromEntries(a.targets.map(t=>[t.label,t.label!=='n₀']));
 for(const unitsPerPixel of [1/21,1/16,.01]){w.points['n₀']=[1,-2];const result=V.check(a,w,{unitsPerPixel}),point=result.results.find(r=>r.label==='n₀');assert.equal(point.ok,false);assert.ok(point.tolerance<=.15);assert.ok(Math.abs(point.error-(Math.sqrt(5)-2))<1e-9);}
 w.points['n₀']=V.expected(a.targets.at(-1).rule);assert.equal(V.check(a,w,{unitsPerPixel:1/21}).ok,false);assert.match(V.check(a,w,{unitsPerPixel:1/21}).results.at(-1).text,/Mărește planșa pentru precizie/);assert.equal(V.check(a,w,{unitsPerPixel:.01}).ok,true);
 w.exactPoints['n₀']=true;assert.equal(V.check(a,w,{unitsPerPixel:1/16}).ok,true);w.points['n₀'][0]+=.13;assert.equal(V.check(a,w,{unitsPerPixel:1/16}).ok,false);
 for(const unitsPerPixel of [1e-3,.01875,.02,1,100]){assert.ok(V.precision(a,unitsPerPixel).tolerance<=.15);assert.ok(V.precision({board:'paper'},unitsPerPixel).tolerance<=.5);}
});

test('GD-U10-070 preserves the zero datum actually printed in Sârbu',()=>{const c=JSON.parse(fs.readFileSync('data/cards.json','utf8')).cards.find(c=>c.id==='GD-U10-070');assert.match(c.back,/±0,00 \(Sârbu, p\. 69, Fig\. 10\.2\.11\)/);assert.doesNotMatch(c.back,/notată \+0,00/);});
test('m1/m4/m5/m6: left labels, zero dimensions, complete trace notation and interior piercing point',()=>{
 for(const id of ['sphere','cone','cone-cut']){const a=A.build(id,A.defaults()),l=V.expected(a.targets.find(t=>t.label==='l′').rule),r=V.expected(a.targets.find(t=>t.label==='r′').rule);assert.ok(l[0]<r[0],id);}
 const zero=A.build('scale',{...A.defaults(),z:0});assert.equal(zero.targets.length,0);assert.ok(zero.notes[0].includes('nu a fost înlocuită'));
 const traces=A.build('traces',A.defaults());assert.deepEqual(traces.targets.slice(6).map(t=>t.label),['h','h′','v','v′','w','w″']);for(const label of ['h′','v'])assert.ok(Math.abs(V.expected(traces.targets.find(t=>t.label===label).rule)[1])<1e-10);
 assert.deepEqual(A.build('pierce',A.defaults('pierce')).points.K,[2,1.5,2]);
});
test('Unchanged identifiers, synchronized offline bundle and canonical unit titles',()=>{
 const vm=require('node:vm'),ctx={window:{}};vm.createContext(ctx);for(const name of ['data/bundle.js','data/exam.js'])vm.runInContext(fs.readFileSync(name,'utf8'),ctx);
 const d=ctx.window.GD_DATA,ids=JSON.parse(fs.readFileSync('tests/baseline-ids.json','utf8'));assert.deepEqual(JSON.parse(JSON.stringify({cards:d.cards.map(c=>c.id),exercises:d.exercises.map(c=>c.id),exam:ctx.window.GD_EXAM.map(c=>c.id),activities:A.catalog.flat()})),ids);
 assert.deepEqual(JSON.parse(JSON.stringify(d.cards)),JSON.parse(fs.readFileSync('data/cards.json','utf8')).cards);assert.deepEqual(JSON.parse(JSON.stringify(d.exercises)),JSON.parse(fs.readFileSync('data/seminar.json','utf8')).exercises);assert.deepEqual(Array.from(d.units,u=>u.title),A.titles);
});
test('m10–m13: reference label/text corrections preserve validated numeric answers',()=>{
 const vm=require('node:vm'),ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('scripts/geometry.js','utf8'),ctx);const G=ctx.window.GD_GEOM;
 for(const q of JSON.parse(fs.readFileSync('tests/reference-numeric-fixtures.json','utf8'))){const answer=G.compute(q.unit,q.params,42).question.answer;if(typeof q.answer==='number')assert.ok(Math.abs(answer-q.answer)<1e-10);else assert.equal(answer,q.answer);}
 assert.ok(G.compute(7,{shape:'sphere',d:2}).details.includes('secțiunea se reduce la un punct'));
 for(const u of [5,8,9])assert.doesNotMatch(G.compute(u,G.defaultParams[u],42).details,/px\/m|SVG/);
});
