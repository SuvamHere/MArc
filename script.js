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
        const bg = activeScreen.querySelector('.graph-grid-backdrop');
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

function validateUsername(name) {
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

function initUsername() {
    const input = document.getElementById('username-input');
    const hint = document.getElementById('username-hint');
    const btnPlay = document.getElementById('btn-play');

    input.addEventListener('input', ()=> {
        const val = input.value.trim().toUpperCase();
        input.value = val;
        const result = validateUsername(val);
        hint.textContent = val.length > 0 ? result.msg : '';
        hint.className = 'username-hint' + (result.ok ? 'ok': val.length > 0 ? 'error': '');
    });
    btnPlay.addEventListener('click', () => {
        const val = input.value.trim();
        const result = validateUsername(val);
        if (!result.ok) {
            hint.textContent = result.msg;
            hint.className = 'username-hint error';
            input.focus();
            return;
        }
        saveUsername(val);
        updateNavUsername(val);
        loadPersonalScores();
        showScreen('select');
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') btnPlay.click();
    });
}

function initGameSelect() {
    const changeBtn = document.getElementById('btn-change');
    if (changeBtn) {
        changeBtn.addEventListener('click', ()=> {
            localStorage.removeItem('arcade-username');
            updateNavUsername('');
            document.getElementById('username-input').value = '';
            document.getElementById('username-hint').textContent = '';
            showScreen('username');
        });
    }

    document.querySelectorAll('.btn-play-game').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const target = btn.getAttribute('data-target');
            if (target) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => { window.location.href = target; }, 100);
            }
        });
    });
}

function deployGraphbackdrops() {
    Object.values(screens).forEach(screen => {
        const backdrop = document.createElement('div');
        backdrop.className = 'graph-grid-backdrop';
        screen.insertBefore(backdrop, screen.firstChild);
    });
}

function setupCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'custom-cursor-trail';
    document.body.appendChild(trail);

    let mouse = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    const lerpFactor = 0.2; // I added this factor to control the smooth elastic stiffness of the follow animation

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // I built a continuous tracking loop here using requestAnimationFrame for crisp performance
    function processTrailLoop() {
        current.x += (mouse.x - current.x) * lerpFactor;
        current.y += (mouse.y - current.y) * lerpFactor;

        trail.style.left = `${current.x}px`;
        trail.style.top = `${current.y}px`;

        requestAnimationFrame(processTrailLoop);
    }
    requestAnimationFrame(processTrailLoop);

    // I added hover listeners right here so that the custom box expands and changes color on clickable elements
    const activeSelectors = 'button, input, .game-card, .btn-change';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(activeSelectors)) {
            trail.style.transform = 'translate(-50%, -50%) scale(1.6) rotate(45deg)';
            trail.style.backgroundColor = 'var(--red)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(activeSelectors)) {
            trail.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
            trail.style.backgroundColor = 'var(--yellow)';
        }
    });
}

function bindGraphParallax(){
    window.addEventListener('mousemove', (e) => {
        const activeScreen = document.querySelector('screen.active');
        if (!activeScreen) return;

        const backdrop = activeScreen.querySelector('graph-grid-backdrop');
        if (!backdrop) return;

        const shiftX = (e.clientX / window.innerWidth - 0.5) * -15;
        const shiftY = (e.clientY / window.innerHeight - 0.5) * -15;

        backdrop.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.05)`;
    });
}