import * as T from '../vendor/three.module.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
const M=globalThis.GD_MATH,C={H:0x2184b0,V:0xcb782b,W:0x279573},vec=p=>new T.Vector3(...p);
export class Scene {
 constructor(host,onMove){
  this.host=host;this.onMove=onMove;this.scene=new T.Scene();this.scene.background=new T.Color('#f4f8fb');this.camera=new T.PerspectiveCamera(40,1,.05,2000);this.camera.up.set(0,0,1);this.camera.position.set(12,19,14);
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.domElement.setAttribute('aria-label','Model geometric 3D: trage pentru orbită, rotița sau două degete pentru zoom');this.renderer.domElement.tabIndex=0;host.append(this.renderer.domElement);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,0,1);this.controls.minDistance=2;this.controls.maxDistance=160;this.controls.addEventListener('change',()=>this.render());this.controls.update();
  this.group=new T.Group();this.scene.add(this.group);this.scene.add(new T.AmbientLight(0xffffff,2));const light=new T.DirectionalLight(0xffffff,2);light.position.set(10,20,30);this.scene.add(light);
  this.options={H:true,V:true,W:true,projectors:true,labels:true,wire:false,unfold:0,motion:0,drag:false};this.ray=new T.Raycaster();this.pointer=new T.Vector2();this.draggable=[];
  this.resize=new ResizeObserver(()=>{const w=host.clientWidth,h=Math.max(340,host.clientHeight);this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.render();});this.resize.observe(host);
  const el=this.renderer.domElement;
  this.down=e=>{if(!this.options.drag)return;this.setRay(e);const hit=this.ray.intersectObjects(this.draggable)[0];if(!hit)return;this.controls.enabled=false;this.dragged=hit.object.userData.name;this.dragStart={y:e.clientY,p:this.model.points[this.dragged].slice()};this.dragPlane=new T.Plane(new T.Vector3(0,0,1),-this.dragStart.p[2]);el.setPointerCapture(e.pointerId);};
  this.move=e=>{if(!this.dragged)return;let p;if(e.shiftKey){p=this.dragStart.p.slice();p[2]-=(e.clientY-this.dragStart.y)/35;}else{this.setRay(e);const v=new T.Vector3();if(!this.ray.ray.intersectPlane(this.dragPlane,v))return;p=v.toArray();}p=p.map(n=>Math.round(Math.max(-5,Math.min(5,n))*4)/4);this.onMove(this.dragged,p);};
  this.up=()=>{this.dragged=null;this.controls.enabled=true;};el.addEventListener('pointerdown',this.down);el.addEventListener('pointermove',this.move);el.addEventListener('pointerup',this.up);el.addEventListener('pointercancel',this.up);
  this.key=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key))return;e.preventDefault();if(e.key==='+'||e.key==='-')this.zoom(e.key==='+'?.8:1.25);else{const d=this.camera.position.clone().sub(this.controls.target),s=e.key==='ArrowLeft'||e.key==='ArrowDown'?-.12:.12;if(e.key==='ArrowLeft'||e.key==='ArrowRight')d.applyAxisAngle(new T.Vector3(0,0,1),s);else d.applyAxisAngle(new T.Vector3(1,0,0),s);this.camera.position.copy(this.controls.target.clone().add(d));this.controls.update();}};el.addEventListener('keydown',this.key);
 }
 setRay(e){const r=this.renderer.domElement.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.ray.setFromCamera(this.pointer,this.camera);}
 line(points,color=0x263d51,dashed=false){if(points.length<2)return;const g=new T.BufferGeometry().setFromPoints(points.map(vec));const m=dashed?new T.LineDashedMaterial({color,dashSize:.14,gapSize:.1}):new T.LineBasicMaterial({color});const l=new T.Line(g,m);if(dashed)l.computeLineDistances();this.group.add(l);return l;}
 polygon(points,color,opacity=.2){if(points.length<3)return;const positions=[];for(let i=1;i<points.length-1;i++)positions.push(...points[0],...points[i],...points[i+1]);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.computeVertexNormals();const m=new T.MeshStandardMaterial({color,side:T.DoubleSide,transparent:opacity<1,opacity,depthWrite:opacity===1,roughness:.8,wireframe:this.options.wire&&opacity===1});const mesh=new T.Mesh(g,m);this.group.add(mesh);return mesh;}
 label(p,text,color='#263d51'){if(!this.options.labels)return;const canvas=document.createElement('canvas');let c=canvas.getContext('2d');c.font='600 30px system-ui';const width=Math.ceil(c.measureText(text).width)+16;canvas.width=width;canvas.height=48;c=canvas.getContext('2d');c.font='600 30px system-ui';c.fillStyle='rgba(255,255,255,.88)';c.fillRect(0,0,width,48);c.fillStyle=color;c.fillText(text,8,34);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const mat=new T.SpriteMaterial({map:texture,depthTest:false,transparent:true,sizeAttenuation:false});const s=new T.Sprite(mat);s.position.copy(vec(p));s.scale.set(width/48*.034,.034,1);this.group.add(s);}
 point(p,name,color=0xe7a344,drag=false){const mesh=new T.Mesh(new T.SphereGeometry(.11,12,8),new T.MeshBasicMaterial({color}));mesh.position.copy(vec(p));mesh.userData.name=name;this.group.add(mesh);if(drag)this.draggable.push(mesh);this.label(M.add(p,[.24,0,.3]),name,'#'+color.toString(16).padStart(6,'0'));}
 plane(n,k,color,extent,transform=p=>p){const e=extent,corners=[];for(const x of [-e,e])for(const y of [-e,e])for(const z of [-e,e])corners.push([x,y,z]);const pts=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if(corners[i].filter((v,a)=>v!==corners[j][a]).length===1){const q=M.linePlane(corners[i],corners[j],n,k);if(q.kind==='point'&&q.t>=0&&q.t<=1&&!pts.some(p=>M.dist(p,q.point)<1e-8))pts.push(q.point);}
  if(pts.length<3)return;const center=M.mul(pts.reduce((s,p)=>M.add(s,p),[0,0,0]),1/pts.length),u=M.unit(M.sub(pts[0],center)),v=M.unit(M.cross(n,u));pts.sort((a,b)=>Math.atan2(M.dot(M.sub(a,center),v),M.dot(M.sub(a,center),u))-Math.atan2(M.dot(M.sub(b,center),v),M.dot(M.sub(b,center),u)));this.polygon(pts.map(transform),color,.13);this.line(pts.concat([pts[0]]).map(transform),color);
 }
 update(model,options={}){
  this.model=model;Object.assign(this.options,options);this.clear();const o=this.options,e=Math.min(9,Math.max(5,model.extent)),t=o.unfold;
  const planeMap={H:p=>M.rotate(p,[0,0,0],[1,0,0],-t*Math.PI/2),V:p=>p,W:p=>M.rotate(p,[0,0,0],[0,0,1],t*Math.PI/2)};
  for(const [name,n] of [['H',[0,0,1]],['V',[0,1,0]],['W',[1,0,0]]])if(o[name]){this.plane(n,0,C[name],e,planeMap[name]);this.label(planeMap[name](name==='H'?[e*.8,e*.8,0]:name==='V'?[e*.8,0,e*.8]:[0,e*.8,e*.8]),name);}
  for(const [axis,label] of [[[e,0,0],'+OX'],[[0,e,0],'+OY'],[[0,0,e],'+OZ']]){this.line([M.mul(axis,-1),axis],0x526a7e);this.label(axis,label);}this.label([0,0,0],'O');
  if(model.plane){const tr=model.transform&&!model.transform.planeOnly?p=>M.rotate(p,model.transform.origin,model.transform.axis,model.transform.angle*o.motion):p=>p;this.plane(model.plane.n,model.plane.k,0xa987c1,e,tr);}
  if(model.secondPlane)this.plane(model.secondPlane.n,model.secondPlane.k,0xbd6799,e);
  if(model.transform?.planeOnly){this.plane([0,1,0],0,0xab67ad,e,p=>M.rotate(p,[0,0,0],[0,0,1],model.transform.angle*o.motion));}
  if(model.sectionPlane)this.plane(model.sectionPlane.n,model.sectionPlane.k,0xd37626,e);
  for(const face of model.faces)this.polygon(face.map(n=>model.points[n]),0x8fbed4,1);
  for(const [a,b] of model.segments)this.line([model.points[a],model.points[b]],0x263d51);
  if(model.surface)this.surface(model,o.motion);
  for(const [name,p] of Object.entries(model.points)){
   this.point(p,name,0xd88819,['N','A','B'].includes(name)&&globalThis.GD_ACTIVITIES.controls[model.id].some(k=>(name==='B'?['bx','by','bz']:['x','y','z']).includes(k)));
   const requested=model.targets.filter(t=>t.rule.kind==='projection'&&M.dist(t.rule.p,p)<1e-8).map(t=>t.rule.plane);const planes=requested.length?requested:(model.faces.length?[]:['H','V','W']);if(o.projectors)for(const plane of planes)if(o[plane]){const q=M.unfold(p,plane,t);this.line([p,q],C[plane],true);this.point(q,name.toLowerCase()+{H:'',V:'′',W:'″'}[plane],C[plane]);}
  }
  if(model.section){let run=[];for(const p of model.section){if(p)run.push(p);else{this.line(run,0xda613a);run=[];}}this.line(run,0xda613a);}
  if(model.transform&&!model.transform.planeOnly){const p=model.points.N,tr=model.transform;const q=M.rotate(p,tr.origin,tr.axis,tr.angle*o.motion);this.point(q,'N(t)',0xbb4d86);this.line(Array.from({length:49},(_,i)=>M.rotate(p,tr.origin,tr.axis,tr.angle*o.motion*i/48)),0xbb4d86);}
  this.render();
 }
 surface(m,t){const r=m.radius,h=m.height,rows=m.surface==='sphere'?20:8,cols=64;const point=(i,j)=>{const theta=2*Math.PI*j/cols;
  if(m.surface==='sphere'){const a=Math.PI*i/rows;return [r*Math.sin(a)*Math.cos(theta),r*Math.sin(a)*Math.sin(theta),r*Math.cos(a)];}
  const z=h*i/rows;
  if(m.net&&m.surface==='cylinder')return M.cylinderNet(theta,z,r,t);
  if(m.net&&m.surface==='cone'){const g=Math.hypot(r,h),s0=r/g,s=s0+(1-s0)*t,rad=g*(1-z/h),a=theta*s0/s;return [rad*s*Math.sin(a),rad*s*Math.cos(a),h-rad*Math.sqrt(Math.max(0,1-s*s))];}
  const radius=m.surface==='cone'?r*(1-z/h):r;return [radius*Math.cos(theta),radius*Math.sin(theta),z];};
  const positions=[];
  for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const a=point(i,j),b=point(i+1,j),c=point(i+1,j+1),d=point(i,j+1);positions.push(...a,...b,...c,...a,...c,...d);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();this.group.add(new T.Mesh(geometry,new T.MeshStandardMaterial({color:0x98bed0,side:T.DoubleSide,roughness:.8,wireframe:this.options.wire})));
  for(let j=0;j<cols;j+=8)this.line(Array.from({length:rows+1},(_,i)=>point(i,j)),0x41647b);
  for(const i of [0,rows])this.line(Array.from({length:cols+1},(_,j)=>point(i,j)),0x41647b);
 }
 view(name){const distance=25;this.controls.target.set(0,0,0);this.camera.up.set(0,0,1);if(name==='H'){this.camera.position.set(0,.001,distance);this.camera.up.set(0,-1,0);}else if(name==='V')this.camera.position.set(0,distance,0);else if(name==='W')this.camera.position.set(distance,0,0);else this.camera.position.set(12,19,14);this.controls.update();this.render();}
 zoom(factor){this.camera.position.copy(this.controls.target.clone().add(this.camera.position.clone().sub(this.controls.target).multiplyScalar(factor)));this.controls.update();this.render();}
 render(){this.renderer.render(this.scene,this.camera);}
 clear(){this.draggable=[];while(this.group.children.length){const c=this.group.children[0];this.group.remove(c);c.geometry?.dispose();if(c.material){c.material.map?.dispose();c.material.dispose();}}}
 destroy(){this.resize.disconnect();this.controls.dispose();this.clear();this.renderer.dispose();this.host.replaceChildren();}
}
