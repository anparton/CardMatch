export class ClassUtil {
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    async LerpTo(displayObject, toX, toY, time) {
        if (time>0) {
            const fromX = displayObject.x;
            const fromY = displayObject.y;
            const steps = Math.max(1, Math.floor(time / 16));
            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const easedT = this.easeInOutCubic(t);
                displayObject.x = fromX + (toX - fromX) * easedT;
                displayObject.y = fromY + (toY - fromY) * easedT;
                await new Promise(res => setTimeout(res, time / steps));
            }
        }
        displayObject.x = toX;
        displayObject.y = toY;
    }

    async ScaleTo(displayObject, toScaleX, toScaleY, time) {
        if (!displayObject.scale || typeof displayObject.scale.x !== 'number' || typeof displayObject.scale.y !== 'number') {
            throw new Error('Object does not have scale.x and scale.y');
        }
        const fromScaleX = displayObject.scale.x;
        const fromScaleY = displayObject.scale.y;
        const steps = Math.max(1, Math.floor(time / 16));
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const easedT = this.easeInOutCubic(t);
            displayObject.scale.x = fromScaleX + (toScaleX - fromScaleX) * easedT;
            displayObject.scale.y = fromScaleY + (toScaleY - fromScaleY) * easedT;
            await new Promise(res => setTimeout(res, time / steps));
        }
        displayObject.scale.x = toScaleX;
        displayObject.scale.y = toScaleY;
    }
}