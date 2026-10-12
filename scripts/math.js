/* Analytic geometry, in metres and radians. No DOM or rendering dependencies. */
(function(root){'use strict';
const EPS=1e-9,add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,k)=>a.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>Math.hypot(...a),dist=(a,b)=>norm(sub(a,b));
function unit(a){const n=norm(a);if(n<EPS)throw Error('Direcție nulă');return mul(a,1/n);}
const lerp=(a,b,t)=>add(a,mul(sub(b,a),t));
function rotate(p,origin,axis,angle){const v=sub(p,origin),u=unit(axis),c=Math.cos(angle),s=Math.sin(angle);return add(origin,add(add(mul(v,c),mul(cross(u,v),s)),mul(u,dot(u,v)*(1-c))));}
function projection(p,plane){return plane==='H'?[p[0],p[1],0]:plane==='V'?[p[0],0,p[2]]:[0,p[1],p[2]];}
// Board coordinates: right / up. +OX points left. +OY_H down; +OY_W right.
function epure(p,plane){return plane==='H'?[-p[0],-p[1]]:plane==='V'?[-p[0],p[2]]:[p[1],p[2]];}
function unfold(p,plane,t){const q=projection(p,plane);return plane==='H'?rotate(q,[0,0,0],[1,0,0],-t*Math.PI/2):plane==='W'?rotate(q,[0,0,0],[0,0,1],t*Math.PI/2):q;}
function linePlane(a,b,n,k){const v=sub(b,a);if(norm(v)<EPS)return {kind:'point',point:a,onPlane:Math.abs(dot(n,a)-k)<EPS};const den=dot(n,v),r=k-dot(n,a);if(Math.abs(den)<EPS)return {kind:Math.abs(r)<EPS?'contained':'parallel'};const t=r/den;return {kind:'point',point:lerp(a,b,t),t};}
function planePlane(n,k,m,l){const v=cross(n,m),d=dot(v,v);if(norm(n)<EPS||norm(m)<EPS)return {kind:'invalid'};if(d<EPS){const j=n.findIndex(x=>Math.abs(x)>EPS);return {kind:Math.abs(k*m[j]-l*n[j])<EPS?'coincident':'parallel'};}return {kind:'line',point:mul(add(mul(cross(m,v),k),mul(cross(v,n),l)),1/d),direction:unit(v)};}
function central(p,s){if(Math.abs(p[2]-s[2])<EPS)return {kind:'parallel'};const t=-s[2]/(p[2]-s[2]);return {kind:'point',point:lerp(s,p,t),t};}
function lineIntersection(a,b,c,d){const u=sub(b,a),v=sub(d,c),det=u[0]*v[1]-u[1]*v[0];if(norm(u)<EPS||norm(v)<EPS)return {kind:'degenerate'};if(Math.abs(det)<EPS)return {kind:Math.abs((c[0]-a[0])*u[1]-(c[1]-a[1])*u[0])<EPS?'coincident':'parallel'};const t=((c[0]-a[0])*v[1]-(c[1]-a[1])*v[0])/det;return {kind:'point',point:add(a,mul(u,t))};}
function classify(p){const [,y,z]=p,planes=[];if(Math.abs(z)<EPS)planes.push('H');if(Math.abs(y)<EPS)planes.push('V');if(Math.abs(p[0])<EPS)planes.push('W');const diedru=Math.abs(y)<EPS||Math.abs(z)<EPS?null:y>0?(z>0?'I':'IV'):(z>0?'II':'III');const bisector=Math.abs(y-z)<EPS?'I/III':Math.abs(y+z)<EPS?'II/IV':null;return {planes,diedru,bisector};}
function sphereSection(r,d){const v=r*r-d*d;return v < -EPS?{kind:'empty'}:Math.abs(v)<EPS?{kind:'tangent',radius:0}:{kind:'circle',radius:Math.sqrt(v)};}
// Exact developable cylinder family: arc length is R theta for every t, including t=1.
function cylinderNet(theta,z,r,t){const c=1-t;return Math.abs(c)<EPS?[r*theta,0,z]:[r*Math.sin(c*theta)/c,r*(1-Math.cos(c*theta))/c,z];}
function coneNet(theta,r,h){const g=Math.hypot(r,h),a=theta*r/g;return [g*Math.sin(a),g*Math.cos(a)];}
function finitePoint(p,n=3){return Array.isArray(p)&&p.length===n&&p.every(Number.isFinite);}
root.GD_MATH={EPS,add,sub,mul,dot,cross,norm,dist,unit,lerp,rotate,projection,epure,unfold,linePlane,planePlane,central,lineIntersection,classify,sphereSection,cylinderNet,coneNet,finitePoint};
})(globalThis);
