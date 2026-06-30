'use strict';

function on(id, event, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, fn);
}

function $id(id) {
  return document.getElementById(id);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const PY_VARS    = ['total','result','acc','val','out','s','count','ans'];
const PY_LISTS   = ['nums','arr','data','values','items','scores','lst'];
const PY_FUNCS   = ['compute','process','calculate','run','solve','check'];
const C_VARS     = ['total','result','sum','val','acc','count','ans','s'];
const C_ARRAYS   = ['nums','arr','data','vals','scores','items'];
const C_FUNCS    = ['compute','process','calc','run','solve'];

function getDifficulty(round) {
  if (round <= 5)  return 'easy';
  if (round <= 12) return 'medium';
  return 'hard';
}

const TEMPLATES = [

  function pyLoopSum(diff) {
    const fn  = pick(PY_FUNCS);
    const lst = pick(PY_LISTS);
    const tot = pick(PY_VARS);
    const n   = randInt(3, 9);
    const vals = Array.from({length: n}, () => randInt(1, 20));
    const correct = vals.reduce((a, b) => a + b, 0);

    const bugInit = diff === 'easy' ? '1' : String(randInt(2, 5));
    const listLit = '[' + vals.join(', ') + ']';

    return {
      context: `Sum all numbers in a list — expected ${correct}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}):`,highlight: false },
        { code: `    ${tot} = ${bugInit}`,highlight: true  }, 
        { code: `    for x in ${lst}:`,highlight: false },
        { code: `        ${tot} += x`,highlight: true  },
        { code: `    return ${tot}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}))  # expected ${correct}`,highlight: true },
      ],
      bugLineIndex: 1,
    };
  },
  function pyFindMax(diff) {
    const fn  = 'find_max';
    const lst = pick(PY_LISTS);
    const mv  = pick(['mx', 'best', 'top', 'peak']);
    const vals = Array.from({length: randInt(4,7)}, () => randInt(-10, 20));
    const correct = Math.max(...vals);
    const listLit = '[' + vals.join(', ') + ']';

    const bugInit = diff === 'hard' ? String(randInt(1, 5)) : '0';

    return {
      context: `Return the largest number in a list — expected ${correct}`,
      filename: `max_val.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}):`,highlight: false },
        { code: `    ${mv} = ${bugInit}`,highlight: true  }, 
        { code: `    for n in ${lst}:`,highlight: false },
        { code: `        if n > ${mv}:`,highlight: true  },
        { code: `            ${mv} = n`,highlight: false },
        { code: `    return ${mv}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}))  # expected ${correct}`,highlight: true },
      ],
      bugLineIndex: 1,
    };
  },
  function pyEvenCheck(diff) {
    const fn = pick(['is_even', 'check_even', 'even_check']);
    const v  = pick(['n', 'x', 'num', 'val']);
    return {
      context: `Return True if a number is even`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${v}):`,highlight: false },
        { code: `    return ${v} % 2 == 1`,highlight: true  }, 
        { code: ``,highlight: false },
        { code: `print(${fn}(4))   # expected True`,highlight: true  },
        { code: `print(${fn}(7))   # expected False`,highlight: true  },
        { code: ``,highlight: false },
        { code: `# used in input validation`,highlight: true  },
      ],
      bugLineIndex: 1,
    };
  },

  function pyFactorial(diff) {
    const fn = pick(['factorial', 'fact', 'calc_fact']);
    const v  = pick(['n', 'x', 'num']);
    const n  = randInt(4, 7);
    const correct = [1,1,2,6,24,120,720,5040][n];
    return {
      context: `Compute factorial of n — factorial(${n}) = ${correct}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${v}):`,highlight: false },
        { code: `    if ${v} == 0:`,highlight: true  },
        { code: `        return 0`,highlight: true  }, 
        { code: `    return ${v} * ${fn}(${v} - 1)`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${n}))  # expected ${correct}`,highlight: true },
        { code: `print(${fn}(0))     # expected 1`,highlight: false },
      ],
      bugLineIndex: 2,
    };
  },

  function pyCount(diff) {
    const fn  = pick(['count_val', 'count_item', 'tally']);
    const lst = pick(PY_LISTS);
    const cnt = pick(['count', 'tally', 'total', 'found']);
    const target = randInt(1, 5);
    const vals = Array.from({length: randInt(5,8)}, () => randInt(1, 5));
    const correct = vals.filter(v => v === target).length;
    const listLit = '[' + vals.join(', ') + ']';
    return {
      context: `Count how many times ${target} appears in a list — expected ${correct}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}, val):`,highlight: false },
        { code: `    ${cnt} = 0`,highlight: false },
        { code: `    for item in ${lst}:`,highlight: false },
        { code: `        if item == val:`, highlight: true  },
        { code: `            ${cnt} += 0`,highlight: true  },
        { code: `    return ${cnt}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}, ${target}))  # expected ${correct}`, highlight: true },
      ],
      bugLineIndex: 4,
    };
  },

  function pyPower(diff) {
    const fn   = pick(['power', 'my_pow', 'raise_to']);
    const res  = pick(PY_VARS);
      const base = randInt(2, 4);
    const exp  = randInt(3, 6);
    const correct = Math.pow(base, exp);
    return {
      context: `Raise ${base} to the power of ${exp} — expected ${correct}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(base, exp):`,highlight: false },
        { code: `    ${res} = 0`,highlight: true  },
        { code: `    for _ in range(exp):`,highlight: false },
        { code: `        ${res} *= base`,highlight: true  },
        { code: `    return ${res}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${base}, ${exp}))  # expected ${correct}`, highlight: true },
      ],
      bugLineIndex: 1,
    };
  },

  function pyAverage(diff) {
    const fn  = pick(['average', 'mean', 'calc_avg']);
    const lst = pick(PY_LISTS);
    const tot = pick(PY_VARS);
    const vals = Array.from({length: randInt(3,6)}, () => randInt(5, 30));
    const avg  = (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1);
    const listLit = '[' + vals.join(', ') + ']';
    const bugAdd = diff === 'hard' ? randInt(2, 4) : 1;
    return {
      context: `Calculate the average of a list — expected ${avg}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}):`,highlight: false },
        { code: `    ${tot} = sum(${lst})`,highlight: false },
        { code: `    return ${tot} / len(${lst}) + ${bugAdd}`,highlight: true  }, 
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}))  # expected ${avg}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `# used in grade calculator`,highlight: true  },
        { code: `# returns float`,highlight: true  },
      ],
      bugLineIndex: 2,
    };
  },

  function pyFindIndex(diff) {
    const fn  = pick(['find_index', 'search', 'locate']);
    const lst = pick(PY_LISTS);
    const vals = Array.from({length: randInt(4,7)}, () => randInt(10, 90));
    const targetIdx = randInt(0, vals.length - 1);
    const target = vals[targetIdx];
    const listLit = '[' + vals.join(', ') + ']';
    return {
      context: `Find index of ${target} in list — expected ${targetIdx}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}, val):`,highlight: false },
        { code: `    for i in range(len(${lst})):`,highlight: false },
        { code: `        if ${lst}[i] == val:`,highlight: true  },
        { code: `            return i + 1`,highlight: true  },     
        { code: `    return -1`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}, ${target}))  # expected ${targetIdx}`, highlight: true },
      ],
      bugLineIndex: 3,
    };
  },

  function pyReverse(diff) {
    const fn = pick(['reverse_str', 'flip', 'rev_string']);
    const v  = pick(['s', 'text', 'word', 'src']);
    return {
      context: `Reverse a string — "hello" should become "olleh"`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${v}):`,highlight: false },
        { code: `    out = ''`,highlight: false },
        { code: `    for i in range(len(${v})):`,highlight: true  }, 
        { code: `        out += ${v}[i]`,highlight: true  },
        { code: `    return out`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}('hello'))  # expected 'olleh'`, highlight: true },
      ],
      bugLineIndex: 2,
    };
  },

  function pyFilterOdds(diff) {
    const fn  = pick(['filter_odds', 'get_odds', 'only_odd']);
    const lst = pick(PY_LISTS);
    const vals = Array.from({length: randInt(5,8)}, () => randInt(1,20));
    const correct = vals.filter(v => v % 2 !== 0);
    const listLit = '[' + vals.join(', ') + ']';
    return {
      context: `Return only odd numbers from a list`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}):`,highlight: false },
        { code: `    return [x for x in ${lst}`,highlight: false },
        { code: `            if x % 2 == 0]`,highlight: true  }, 
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}))`,highlight: true  },
        { code: `# expected ${JSON.stringify(correct)}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `# used in number classifier`,highlight: true  },
      ],
      bugLineIndex: 2,
    };
  },

  function pyBubbleStep(diff) {
    const fn  = pick(['bubble_pass', 'sort_pass', 'one_pass']);
    const lst = pick(PY_LISTS);
    return {
      context: `One pass of bubble sort — swap adjacent elements if out of order`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}):`,highlight: false },
        { code: `    for i in range(len(${lst}) - 2):`,highlight: true  }, 
        { code: `        if ${lst}[i] > ${lst}[i + 1]:`,highlight: true  },
        { code: `            ${lst}[i], ${lst}[i+1] = \\`,highlight: false },
        { code: `            ${lst}[i+1], ${lst}[i]`,highlight: false },
        { code: `    return ${lst}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}([3,1,4,2]))  # expected [1,3,2,4]`,highlight: true },
      ],
      bugLineIndex: 1,
    };
  },

  function pyBinarySearch(diff) {
    const fn  = pick(['binary_search', 'bin_find', 'bsearch']);
    const lst = pick(PY_LISTS);
    const target = randInt(10, 50);
    return {
      context: `Binary search — find index of target in sorted list`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}, target):`,highlight: false },
        { code: `    lo, hi = 0, len(${lst}) - 1`,highlight: false },
        { code: `    while lo <= hi:`,highlight: false },
        { code: `        mid = (lo + hi) // 2 + 1`,highlight: true  }, 
        { code: `        if ${lst}[mid] == target:`,highlight: true  },
        { code: `            return mid`,highlight: false },
        { code: `        elif ${lst}[mid] < target:`,highlight: true  },
        { code: `            lo = mid + 1`,highlight: false },
        { code: `        else: hi = mid - 1`,highlight
        : true  },
      ],
      bugLineIndex: 3,
    };
  },

  function pyFizzBuzz(diff) {
    return {
      context: `FizzBuzz — 3→Fizz, 5→Buzz, 15→FizzBuzz`,
      filename: `fizzbuzz.py`,
      language: 'Python',
      lines: [
        { code: `def fizzbuzz(n):`,highlight: false },
        { code: `    out = []`,highlight: false },
        { code: `    for i in range(1, n + 1):`,highlight: false },
        { code: `        if i % 15 == 0:`,highlight: true  },
        { code: `            out.append('FizzBuzz')`,highlight: false },
        { code: `        elif i % 3 == 0:`,highlight: true  },
        { code: `            out.append('Buzz')`,highlight: true  }, 
        { code: `        elif i % 5 == 0:`,highlight: false },
        { code: `            out.append('Fizz')`,highlight: true  },
      ],
      bugLineIndex: 6,
    };
  },

  function pyRepeat(diff) {
    const fn = pick(['repeat_str', 'multiply_str', 'str_repeat']);
    const v  = pick(['s', 'text', 'word']);
    const times = randInt(2, 5);
    return {
      context: `Repeat a string n times — "ab" × ${times} = "${'ab'.repeat(times)}"`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${v}, n):`,highlight: false },
        { code: `    return ${v} + n`,highlight: true  }, 
        { code: ``,highlight: false },
        { code: `print(${fn}('ab', ${times}))`,highlight: true  },
        { code: `# expected '${'ab'.repeat(times)}'`,highlight: true  },
        { code: ``,highlight: false },
        { code: `# used in pattern generator`,highlight: true  },
      ],
      bugLineIndex: 1,
    };
  },

  function pyFindMin(diff) {
    const fn  = pick(['find_min', 'minimum', 'get_min']);
    const lst = pick(PY_LISTS);
    const mv  = pick(['mn', 'low', 'smallest', 'least']);
    const vals = Array.from({length: randInt(4,7)}, () => randInt(1, 50));
    const correct = Math.min(...vals);
    const listLit = '[' + vals.join(', ') + ']';
    return {
      context: `Return the smallest number — expected ${correct}`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${lst}):`,highlight: false },
        { code: `    ${mv} = ${lst}[0]`,highlight: false },
        { code: `    for n in ${lst}[1:]:`,highlight: false },
        { code: `        if n > ${mv}:`,highlight: true  }, 
        { code: `            ${mv} = n`,highlight: false },
        { code: `    return ${mv}`,highlight: true  },
        { code: ``,highlight: false },
        { code: `print(${fn}(${listLit}))  # expected ${correct}`, highlight: true },
        { code: ``,highlight: false },
        { code: `# wrong comparison direction`,highlight: true  },
      ],
      bugLineIndex: 3,
    };
  },

  function cArraySum(diff) {
    const fn  = pick(C_FUNCS);
    const arr = pick(C_ARRAYS);
    const tot = pick(C_VARS);
    const n   = randInt(3, 6);
    const vals = Array.from({length: n}, () => randInt(1, 15));
    const correct = vals.reduce((a,b) => a+b, 0);
    const arrLit = '{' + vals.join(', ') + '}';
    return {
      context: `Sum ${n} integers in a C array — expected ${correct}`,
      filename: `${fn}.c`,
      language: 'C',
      lines: [
        { code: `int ${fn}(int ${arr}[], int n) {`,highlight: false },
        { code: `    int ${tot} = 0;`,highlight: false },
        { code: `    for (int i = 0; i <= n; i++)`,highlight: true  }, 
        { code: `        ${tot} += ${arr}[i];`,highlight: true  },
        { code: `    return ${tot};`,highlight: true  },
        { code: `}`,highlight: false },
        { code: ``,highlight: false },
        { code: `int a[] = ${arrLit};`,highlight: true  },
      ],
      bugLineIndex: 2,
    };
  },

  function cFindMin(diff) {
    const fn  = pick(['find_min', 'get_min', 'minimum']);
    const arr = pick(C_ARRAYS);
    const mv  = pick(['mn', 'low', 'smallest']);
    const vals = Array.from({length: randInt(4,6)}, () => randInt(1,50));
    const correct = Math.min(...vals);
    const arrLit = '{' + vals.join(', ') + '}';
    return {
      context: `Find the smallest value in a C array — expected ${correct}`,
      filename: `${fn}.c`,
      language: 'C',
      lines: [
        { code: `int ${fn}(int ${arr}[], int n) {`,highlight: false },
        { code: `    int ${mv} = ${arr}[0];`,highlight: false },
        { code: `    for (int i = 1; i < n; i++) {`,highlight: false },
        { code: `        if (${arr}[i] > ${mv})`,highlight: true  }, 
        { code: `            ${mv} = ${arr}[i];`,highlight: true  },
        { code: `    }`,highlight: false },
        { code: `    return ${mv};`,highlight: true  },
        { code: `}`,highlight: false },
        { code: `// int a[]=${arrLit};  expected ${correct}`, highlight: true },
      ],
      bugLineIndex: 3,
    };
  },

  function cOffByOne(diff) {
    const fn  = pick(C_FUNCS);
    const arr = pick(C_ARRAYS);
    const tot = pick(C_VARS);
    const n   = randInt(4, 7);
    const vals = Array.from({length: n}, () => randInt(1, 10));
    const correct = vals.reduce((a,b) => a+b, 0);
    const arrLit = '{' + vals.join(', ') + '}';
    return {
      context: `Sum all ${n} elements — expected ${correct} (no element skipped)`,
      filename: `${fn}.c`,
      language: 'C',
      lines: [
        { code: `int ${fn}(int ${arr}[], int n) {`,highlight: false },
        { code: `    int ${tot} = 0;`,highlight: false },
        { code: `    for (int i = 1; i < n; i++)`,highlight: true  }, 
        { code: `        ${tot} += ${arr}[i];`,highlight: true  },
        { code: `    return ${tot};`,highlight: true  },
        { code: `}`,highlight: false },
        { code: ``,highlight: false },
        { code: `int a[] = ${arrLit}; // expected ${correct}`, highlight: true },
      ],
      bugLineIndex: 2,
    };
  },

    function cWrongInit(diff) {
    const fn   = pick(C_FUNCS);
    const arr  = pick(C_ARRAYS);
    const res  = pick(C_VARS);
    const base = randInt(2, 3);
    const n    = randInt(3, 5);
    const correct = Math.pow(base, n);
    return {
      context: `Compute ${base}^${n} by multiplying in a loop — expected ${correct}`,
      filename: `power.c`,
      language: 'C',
      lines: [
        { code: `int power(int base, int exp) {`,highlight: false },
        { code: `    int ${res} = 0;`,highlight: true  }, 
        { code: `    for (int i = 0; i < exp; i++)`, highlight: false },
        { code: `        ${res} *= base;`,highlight: true  },
        { code: `    return ${res};`,highlight: true  },
        { code: `}`,highlight: false },
        { code: ``,highlight: false },
        { code: `// power(${base},${n}) expected ${correct}`, highlight: true },
      ],
      bugLineIndex: 1,
    };
  },

  function cPrintfBug(diff) {
    const val = randInt(10, 99);
    return {
      context: `Print an integer value — should print ${val} not garbage`,
      filename: `print_val.c`,
      language: 'C',
      lines: [
        { code: `#include <stdio.h>`,highlight: false },
        { code: ``,highlight: false },
        { code: `int main() {`,highlight: false },
        { code: `    int val = ${val};`,highlight: true  },
        { code: `    printf("%f\\n", val);`,highlight: true  }, 
        { code: `    return 0;`,highlight: true  },
        { code: `}`,highlight: false },
        { code: `// expected output: ${val}`,highlight: true  },
      ],
      bugLineIndex: 4,
    };
  },

];

const PY_TEMPLATES = TEMPLATES.filter((_, i) => i <= 13); 
const C_TEMPLATES  = TEMPLATES.filter((_, i) => i >= 14); 

function pickTemplate(diff) {
  const hardOnly = ['pyBubbleStep', 'pyBinarySearch'];

  const usePy = Math.random() < 0.75;
  const pool  = usePy ? PY_TEMPLATES : C_TEMPLATES;

  const filtered = diff === 'easy'
    ? pool.filter(fn => !hardOnly.includes(fn.name))
    : pool;

  return pick(filtered.length ? filtered : pool);
}

function generateQuestion(round) {
  const diff = getDifficulty(round);
  const tmpl = pickTemplate(diff);
  return tmpl(diff);
}

const STATE = {
  running:    false,
  score:      0,
  lives:      3,
  round:      1,
  streak:     0,
  bestStreak: 0,
  currentQ:   null,
  timerInterval: null,
  timeLeft:   5.0,
  answered:   false,
  maxTime:    5.0,
  recentTemplates: [],
};

const TIMER_START  = 5.0;
const TIMER_MIN    = 2.0;
const TIMER_SHRINK = 0.15;
const TICK_MS      = 50;

function streakMultiplier(streak) {
  if (streak >= 10) return 2.5;
  if (streak >= 7)  return 2.0;
  if (streak >= 4)  return 1.5;
  return 1.0;
}

function calcScore(round, streak, timeLeft, maxTime) {
  const base       = 10 * round;
  const mult       = streakMultiplier(streak);
  const speedBonus = Math.floor((timeLeft / maxTime) * 50);
  return Math.floor(base * mult + speedBonus);
}

function nextQuestion() {
  const diff = getDifficulty(STATE.round);
  let tmpl = pickTemplate(diff);

  if (STATE.recentTemplates.slice(-2).includes(tmpl.name)) {
    tmpl = pickTemplate(diff);
  }

  STATE.recentTemplates.push(tmpl.name);
  if (STATE.recentTemplates.length > 5) STATE.recentTemplates.shift();

  return tmpl(diff);
}

function clearTimer() {
  if (STATE.timerInterval !== null) {
    clearInterval(STATE.timerInterval);
    STATE.timerInterval = null;
  }
}
function startTimer() {
  clearTimer();
  const reduction = Math.floor((STATE.round - 1) / 3)* TIMER_SHRINK;
  STATE.maxTime = Math.max(TIMER_MIN, TIMER_START - reduction);
  STATE.timeleft = STATE.maxTime;
  STATE.timeLeft = STATE.maxTime;
  updateTimerUI();

  STATE.timerInterval = setInterval(() => {
    STATE.timeLeft -= TICK_MS / 1000;
    if (STATE.timeleft <= 0) {
      STATE.timeLeft = 0;
      updateTimerUI();
      clearTimer();
      clearTimer();
      handleTimeout();
      return;
    }
    updateTimerUI();
  }, TICK_MS);
}

function updateTimerUI() {
  const bar = $id('timer-bar');
  const secs = $id('timer-seconds');
  if (!bar || !secs) return;

  const pct = STATE.timeLeft / STATE.maxTime;
  bar.style.width = (pct * 100) + '%';
  if (pct <= 0.25)     bar.style.background = 'var(--red)';
  else if (pct <= 0.5) bar.style.background = '#ff9a3c';
  else                 bar.style.background = 'var(--yellow)';

  secs.style.color = pct <= 0.25 ? 'var(--red)' : 'var(--ink)';
  secs.textContent = STATE.timeLeft.toFixed(1) + 's';
}

function updateHUD() {
  const score = $id ('hud-score');
  const round = $id ('hud-round');
  const streak = $id ('hud-streak');
  const status = $id ('status-round');
  if (score) score.textContext = STATE.score;
  if (round) round.textContent = STATE.round;
  if (streak) streak.textContent = STATE.streak + 'x';
  if (status) status.textContext = 'ROUND' + STATE.round;
}

function updateLivesUI() {
  for (let i = 1; i <= 3; i++) {
    const el = $id('life-' + i);
    if (!el) continue;
    el.classList.toggle('lost', i > STATE.lives);
  }
}
function animateScorePop() {
  const el = $id('hud-score');
  if (!el) return;
  el.style.transform = 'scale(1.35)';
  el.style.color = 'var(--green)';
  setTimeout(() => {
    el.style.transform = '';
    el.style.color = '';
  }, 280);
}

function highlightCode(code, language) {
  let s = code;

  s = s.replace(/&/g, '&amp;');
  s = s.replace(/</g, '&lt;');
  s = s.replace(/>/g, '&gt;');

  if (language === 'Python') {

    s = s.replace(
      /(#.*)$/g,
      '<span class="cm">$1</span>'
    );

  } else {

    s = s.replace(
      /(\/\/.*)$/g,
      '<span class="cm">$1</span>'
    );

  }

  s = s.replace(
    /(&quot;[^&]*&quot;|'[^']*')/g,
    '<span class="str">$1</span>'
  );
  s = s.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="num">$1</span>'
  );
  if (language === 'Python') {

    const kws = [
      'def','return','for','in','if','elif','else','while','not','and','or','True','False','None','import','from','class','pass','break','continue','lambda','with','as'];

    kws.forEach(kw => {
      const pattern = new RegExp(
        '\\b' + kw + '\\b',
        'g'
      );

      s = s.replace(
        pattern,
        '<span class="kw">$&</span>'
      );

    });

  }

  if (language === 'C') {

    const kws = [
      'int','float','char','void','return','for','while','if','else','break','continue','struct','include','printf','main'];

    kws.forEach(kw => {

      const pattern = new RegExp(
        '\\b' + kw + '\\b',
        'g'
      );

      s = s.replace(
        pattern,
        '<span class="kw">$&</span>'
      );

    });

  }

  s = s.replace(
    /\b([a-zA-Z_]\w*)(?=\s*\()/g,
    '<span class="fn">$1</span>'
  );
  return s;
}

function renderRound(q) {
  const ctxEl = $if('context-text');
  const fnEl = $id('code-filename');
  const langEl = $if('code-lang-tag');
  const body = $id('code-body');
  
  if (ctxEl) ctxEl.textContent = q.context;
  if (fnEl) fnEl.textContent = q.filename;
  if (langEl) langEl.textContent = q.language;

  if (langEl) {
    langEl.style.background =
      q.language === 'C'          ? 'var(--purple)' :
      q.language === 'JavaScript' ? 'var(--yellow)'  :'var(--blue)';
  }

  if (!body) return;
  body.innerHTML = '';

  q.lines.forEach((line, idx) => {
    const row    = document.createElement('div');
    const numEl  = document.createElement('span');
    const codeEl = document.createElement('span');

    row.classList.add('code-line');
    row.classList.add(line.highlight ? 'line-highlighted' : 'line-dim');

    numEl.classList.add('line-num');
    numEl.textContent = idx + 1;

    codeEl.classList.add('line-code');
    codeEl.innerHTML = line.code
      ? highlightCode(line.code, q.language)
      : '&nbsp;';

    row.appendChild(numEl);
    row.appendChild(codeEl);

    if (line.highlight) {
      row.addEventListener('click', () => handleLineClick(idx, row));
    }

    body.appendChild(row);
  });
}

function handleLineClick(lineIdx, rowE) {
  if (STATE.answered || !STATE.running) return;
  STATE.answered = true;
  clearTimer();

  if (lineIdx === STATE.currentQ.bugLineIndex) {
    handleCorrect(rowEl);
}
  else {
    handleWrong(rowEl);
  }
}

function handleCorrect(rowEl) {
  rowEl.classList.replace('line-highlighted','line-correct');

  const block = $id('code-block');
  if (block) block.classList.add('anim-correct');

  const earned = calcScore(STATE.round,STATE.streak + 1, STATE.timeLeft, STATE.maxTime);
  STATE.streak++;
  if (STATE.streak > STATE.bestStreak) STATE.bestStreak = STATE.streak;
  STATE.score += earned;

  updateHUD();
  animateScorePop();

  setTimeout(() => {
    if(block) block.classList.remove('anim-correct');
    advanceRound();
  }, 700);
}

function handleWrong(rowEl) {
  rowEl.classList.replace('line-highlighted','line-wrong');

  const block = $id('code-block');
  if (block) block.classList.add('anim-wrong');
  revealCorrectLine();
  STATE.streak = 0;
  updateHUD();

  setTimeout(() => {
    if (block) block.classList.remove('anim-wrong');
    loseLife();
  }, 750);
}
function handleTimeout() {
  if (STATE.answered || !STATE.running) return;
  STATE.answered = true;
  revealCorrectLine();
  STATE.streak = 0;
  updateHUD();
  setTimeout(() => loseLife(), 750);
}

function revealCorrectLine() {
  const body = $id('code-body');
  if (!body) return;
  const rows = body.querySelectorAll('code-line'); 
  const correctRow = rows[STATE.currentQ.bugLineIndex];
  if (correctRow) correctRow.classList.replace('line-highlighted','line-correct');
}
function loseLife() {
  STATE.lives--;
  updateLivesUI();
  const lifeEl = $id('life-' + (STATE.lives + 1));
  if (lifeEl) {
    lifeEl.style.transition = 'transform 0.2s, opacity 0.2s, color 0.2s';
  }
  if (STATE.lives <= 0) {
    setTimeout(() => endGame(), 600);
  } 
    else {
    setTimeout(() => advanceRound(), 600);
  }
}