'use strict';

function on(id,event,fn) {
    const el = document.getElementById(id);
    if(el) el.addEventListener(event,fn);
}