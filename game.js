// Mob Control عربية - نسخة مبسطة قريبة من اللعبة الأصلية
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const mobCountEl = document.getElementById("mobCount");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const restartBtn = document.getElementById("restart");

let level = 1, score = 0, mobCount = 10, baseHP = 15, baseMaxHP = 15;
let mobs = [], gates = [];
let firing = false, fireX = canvas.width/2;
let gameOver = false;

function resetGame() {
  mobs = [];
  gates = [];
  mobCount = 10 + (level-1)*3;
  baseHP = 15 + (level-1)*4;
  baseMaxHP = baseHP;
  firing = false;
  fireX = canvas.width/2;
  gameOver = false;
  restartBtn.style.display = "none";
  createGates();
  updateUI();
  draw();
}
function updateUI() {
  mobCountEl.textContent = mobCount;
  scoreEl.textContent = score;
  levelEl.textContent = level;
}
function createGates() {
  gates = [];
  for(let i=0; i<4; i++) {
    let t = Math.random();
    let gate;
    if(t<0.3)      gate = {type:"mul", v:2, label:"x2", color:"#3ac"};
    else if(t<0.5) gate = {type:"add", v:10+level*2, label:"+"+(10+level*2), color:"#2c7"};
    else if(t<0.7) gate = {type:"sub", v:Math.max(3,level*2), label:"-"+Math.max(3,level*2), color:"#f66"};
    else           gate = {type:"div", v:2, label:"÷2", color:"#fd6"};
    let x = 70 + i*86;
    let y = 200 + Math.random()*60;
    gates.push({...gate, x, y, w:60, h:28, used:false});
  }
}
function fireMob() {
  if (mobCount > 0 && !gameOver) {
    mobs.push({x: fireX, y: 520, size:14, color: "#35aaff", active:true});
    mobCount--;
    updateUI();
  }
}
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // الأرضية
  ctx.fillStyle = "#d0ecff";
  ctx.fillRect(0, 560, 400, 40);
  // القاعدة
  ctx.save();
  ctx.translate(200, 70);
  ctx.fillStyle = "#e74c3c";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0,0,32,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px Cairo";
  ctx.textAlign = "center";
  ctx.fillText("العدو",0,5);
  // شريط الصحة
  ctx.fillStyle = "#222";
  ctx.fillRect(-30,35,60,10);
  ctx.fillStyle = "#0f3";
  ctx.fillRect(-30,35,60*(baseHP/baseMaxHP),10);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(-30,35,60,10);
  ctx.restore();
  // رسم البوابات
  gates.forEach(g=>{
    ctx.save();
    ctx.globalAlpha = g.used ? 0.28 : 1;
    ctx.fillStyle = g.color;
    ctx.fillRect(g.x-30, g.y-14, g.w, g.h);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(g.x-30,g.y-14,g.w,g.h);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Cairo";
    ctx.textAlign = "center";
    ctx.fillText(g.label, g.x, g.y+7);
    ctx.restore();
  });
  // رسم الجنود
  mobs.forEach(m=>{
    if(!m.active) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(m.x,m.y,m.size,0,Math.PI*2);
    ctx.fillStyle = m.color;
    ctx.shadowColor = "#19a3ff";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  });
  // المدفع
  ctx.save();
  ctx.translate(fireX,540);
  ctx.fillStyle = "#2091fa";
  ctx.fillRect(-14,16,28,16);
  ctx.beginPath();
  ctx.arc(0,13,22,Math.PI*0.8,Math.PI*2.2);
  ctx.fill();
  ctx.restore();
  // رسالة خسارة أو فوز
  if(gameOver){
    ctx.save();
    ctx.globalAlpha=0.92;
    ctx.fillStyle="#fff";
    ctx.fillRect(60,230,280,90);
    ctx.fillStyle="#e74c3c";
    ctx.font="bold 32px Cairo";
    ctx.textAlign="center";
    ctx.fillText(baseHP<=0?"فزت!":"انتهت المحاولة!",200,270);
    ctx.fillStyle="#222";
    ctx.font="bold 20px Cairo";
    ctx.fillText(baseHP<=0?"انتقلت للمرحلة التالية!":"حاول مجددًا!",200,300);
    ctx.restore();
  }
}
function updateMobs() {
  mobs.forEach(m=>{
    if(m.active) m.y -= 5;
    // التصادم مع القاعدة
    if(m.active && Math.hypot(m.x-200,m.y-70)<38) {
      baseHP--;
      score+=2;
      m.active=false;
      updateUI();
      if(baseHP<=0) winLevel();
    }
    // التصادم مع البوابات
    gates.forEach(g=>{
      if(!g.used && m.active
        && m.x>g.x-30 && m.x<g.x+32
        && m.y>g.y-14 && m.y<g.y+16){
        g.used=true;
        switch(g.type){
          case "mul": mobCount *= g.v; break;
          case "add": mobCount += g.v; break;
          case "sub": mobCount = Math.max(1,mobCount-g.v); break;
          case "div": mobCount = Math.max(1,Math.floor(mobCount/g.v)); break;
        }
        score+=1;
        updateUI();
      }
    });
    // خارج الشاشة
    if(m.y<0) m.active=false;
  });
  mobs = mobs.filter(m=>m.active);
}
function lose() {
  gameOver=true;
  restartBtn.textContent="إعادة اللعب";
  restartBtn.style.display="inline-block";
  draw();
}
function winLevel() {
  gameOver=true;
  score+=level*10;
  level++;
  restartBtn.textContent="التالي";
  restartBtn.style.display="inline-block";
  draw();
}
function gameLoop() {
  if(!gameOver){
    updateMobs();
    if(mobCount<=0 && mobs.length==0 && baseHP>0) lose();
  }
  draw();
  requestAnimationFrame(gameLoop);
}
// تحريك المدفع
canvas.addEventListener("pointerdown",e=>{
  firing=true;
  moveTo(e);
});
canvas.addEventListener("pointermove",e=>{
  if(firing) moveTo(e);
});
canvas.addEventListener("pointerup",()=>{firing=false;});
canvas.addEventListener("pointerleave",()=>{firing=false;});
function moveTo(e){
  let rect=canvas.getBoundingClientRect();
  let x=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
  x=Math.max(32,Math.min(368,x));
  fireX=x;
  if(!gameOver) fireMob();
}
restartBtn.onclick=()=>{
  if(baseHP<=0){ // فزت: انتقل للمرحلة التالية
    resetGame();
  }else{ // خسرت: أعد المرحلة
    level=Math.max(1,level);
    resetGame();
  }
};
// بدء اللعبة
resetGame();
gameLoop();
