// scripts/main.js
import {Application, Assets, Container} from 'pixi.js';
import {getCardPosition, shuffle, sleep} from "./utils.js";
import {Card} from "./classes.js"

const SIZEX = 1920;
const SIZEY = SIZEX * 9 / 16;
export let rootContainer;
const cardNames = ["Hearts", "Spades", "Clubs", "Diamonds", "Back"];
let app = undefined;
let textures;

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
        tex['TimePanel'] = await Assets.load(`./assets/TimePanel.png`);
        callback(tex);
    } catch (error) {
        console.error('Failed to load assets:', error);
    }
}



function playGame() {
    selectCards();
}


let cardsInPlay = [];

let flippedCards = [];

//Callback called when card is flipped
async function onCardFlipped(card) {
    flippedCards.push(card);
    console.log("Flipped = "+flippedCards.length);
    if (flippedCards.length===2) {
        if (flippedCards[0].suit === flippedCards[1].suit) {
            flippedCards[0].destroy();
            flippedCards[1].destroy();
            console.log("MATCHED!!");
            flippedCards = [];
            Card.flipCounter = 0;
        } else {
            await sleep(500);
            cardsInPlay.forEach((c) => {
                if (c.active)
                    c.unflip();
            });
            Card.flipCounter = 0;
            flippedCards = [];
        }
    }

}

function selectCards() {
    cardsInPlay = [];

    //Create 4 cards of each suit
    cardNames.forEach((cn) => {
        if (cn!=='Back') {
            for (let i = 0; i < 4; i++) {
                cardsInPlay.push(new Card(cn, textures, rootContainer, onCardFlipped));
            }
        }
    });

    //Shuffle into a random order
    shuffle(cardsInPlay);


    for (let i = 0;i<16;i++) {
        let x = getCardPosition(SIZEX,180, i%8);
        let y = i<8?250:550;
        //cardsInPlay[i].setPosition(1700-i,800-i);
        cardsInPlay[i].setPosition(x,y);
        cardsInPlay[i].cardIndex = i;
        //cardsInPlay[i].setTargetPosition(x,y);
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