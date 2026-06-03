'use strict'

const screens = {
    landing: document.getElementById('screen-landing'),
    username: document.getElementById('screen-username'),
    select: document.getElementById('screen-select'),
};

function showScreen(name) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.remove('active');
    });
    const activeScreen = screens[name];
    activeScreen.classList.add('active');
}