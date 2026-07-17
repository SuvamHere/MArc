'use strict';

var overlayStart    = document.getElementById('overlay-start');
var overlayGameover = document.getElementById('overlay-gameover');
var gameUI          = document.getElementById('game-ui');

var hudScore  = document.getElementById('hud-score');
var hudLevel  = document.getElementById('hud-level');
var hudStreak = document.getElementById('hud-streak');

var finalScore  = document.getElementById('final-score');
var finalBest   = document.getElementById('final-best');
var finalLevel  = document.getElementById('final-level');
var finalStreak = document.getElementById('final-streak');
var newBestBanner = document.getElementById('new-best-banner');

var lifeEls = [
  document.getElementById('life-1'),
  document.getElementById('life-2'),
  document.getElementById('life-3'),
];

var circuitSvg  = document.getElementById('circuit-svg');
var wireOptions = document.getElementById('wire-options');
var timerBar    = document.getElementById('timer-bar');
var timerSecs   = document.getElementById('timer-seconds');
var statusLevel = document.getElementById('status-level');
var scorePopup  = document.getElementById('score-popup');


var COLORS = {
  bg:'#fffdf6',
  surface:'#ffffff',
  ink:'#111111',
  red:'#ff6a67',
  yellow:'#ffdd3c',
  blue:'#179FF5',
  green:'#5edd8e',
  shadow:'#111111',
};
var WIRE_COLORS = {
  power:'#cc0000',   
  ground:'#111111',   
  signal:'#007700',   
  neutral:'#888888',   
};

var BASE_TIME= 10;    
var TIME_REDUCE= 0.2;   
var MIN_TIME= 4;     
var LEVEL_UP_SCORE = 100;   
var LIVES= 3;

var STREAK_TIERS = [
  { min: 10,mult: 2.5 },
  { min: 7,mult: 2.0 },
  { min: 4,mult: 1.5 },
  { min: 0,mult: 1.0 },
];

var state = {
  running:false,
  score: 0,
  lives: LIVES,
  level: 1,
  streak:0,
  bestStreak:0,
  answered:false,    
  timerInterval: null, 
  timeLeft:BASE_TIME,
  currentCircuit: null,
  dragWire:null,     
};

function resetState() {
  state.running  = false;
  state.score= 0;
  state.lives = LIVES; 
  state.level = 1;
  state.streak = 0;
  state.bestStreak= 0;
  state.answered = false;
  state.timerInterval = null;
  state.timeLeft = BASE_TIME;
  state.currentCircuit = null;
  state.dragWire = null; 
} 

var audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, type, duration, volume) {
  try {
    var ctx = getAudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume || 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
  }
}

function soundCorrect() {
  playTone(880,'sawtooth',0.08,0.25);
  setTimeout(function() {playTone(1200,'sine',0.15,0.2);},80);
  setTimeout(function() {playTone(660,'sine',0.2,0.15);},180);
}

function soundWrong() {
  playTone(120,'square',0.18,0.3);
  setTimeout(function() {playTone(100,'square',0.15,0.2);},100);
}


function soundLifeLost() {
  playTone(400, 'sine',0.15,0.3);
  setTimeout(function() {playTone(300,'sine',0.15,0.25);},120);
  setTimeout(function() {playTone(200,'sine',0.25,0.2);},240);
}

function soundGameOver() {
  playTone(300,'sawtooth',0.3,0.3);
  setTimeout(function() {playTone(250,'sawtooth',0.3,0.25);},200);
  setTimeout(function() {playTone(180,'sawtooth',0.5,0.2);},400);
}

function soundTick(urgent) {
  var freq =urgent?600:400;
  playTone(freq,'sine',0.04,0.15);
}

function on(id, event, fn) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener(event, fn);
  } else {
    console.warn('WIREFIXER: element not found —', id);
  }
}

function getBestScore() {
  return parseInt(localStorage.getItem('best-wirefixer') || '0', 10);
}

function saveBestScore(score) {
  var prev = getBestScore();
  if (score > prev) {
    localStorage.setItem('best-wirefixer', String(score));
    return true;
  }
  return false;
}

function getTimeForLevel() {
  var reductions = Math.floor((state.level - 1) / 2);
  var time = BASE_TIME - reductions * TIME_REDUCE;
  if (time < MIN_TIME) time = MIN_TIME;
  return time;
}

function getMultiplier() {
  for (var i = 0; i < STREAK_TIERS.length; i++) {
    if (state.streak >= STREAK_TIERS[i].min) {
      return STREAK_TIERS[i].mult;
    }
  }
  return 1.0;
}

function makeSVG(tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  return el;
}