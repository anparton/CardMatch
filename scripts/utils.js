import {Application, Assets, Sprite, Container} from 'pixi.js';


export function getCardPosition(SIZEX, wid, index) {
    const gap = (SIZEX - wid * 8) / 9;
    return (gap + index * (wid + gap))+wid/2;
}

export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
export function easeInOut(t) {
    t = Math.max(0, Math.min(1, t));
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



