// scripts/main.js
import { Application, Assets, Container, Sprite } from 'pixi.js';
import {centerPivot, getCardPosition, lerpTo, scaleTo, shuffle, sleep} from './utils.js';
import { Card } from './classes.js';
import { TimerPanel } from './timerpanel';
import { GuessPanel } from './GuessPanel';

const SIZEX = 1920;
const SIZEY = SIZEX * 9 / 16;

export let rootContainer;

const cardNames = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];

let app;
let textures;
let timerPanel, guessPanel, panelContainer;
let cardsInPlay = [];
let flippedCards = [];

let messageContainer;
let getReadySprite, titleSprite;
//let highScore = [];
let matches = 0;
let finished = false;
let quitGame = false;
(async () => {
    try {
        await init();
        resizeGameDiv();
    } catch (e) {
        console.error('Error during initialization:', e);
    }
})();

async function init() {
    app = new Application();
    await app.init({ width: SIZEX, height: SIZEY, backgroundColor: 'darkolivegreen' });

    rootContainer = new Container();
    app.stage.addChild(rootContainer);

    await loadGraphics(tex => {
        textures = tex;
        document.getElementById('game').appendChild(app.canvas);
        resizeGameDiv();
    });

    app.ticker.add(delta => {
        cardsInPlay.forEach(card => card.tick(delta));
    });

    await playGameLoop(); // Await here
}


async function loadGraphics(callback) {
    try {
        const tex = {};
        for (const name of cardNames) {
            tex[name.toLowerCase()] = await Assets.load(`./assets/${name}.png`);
        }
        tex.back = await Assets.load('./assets/Back.png');  //Card back
        tex.getready = await Assets.load(`./assets/GetReady.png`);  //Get Ready message
        tex.title = await Assets.load(`./assets/Title.png`);  //Title
        getReadySprite = new Sprite(tex.getready);
        centerPivot(getReadySprite);
        titleSprite = new Sprite(tex.title);
        centerPivot(titleSprite);
        //Create the panels - put into a container
        panelContainer = new Container();
        timerPanel = new TimerPanel(panelContainer);
        await timerPanel.init();
        guessPanel = new GuessPanel(panelContainer);
        await guessPanel.init();
        rootContainer.addChild(panelContainer);

        //Create the 'message' container
        messageContainer = new Container();
        rootContainer.addChild(messageContainer);
        callback(tex);
    } catch (error) {
        console.error('Failed to load assets:', error);
    }
}



async function playGameLoop() {
    rootContainer.addChild(titleSprite);
    titleSprite.scale.set(1.5,1.5);
    titleSprite.position.set(SIZEX/2,90);
    while (!quitGame) {
        matches = 0;
        finished = false;
        await playGame();
        // Wait for the game to finish
        while (!finished) {
            await sleep(100);
        }
        // Optionally, add logic here for replay, show score, etc.
    }
}

async function playGame() {

        panelContainer.position.set(0,-200);
        messageContainer.addChild(getReadySprite);
        getReadySprite.position.set(SIZEX/2,SIZEY/2);
        getReadySprite.scale.set(0,0);
        guessPanel.reset();
        timerPanel.reset();

        scaleTo(getReadySprite, 1.5, 1.5, 500);
        selectCards();
        rootContainer.setChildIndex(messageContainer, rootContainer.children.length-1)
        await dealCards();
        await lerpTo(panelContainer,0,0,1000);
        await lerpTo(getReadySprite,SIZEX+1000,SIZEY/2, 500 );
        messageContainer.removeChild(getReadySprite);
        timerPanel.start();

}

async function onCardFlipped(card) {
    flippedCards.push(card);
    console.log(`Flipped = ${flippedCards.length}`);

    if (flippedCards.length === 2) {
        guessPanel.bumpGuesses();
        if (flippedCards[0].suit === flippedCards[1].suit) {
            flippedCards[0].shake(600);
            flippedCards[1].shake(600);
            await sleep(500);
            flippedCards[0].destroy();
            flippedCards[1].destroy();
            flippedCards = [];
            Card.flipCounter = 0;
            matches++;
            console.log("Matches = "+matches);
            if (matches===8) {
                console.log("FINISHED!");
                finished = true;
            }
        } else {
            await sleep(600);
            cardsInPlay.forEach(c => {
                if (c.active) c.unflip();
            });
            Card.flipCounter = 0;
            flippedCards = [];
        }
    }
}

async function selectCards() {
    cardsInPlay = [];

    // Create 4 cards of each suit
    cardNames.forEach(cn => {
        for (let i = 0; i < 4; i++) {
            cardsInPlay.push(new Card(cn, textures, rootContainer, onCardFlipped));
        }
    });

    shuffle(cardsInPlay);
    shuffle(cardsInPlay);
    shuffle(cardsInPlay);

    for (let i = 0; i < 16; i++) {
        cardsInPlay[i].position.set((SIZEX / 2)-i, 900-i);
        cardsInPlay[i].cardIndex = i;
    }

}

async function dealCards() {
    await sleep(500);

    for (let i = 0; i < 16; i++) {
        const x = getCardPosition(SIZEX, 180, i % 8);
        const y = i < 8 ? 350 : 650;
        cardsInPlay[i].lerpTo(x, y, 200);
        await sleep(100);
    }
}
function resizeGameDiv() {
    const gameDiv = document.getElementById('game');
    const width = Math.floor(window.innerWidth * 0.95);
    const height = Math.floor(width * 9 / 16);

    gameDiv.style.width = `${width}px`;
    gameDiv.style.height = `${height}px`;

    if (app && rootContainer) {
        app.renderer.resize(gameDiv.clientWidth, gameDiv.clientHeight);
        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';

        const scale = Math.min(
            gameDiv.clientWidth / SIZEX,
            gameDiv.clientHeight / SIZEY
        );
        rootContainer.scale.set(scale);

        rootContainer.x = (gameDiv.clientWidth - SIZEX * scale) / 2;
        rootContainer.y = (gameDiv.clientHeight - SIZEY * scale) / 2;
    }
}

window.addEventListener('resize', resizeGameDiv);