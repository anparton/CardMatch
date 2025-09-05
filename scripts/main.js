// scripts/main.js
import {Application, Assets, Container} from 'pixi.js';
import {getCardPosition, shuffle, sleep} from "./utils.js";
import {Card} from "./classes.js"
import {TimerPanel} from "./timerpanel";
import {GuessPanel} from "./GuessPanel";

const SIZEX = 1920;
const SIZEY = SIZEX * 9 / 16;
export let rootContainer;
const cardNames = ["Hearts", "Spades", "Clubs", "Diamonds"];
let app = undefined;
let textures;
let timerPanel, guessPanel, panelContainer;
let cardsInPlay = [];
let flippedCards = [];

(async () => {
    await init();
    resizeGameDiv();
})();

async function init() {
    app = new Application();
    await app.init({width: SIZEX, height: SIZEY, backgroundColor: "darkolivegreen"});
    rootContainer = new Container();
    app.stage.addChild(rootContainer);

    await loadGraphics((tex) => {
        textures = tex;
        document.getElementById("game").appendChild(app.canvas);
    });
    //Set up the tick
    app.ticker.add((delta) => {
        cardsInPlay.forEach(card => card.tick(delta));
    })
    playGame();
}

async function loadGraphics(callback) {
    try {
        const tex = {};
        for (const name of cardNames) {
            tex[name.toLowerCase()] = await Assets.load(`./assets/${name}.png`);
        }
        tex.back = await Assets.load(`./assets/Back.png`);
        panelContainer = new Container();
        timerPanel = new TimerPanel(panelContainer);
        await timerPanel.init();
        guessPanel = new GuessPanel(panelContainer);
        await guessPanel.init();
        rootContainer.addChild(panelContainer);
        panelContainer.y = 0;

        callback(tex);
    } catch (error) {
        console.error('Failed to load assets:', error);
    }
}




async function playGame() {
    selectCards();
    timerPanel.start();
}




//Callback called when card is flipped
async function onCardFlipped(card) {
    flippedCards.push(card);
    console.log("Flipped = "+flippedCards.length);
    if (flippedCards.length===2) {
        guessPanel.bumpGuesses();
        if (flippedCards[0].suit === flippedCards[1].suit) {
            flippedCards[0].shake(600);
            flippedCards[1].shake(600);
            await sleep(500);
            flippedCards[0].destroy();
            flippedCards[1].destroy();
            flippedCards = [];
            Card.flipCounter = 0;
        } else {
            await sleep(600);
            cardsInPlay.forEach((c) => {
                if (c.active)
                    c.unflip();
            });
            Card.flipCounter = 0;
            flippedCards = [];
        }
    }

}

async function selectCards() {
    cardsInPlay = [];

    //Create 4 cards of each suit
    cardNames.forEach((cn) => {
        for (let i = 0; i < 4; i++) {
            cardsInPlay.push(new Card(cn, textures, rootContainer, onCardFlipped));
        }
    });
    //Shuffle into a random order
    shuffle(cardsInPlay);
    for (let i = 0;i<16;i++) {
      //  let x = getCardPosition(SIZEX,180, i%8);
      //  let y = i<8?350:650;
        cardsInPlay[i].setPosition(rootContainer.width/2,800);
        cardsInPlay[i].cardIndex = i;
    }
    await sleep(500);
    for (let i = 0;i<16;i++) {
        let x = getCardPosition(SIZEX,180, i%8);
        let y = i<8?350:650;
        cardsInPlay[i].lerpTo(x, y, 200);
        await sleep(100);
    }

}

function resizeGameDiv() {
    const gameDiv = document.getElementById("game");
    const width = Math.floor(window.innerWidth * 0.95);
    const height = Math.floor(width * 9 / 16);

    gameDiv.style.width = width + "px";
    gameDiv.style.height = height + "px";

    if (app && rootContainer) {
        app.renderer.resize(gameDiv.clientWidth, gameDiv.clientHeight);
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";

        const scale = Math.min(
            gameDiv.clientWidth / SIZEX,
            gameDiv.clientHeight / SIZEY
        );
        rootContainer.scale.set(scale);

        rootContainer.x = (gameDiv.clientWidth - SIZEX * scale) / 2;
        rootContainer.y = (gameDiv.clientHeight - SIZEY * scale) / 2;
    }
}

window.addEventListener("resize", resizeGameDiv);