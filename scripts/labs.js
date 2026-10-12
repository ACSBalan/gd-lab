(function(root){'use strict';
function practiceEpure(picks={}) {
 const line=(x1,y1,x2,y2,stroke='#415d70',dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${dash?1:2}" ${dash?'stroke-dasharray="4 5"':''}/>`;
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 320" role="img" aria-label="Epură de construit: plasează proiecțiile n și n prim">';
 for(let x=25;x<500;x+=25)s+=line(x,0,x,320,'#e8edf1','4');for(let y=20;y<320;y+=25)s+=line(0,y,500,y,'#e8edf1','4');
 s+=line(18,150,482,150)+line(330,15,330,305)+`<text x="20" y="139" font-size="13" fill="#415d70">+OX</text><text x="340" y="23" font-size="13" fill="#415d70">+OZ</text><text x="340" y="165" font-size="13" fill="#415d70">O</text>`;
 for(let [role,p] of Object.entries(picks)){if(p){let c=role==='n'?'#176c9a':'#b5672b';s+=`<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="${c}" stroke="white" stroke-width="2"/><text x="${p[0]+10}" y="${p[1]-8}" font-size="14" font-weight="700" fill="${c}">${role==='n'?'n':'n′'}</text>`;}}
 s+='</svg>';return s;
}
function checkEpure(params,picks){let x=+params.x,y=+params.y,z=+params.z;let target={n:[330-31*x,150+31*y],np:[330-31*x,150-31*z]};let errs={};for(let k of ['n','np']){let xy=picks[k];errs[k]=xy?Math.hypot(xy[0]-target[k][0],xy[1]-target[k][1]):Infinity;}return {ok:errs.n<=13&&errs.np<=13,errs,target};}
root.GD_PRACTICE={practiceEpure,checkEpure};
})(window);
