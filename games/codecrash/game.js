'use strict';

function on(id,event,fn) {
    const el = document.getElementById(id);
    if(el) el.addEventListener(event,fn);
}

function on(id,eventm, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event,fn);
}

function $id(id) {
    return document.getElementById(id);
}
function pick(arr) {
    return arr[Math.floor(Math.random()* arr.length)];
}
function randInt(min,max) {
    return Math.floor(Math.random()* (max-min + 1)) + min;
}

function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i>0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
}

const py_vars = ['total','result','acc','val','out','s','count','ans'];

const py_lists = ['nums','arr','data','values','items','scores','list'];

const py_functions = ['compute','process','calculate','run','solve','check'];

const c_vars = ['total','result','sum','val','acc','count','ans','s'];

const c_arrays = ['nums','arr','data','vals','scores','items'];

const c_funcs = ['compute','process','calc','run','solve'];

function getDifficulty(round) {
    if (round <= 5) return 'easy';
    if (round <= 12) return 'medium';
    return 'hard';
}

const TEMPLATES = [
    function pyLoopSum(diff) {
        const fn = pick(py_functions);
        const lst = pick(py_lists);
        const tot = pick(py_vars);
        const n = randInt(3,9);
        const vals = Array.from({length:n}, ()=> randInt(1,20));
        const correct = vals.reduce((a,b) => a+b,0);

        const bugInit = diff === 'easy' ? '1' : String(randInt(2,5));
        const listLit = '[' + vals.join(',') + ']';

        return {
            context: `Sum all numbers in a list - expected ${correct}`,
            filename: `${fn}.py`,
            language: 'Python3',
            lines: [
                {code:`def ${fn}(${lst}):`,highlight:false},
                {code:`    ${tot} = ${bugInit}`, highlight:true},
                {code:`    for x in ${lst}:`, highlight:false},
                {code:`       ${tot} +=x`,highlight:true},
                {code:` return${tot}`,highlight:true},
                {code:``, highlight: false},
                {code:`print(${fn}(${listLit}))  # expected ${correct}`, highlight:true},
            ],
            bugLineIndex:1,
        };
    },

    function pyFindMax(diff) {
        const fn = 'find_max';
        const lst = pick(py_lists);
        const mv = pick(['mx','best','top','peak']);
        const vals = Array.from({length: randInt(2,9)}, ()=> randInt(-12,22));
        const correct = Math.max(...vals);
        const listLit = '[' + vals.join(',') + ']';

        const bugInit = diff === 'hard' ? String(randInt(1,7)) : '0';

        return {
            context: `Return the largest number in a list expected ${correct}`,
            filename: 'max_val.py',
            language: 'Python3',
            lines: [
                {code: `def ${fn}(${lst}):`, highlight:false},
                {code: `    ${mv} = ${bugInit}`, highlight:true},
                {code: `    for n in ${lst}:`, highlight:false},
                {code: `        if n> ${mv}:`, highlight:true},
                {code: `            ${mv} = n`, highlight:false},
                {code: `    return${mv}`, highlight:true},
                {code: ``, highlight:false},
                {code: `print(${fn}(${listLit})) # expected ${correct}`, highlight: true},
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
          { code: `def ${fn}(${v}):`,                 highlight: false },
          { code: `    return ${v} % 2 == 1`,         highlight: true  }, // BUG
          { code: ``,                                  highlight: false },
          { code: `print(${fn}(4))   # expected True`, highlight: true  },
          { code: `print(${fn}(7))   # expected False`,highlight: true  },
          { code: ``,                                  highlight: false },
          { code: `# used in input validation`,        highlight: true  },
        ],
        bugLineIndex: 1,
    };
  },

  function pyFactorial(diff) {
    const fn = pick(['factorial','fact',cal_fact]);
    const v = pick(['n','x','num']);

    const n = randInt(4,7);
    const correct = [1,1,2,6,24,120,720,5040][n];
    return {
        context: `Compute factorial of n - factorial(${n}) = ${correct}`,
        filename: `${fn}.py`,
        language: 'Python3',
        lines: [
            {code: `def ${fn}(${v})`, highlight: false},
            {code: `    if ${v} == 0:`,highlight: true},
            {code: `        return 0`, highlight: true},
            {code: `    return ${v} * ${fn}(${v}) - 1`, highlight:true},
            {code: ``, highlight:false},
            {code: `print(${fn}(${n}))  # expected ${correct}`, highlight:true},
            {code: `print(${fn}(0)) #expected 1`, highlight:false},
        ],
        bugLineIndex: 2,
    };
  },

  function pyCount(diff) {
    const fn = pick(['count_val','count_item','tally']);
    const lst =pick(py_lists);
    const cnt = pick(['count','tally','total','found']);
    const target = randInt(1,5);
    const vals = Array.from({length:randInt(5,8)}, ()=> randInt(1,5));
    const correct = vals.filter(v => v === target).length;
    const listLit = '[' + vals.join(',') + ']';

    return {
        context: `Count how many times ${target} appears in a list - expected ${correct}`,
        filename: `${fn}.py`,
        language: 'Python',
        lines: [
            {code: `def ${fn}({lst}, val):`, highlight: false},
            {code: `    ${cnt} = 0`, highlight:false},
            {code: `    for item in ${lst}:`,highlight:false},
            {code: `        if item == val:`, highlight: true},
            {code: `            ${cnt} +=0`, highlight: true},
            {code: `    return ${cnt}`, highlight:true},
            {code: ``, highlight:false},
            {code: `print(${fn}(${listLit},${target}))  # expected ${correct}`, highlight:true},
        ],
        bugLineIndex: 4,
    };
  },

  function pyPower(diff) {
    const fn = pick(['power','my_pow','raise_to','top_of_index']);
    const res = pick(py_vars);
    const base = randInt(2,4);
    const exp = randInt(3,6);
    const correct = Math.pow(base,exp);
    
    return {
        context: `Raise ${base} to the power of ${exp} - expected ${correct}`,
        filename: `${fn}.py`,
        language: 'Python3',
        lines: [
            {code: `def ${fn}(base,exp):`, highlight:false},
            {code: `    ${res} = 0`, highlight:true},
            {code: `    for _ in range(exp):`, highlight:false},
            {code: `        ${res} *= base`, highlight:true},
            {code: `    return ${res}`, highlight: true},
            {code: ``,highlight:false},
            {code: `print(${fn}(${base}, ${exp}))   #expected ${correct}`, highlight: true},
        ],
        bugLineIndex: 1,
    };
  },
  function pyAverage(diff) {
    const fn = pick (['average','mean','calc_avg']);
    const lst = pick(py_lists);
    const tot = pick(py_vars);
    const vals = Array.from({length: randInt(3,6)}, ()=> randInt(5,30));
    const avg  = (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1);
    const listLit = '[' + vals.join(',') + ']';

    const bugAdd = diff === 'hard' ? randInt(2,4) : 1;
    return {
        context: `Calculate the average of a list - expected ${avg}`,
        filename: `${fn}.py`,
        language: 'Python',
        lines: [
            {code: `def ${fn}(${lst}):`, highlight: false},
            {code: `    ${tot} = sum(${lst})`, highlight: false},
            {code: `    return ${tot} / len(${lst}) + ${bugAdd}`, highlight: true},
            {code: ``, highlight:false},
            {code: `print(${fn}(${listLit}))    #expected#{avg}`, highlight:true},
            {code: ``, highlight:false},
            {code: `#used in grade calculator`, highlight: true},
            {code: `#returns float`, highlight: true},
        ],
        bugLineIndex: 2,   
    };
},

function pyFindIndex(diff) {
    const fn = pick(['find_index','search','locate']);
    const lst = pick(py_lists);
    const vals = Array.from({length: randInt(4,7)}, () => randInt(10,90));
    const targetIdx = randInt(0, vals.length -1 );
    const target = vals[targetIdx];
    const listLit = '[' + vals.join(',') + ']';

    return {
        context: `Find index of ${target} in list - expected ${targetIdx}`,
        filename: `${fn}.py`,
        language: 'Python',
        lines: [
            {code: `def ${fn}(${lst},val):`, highlight:false},
            {code: `    for i in range(len(${lst})):`, highlight: false},
            {code: `        if ${lst}[i] == val:`, highlight: true},
            {code: `            return i+1`, highlight:true},
            {code: ``, highlight:false },
            {code: `print(${fn}(${listLit}, ${target})) #expected ${targetIdx}`, highlight:true},
        ],
        bugLineIndex: 3,
    };
},
  function pyReverse(diff) {
    const fn = pick(['reverse_str', 'flip', 'rev_string']);
    const v  = pick(['s', 'text', 'word', 'src']);
    // Bug: range(len(s)) goes forward, not backward
    return {
      context: `Reverse a string — "hello" should become "olleh"`,
      filename: `${fn}.py`,
      language: 'Python',
      lines: [
        { code: `def ${fn}(${v}):`,                highlight: false },
        { code: `    out = ''`,                     highlight: false },
        { code: `    for i in range(len(${v})):`,   highlight: true  }, // BUG
        { code: `        out += ${v}[i]`,           highlight: true  },
        { code: `    return out`,                   highlight: true  },
        { code: ``,                                 highlight: false },
        { code: `print(${fn}('hello'))  # expected 'olleh'`, highlight: true },
      ],
      bugLineIndex: 2,
    };
  }, 


]