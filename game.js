// إعداد
let playerArmy = 20;
let enemyArmy = 20;
let playerDefend = false;
let enemyDefend = false;
let gameOver = false;

const playerArmyEl = document.getElementById("player-army");
const enemyArmyEl = document.getElementById("enemy-army");
const attackBtn = document.getElementById("attack-btn");
const defendBtn = document.getElementById("defend-btn");
const restartBtn = document.getElementById("restart-btn");
const msgEl = document.getElementById("msg");
const canvas = document.getElementById("battle-canvas");
const ctx = canvas.getContext("2d");

// رسم الجيوش بشكل عصري
function drawArmies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // جيش اللاعب: دوائر زرقاء
  for(let i=0; i<playerArmy; i++) {
    let row = Math.floor(i/5), col = i%5;
    ctx.beginPath();
    ctx.arc(60+col*25, 220-row*24, 12, 0, 2*Math.PI);
    ctx.fillStyle = playerDefend ? "#38f" : "#66e2ff";
    ctx.strokeStyle = "#0f5";
    ctx.lineWidth = playerDefend ? 3 : 1;
    ctx.fill();
    ctx.stroke();
  }
  // جيش العدو: دوائر حمراء
  for(let i=0; i<enemyArmy; i++) {
    let row = Math.floor(i/5), col = i%5;
    ctx.beginPath();
    ctx.arc(340-col*25, 70+row*24, 12, 0, 2*Math.PI);
    ctx.fillStyle = enemyDefend ? "#f44" : "#ff4f7a";
    ctx.strokeStyle = "#f20";
    ctx.lineWidth = enemyDefend ? 3 : 1;
    ctx.fill();
    ctx.stroke();
  }
  // أرض المعركة
  ctx.beginPath();
  ctx.moveTo(0, 150); ctx.lineTo(400, 150);
  ctx.strokeStyle = "#fff3";
  ctx.setLineDash([6,6]);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
}

function updateStats() {
  playerArmyEl.textContent = playerArmy;
  enemyArmyEl.textContent = enemyArmy;
  drawArmies();
}

function gameMessage(txt, color="#fff") {
  msgEl.textContent = txt;
  msgEl.style.color = color;
}

function endGame(winner) {
  gameOver = true;
  attackBtn.style.display = "none";
  defendBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  if(winner === "player") gameMessage("فزت! 🏆", "#0f0");
  else if(winner === "enemy") gameMessage("خسرت! 👹", "#ff4f7a");
  else gameMessage("تعادل!", "#ffe066");
}

// ذكاء اصطناعي بسيط: عشوائي يهاجم أو يدافع
function enemyTurn() {
  if(gameOver) return;
  setTimeout(()=>{
    if(enemyArmy <= 0) return endGame("player");
    if(playerArmy <= 0) return endGame("enemy");
    let action = Math.random()<0.5 ? "attack" : "defend";
    if(action==="attack") {
      enemyDefend = false;
      let hit = Math.floor(Math.random()*3)+2;
      if(playerDefend) hit = Math.floor(hit/2);
      playerArmy -= hit;
      if(playerArmy<0) playerArmy=0;
      gameMessage("👹 العدو هجم عليك وخسرت " + hit + " جندي!", "#ffb347");
      playerDefend = false;
    } else {
      enemyDefend = true;
      gameMessage("العدو في وضع الدفاع!", "#aaa");
    }
    updateStats();
    if(playerArmy<=0) endGame("enemy");
    else if(enemyArmy<=0) endGame("player");
  }, 1200);
}

// هجوم اللاعب
attackBtn.onclick = ()=>{
  if(gameOver) return;
  let hit = Math.floor(Math.random()*4)+2;
  if(enemyDefend) hit = Math.floor(hit/2);
  enemyArmy -= hit;
  if(enemyArmy<0) enemyArmy=0;
  gameMessage("🚀 هاجمت العدو وخسر " + hit + " جندي!", "#0ff");
  enemyDefend = false;
  updateStats();
  if(enemyArmy<=0) endGame("player");
  else if(playerArmy<=0) endGame("enemy");
  else enemyTurn();
};

// دفاع اللاعب
defendBtn.onclick = ()=>{
  if(gameOver) return;
  playerDefend = true;
  gameMessage("🛡️ أنت في وضع الدفاع!", "#6ef58e");
  updateStats();// إعداد
let playerArmy = 20;
let enemyArmy = 20;
let playerDefend = false;
let enemyDefend = false;
let gameOver = false;

const playerArmyEl = document.getElementById("player-army");
const enemyArmyEl = document.getElementById("enemy-army");
const attackBtn = document.getElementById("attack-btn");
const defendBtn = document.getElementById("defend-btn");
const restartBtn = document.getElementById("restart-btn");
const msgEl = document.getElementById("msg");
const canvas = document.getElementById("battle-canvas");
const ctx = canvas.getContext("2d");

// رسم الجيوش بشكل عصري
function drawArmies() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // جيش اللاعب: دوائر زرقاء
  for(let i=0; i<playerArmy; i++) {
    let row = Math.floor(i/5), col = i%5;
    ctx.beginPath();
    ctx.arc(60+col*25, 220-row*24, 12, 0, 2*Math.PI);
    ctx.fillStyle = playerDefend ? "#38f" : "#66e2ff";
    ctx.strokeStyle = "#0f5";
    ctx.lineWidth = playerDefend ? 3 : 1;
    ctx.fill();
    ctx.stroke();
  }
  // جيش العدو: دوائر حمراء
  for(let i=0; i<enemyArmy; i++) {
    let row = Math.floor(i/5), col = i%5;
    ctx.beginPath();
    ctx.arc(340-col*25, 70+row*24, 12, 0, 2*Math.PI);
    ctx.fillStyle = enemyDefend ? "#f44" : "#ff4f7a";
    ctx.strokeStyle = "#f20";
    ctx.lineWidth = enemyDefend ? 3 : 1;
    ctx.fill();
    ctx.stroke();
  }
  // أرض المعركة
  ctx.beginPath();
  ctx.moveTo(0, 150); ctx.lineTo(400, 150);
  ctx.strokeStyle = "#fff3";
  ctx.setLineDash([6,6]);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
}

function updateStats() {
  playerArmyEl.textContent = playerArmy;
  enemyArmyEl.textContent = enemyArmy;
  drawArmies();
}

function gameMessage(txt, color="#fff") {
  msgEl.textContent = txt;
  msgEl.style.color = color;
}

function endGame(winner) {
  gameOver = true;
  attackBtn.style.display = "none";
  defendBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
  if(winner === "player") gameMessage("فزت! 🏆", "#0f0");
  else if(winner === "enemy") gameMessage("خسرت! 👹", "#ff4f7a");
  else gameMessage("تعادل!", "#ffe066");
}

// ذكاء اصطناعي بسيط: عشوائي يهاجم أو يدافع
function enemyTurn() {
  if(gameOver) return;
  setTimeout(()=>{
    if(enemyArmy <= 0) return endGame("player");
    if(playerArmy <= 0) return endGame("enemy");
    let action = Math.random()<0.5 ? "attack" : "defend";
    if(action==="attack") {
      enemyDefend = false;
      let hit = Math.floor(Math.random()*3)+2;
      if(playerDefend) hit = Math.floor(hit/2);
      playerArmy -= hit;
      if(playerArmy<0) playerArmy=0;
      gameMessage("👹 العدو هجم عليك وخسرت " + hit + " جندي!", "#ffb347");
      playerDefend = false;
    } else {
      enemyDefend = true;
      gameMessage("العدو في وضع الدفاع!", "#aaa");
    }
    updateStats();
    if(playerArmy<=0) endGame("enemy");
    else if(enemyArmy<=0) endGame("player");
  }, 1200);
}

// هجوم اللاعب
attackBtn.onclick = ()=>{
  if(gameOver) return;
  let hit = Math.floor(Math.random()*4)+2;
  if(enemyDefend) hit = Math.floor(hit/2);
  enemyArmy -= hit;
  if(enemyArmy<0) enemyArmy=0;
  gameMessage("🚀 هاجمت العدو وخسر " + hit + " جندي!", "#0ff");
  enemyDefend = false;
  updateStats();
  if(enemyArmy<=0) endGame("player");
  else if(playerArmy<=0) endGame("enemy");
  else enemyTurn();
};

// دفاع اللاعب
defendBtn.onclick = ()=>{
  if(gameOver) return;
  playerDefend = true;
  gameMessage("🛡️ أنت في وضع الدفاع!", "#6ef58e");
  updateStats();
  enemyTurn();
};

restartBtn.onclick = ()=>{
  playerArmy = 20;
  enemyArmy = 20;
  playerDefend = false;
  enemyDefend = false;
  gameOver = false;
  attackBtn.style.display = "inline-block";
  defendBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  gameMessage("المعركة بدأت! هاجم أو دافع!");
  updateStats();
};

window.onload = ()=>{
  gameMessage("المعركة بدأت! هاجم أو دافع!");
  updateStats();
};
  enemyTurn();
};

restartBtn.onclick = ()=>{
  playerArmy = 20;
  enemyArmy = 20;
  playerDefend = false;
  enemyDefend = false;
  gameOver = false;
  attackBtn.style.display = "inline-block";
  defendBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  gameMessage("المعركة بدأت! هاجم أو دافع!");
  updateStats();
};

window.onload = ()=>{
  gameMessage("المعركة بدأت! هاجم أو دافع!");
  updateStats();
};
