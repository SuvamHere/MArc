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