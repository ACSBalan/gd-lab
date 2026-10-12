/* Labels are placed in SVG units using measured text bounds, never approximate glyph widths. */
const NS='http://www.w3.org/2000/svg';
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
export function layoutLabels(svg,labels,fontSize,markers=[]){
 const occupied=[],bounds={x:12,y:12,w:776,h:576};
 for(const item of labels.slice().sort((a,b)=>({axis:0,point:1,tick:2}[a.kind]-{axis:0,point:1,tick:2}[b.kind]))){
  const g=document.createElementNS(NS,'g'),t=document.createElementNS(NS,'text');g.setAttribute('class','st-label-group');g.setAttribute('pointer-events','none');t.setAttribute('font-size',fontSize);t.setAttribute('fill',item.color);t.setAttribute('class','st-'+item.kind+'-label');t.textContent=item.text;g.append(t);svg.append(g);
  const box=t.getBBox(),w=box.width+8,h=box.height+6,x=item.xy[0],y=item.xy[1];
  const candidates=item.kind==='point'?[[x+12,y-h-8],[x+12,y+10],[x-w-12,y-h-8],[x-w-12,y+10],[x-w/2,y-h-18],[x-w/2,y+18]]:[[x,y-h],[x-w,y-h]];
  if(item.kind==='point')for(const r of [40,65,95,130])for(let i=0;i<8;i++){const a=i*Math.PI/4;candidates.push([x+r*Math.cos(a)-w/2,y+r*Math.sin(a)-h/2]);}
  let best=null,score=Infinity;
  for(const [cx,cy] of candidates){const b={x:Math.max(bounds.x,Math.min(bounds.x+bounds.w-w,cx)),y:Math.max(bounds.y,Math.min(bounds.y+bounds.h-h,cy)),w,h};
   const collisions=occupied.reduce((sum,q)=>sum+overlap(b,q),0)+markers.reduce((sum,q)=>sum+overlap(b,{x:q[0]-8,y:q[1]-8,w:16,h:16}),0);
   const cost=collisions*1000+Math.hypot(b.x-cx,b.y-cy);
   if(cost<score){best=b;score=cost;}if(cost===0)break;
  }
  if(item.kind==='tick'&&(occupied.some(b=>overlap(best,b)>0)||markers.some(q=>overlap(best,{x:q[0]-10,y:q[1]-10,w:20,h:20})>0))){g.remove();continue;}
  occupied.push(best);t.setAttribute('x',best.x+4-box.x);t.setAttribute('y',best.y+3-box.y);
  const bg=document.createElementNS(NS,'rect');for(const [k,v] of Object.entries({x:best.x,y:best.y,width:best.w,height:best.h,rx:3,fill:'white','fill-opacity':.94}))bg.setAttribute(k,v);g.prepend(bg);
  if(item.kind==='point'&&Math.hypot(best.x+w/2-x,best.y+h/2-y)>Math.max(w,h)+20){const l=document.createElementNS(NS,'line');for(const [k,v] of Object.entries({x1:x,y1:y,x2:Math.max(best.x,Math.min(best.x+w,x)),y2:Math.max(best.y,Math.min(best.y+h,y)),stroke:item.color,'stroke-width':1}))l.setAttribute(k,v);svg.insertBefore(l,g);}
 }
}
