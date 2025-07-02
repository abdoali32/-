// Mob Control عربية متطورة

// --- واجهة ---
const mainMenu = document.getElementById('main-menu');
const gameArea = document.getElementById('game-area');
const shopPopup = document.getElementById('shop');
const settingsPopup = document.getElementById('settings');
const coinsBar = document.getElementById('coins');
const coinsHud = document.getElementById('coins-hud');

// --- لعبة ---
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const playerHealthEl = document.getElementById("player-health");
const restartBtn = document.getElementById("restart");

let level = 1, score = 0, baseHP = 15, baseMaxHP = 15;
let coins = Number(localStorage.getItem("coins") || 0); // حفظ العملات
let playerMaxHealth = 5, playerHealth = 5, mobSpeed = 5;
let mobs = [], gates = [], enemyBullets = [];
let firing = false, fireX = canvas.width/2;
let gameOver = false, lastFireTime = 0;
let enemyFireTimer = 0, enemyFireInterval = 1800; // ms
let hitEffect = 0;

// --- واجهة ---
function showMenu() {
  mainMenu.classList.add('active');
  gameArea.classList.remove('active');
  updateCoinsUI();
}
function startGame() {
  mainMenu.classList.remove('active');
  gameArea.classList.add('active');
  resetGame();
}
function backToMenu() {
  showMenu();
}
function openShop() { shopPopup.classList.add('active'); }
function closeShop() { shopPopup.classList.remove('active'); }
function openSettings() { settingsPopup.classList.add('active'); }
function closeSettings() { settingsPopup.classList.remove('active'); }
function updateCoinsUI() {
  coinsBar.textContent = coins;
  coinsHud.textContent = coins;
  localStorage.setItem("coins", coins);
}

// --- متجر ---
function buyUpgrade(type) {
  if (type === "health") {
    if (coins >= 2) {
      coins -= 2;
      playerMaxHealth++;
      playerHealth = playerMaxHealth;
      updateCoinsUI();
      alert("تمت زيادة الصحة!");
    } else {
      alert("لا يوجد عملات كافية!");
    }
  }
  if (type === "speed") {
    if (coins >= 4) {
      coins -= 4;
      mobSpeed += 1.5;
      updateCoinsUI();
      alert("تمت زيادة سرعة الجنود!");
    } else {
      alert("لا يوجد عملات كافية!");
    }
  }
}

// --- لعبة ---
function resetGame() {
  mobs = [];
  gates = [];
  enemyBullets = [];
  baseHP = 15 + (level-1)*6;
  baseMaxHP = baseHP;
  playerHealth = playerMaxHealth;
  firing = false;
  fireX = canvas.width/2;
  gameOver = false;
  restartBtn.style.display = "none";
  createGates();
  updateUI();
  draw();
}
function updateUI() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  playerHealthEl.textContent = playerHealth;
  updateCoinsUI();
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
    gates.push({...gate, x, y, w:60, h:28, used:false, anim:0});
  }
}
function fireMob() {
  if(!gameOver) {
    mobs.push({x: fireX, y: 520, size:14, color: "#35aaff", active:true, shimmer:1});
  }
}
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // الأرضية
  ctx.fillStyle = "#d0ecff";
  ctx.fillRect(0, 560, 400, 40);
  // قاعدة العدو (حمراء)
  ctx.save();
  ctx.translate(200, 70);
  ctx.fillStyle = "#e74c3c";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0,0,32,0,Math.PI*2);
  ctx.shadowColor = baseHP<baseMaxHP? "#fa3366" : "#0000";
  ctx.shadowBlur = baseHP<baseMaxHP? 15 : 0;
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur=0;
  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px Cairo";
  ctx.textAlign = "center";
  ctx.fillText("العدو",0,5);
  // شريط صحة العدو
  ctx.fillStyle = "#222";
  ctx.fillRect(-30,35,60,10);
  ctx.fillStyle = "#0f3";
  ctx.fillRect(-30,35,60*(baseHP/baseMaxHP),10);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(-30,35,60,10);
  ctx.restore();
  // قذائف العدو
  enemyBullets.forEach(b=>{
    ctx.save();
    ctx.beginPath();
    ctx.arc(b.x,b.y,12,0,Math.PI*2);
    ctx.fillStyle="#f7c531";
    ctx.shadowColor="#f7c531";
    ctx.shadowBlur=10;
    ctx.globalAlpha=0.6+0.4*Math.sin(Date.now()/140+b.y/37);
    ctx.fill();
    ctx.restore();
  });
  // البوابات (مع اهتزاز عند التصادم)
  gates.forEach(g=>{
    ctx.save();
    ctx.globalAlpha = g.used ? 0.18 : 1;
    ctx.translate(g.x+Math.sin(g.anim)*3,g.y);
    ctx.fillStyle = g.color;
    ctx.fillRect(-30, -14, g.w, g.h);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(-30,-14,g.w,g.h);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Cairo";
    ctx.textAlign = "center";
    ctx.fillText(g.label, 0,7);
    ctx.restore();
    // مؤثر اهتزاز
    if(g.anim>0) g.anim-=0.25;
  });
  // الجنود (بريق لحظة الإطلاق)
  mobs.forEach(m=>{
    if(!m.active) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(m.x,m.y,m.size+m.shimmer,0,Math.PI*2);
    ctx.fillStyle = m.color;
    ctx.shadowColor = "#19a3ff";
    ctx.shadowBlur = 8+m.shimmer*3;
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.restore();
    if(m.shimmer>0) m.shimmer-=0.15;
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
  // صحة اللاعب (أسفل)
  ctx.save();
  ctx.fillStyle="#444";
  ctx.fillRect(110,565,180,15);
  ctx.fillStyle="#0ff";
  ctx.fillRect(110,565,180*(playerHealth/playerMaxHealth),15);
  ctx.strokeStyle="#fff";
  ctx.strokeRect(110,565,180,15);
  ctx.font="bold 14px Cairo";
  ctx.fillStyle="#fff";
  ctx.textAlign="center";
  ctx.fillText("صحتك",200,577);
  ctx.restore();
  // مؤثر اهتزاز عند الضرب
  if(hitEffect>0){
    canvas.classList.add("hit-effect");
    hitEffect--;
  } else {
    canvas.classList.remove("hit-effect");
  }
  // رسالة خسارة أو فوز
  if(gameOver){
    ctx.save();
    ctx.globalAlpha=0.93;
    ctx.fillStyle="#fff";
    ctx.fillRect(60,230,280,110);
    ctx.fillStyle=baseHP<=0?"#2196f3":"#e74c3c";
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
    if(m.active) m.y -= mobSpeed;
    // التصادم مع القاعدة (العدو)
    if(m.active && Math.hypot(m.x-200,m.y-70)<38) {
      baseHP--;
      score+=2;
      coins+=2;
      updateCoinsUI();
      m.active=false;
      updateUI();
      hitEffect=7;
      if(baseHP<=0) winLevel();
    }
    // التصادم مع البوابات
    gates.forEach(g=>{
      if(!g.used && m.active
        && m.x>g.x-30 && m.x<g.x+32
        && m.y>g.y-14 && m.y<g.y+16){
        g.used=true;
        g.anim=3.5;
        switch(g.type){
          case "mul": break; // عدد الجنود مفتوح
          case "add": break;
          case "sub": break;
          case "div": break;
        }
        score+=1;
        updateUI();
      }
    });
    // التصادم مع قذائف العدو
    enemyBullets.forEach(b=>{
      if(m.active && Math.hypot(m.x-b.x,m.y-b.y)<16){
        m.active=false;
        hitEffect=5;
      }
    });
    // خارج الشاشة
    if(m.y<0) m.active=false;
  });
  mobs = mobs.filter(m=>m.active);
}
function updateEnemyBullets() {
  enemyBullets.forEach(b=>{
    b.y += 5 + Math.min(level,8);
    // تصطدم بمدفع اللاعب
    if(Math.abs(b.y-540)<18 && Math.abs(b.x-fireX)<32 && !gameOver){
      playerHealth--;
      hitEffect=13;
      b.hit=true;
      updateUI();
      if(playerHealth<=0) lose();
    }
  });
  enemyBullets = enemyBullets.filter(b=>!b.hit && b.y<canvas.height+20);
}
function enemyShoot() {
  // العدو يرمي قذيفة عشوائية ويزيد العدد مع المراحل
  let bullets = 1+Math.floor(level/4);
  for(let i=0;i<bullets;i++){
    let spread = 120 + Math.random()*160;
    let bulletX = 200 + (Math.random()-0.5)*spread;
    enemyBullets.push({x: bulletX, y: 70, hit:false});
  }
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
  coins+=level*4;
  level++;
  restartBtn.textContent="التالي";
  restartBtn.style.display="inline-block";
  updateCoinsUI();
  draw();
}
function gameLoop(ts) {
  if(!gameOver){
    updateMobs();
    updateEnemyBullets();
    // العدو يهاجم أسرع في المراحل الأعلى
    if(!enemyFireTimer) enemyFireTimer=ts;
    let fireRate = enemyFireInterval-Math.min(level*90,1000);
    if(ts-enemyFireTimer > fireRate) {
      enemyShoot();
      enemyFireTimer=ts;
    }
  }
  draw();
  requestAnimationFrame(gameLoop);
}

// تحريك المدفع مع الضغط أو السحب
function getPointerX(e) {
  let rect = canvas.getBoundingClientRect();
  if(e.touches && e.touches.length > 0) {
    return Math.max(32, Math.min(368, e.touches[0].clientX - rect.left));
  }
  return Math.max(32, Math.min(368, e.clientX - rect.left));
}
canvas.addEventListener("pointerdown", e => {
  firing = true;
  fireX = getPointerX(e);
  fireMob();
  lastFireTime = performance.now();
});
canvas.addEventListener("pointermove", e => {
  if(firing) {
    fireX = getPointerX(e);
    let now = performance.now();
    if(now - lastFireTime > 90) {
      fireMob();
      lastFireTime = now;
    }
  }
});
canvas.addEventListener("pointerup",()=>{firing=false;});
canvas.addEventListener("pointerleave",()=>{firing=false;});
canvas.addEventListener("touchstart", e => {
  firing = true;
  fireX = getPointerX(e);
  fireMob();
  lastFireTime = performance.now();
});
canvas.addEventListener("touchmove", e => {
  if(firing) {
    fireX = getPointerX(e);
    let now = performance.now();
    if(now - lastFireTime > 90) {
      fireMob();
      lastFireTime = now;
    }
  }
});
canvas.addEventListener("touchend",()=>{firing=false;});
canvas.addEventListener("touchcancel",()=>{firing=false;});

restartBtn.onclick=()=>{
  if(baseHP<=0){ // فزت: انتقل للمرحلة التالية
    resetGame();
  }else{ // خسرت: أعد المرحلة
    level=Math.max(1,level);
    resetGame();
  }
};

showMenu();
requestAnimationFrame(gameLoop);
