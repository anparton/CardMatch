
import { Assets, Sprite, Text } from "pixi.js";

export class GuessPanel {
    constructor(root) {
        this.root = root;
        this.destroyed = false;
        this.tex = undefined;
        this.panel = undefined;
        this.text = undefined;
        this.guessed = 0;
    }

    async init() {
        this.tex = await Assets.load("./assets/GuessPanel.png");
        this.panel = new Sprite(this.tex);
        this.panel.pivot.set(this.panel.width / 2, this.panel.height / 2);
        this.panel.x = 200;
        this.panel.y = 80;
        this.root.addChild(this.panel);

        this.text = new Text({text:'00', style:{
                fontFamily: 'Arial',
                fontSize: 45,
                fontWeight:600,
                fill: 0xffff00,
                align: 'center'
            }});

        this.text.x = 180;
        this.text.y = 80;
        this.root.addChild(this.text);
        this.guesses = 0;
    }

    async show(show) {
        if (!this.tex) {
            await this.init();
        }
        this.panel.visible = show;
        this.text.visible = show;
    }

    reset() {
        this.guesses = 0;
    }

    bumpGuesses() {
        this.guesses++;
        this.updateText()
    }

    updateText() {
        if (this.text) {
            this.text.text = this.guesses.toString().padStart(2, '0');
        }
    }
    destroy() {
        if (!this.destroyed) {
            this.show(false);
            if (this.tex) this.tex.destroy();
            this.tex = undefined;
            if (this.text) this.text.destroy();
            this.destroyed = true;
        }
    }
}