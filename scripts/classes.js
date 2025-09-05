import {Sprite} from "pixi.js";
import {sleep} from "./utils";
import {rootContainer} from "./main";
import {ClassUtil} from "./classutil";

export class Card extends ClassUtil {
    static flipCounter = 0;
    constructor(suit, textures, root, onFlip) {
        super();
        this.active = true;
        this.suit = suit;
        this.onFlip = onFlip;
        this.rootContainer = root;
        this.sprite = new Sprite(textures[suit.toLowerCase()]);
        this.backSprite = new Sprite(textures['back']);
        this.sprite.pivot.x = this.sprite.width / 2;
        this.sprite.pivot.y = this.sprite.height / 2;
        this.backSprite.pivot.x = this.backSprite.width / 2;
        this.backSprite.pivot.y = this.backSprite.height / 2;

        this.rootContainer.addChild(this.sprite);
        this.rootContainer.addChild(this.backSprite);
        this.backSprite.visible = false;
        this.backShowing = true;
        this.backSprite.interactive = true;
        this.backSprite.buttonMode = true;

        this.backSprite.on('pointerdown', async () => {
            if (Card.flipCounter===2) return;
            await this.flip();
            if (this.onFlip) {
                this.onFlip(this);
            }

        });
    }

    setPosition(x,y) {
        this.sprite.x = this.backSprite.x = x;
        this.sprite.y = this.backSprite.y = y;
        this.lerping = false;
    }

    tick() {
        this.backSprite.visible = this.backShowing;
        this.sprite.visible = !this.backShowing;
    }

    async flip() {
        if (!this.active) return;
        const duration = 100; // ms for each half
        const steps = 25;
        const delay = duration / steps;

        // Scale X from 1 to 0
        for (let i = 0; i <= steps; i++) {
            const scale = 1 - i / steps;
            this.backSprite.scale.x = this.sprite.scale.x = scale;
            await sleep(delay);
        }

        this.backShowing = false;

        // Scale X from 0 to 1
        for (let i = 0; i <= steps; i++) {
            const scale = i / steps;
            this.backSprite.scale.x = this.sprite.scale.x = scale;
            await sleep(delay);
        }
        Card.flipCounter++;
    }

    async unflip() {
        if (!this.backShowing) {
            const duration = 100; // ms for each half
            const steps = 25;
            const delay = duration / steps;

            // Scale X from 1 to 0
            for (let i = 0; i <= steps; i++) {
                const scale = 1 - i / steps;
                this.backSprite.scale.y = this.sprite.scale.y = scale;
                await sleep(delay);
            }

            this.backShowing = true;

            // Scale X from 0 to 1
            for (let i = 0; i <= steps; i++) {
                const scale = i / steps;
                this.backSprite.scale.y = this.sprite.scale.y = scale;
                await sleep(delay);
            }


            Card.flipCounter = Math.max(Card.flipCounter-1, 0);
        }
    }
    setScale(x,y) {
        this.sprite.scale.set(x,y);
        this.backSprite.scale.set(x,y);
    }
    async destroy() {
        this.active = false;
        for (let sc = 1;sc>=0;sc-=0.01) {
            this.setScale(sc, sc);
            await sleep(5);
            this.sprite.rotation+=0.1;
            this.backSprite.rotation+=0.1;
        }
        rootContainer.removeChild(this.sprite);
        rootContainer.removeChild(this.backSprite);
    }

    async shake(millis) {
        let targetTime = Date.now() + millis;
        while (Date.now()<targetTime) {
            let x = Math.floor(Math.random() * 17) - 8;
            let y = Math.floor(Math.random() * 17) - 8;
            this.sprite.pivot.set(this.sprite.width / 2 + x, this.sprite.height / 2 + y);
            await sleep(1);
            this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
        }

    }
    async lerpTo(x,y,time) {
        super.LerpTo(this.sprite, x, y, time);
        super.LerpTo(this.backSprite, x, y, time);
    }

}
