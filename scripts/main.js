
import { Application, Assets, Container, Sprite } from 'pixi.js';
import {centerPivot, getCardPosition, lerpTo, scaleTo, shuffle, sleep} from './utils.js';
import {Audio} from './audio.js'
import { Card } from './classes.js';
import { TimerPanel } from './timerpanel';
import { GuessPanel } from './guesspanel';

const SIZEX = 1920;
const SIZEY = SIZEX * 9 / 16;

export let rootContainer;

const cardNames = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
export let audio = new Audio();
let app;
let textures;
let timerPanel, guessPanel, panelContainer;
let cardsInPlay = [];
let flippedCards = [];

let messageContainer;
let getReadySprite, titleSprite, gameOverSprite, backgroundSprite;
//let highScore = [];
let matches = 0;
let finished = false;
let quitGame = false;
let timerStarted = false;
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('intro-screen').style.display = 'none';
    startGame(); // or your game start logic
});

(async () => {
    try {
        resizeGameDiv();
    } catch (e) {
        console.error('Error during initialization:', e);
    }
})();

async function startGame() {
    try {
        await init();
        resizeGameDiv();
    } catch (e) {
        console.error('Error during initialization:', e);
    }

}
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
        tex.gameover = await Assets.load(`./assets/GameOver.png`);
        tex.background = await Assets.load('./assets/baize.jpg');

        getReadySprite = new Sprite(tex.getready);
        gameOverSprite = new Sprite(tex.gameover);
        backgroundSprite = new Sprite(tex.background);
        backgroundSprite.width = SIZEX;
        backgroundSprite.height = SIZEY;
        backgroundSprite.position.set(SIZEX/2, SIZEY/2);
        centerPivot(gameOverSprite);
        centerPivot(getReadySprite);
        backgroundSprite.anchor.set(0.5);
        titleSprite = new Sprite(tex.title);
        centerPivot(titleSprite);
        rootContainer.addChild(backgroundSprite);   //Add the background first!
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
        audio.init();   //Load the audio files
    } catch (error) {
        console.error('Failed to load assets:', error);
    }
}

let musicId;

async function playGameLoop() {
    await showTitleScreen();
    rootContainer.addChild(titleSprite);
    titleSprite.scale.set(1.5,1.5);
    titleSprite.position.set(SIZEX/2,90);
    musicId = audio.play('music');
    while (!quitGame) {
        matches = 0;
        finished = false;
        await playGame();
        // Wait for the game to finish
        while (!finished) {
            await sleep(100);
        }

        await showGameOver();
    }
}

async function playGame() {

        audio.play('whooshIn');
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
        audio.play('whooshAway');
        await lerpTo(getReadySprite,SIZEX+1000,SIZEY/2, 500 );
        messageContainer.removeChild(getReadySprite);
        timerStarted = false;
}

async function onCardFlipped(card) {
    if (!timerStarted) {
        timerStarted = true;
        timerPanel.start();
    }

    flippedCards.push(card);
    if (flippedCards.length === 2) {
        guessPanel.bumpGuesses();
        if (flippedCards[0].suit === flippedCards[1].suit) {
            flippedCards[0].shake(600);
            flippedCards[1].shake(600);
            shakeTitle(600);
            audio.play('cardMatch');
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
            audio.play('noMatch');
            await sleep(600);
            cardsInPlay.forEach(c => {
                if (c.active) c.unflip();
            });
            Card.flipCounter = 0;
            flippedCards = [];
        }
    }
}

async function shakeTitle(duration) {
    const sprite = titleSprite;
    const maxShake = 10;
    const cx = titleSprite.pivot.x;
    const cy = titleSprite.pivot.y;
    const start = performance.now();

    while (performance.now() - start < duration) {
        sprite.pivot.x = cx + (Math.random() - 0.5) * maxShake;
        sprite.pivot.y = cy + (Math.random() - 0.5) * maxShake;
        await sleep(1);
    }
    titleSprite.pivot.set (cx, cy);
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
        cardsInPlay[i].position.set((SIZEX / 2)-i*2, 900-i*2);
        cardsInPlay[i].cardIndex = i;
    }

}

async function dealCards() {
    await sleep(500);

    for (let i = 0; i < 16; i++) {
        const x = getCardPosition(SIZEX, 180, i % 8);
        const y = i < 8 ? 350 : 650;
        audio.play('flip');
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

async function showGameOver() {
    timerPanel.stop();
    audio.stop('music', musicId);
    audio.play('gameOver');
    gameOverSprite.scale.x = 0;
    gameOverSprite.scale.y = 0;
    rootContainer.addChild(gameOverSprite);
    gameOverSprite.position.set(SIZEX/2, SIZEY/2);
    lerpTo(panelContainer,0,-200,1000);
    await scaleTo(gameOverSprite, 1.5, 1.5, 500);

    // Wait for user click
    await new Promise(resolve => {
        async function onClick() {
            await scaleTo(gameOverSprite, 0, 0, 300);
            gameOverSprite.off('pointerdown', onClick);
            rootContainer.removeChild(gameOverSprite);
            musicId = audio.play('music');
            resolve();
        }
        gameOverSprite.interactive = true;
        gameOverSprite.buttonMode = true;
        gameOverSprite.on('pointerdown', onClick);
    });
}

async function showTitleScreen() {
    Howler.stop();
    let music = audio.play('titleScreen');
    const texture = await Assets.load('./assets/TitleScreen.jpg');
    const titleScreenSprite = new Sprite(texture);
    titleScreenSprite.interactive = true;
    titleScreenSprite.buttonMode = true;
    rootContainer.addChild(titleScreenSprite);

    await new Promise(resolve => {
        function onClick() {
            rootContainer.removeChild(titleScreenSprite);
            titleScreenSprite.destroy({ texture: true, baseTexture: true });
            Assets.unload('./assets/TitleScreen.jpg');
            titleScreenSprite.off('pointerdown', onClick);
            audio.stop('titleScreen',music);
            resolve();
        }
        titleScreenSprite.on('pointerdown', onClick);
    });
}

async function toMainMenu() {
    // Reset game state
    quitGame = false;
    finished = false;
    matches = 0;
    flippedCards = [];
    cardsInPlay = [];
    timerStarted = false;

    // Remove all children except panelContainer and messageContainer
    rootContainer.removeChildren();
    rootContainer.addChild(panelContainer);
    rootContainer.addChild(messageContainer);

    await playGameLoop();
}

window.addEventListener('resize', resizeGameDiv);

document.querySelector('.main-menu-btn').addEventListener('click', () => {
    toMainMenu(); // or your desired function
});