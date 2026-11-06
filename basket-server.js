import {randomBytes} from 'node:crypto';
const rooms=new Map();
const code=()=>randomBytes(3).toString('hex').toUpperCase();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const clean=s=>String(s||'').replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,18)||'Hráč';
export function setupBasket(io){
 const namespace=io.of('/basket');
 function snapshot(r){return {code:r.code,mode:r.mode,players:Object.values(r.players).map(p=>({id:p.id,name:p.name,team:p.team,x:p.x,y:p.y,score:p.score})),ball:r.ball,scores:r.scores,time:Math.max(0,Math.ceil((r.ends-Date.now())/1000)),started:r.started,notice:r.notice};}
 function send(r){namespace.to(r.code).emit('state',snapshot(r));}
 function resetBall(r,team){const ids=Object.keys(r.players).filter(id=>r.players[id].team===team);r.ball={x:400,y:260,owner:ids[0]||null,flight:null};for(const p of Object.values(r.players)){p.x=p.team===0?220:580;p.y=180+(p.slot%2)*160;}}
 namespace.on('connection',s=>{
 s.on('join',({room,mode,name}={},ack=()=>{})=>{
  const id=String(room||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8)||code();
  mode=mode==='2v2'?'2v2':'1v1';let r=rooms.get(id);
  if(!r){r={code:id,mode,players:{},scores:[0,0],ball:{x:400,y:260,owner:null,flight:null},started:false,ends:0,notice:'Čakáme na hráčov',updated:Date.now()};rooms.set(id,r);}
  const limit=r.mode==='2v2'?4:2;
  if(Object.keys(r.players).length>=limit){ack({error:'Miestnosť je plná'});return;}
  if(s.data.room){const old=rooms.get(s.data.room);if(old){delete old.players[s.id];send(old)}s.leave(s.data.room)}
  const count=Object.keys(r.players).length,team=count%2,slot=Math.floor(count/2);
  r.players[s.id]={id:s.id,name:clean(name),team,slot,x:team===0?220:580,y:180+slot*160,score:0,lastMove:0,lastAction:0};
  s.join(id);s.data.room=id;r.updated=Date.now();
  if(!r.ball.owner)r.ball.owner=s.id;
  if(Object.keys(r.players).length===limit){r.started=true;r.ends=Date.now()+180000;r.scores=[0,0];r.notice='ZÁPAS ZAČÍNA!';resetBall(r,0)}
  ack({code:id,id:s.id,mode:r.mode});send(r);
 });
 s.on('move',({x,y}={})=>{const r=rooms.get(s.data.room),p=r?.players[s.id];if(!p||!r.started)return;const now=Date.now();if(now-p.lastMove<28)return;const dt=clamp((now-(p.lastMove||now-50))/1000,.015,.12);p.lastMove=now;let dx=clamp(Number(x)||0,-1,1),dy=clamp(Number(y)||0,-1,1);const m=Math.max(1,Math.hypot(dx,dy));p.x=clamp(p.x+dx/m*230*dt,65,735);p.y=clamp(p.y+dy/m*230*dt,65,455);if(r.ball.owner===s.id){r.ball.x=p.x;r.ball.y=p.y-13;}});
 s.on('act',({type,power}={})=>{const r=rooms.get(s.data.room),p=r?.players[s.id];if(!r||!p||!r.started||Date.now()>r.ends)return;const now=Date.now();if(now-p.lastAction<280)return;p.lastAction=now;
  if(type==='steal'&&r.ball.owner!==s.id&&!r.ball.flight){const holder=r.players[r.ball.owner];if(holder&&holder.team!==p.team&&Math.hypot(holder.x-p.x,holder.y-p.y)<60){r.ball.owner=s.id;r.notice=p.name+' získal loptu!'}return;}
  if(r.ball.owner!==s.id||r.ball.flight)return;
  if(type==='pass'){
   const mates=Object.values(r.players).filter(v=>v.team===p.team&&v.id!==s.id);if(!mates.length){r.notice='V 1v1 nie je komu prihrať';return;}
   const mate=mates.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];r.ball.owner=null;r.ball.flight={type:'pass',from:[p.x,p.y],to:[mate.x,mate.y],target:mate.id,start:now,duration:380};r.notice='PRIHRÁVKA!';return;
  }
  if(type==='shoot'){
   power=clamp(Number(power)||0,0,1);const hx=p.team===0?710:90;const distance=Math.hypot(hx-p.x,260-p.y);const ideal=clamp(.24+distance/980,.28,.88);const quality=clamp(1-Math.abs(power-ideal)*2.5,0,1);const chance=clamp(.14+quality*.77-distance/2600,.05,.93);const made=Math.random()<chance;const pts=distance>235?3:2;
   r.ball.owner=null;r.ball.flight={type:'shot',from:[p.x,p.y],to:[hx,260],start:now,duration:650,made,team:p.team,pts,shooter:s.id};r.notice=made?'LETÍ TO!':'STRELA LETÍ...';
  }
 });
 s.on('disconnect',()=>{const r=rooms.get(s.data.room);if(!r)return;delete r.players[s.id];if(r.ball.owner===s.id)r.ball.owner=Object.keys(r.players)[0]||null;r.started=false;r.notice='Hráč sa odpojil';if(!Object.keys(r.players).length)rooms.delete(r.code);else send(r);});
 });
 setInterval(()=>{const now=Date.now();for(const r of rooms.values()){
  if(r.ball.flight){const f=r.ball.flight,t=clamp((now-f.start)/f.duration,0,1);r.ball.x=f.from[0]+(f.to[0]-f.from[0])*t;r.ball.y=f.from[1]+(f.to[1]-f.from[1])*t-Math.sin(t*Math.PI)*(f.type==='shot'?105:28);
   if(t>=1){r.ball.flight=null;if(f.type==='pass'){r.ball.owner=r.players[f.target]?f.target:Object.keys(r.players)[0]||null;}else{if(f.made){r.scores[f.team]+=f.pts;if(r.players[f.shooter])r.players[f.shooter].score+=f.pts;r.notice=`KÔŠ! +${f.pts} BODY`;resetBall(r,1-f.team)}else{r.notice='DOSKOK!';const all=Object.values(r.players);all.sort((a,b)=>Math.hypot(a.x-r.ball.x,a.y-r.ball.y)-Math.hypot(b.x-r.ball.x,b.y-r.ball.y));r.ball.owner=all[0]?.id||null;}}}
  }
  if(r.started&&now>=r.ends){r.started=false;r.notice='KONIEC ZÁPASU • '+r.scores.join(' : ');}
  if(now-r.updated>3600000){rooms.delete(r.code);continue;}send(r);
 }},66);
}
