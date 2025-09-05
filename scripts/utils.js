


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

export function easeInOutCubic(t) {return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;}


export async function lerpTo(displayObject, toX, toY, time) {
    if (time>0) {
        const fromX = displayObject.x;
        const fromY = displayObject.y;
        const steps = Math.max(1, Math.floor(time / 16));
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const easedT = easeInOutCubic(t);
            displayObject.x = fromX + (toX - fromX) * easedT;
            displayObject.y = fromY + (toY - fromY) * easedT;
            await new Promise(res => setTimeout(res, time / steps));
        }
    }
    displayObject.x = toX;
    displayObject.y = toY;
}

export async function scaleTo(displayObject, toScaleX, toScaleY, time) {
    if (!displayObject.scale || typeof displayObject.scale.x !== 'number' || typeof displayObject.scale.y !== 'number') {
        throw new Error('Object does not have scale.x and scale.y');
    }
    const fromScaleX = displayObject.scale.x;
    const fromScaleY = displayObject.scale.y;
    const steps = Math.max(1, Math.floor(time / 16));
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const easedT = easeInOutCubic(t);
        displayObject.scale.x = fromScaleX + (toScaleX - fromScaleX) * easedT;
        displayObject.scale.y = fromScaleY + (toScaleY - fromScaleY) * easedT;
        await new Promise(res => setTimeout(res, time / steps));
    }
    displayObject.scale.x = toScaleX;
    displayObject.scale.y = toScaleY;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function centerPivot(obj) {
    obj.pivot.set(obj.width/2, obj.height/2);
}



