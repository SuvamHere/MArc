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
  bg:      '#fffdf6',
  surface: '#ffffff',
  ink:     '#111111',
  red:     '#ff6a67',
  yellow:  '#ffdd3c',
  blue:    '#179FF5',
  green:   '#5edd8e',
  shadow:  '#111111',
};
var WIRE_COLORS = {
  power:   '#cc0000',   
  ground:  '#111111',   
  signal:  '#007700',   
  neutral: '#888888',   
};
