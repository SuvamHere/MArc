'use strict'


var overlayStart    = document.getElementById('overlay-start');
var overlayGameover = document.getElementById('overlay-gameover');
var gameUI          = document.getElementById('game-ui');
 
var hudScore  = document.getElementById('hud-score');
var hudLevel  = document.getElementById('hud-level');
var hudStreak = document.getElementById('hud-streak');
 
var finalScore    = document.getElementById('final-score');
var finalBest     = document.getElementById('final-best');
var finalLevel    = document.getElementById('final-level');
var finalStreak   = document.getElementById('final-streak');
var newBestBanner = document.getElementById('new-best-banner');

var lifeEls = [
  document.getElementById('Life-1'),
  document.getElementById('Life-2'),
  document.getElementById("Life-3")
];

var circuitSvg = document.getElementById('circuit-svg');
var wireOptions = document.getElementById('wire-options');
var timerBar = document.getElementById('timer-bar');
var timerSecs = document.getElementById('timer-seconds');
var statusLevel = document.getElementById('status-level');
var scorePopup = document.getElementById('score-popup');

var wireTrayWrap = document.getElementById('wire-tray-wrap');    
var mcWrap = document.getElementById('mc-wrap');           
var mcOptions = document.getElementById('mc-options');
var numericWrap = document.getElementById('numeric-wrap');      
var numericInput = document.getElementById('numeric-input');
var numericSubmit = document.getElementById('numeric-submit');
var numericUnit  = document.getElementById('numeric-unit');      
var questionPrompt = document.getElementById('question-prompt');   


var COLORS = {
  bg: '#fffdf6',
  surface: '#ffffff',
  ink: '#111111',
  red: '# ff6a67',
  yellow: '#ffdd3c',
  blue: '#179ff5',
  purple: '#b39dff',
  green: '#5edd8e',
  shadow: '#111111',
};

var WIRE_COLORS = {
  power: '#cc0000',
  ground: '#111111',
  signal: '#007700',
  neutral: '#888888',
};

var BASE_TIME= 10;
var TIME_REDUCE= 0.2;
var MIN_TIME= 4;
var LIVES= 3;

var STREAK_TIERS = [
  { min:10,mult:2.5 },
  { min:7, mult:2.0 },
  { min:4, mult:1.5 },
  { min:0, mult:1.0 }
];

