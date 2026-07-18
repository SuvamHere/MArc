'use strict';

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
  document.getElementById('life-1'),
  document.getElementById('life-2'),
  document.getElementById('life-3')
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
  shadow:  '#111111'
};

var WIRE_COLORS = {
  power:   '#cc0000',
  ground:  '#111111',
  signal:  '#007700',
  neutral: '#888888'
};

var BASE_TIME       = 10;
var TIME_REDUCE     = 0.2;
var MIN_TIME        = 4;
var LEVEL_UP_SCORE  = 100;
var LIVES           = 3;

var STREAK_TIERS = [
  { min: 10, mult: 2.5 },
  { min: 7,  mult: 2.0 },
  { min: 4,  mult: 1.5 },
  { min: 0,  mult: 1.0 }
];

var state = {
  running:        false,
  score:          0,
  lives:          LIVES,
  level:          1,
  streak:         0,
  bestStreak:     0,
  answered:       false,
  timerInterval:  null,
  timeLeft:       BASE_TIME,
  currentCircuit: null,
  dragWire:       null
};

function resetState() {
  state.running        = false;
  state.score          = 0;
  state.lives          = LIVES;
  state.level          = 1;
  state.streak         = 0;
  state.bestStreak     = 0;
  state.answered       = false;
  state.timerInterval  = null;
  state.timeLeft       = BASE_TIME;
  state.currentCircuit = null;
  state.dragWire       = null;
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
  } catch (e) {}
}

function soundCorrect() {
  playTone(880, 'sawtooth', 0.08, 0.25);
  setTimeout(function() { playTone(1200, 'sine', 0.15, 0.2); }, 80);
  setTimeout(function() { playTone(660, 'sine', 0.2, 0.15); }, 180);
}

function soundWrong() {
  playTone(120, 'square', 0.18, 0.3);
  setTimeout(function() { playTone(100, 'square', 0.15, 0.2); }, 100);
}

function soundLifeLost() {
  playTone(400, 'sine', 0.15, 0.3);
  setTimeout(function() { playTone(300, 'sine', 0.15, 0.25); }, 120);
  setTimeout(function() { playTone(200, 'sine', 0.25, 0.2); }, 240);
}

function soundGameOver() {
  playTone(300, 'sawtooth', 0.3, 0.3);
  setTimeout(function() { playTone(250, 'sawtooth', 0.3, 0.25); }, 200);
  setTimeout(function() { playTone(180, 'sawtooth', 0.5, 0.2); }, 400);
}

function soundTick(urgent) {
  var freq = urgent ? 600 : 400;
  playTone(freq, 'sine', 0.04, 0.15);
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

var CIRCUITS = [
  {
    id: 'series-basic',
    label: 'SERIES CIRCUIT',
    output: 'bulb',
    brokenWire: 'power',
    wrongWires: ['signal', 'neutral'],
    battery: { x: 30, y: 80 },
    bulb: { x: 460, y: 80 },
    wires: [
      { x1: 74, y1: 68, x2: 420, y2: 68, type: 'power', broken: true },
      { x1: 30, y1: 112, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 460, y1: 68, x2: 460, y2: 62, type: 'power', broken: false },
      { x1: 460, y1: 100, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 30, y1: 68, x2: 30, y2: 112, type: 'ground', broken: false }
    ],
    dropZone: { x: 200, y: 58, w: 80, h: 24 },
    brokenSegments: [
      { x1: 74, y1: 68, x2: 195, y2: 68 },
      { x1: 285, y1: 68, x2: 420, y2: 68 }
    ]
  },
  {
    id: 'series-resistor',
    label: 'RESISTOR CIRCUIT',
    output: 'bulb',
    brokenWire: 'power',
    wrongWires: ['ground', 'neutral'],
    battery: { x: 30, y: 80 },
    bulb: { x: 460, y: 80 },
    resistor: { x: 180, y: 58, w: 60, h: 20, label: '100Ω' },
    wires: [
      { x1: 74, y1: 68, x2: 180, y2: 68, type: 'power', broken: false },
      { x1: 240, y1: 68, x2: 300, y2: 68, type: 'power', broken: true },
      { x1: 300, y1: 68, x2: 420, y2: 68, type: 'power', broken: false },
      { x1: 30, y1: 112, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 460, y1: 68, x2: 460, y2: 62, type: 'power', broken: false },
      { x1: 460, y1: 100, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 30, y1: 68, x2: 30, y2: 112, type: 'ground', broken: false }
    ],
    dropZone: { x: 300, y: 58, w: 70, h: 24 },
    brokenSegments: [
      { x1: 240, y1: 68, x2: 298, y2: 68 },
      { x1: 374, y1: 68, x2: 420, y2: 68 }
    ]
  },
  {
    id: 'parallel-basic',
    label: 'PARALLEL CIRCUIT',
    output: 'bulb',
    brokenWire: 'signal',
    wrongWires: ['power', 'neutral'],
    battery: { x: 30, y: 100 },
    bulb: { x: 460, y: 60 },
    wires: [
      { x1: 74, y1: 88, x2: 200, y2: 88, type: 'power', broken: false },
      { x1: 200, y1: 88, x2: 200, y2: 48, type: 'power', broken: false },
      { x1: 200, y1: 48, x2: 420, y2: 48, type: 'power', broken: false },
      { x1: 420, y1: 48, x2: 420, y2: 62, type: 'power', broken: false },
      { x1: 200, y1: 88, x2: 200, y2: 140, type: 'signal', broken: false },
      { x1: 200, y1: 140, x2: 420, y2: 140, type: 'signal', broken: true },
      { x1: 420, y1: 100, x2: 420, y2: 140, type: 'signal', broken: false },
      { x1: 30, y1: 112, x2: 200, y2: 112, type: 'ground', broken: false },
      { x1: 460, y1: 80, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 460, y1: 112, x2: 30, y2: 112, type: 'ground', broken: false }
    ],
    dropZone: { x: 270, y: 130, w: 80, h: 24 },
    brokenSegments: [
      { x1: 200, y1: 140, x2: 268, y2: 140 },
      { x1: 352, y1: 140, x2: 420, y2: 140 }
    ]
  },
  {
    id: 'switch-led',
    label: 'SWITCH CIRCUIT',
    output: 'led',
    brokenWire: 'power',
    wrongWires: ['signal', 'ground'],
    battery: { x: 30, y: 80 },
    led: { x: 440, y: 68 },
    switchComp: { x: 200, y: 58, w: 60, h: 20, label: 'SW1' },
    wires: [
      { x1: 74, y1: 68, x2: 200, y2: 68, type: 'power', broken: false },
      { x1: 260, y1: 68, x2: 320, y2: 68, type: 'power', broken: true },
      { x1: 320, y1: 68, x2: 430, y2: 68, type: 'power', broken: false },
      { x1: 30, y1: 112, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 460, y1: 80, x2: 460, y2: 112, type: 'ground', broken: false },
      { x1: 30, y1: 68, x2: 30, y2: 112, type: 'ground', broken: false }
    ],
    dropZone: { x: 318, y: 58, w: 70, h: 24 },
    brokenSegments: [
      { x1: 260, y1: 68, x2: 316, y2: 68 },
      { x1: 390, y1: 68, x2: 430, y2: 68 }
    ]
  }
];

function getCircuitForLevel() {
  var lvl = state.level;
  if (lvl <= 2) {
    return CIRCUITS[0];
  } else if (lvl <= 4) {
    return CIRCUITS[1];
  } else if (lvl <= 6) {
    return CIRCUITS[2];
  } else {
    return CIRCUITS[3];
  }
}

function drawCircuit(circuit) {
  while (circuitSvg.firstChild) {
    circuitSvg.removeChild(circuitSvg.firstChild);
  }

  for (var i = 0; i < circuit.wires.length; i++) {
    var w = circuit.wires[i];

    if (w.broken) {
      for (var s = 0; s < circuit.brokenSegments.length; s++) {
        var seg = circuit.brokenSegments[s];
        var brokenLine = makeSVG('line', {
          x1: seg.x1, y1: seg.y1, x2: seg.x2, y2: seg.y2,
          class: 'wire wire-broken'
        });
        circuitSvg.appendChild(brokenLine);
      }
    } else {
      var line = makeSVG('line', {
        x1: w.x1, y1: w.y1, x2: w.x2, y2: w.y2,
        class: 'wire wire-' + w.type
      });
      circuitSvg.appendChild(line);
    }
  }

  var dz = circuit.dropZone;
  var dropZoneEl = makeSVG('rect', {
    x: dz.x, y: dz.y, width: dz.w, height: dz.h,
    class: 'drop-zone',
    id: 'drop-zone'
  });
  circuitSvg.appendChild(dropZoneEl);

  var xMark = makeSVG('text', {
    x: dz.x + dz.w / 2,
    y: dz.y - 10,
    class: 'break-x'
  });
  xMark.textContent = '✕';
  circuitSvg.appendChild(xMark);

  drawSparks(dz.x + dz.w / 2, dz.y + dz.h / 2);
  drawBattery(circuit.battery.x, circuit.battery.y);

  if (circuit.resistor) {
    drawComponent(circuit.resistor.x, circuit.resistor.y,
                  circuit.resistor.w, circuit.resistor.h,
                  circuit.resistor.label);
  }

  if (circuit.switchComp) {
    drawComponent(circuit.switchComp.x, circuit.switchComp.y,
                  circuit.switchComp.w, circuit.switchComp.h,
                  circuit.switchComp.label);
  }

  if (circuit.output === 'bulb') {
    drawBulb(circuit.bulb.x, circuit.bulb.y, false);
  } else if (circuit.output === 'led') {
    drawLED(circuit.led.x, circuit.led.y, false);
  }

  var label = makeSVG('text', {
    x: 0, y: -8,
    'font-family': 'Space Mono, monospace',
    'font-size': '9',
    'font-weight': '700',
    'letter-spacing': '0.1',
    'text-transform': 'uppercase',
    fill: COLORS.ink,
    opacity: '0.4'
  });
  label.textContent = circuit.label + ' — LEVEL ' + state.level;
  circuitSvg.appendChild(label);
}

function drawBattery(x, y) {
  var rect = makeSVG('rect', {
    x: x, y: y - 22, width: 44, height: 44,
    class: 'component-body'
  });
  circuitSvg.appendChild(rect);

  var plus = makeSVG('text', { x: x + 22, y: y - 6, class: 'component-text' });
  plus.textContent = '+';
  circuitSvg.appendChild(plus);

  var minus = makeSVG('text', { x: x + 22, y: y + 8, class: 'component-text', 'font-size': '14' });
  minus.textContent = '−';
  circuitSvg.appendChild(minus);

  var voltLabel = makeSVG('text', { x: x + 22, y: y + 20, class: 'component-text', 'font-size': '8' });
  voltLabel.textContent = '9V';
  circuitSvg.appendChild(voltLabel);
}

function drawComponent(x, y, w, h, label) {
  var rect = makeSVG('rect', {
    x: x, y: y, width: w, height: h,
    class: 'component-body'
  });
  circuitSvg.appendChild(rect);

  var text = makeSVG('text', { x: x + w / 2, y: y + h / 2, class: 'component-text', 'font-size': '9' });
  text.textContent = label;
  circuitSvg.appendChild(text);
}

function drawBulb(x, y, lit) {
  var circle = makeSVG('circle', {
    cx: x, cy: y, r: '20',
    class: lit ? 'bulb-glass lit' : 'bulb-glass',
    id: 'output-device'
  });
  circuitSvg.appendChild(circle);

  var line1 = makeSVG('line', {
    x1: x - 8, y1: y - 6, x2: x + 8, y2: y + 6,
    stroke: COLORS.ink, 'stroke-width': '1.5'
  });
  circuitSvg.appendChild(line1);

  var line2 = makeSVG('line', {
    x1: x + 8, y1: y - 6, x2: x - 8, y2: y + 6,
    stroke: COLORS.ink, 'stroke-width': '1.5'
  });
  circuitSvg.appendChild(line2);

  var label = makeSVG('text', { x: x, y: y + 32, class: 'component-text', 'font-size': '8' });
  label.textContent = 'BULB';
  circuitSvg.appendChild(label);
}

function drawLED(x, y, lit) {
  var points = (x) + ',' + (y - 14) + ' ' + (x + 14) + ',' + (y + 7) + ' ' + (x - 14) + ',' + (y + 7);
  var triangle = makeSVG('polygon', {
    points: points,
    class: lit ? 'led-body lit' : 'led-body',
    id: 'output-device'
  });
  circuitSvg.appendChild(triangle);

  var ray1 = makeSVG('line', {
    x1: x + 16, y1: y - 10, x2: x + 24, y2: y - 18,
    stroke: lit ? COLORS.green : COLORS.ink,
    'stroke-width': '1.5', 'stroke-linecap': 'round'
  });
  circuitSvg.appendChild(ray1);

  var ray2 = makeSVG('line', {
    x1: x + 20, y1: y - 2, x2: x + 30, y2: y - 8,
    stroke: lit ? COLORS.green : COLORS.ink,
    'stroke-width': '1.5', 'stroke-linecap': 'round'
  });
  circuitSvg.appendChild(ray2);

  var label = makeSVG('text', { x: x, y: y + 22, class: 'component-text', 'font-size': '8' });
  label.textContent = 'LED';
  circuitSvg.appendChild(label);
}

function drawSparks(cx, cy) {
  var offsets = [
    { dx: -8, dy: -7 },
    { dx: 8,  dy: -7 },
    { dx: 0,  dy: -10 }
  ];

  for (var i = 0; i < offsets.length; i++) {
    var spark = makeSVG('line', {
      x1: cx + offsets[i].dx * 0.3,
      y1: cy + offsets[i].dy * 0.3,
      x2: cx + offsets[i].dx,
      y2: cy + offsets[i].dy,
      class: 'spark-line',
      style: 'animation-delay: ' + (i * 0.15) + 's'
    });
    circuitSvg.appendChild(spark);
  }
}

function lightUpOutput() {
  var circuit = state.currentCircuit;
  var old = document.getElementById('output-device');
  if (old) old.parentNode.removeChild(old);

  if (circuit.output === 'bulb') {
    drawBulb(circuit.bulb.x, circuit.bulb.y, true);
  } else if (circuit.output === 'led') {
    drawLED(circuit.led.x, circuit.led.y, true);
  }
}

function showFixedWire() {
  var broken = circuitSvg.querySelectorAll('.wire-broken');
  broken.forEach(function(el) { el.parentNode.removeChild(el); });

  var dz = document.getElementById('drop-zone');
  if (dz) dz.parentNode.removeChild(dz);
  
  var sparks = circuitSvg.querySelectorAll('.spark-line');
  sparks.forEach(function(el) { el.parentNode.removeChild(el); });
  
  var xMark = circuitSvg.querySelector('.break-x');
  if (xMark) xMark.parentNode.removeChild(xMark);

  var circuit = state.currentCircuit;
  var segs = circuit.brokenSegments;
  if (segs.length >= 2) {
    var fixedLine = makeSVG('line', {
      x1: segs[0].x1, y1: segs[0].y1,
      x2: segs[segs.length - 1].x2, y2: segs[segs.length - 1].y2,
      class: 'wire-fixed'
    });
    circuitSvg.appendChild(fixedLine);
  }
}

function buildWireTray(circuit) {
  wireOptions.innerHTML = '';

  var options = [circuit.brokenWire];
  for (var i = 0; i < circuit.wrongWires.length; i++) {
    options.push(circuit.wrongWires[i]);
  }

  for (var j = options.length - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var temp = options[j];
    options[j] = options[k];
    options[k] = temp;
  }

  for (var m = 0; m < options.length; m++) {
    var wireType = options[m];
    var card = createWireCard(wireType, wireType === circuit.brokenWire);
    wireOptions.appendChild(card);
  }
}

function createWireCard(wireType, isCorrect) {
  var card = document.createElement('div');
  card.className = 'wire-option';
  card.setAttribute('draggable', 'true');
  card.dataset.wireType = wireType;
  card.dataset.correct = isCorrect ? 'true' : 'false';

  var swatch = document.createElement('div');
  swatch.className = 'wire-swatch';
  swatch.style.background = WIRE_COLORS[wireType] || COLORS.ink;

  var label = document.createElement('span');
  label.className = 'wire-option-label';
  label.textContent = wireType.toUpperCase();

  card.appendChild(swatch);
  card.appendChild(label);

  card.addEventListener('dragstart', onDragStart);
  card.addEventListener('dragend', onDragEnd);

  return card;
}

function onDragStart(e) {
  state.dragWire = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.wireType);
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  state.dragWire = null;
  var dz = document.getElementById('drop-zone');
  if (dz) dz.classList.remove('drag-over');
}

function setupDropZone() {
  circuitSvg.addEventListener('dragover', function(e) {
    e.preventDefault();
    var dz = document.getElementById('drop-zone');
    if (dz) dz.classList.add('drag-over');
  });

  circuitSvg.addEventListener('dragleave', function() {
    var dz = document.getElementById('drop-zone');
    if (dz) dz.classList.remove('drag-over');
  });

  circuitSvg.addEventListener('drop', function(e) {
    e.preventDefault();

    if (state.answered) return;
    if (!state.running) return;

    var dz = document.getElementById('drop-zone');
    if (dz) dz.classList.remove('drag-over');

    var wireType = e.dataTransfer.getData('text/plain');

    if (wireType === state.currentCircuit.brokenWire) {
      handleCorrectDrop();
    } else {
      handleWrongDrop(wireType);
    }
  });
}

function startTimer() {
  stopTimer();

  var maxTime = getTimeForLevel();
  state.timeLeft = maxTime;
  var lastTickSecond = Math.ceil(state.timeLeft);

  state.timerInterval = setInterval(function() {
    state.timeLeft -= 0.1;

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      stopTimer();
      handleTimeUp();
      return;
    }

    var pct = (state.timeLeft / maxTime) * 100;
    timerBar.style.width = pct + '%';
    timerSecs.textContent = state.timeLeft.toFixed(1) + 's';

    if (pct <= 25) {
      timerBar.style.background = COLORS.red;
    } else if (pct <= 50) {
      timerBar.style.background = '#ff9a3c';
    } else {
      timerBar.style.background = COLORS.yellow;
    }

    var currentSecond = Math.ceil(state.timeLeft);
    var isUrgent = state.timeLeft <= 3;

    if (isUrgent) {
      if (Math.round(state.timeLeft * 2) !== Math.round((state.timeLeft + 0.1) * 2)) {
        soundTick(true);
      }
    } else {
      if (currentSecond !== lastTickSecond) {
        soundTick(false);
        lastTickSecond = currentSecond;
      }
    }
  }, 100);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function handleCorrectDrop() {
  state.answered = true;
  stopTimer();

  state.streak++;
  if (state.streak > state.bestStreak) {
    state.bestStreak = state.streak;
  }

  var maxTime  = getTimeForLevel();
  var timeUsed = maxTime - state.timeLeft;
  var speedPct = 1 - (timeUsed / maxTime);
  var speedBonus = Math.round(speedPct * 50);

  var label;
  if (timeUsed < 2) {
    label = 'PERFECT!';
  } else if (timeUsed < 4) {
    label = 'FAST!';
  } else {
    label = 'FIXED!';
  }

  var mult   = getMultiplier();
  var points = Math.round(100 * state.level * mult) + speedBonus;
  state.score += points;

  showFixedWire();
  lightUpOutput();
  showScorePopup(label + ' +' + points);
  soundCorrect();

  setTimeout(function() {
    nextLevel();
  }, 1200);
}

function handleWrongDrop(wireType) {
  soundWrong();
  var cards = wireOptions.querySelectorAll('.wire-option');
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].dataset.wireType === wireType) {
      cards[i].classList.add('shake');
      setTimeout(function(card) {
        card.classList.remove('shake');
      }, 400, cards[i]);
      break;
    }
  }
}

function handleTimeUp() {
  state.answered = true;
  state.streak   = 0;
  soundLifeLost();
  state.lives--;

  updateHUD();
  showFixedWire();

  if (state.lives <= 0) {
    setTimeout(function() {
      endGame();
    }, 800);
  } else {
    setTimeout(function() {
      nextLevel();
    }, 1000);
  }
}

function nextLevel() {
  if (!state.running) return;

  state.level++;
  state.answered = false;
  state.currentCircuit = getCircuitForLevel();

  drawCircuit(state.currentCircuit);
  buildWireTray(state.currentCircuit);

  timerBar.style.width = '100%';
  timerBar.style.background = COLORS.yellow;

  if (statusLevel) statusLevel.textContent = 'LEVEL ' + state.level;

  updateHUD();
  startTimer();
}

function showScorePopup(text) {
  if (!scorePopup) return;
  scorePopup.textContent = text;
  scorePopup.classList.remove('hidden', 'visible');
  void scorePopup.offsetWidth;
  scorePopup.classList.add('visible');

  setTimeout(function() {
    scorePopup.classList.remove('visible');
    scorePopup.classList.add('hidden');
  }, 1500);
}

function startGame() {
  resetState();

  overlayStart.classList.remove('active');
  overlayGameover.classList.remove('active');
  gameUI.classList.remove('hidden');

  requestAnimationFrame(function() {
    state.running = true;
    state.currentCircuit = getCircuitForLevel();

    drawCircuit(state.currentCircuit);
    buildWireTray(state.currentCircuit);
    setupDropZone();

    if (statusLevel) statusLevel.textContent = 'LEVEL 1';
    updateHUD();
    startTimer();
  });
}

function endGame() {
  state.running = false;
  stopTimer();
  soundGameOver();

  var isNewBest = saveBestScore(state.score);
  var best      = getBestScore();

  if (finalScore)  finalScore.textContent  = state.score;
  if (finalBest)   finalBest.textContent   = best;
  if (finalLevel)  finalLevel.textContent  = state.level;
  if (finalStreak) finalStreak.textContent = state.bestStreak;

  if (newBestBanner) {
    newBestBanner.classList.toggle('hidden', !isNewBest);
  }

  gameUI.classList.add('hidden');
  overlayGameover.classList.add('active');
}

function goToArcade() {
  window.location.href = '../../index.html';
}

function updateHUD() {
  if (hudScore)  hudScore.textContent  = state.score;
  if (hudLevel)  hudLevel.textContent  = state.level;
  if (hudStreak) hudStreak.textContent = state.streak + '×';

  for (var i = 0; i < lifeEls.length; i++) {
    if (lifeEls[i]) {
      if (i >= state.lives) {
        lifeEls[i].classList.add('lost');
      } else {
        lifeEls[i].classList.remove('lost');
      }
    }
  }
}

on('btn-start',      'click', startGame);
on('btn-restart',    'click', startGame);
on('btn-back-start', 'click', goToArcade);
on('btn-back-over',  'click', goToArcade);

on('btn-back-hud', 'click', function() {
  state.running = false;
  stopTimer();
  gameUI.classList.add('hidden');
  overlayStart.classList.add('active');
});

window.addEventListener('resize', function() {});