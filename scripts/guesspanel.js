import { Assets, Sprite, Text } from "pixi.js";

export class GuessPanel {
    constructor(root) {
        this.root = root;
        this.destroyed = false;
        this.tex = null;
        this.panel = null;
        this.text = null;
        this.guesses = 0;
    }

    async init() {
        if (this.tex) return; // Prevent re-initialization
        this.tex = await Assets.load("./assets/GuessPanel.png");
        this.panel = new Sprite(this.tex);
        this.panel.pivot.set(this.panel.width / 2, this.panel.height / 2);
        this.panel.position.set(200, 80);
        this.root.addChild(this.panel);

        this.text = new Text({
            text: "00",
            style: {
                fontFamily: "Happy Monkey",
                fontSize: 64,
                fontWeight: 600,
                fill: 0xffff00,
                align: "center"
            }
        });
        this.text.position.set(160, 15);
        this.root.addChild(this.text);
        this.guesses = 0;
    }

    async show(show) {
        if (!this.tex) await this.init();
        this.panel && (this.panel.visible = !!show);
        this.text && (this.text.visible = !!show);
    }

    reset() {
        this.guesses = 0;
        this.updateText();
    }

    bumpGuesses() {
        this.guesses++;
        this.updateText();
    }

    updateText() {
        if (this.text) {
            this.text.text = this.guesses.toString().padStart(2, "0");
        }
    }

    getGuesses() {
        return this.guesses;
    }

    destroy() {
        if (this.destroyed) return;
        this.show(false);
        this.panel?.destroy();
        this.text?.destroy();
        this.tex?.destroy();
        this.tex = this.panel = this.text = null;
        this.destroyed = true;
    }
}