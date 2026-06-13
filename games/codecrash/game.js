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