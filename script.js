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

function validUsername(name) {
    if (name.length < 3) return {ok:false,msg:'Too short - minimum 3 characters'};
    if (name.length > 20) return {ok:false,msg:'Too long - maximum 20 characters '};
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return {ok:false, msg: 'Only letters, numbers and underscores'};
    return {ok:true,msg:'Looking fine'};
}

function loadPersonalScores() {
    const games =['numstrike','codecrash', 'wirefixer'];
    games.forEach(game => {
        const best = localStorage.getItem(`best-${game}`) || '---';
        const el = document.getElementById(`score-${game}`);
        if (el) el.textContent = best;
    });
}

function updateNavUsername(name) {
    const el = document.getElementById('nav-username');
    if (el) el.textContent = name;
}

function initLanding() {
    const existing = getUsername();
    const enterBtn = document.getElementById('btn-enter');

    enterBtn.addEventListener('click', ()=> {
        if (existing) {
            updateNavUsername(existing);
            loadPersonalScores();
            showScreen('select');
        } else {
            showScreen('username');
        }
    });
}

