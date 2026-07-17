'use strict';

document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.game-card:not(.card-locked)');
    const map = { '1': 0, '2': 1, '3': 2 };
    if (map[e.key] !== undefined && cards[map[e.key]]) {
        cards[map[e.key]].click();
    }
});