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

    if (name === 'select') {
        const bg = activeScreen.querySelector('graph-grid-backdrop');
        if (bg) {
            bg.style.transform = 'scale(1.05) rotate(0.5deg)';
            setTimeout(() => { bg.style.transform = 'scale(1.01) rotate(0deg)'; }, 400);
        }
    }
}

function getUsername() {
    return localStorage.getItem('arcade-username') || '';
}

function saveUsername(name) {
    localStorage.setItem('arcade-username', name);
}
