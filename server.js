import {setupBasket} from './basket-server.js';
import express from 'express';
import http from 'node:http';
import {Server} from 'socket.io';
import {randomBytes} from 'node:crypto';
const app=express();app.use(express.static('public'));const server=http.createServer(app);const io=new Server(server,{cors:{origin:'*'}});
setupBasket(io);
const rooms=new Map();const clean=s=>String(s||'').replace(/[<>]/g,'').slice(0,24);const code=()=>randomBytes(3).toString('hex').toUpperCase();
function publish(room){const r=rooms.get(room);if(r)io.to(room).emit('roomState',{code:room,players:Object.values(r.players),game:r.game,ball:r.ball,host:r.host,chat:r.chat.slice(-12)});}
io.on('connection',s=>{
 s.on('join',({room,name,character}={},cb=()=>{})=>{room=clean(room).toUpperCase()||code();name=clean(name)||'Hráč';character='player';if(!rooms.has(room))rooms.set(room,{players:{},host:s.id,game:'lobby',ball:null,chat:[]});const r=rooms.get(room);if(Object.keys(r.players).length>=12){cb({error:'Miestnosť je plná'});return;}if(s.data.room)s.leave(s.data.room);s.join(room);s.data.room=room;r.players[s.id]={id:s.id,name,character,x:Math.random()*70+15,y:Math.random()*50+20,score:0,team:Object.keys(r.players).length%2,ready:false};cb({room,id:s.id});publish(room);});
 s.on('move',({x,y}={})=>{const r=rooms.get(s.data.room);if(!r||!r.players[s.id])return;r.players[s.id].x=Math.max(3,Math.min(97,Number(x)||50));r.players[s.id].y=Math.max(5,Math.min(95,Number(y)||50));s.to(s.data.room).emit('moved',{id:s.id,x:r.players[s.id].x,y:r.players[s.id].y});});
 s.on('game',g=>{const r=rooms.get(s.data.room);if(!r||r.host!==s.id)return;r.game=['lobby','basket','football','volley','pass','road','world','roll','snack','dance','racing','mma'].includes(g)?g:'lobby';r.ball={x:50,y:50,vx:0,vy:0};io.to(s.data.room).emit('event',{text:'Nová hra: '+r.game});publish(s.data.room);});
 s.on('score',()=>{const r=rooms.get(s.data.room);const p=r?.players[s.id];if(!p)return;p.score=Math.min(999,p.score+1);publish(s.data.room);});
 s.on('team',()=>{const r=rooms.get(s.data.room);const p=r?.players[s.id];if(p){p.team=1-p.team;publish(s.data.room);}});
 s.on('chat',v=>{const r=rooms.get(s.data.room);const p=r?.players[s.id];if(!p)return;r.chat.push({name:p.name,text:clean(v).slice(0,100)});publish(s.data.room);});
 s.on('disconnect',()=>{const room=s.data.room,r=rooms.get(room);if(!r)return;delete r.players[s.id];if(r.host===s.id)r.host=Object.keys(r.players)[0];if(!r.host)rooms.delete(room);else publish(room);});
});
app.get('/health',(_,res)=>res.json({ok:true,rooms:rooms.size}));server.listen(process.env.PORT||3000,'0.0.0.0');
