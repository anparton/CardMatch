import { Assets, Sprite, Text } from "pixi.js";
import { sleep } from "./utils";

export class TimerPanel {
    constructor(root) {
        this.root = root;
        this.destroyed = false;
        this.time = 0;
        this.running = false;
        this.tex = null;
        this.timePanel = null;
        this.timeText = null;
    }

    async init() {
        if (this.tex) return; // Prevent re-initialization
        this.tex = await Assets.load("./assets/TimePanel.png");
        this.timePanel = new Sprite(this.tex);
        this.timePanel.pivot.set(this.timePanel.width / 2, this.timePanel.height / 2);
        this.timePanel.position.set(1720, 80);
        this.root.addChild(this.timePanel);

        this.timeText = new Text({
            text: "00:00",
            style: {
                fontFamily: "Happy Monkey",
                fontSize: 64,
                fontWeight: 600,
                fill: 0xffff00,
                align: "center"
            }
        });
        this.timeText.position.set(1630, 15);
        this.root.addChild(this.timeText);
    }

    destroy() {
        if (this.destroyed) return;
        this.show(false);
        this.timePanel?.destroy();
        this.timeText?.destroy();
        this.tex?.destroy();
        this.tex = this.timePanel = this.timeText = null;
        this.destroyed = true;
    }

    async show(show) {
        if (!this.tex) await this.init();
        this.timePanel && (this.timePanel.visible = !!show);
        this.timeText && (this.timeText.visible = !!show);
    }

    reset() {
        this.running = false;
        this.time = 0;
        if (this.timeText) this.timeText.text = this.formatTime(this.time);
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.runTimerLoop();
    }

    stop() {
        this.running = false;
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    getTime() {
        return this.time;
    }

    async runTimerLoop() {
        while (this.running) {
            await sleep(1000);
            if (!this.running) break;
            this.time += 1;
            if (this.timeText) this.timeText.text = this.formatTime(this.time);
        }
    }
}