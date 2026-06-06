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