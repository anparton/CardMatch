import {Sprite} from "pixi.js";
import {sleep} from "./utils";

export class Card {
    static flipCounter = 0;
    constructor(suit, textures, root, onFlip) {
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
        this.targetX = this.targetY = 0;
        this.lerping = false;
        this.backShowing = true;
        this.cardIndex = 0;

        this.backSprite.interactive = true;
        this.backSprite.buttonMode = true;

        this.backSprite.on('pointerdown', (event) => {
            if (Card.flipCounter===2) return;
            this.flip();
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

    setTargetPosition(x,y) {
        this.targetX = x;
        this.targetY = y;
        this.lerping = true;
    }

    tick(delta) {
        delta = delta * (1/60);
        this.backSprite.visible = this.backShowing;
        this.sprite.visible = !this.backShowing;
    }

    async flip() {
        if (this.backShowing) {
            for (var r = 0;r<180;r+=2) {
                this.backSprite.rotation = r * Math.PI / 100;
                await sleep(1);
            }

            this.backShowing = false;
            Card.flipCounter++;
            if (this.onFlip) {
                this.onFlip();
            }
        }
    }

    unflip() {
        if (!this.backShowing) {
            this.backSprite.rotation = 0;
            this.backShowing = true;
            Card.flipCounter = Math.max(Card.flipCounter-1, 0);
        }
    }

}
