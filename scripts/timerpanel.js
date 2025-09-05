import {Assets, Sprite, Text} from "pixi.js";
import {sleep} from "./utils";

export class TimerPanel {
    constructor(root) {
        this.root = root;
        this.destroyed = false;
        this.time = 0;
        this.running = false;
    }

    async init() {
        this.tex = await Assets.load(`./assets/TimePanel.png`);
        this.timePanel = new Sprite(this.tex);
        this.timePanel.pivot.set(this.timePanel.width/2, this.timePanel.height/2);
        this.timePanel.x = 1920-200; this.timePanel.y = 80;
        this.root.addChild(this.timePanel);
        this.timeText = new Text({text:'00:00', style:{
            fontFamily: 'Arial',
            fontSize: 45,
            fontWeight:600,
            fill: 0xffff00,
            align: 'center'
        }});

        this.timeText.x = 1920-260;
        this.timeText.y = 85;
        this.root.addChild(this.timeText);

    }
    destroy() {
        if (!this.destroyed) {
            this.show(false);
            this.tex.destroy();
            this.tex = undefined;
            this.timeText.destroy();
            this.destroyed = true;
        }
    }

    async show(show) {
        if (this.tex===undefined) {
            await this.init();
        }
        this.timePanel.visible = show;
        this.timeText.visible = show;
    }

    reset() {
        this.running = false;
        this.time = 0;
        this.timeText.text = this.formatTime(this.time);
    }
    start() {
        this.running = true;
        this.runTimerLoop();
    }
    stop() {
        this.running = false;
    }
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    async runTimerLoop() {
        while (this.running) {
            await sleep(1000);
            if (!this.running) break;
            this.time += 1;
            // Optionally update the display here, e.g.:
             this.timeText.text = this.formatTime(this.time);
        }
    }

}