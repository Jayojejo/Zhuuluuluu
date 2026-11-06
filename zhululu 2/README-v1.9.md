# ZHULULU v1.9 — Street Hoops

The default `/` route is now a playable top-down multiplayer basketball court (not a static mockup). `arcade.html` preserves the previous minigames. Two devices must open the same Render URL, select the same mode, and enter the same room code. 1v1 needs 2 players; 2v2 needs 4 players. The room code is displayed after creating the room. A 3-minute match begins when full.

Touch: left joystick to move; hold and release SHOOT to charge; PASS passes to the nearest teammate, or attempts a steal when defending. Keyboard: WASD/arrows, Space, E. Shot power, distance and a random component affect scoring. The server manages positions, ball ownership, scores and match clock; this is a stylized prototype, not a licensed NBA simulation. Music is an original synthesized beat, opt-in by tapping the music button. No copyrighted BamBam recording is bundled.

## Deploy

Place the contents of `zhululu/` in the root of the GitHub repo (package.json and server.js at root). Render Web Service: Build `npm install`, Start `npm start`. Node 18+. Persistent multiplayer requires one server instance (in-memory rooms). Avoid scaling to multiple instances without shared state. The game needs an active connection; offline play is not implemented in this version.
