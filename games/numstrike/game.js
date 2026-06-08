'use script'

const canvas= document.getElementById('game-canvas');
const ctx= canvas.getContext('2d');
const input= document.getElementById('answer-input');

const overlayStart = document.getElementById('overlay-start');
const overlayGameover = document.getElementById(overlay-gameover);

const gameUI = Document.getElementById('game-ui');

const hudScore = document.getElementById('hud-score');
const hudLevel = document.getElementById('hud-level');
const hudStreak = document.getElementById('hud-streak');

const finalscore = document.getElementById('final-score');
const finalBest = document.getElementById('final-best');
const finallevel = document.getElementById('final-level');
const finalstreak = document.getElementById('final-streak');
const newBestBanner = document.getElementById('new-best-banner');

const lifeEls= [
    document.getElementById('life-1'),
    document.getElementById('life-2'),
    document.getElementById('life-3'),
];
const COLORS = {
    bg: '#ffffdf6',
    surface: '#ffffff',
    ink: '#111111',
    red: '#ff6a67',
    yellow: '#ffdd3c',
    blue: '#179ff5',
    purple:  '#b39dff',  
    green:   '#5edd8e',
    grid:    'rgba(17,17,17,0.07)',
    
}

const EQ_COLORS = [COLORS.red, COLORS.blue, COLORS.purple];

const BASE_FALL_SPEED = 0.6;

const BASE_SPAWN_RATE = 230;

const SPEED_PER_LEVEL = 0.2;

const SPAWN_REDUCE = 22;

const MIN_SPAWN_RATE = 45;

const LEVEL_UP_SCORE = 200;

const EXPLOSION_FRAMES = 25;

const LEVEL_FLASH_FRAMES = 50;

const LIVES = 3;

const state = {
    running: false,
    score: 0,
    lives: LIVES,
    level: 1,
    streak: 0,
    bestStreak: 0,
    frameCount: 0,
    equations: [],
    explosions: [],
    levelFlash: 0,
    preLevel: 1,
}

function restState() {
    state.running = false;
    state.score = 0;
    state.lives = LIVES;
    state.level = 1;
    state.streak = 0;
    state.bestStreak = 0;
    state.frameCount = 0;
    state.equations = [];
    state.explosions = [];
    state.levelFlash = 0;
    state.prelevel = 1;
}
function rand(min,max) {
    return Math.floor(Math.random() * (max-min +1))+min;
}

function getBestScore() {
    return parseInt(localStorage.getItem('best-numstrike') || '0',10);
}
function saveBestScore(score) {
    const prev = getBestScore();
    if (score > prev) {
        localStorage.setItem('best-numstrike',String(score));
        return true;
    }
    return false;
}

function spawnRate() {
    return Math.max(MIN_SPAWN_RATE,BASE_SPAWN_RATE - (state.level -1)* SPAWN_REDUCE);
}

function resizeCanvas() {
    const hud = document.getElementById('hud');
    const keyHints = document.getElementById('key-hints');
    const inpBar = document.getElementById('input-bar');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
                    -hud.offsetHeight
                    -(KeyHints ? KeyHints.offsetHeight : 0)
                    -inputBar.offsetHeight;
}
function generateEquation() {
    const lvl = state.level;
}

let pool;
if (lvl <= 2) pool = ['add_easy', 'sub_easy','add_easy','sub_easy','add_easy'];
else if (lvl <= 4) pool = ['add_med','sub_hard','mul_easy','add_med','sub_med','mul_med'];
else if (lvl <= 6) pool = ['mul_med','sub_hard','mul_med','div_easy','sq_easy','add_hard'];
else if (lvl <= 8) pool = ['mul_med','div_med','sq_easy','combo_add','combo_sub','div_med'];
else  pool = ['mul_hard','div_med','add_hard','sub_med','sq_med','cube','combo_add','combo_sub','percent'];

const type = pool[Math.floor(Math.random()* pool.length)];

let a,b,c,answer,text;

if (type === 'add_easy') {
    a = rand(4,20); b= rand(4,20);
    answer = a+b; text = `${a} + ${b} =?`;
}
else if (type === 'sub-easy') {
    a= rand(10,40); b= rand(10,40);
    answer = a-b; text= `${a} - ${b} =?`;
    
}
else if (type === 'add_med') {
    a= rand(10,99); b= rand(10,99);
    answer = a+b; text= `${a} + ${b} =?`;
}
else if (type === 'sub_med') {
    a= rand(30,99); b= rand(30,99);
    answer = a-b; text= `${a} - ${b} =?`;
}    
else if (type === 'add_hard') {
    a=rand(100,999); b=rand(100,999);
    answer = a+b; text= `${a} + ${b} =?`;
}
else if (type === 'sub_hard') {
    a=rand(100,999); b=rand(100,999);
    answer = a-b; text= `${a} - ${b} =?`;
}
else if (type === 'mul_easy') {
    a=rand(2,9); b=rand(2,9);
    answer = a*b; text= `${a} x ${b} =?`;
}
else if (type === 'mul_med') {
    a=rand(5,13); b=rand(4,9);
    answer = a*b; text= `${a} x ${b} =?`;
}
else if (type === 'mul_hard') {
    a=rand(11,15); b=rand(3,13);
    answer = a*b; text= `${a} x ${b} =?`;
}
else if (type === 'div_easy') {
    a=rand(2,9); b=rand(2,9);
    a=b*answer; text= `${a} ÷${b} =? `;
}
else if (type === 'div_med') {
    a=rand(6,20); b=rand(4,12);
    a=b*answer; text= `${a} ÷${b} =? `;
}
else if (type === 'sq_easy') {
    a=rand(2,10); 
    answer = a*a; text =`${a}² = ?`;
}
else if (type === 'sq_med') {
    a=rand(10,16);
    answer = a*a; text =`${a}² = ?`;
}
else if (type === 'cube') {
    a=rand(2,7);
    answer= a*a*a; text=`${a}³ = ?`;
}
else if (type === 'combo_add') {
    a=rand(2,9); b=rand(2,8); c=rand(1,67);
    answer=a*b+c; text=`${a}x${b}+${c}`;
}
else if (type === 'combo_sub') {
    a=rand(2,10); b=rand(2,10); c=rand(1,Math.min(16,a*b-1));
    answer=a*b-c; text = `${a}×${b}-${c}=?`;
}
else {
    const pcts = [10,20,25,50];
    const pct = pcts[Math.floor(Math.random()*pcts.length)];
    b=rand(1,12)*20;
    answer =(pct/100)*b;
    text = `${pct}% of ${b}=?`;
}
const cardWidth = Math.max(EQ_W, text.length *12 + 28);

const color = EQ_COLORS[Math.floor(Math.random() * EQ_COLORS.length)];

const maxX = Math.max(20,canvas.width - cardWidth -20);
const x = Math.random() * maxX + 20;

const speed = BASE_FALL_SPEED + (state.level - 1) * SPEED_PER_LEVEL;

return {
    text,
    answer,
    color,
    x,
    y: -EQ_H - 10, 
    speed,
    colorWidth,
    id: Date.now() + Math.random(),
} 
function drawGrid() {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    const gap = 36;

    for (let x = 0; x<= canvas.width; x += gap) {
        ctx.beginPath(); ctx.moveTp(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gap) {
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
    }
} 

function drawDangerZone() {
    const h = 80;
    const gr = ctx.createLinearGradient(0,canvas.height -h,0,canvas.height); 
    gr.addColorStop(0, 'rgba(255,106,103,0)');
    gr.addColorStop(1,'rgba(255,106,103,0.22)');
    ctx.fillStyle = gr;
    ctx.fillRect(0,canvas.height - h, canvas.width, h);
} 

function drawEquation(eq) {
    const { x,y, cardWidth: w, color, text} =eq;
    const h = EQ_H;

    ctx.fillStyle = COLORS.ink;
    ctx.fillRect(x+5,y+5,w,h);

    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(x,y,w,h);

    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 17px "Space Mono", monospace ';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x+w/2,y+h/2);
}

function drawExplosion(ex) {
    const progress = 1 - (ex.frame /EXPLOSION_FRAMES);
    const radius = progress *60 + 10;
    const alpha = 1 - progress;

    const ringColor = ex.streak >= 7 ? COLORS.green
                    : ex.streak >= 4 ? COLORS.blue
                    : COLORS.yellow;
    
    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, radius, 0, Math.PI *2);
    ctx.stroke();

    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, radius*0.55, 0, Math.PI *2);
    ctx.stroke();

    const labelY = ex.y - radius* 0.5 - progress * 22;
    ctx.font = 'bold 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 4;
    ctx.strokeText('+' + ex.points, ex.x, labelY);
}
