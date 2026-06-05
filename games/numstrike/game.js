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