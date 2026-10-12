/* Programare deterministă a repetițiilor: intervale diferențiate, fără promisiuni de FSRS. */
(function(root){'use strict';
const grades=['again','hard','good','easy'];
const date=(d=new Date())=>{let a=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${a}-${m}-${day}`;};
function addDays(dt,num){let [y,m,d]=dt.split('-').map(Number);return date(new Date(y,m-1,d+num,12));}
function newRecord(){return {ease:2.5,interval:0,reps:0,lapses:0,due:null,last:null,t:0};}
function review(old,g,dt=date(),ms=Date.now()){
 if(!grades.includes(g)) throw new Error('Notă invalidă');let p=Object.assign(newRecord(),old||{}),iv=1,ease=p.ease||2.5,reps=p.reps;
 if(g==='again'){iv=0;reps=0;ease=Math.max(1.3,ease-.2);}
 else if(!p.reps || !p.interval){iv={hard:1,good:2,easy:4}[g];reps=1;ease=Math.max(1.3,ease+(g==='hard'?-.12:g==='easy'?.10:0));}
 else{iv={hard:Math.max(1,Math.round(p.interval*1.2)),good:Math.max(p.interval+1,Math.round(p.interval*ease)),easy:Math.max(p.interval+2,Math.round(p.interval*ease*1.3))}[g];reps=p.reps+1;ease=Math.max(1.3,ease+(g==='hard'?-.12:g==='easy'?.10:0));}
 return {ease:Math.round(ease*100)/100,interval:iv,reps,lapses:p.lapses+(g==='again'?1:0),due:addDays(dt,iv),last:dt,t:ms};
}
function intervals(rec,dt){return Object.fromEntries(grades.map(g=>[g,review(rec,g,dt,1).interval]));}
function label(n){return n===0?'azi':n===1?'1 zi':n<30?n+' zile':n<365?Math.round(n/30)+' luni':(n/365).toFixed(1).replace('.',',')+' ani';}
function queue(cards,progress,dt,newLimit){let due=[],fresh=[];cards.forEach(c=>{let r=progress[c.id];if(!r||!r.due)fresh.push(c);else if(r.due<=dt)due.push(c)});due.sort((a,b)=>progress[a.id].due.localeCompare(progress[b.id].due)||a.id.localeCompare(b.id));fresh.sort((a,b)=>a.id.localeCompare(b.id));return due.concat(fresh.slice(0,Math.max(0,newLimit)));}
root.GD_SRS={grades,date,addDays,newRecord,review,intervals,label,queue};
})(window);
